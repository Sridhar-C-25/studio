
'use server';

import { Client, Databases, ID, Models } from 'node-appwrite';
import type { BlogPost, Category } from '@/types';

const getDatabases = () => {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);
    return new Databases(client);
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


export async function getPosts(): Promise<BlogPost[]> {
    const databases = getDatabases();
    const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_POSTS_COLLECTION_ID!
    );
    return response.documents.map(doc => mapDocumentToBlogPost(doc));
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_POSTS_COLLECTION_ID!,
            id
        );
        return mapDocumentToBlogPost(doc);
    } catch(error) {
        return null;
    }
}

type PostInput = Omit<BlogPost, 'id' | 'createdAt' | 'status' | 'category'> & { status?: 'Published' | 'Draft', category: string };

export async function createPost(data: PostInput): Promise<BlogPost> {
  const databases = getDatabases();
  const response = await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_POSTS_COLLECTION_ID!,
    ID.unique(),
    { ...data, status: 'Draft' }
  );
  return mapDocumentToBlogPost(response);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<BlogPost> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_POSTS_COLLECTION_ID!,
        id,
        data
    );
    return mapDocumentToBlogPost(response);
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

function mapDocumentToBlogPost(doc: Models.Document): BlogPost {
    return {
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        createdAt: doc.$createdAt,
        status: doc.status,
        adsenseTag: doc.adsenseTag
    };
}
