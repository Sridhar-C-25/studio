
'use server';

import { Client, Databases, ID, Models, Query, Storage } from 'node-appwrite';
import type { BlogPost, Category } from '@/types';

const getClient = () => {
    return new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);
}

const getDatabases = () => {
    const client = getClient();
    return new Databases(client);
}

const getStorage = () => {
    const client = getClient();
    return new Storage(client);
}

export async function uploadFile(file: Buffer, fileName: string): Promise<Models.File> {
    const storage = getStorage();
    const fileId = ID.unique();
    return await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        fileId,
        // @ts-ignore
        {
            read: () => file,
            path: fileName,
            size: file.length,
        }
    );
}

export async function getFilePreview(fileId: string): Promise<URL> {
    const storage = getStorage();
    return storage.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!, fileId);
}


export async function getCategories(): Promise<Category[]> {
  const databases = getDatabases();
  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
  );
  return response.documents.map(doc => mapDocumentToCategory(doc));
}

export async function getCategory(id: string): Promise<Category | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
            id
        );
        return mapDocumentToCategory(doc);
    } catch (error) {
        // Appwrite throws an error if the document is not found
        return null;
    }
}

export async function createCategory(name: string): Promise<Category> {
  const databases = getDatabases();
  const response = await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}

export async function updateCategory(id: string, name: string): Promise<Category> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id,
        { name }
    );
    return mapDocumentToCategory(response);
}

export async function deleteCategory(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
         process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id
    );
}


export async function getPosts(): Promise<BlogPost[]> {
    const databases = getDatabases();
    const [postsResponse, categoriesResponse] = await Promise.all([
        databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!
        ),
        databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
        )
    ]);

    const allCategories = categoriesResponse.documents.map(mapDocumentToCategory);
    const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));

    const posts = postsResponse.documents.map(doc => {
        const categoryIds = doc.category || [];
        const categories = categoryIds.map((id: string) => categoryMap.get(id)).filter((cat: Category | undefined): cat is Category => cat !== undefined);

        return {
            id: doc.$id,
            title: doc.title,
            content: doc.content,
            category: categories,
            createdAt: doc.$createdAt,
            status: doc.status,
            adsenseTag: doc.adsenseTag,
            banner_image: doc.banner_image,
        } as BlogPost;
    });

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            id
        );
        return await mapDocumentToBlogPost(doc);
    } catch(error) {
        return null;
    }
}

type PostInput = Omit<BlogPost, 'id' | 'createdAt' | 'category' > & { status: 'Published' | 'Draft', category: string[], banner_image?: string };

export async function createPost(data: PostInput): Promise<BlogPost> {
  const databases = getDatabases();
  const response = await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
    ID.unique(),
    {
      ...data,
      category: data.category, 
    }
  );
  return await mapDocumentToBlogPost(response);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<BlogPost> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id,
        {
          ...data,
          category: data.category,
        }
    );
    return await mapDocumentToBlogPost(response);
}

export async function deletePost(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id
    );
}


function mapDocumentToCategory(doc: Models.Document): Category {
    return {
        id: doc.$id,
        name: doc.name,
    };
}

async function mapDocumentToBlogPost(doc: Models.Document): Promise<BlogPost> {
    const categoryIds = doc.category || [];
    const categories = (await Promise.all(
        categoryIds.map((id: string) => getCategory(id))
    )).filter((cat): cat is Category => cat !== null);

    return {
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: categories,
        createdAt: doc.$createdAt,
        status: doc.status,
        adsenseTag: doc.adsenseTag,
        banner_image: doc.banner_image,
    };
}
