
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
        process.env.APPWRITE_STORAGE_BUCKET_ID!,
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
    return storage.getFilePreview(process.env.APPWRITE_STORAGE_BUCKET_ID!, fileId);
}


export async function getCategories(): Promise<Category[]> {
  const databases = getDatabases();
  const response = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_CATEGORIES_COLLECTION_ID!
  );
  return response.documents.map(doc => mapDocumentToCategory(doc));
}

export async function getCategory(id: string): Promise<Category | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
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
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}

export async function updateCategory(id: string, name: string): Promise<Category> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
        id,
        { name }
    );
    return mapDocumentToCategory(response);
}

export async function deleteCategory(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
         process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
        id
    );
}


export async function getPosts(categoryId?: string): Promise<BlogPost[]> {
    const databases = getDatabases();
    const queries = categoryId ? [Query.equal('category', categoryId)] : [];
    const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_POSTS_COLLECTION_ID!,
        queries,
    );
    const posts = await Promise.all(response.documents.map(async (doc) => await mapDocumentToBlogPost(doc)));
    return posts;
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_POSTS_COLLECTION_ID!,
            id
        );
        return await mapDocumentToBlogPost(doc);
    } catch(error) {
        return null;
    }
}

type PostInput = Omit<BlogPost, 'id' | 'createdAt' | 'category' | 'banner_image'> & { status: 'Published' | 'Draft', category: string[], banner_image?: string };

export async function createPost(data: PostInput): Promise<BlogPost> {
  const databases = getDatabases();
  const response = await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_POSTS_COLLECTION_ID!,
    ID.unique(),
    data
  );
  return await mapDocumentToBlogPost(response);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<BlogPost> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_POSTS_COLLECTION_ID!,
        id,
        data
    );
    return await mapDocumentToBlogPost(response);
}

export async function deletePost(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_POSTS_COLLECTION_ID!,
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
    const post: BlogPost = {
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category.map(mapDocumentToCategory), // Category is now an array of documents
        createdAt: doc.$createdAt,
        status: doc.status,
        adsenseTag: doc.adsenseTag
    };
    if (doc.banner_image) {
        post.banner_image = (await getFilePreview(doc.banner_image)).toString();
    }
    return post;
}
