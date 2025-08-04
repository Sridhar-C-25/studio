
'use server';

import { Client, Databases, ID, Models } from 'node-appwrite';
import type { BlogPost, Category } from '@/types';

const adminClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const adminDatabases = new Databases(adminClient);


export async function getCategories(): Promise<Category[]> {
  const response = await adminDatabases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
  );
  return response.documents.map(doc => mapDocumentToCategory(doc));
}

export async function getCategory(id: string): Promise<Category> {
    const doc = await adminDatabases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id
    );
    return mapDocumentToCategory(doc);
}

export async function createCategory(name: string): Promise<Category> {
  const response = await adminDatabases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}


export async function getPosts(): Promise<BlogPost[]> {
    const response = await adminDatabases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!
    );
    return response.documents.map(doc => mapDocumentToBlogPost(doc));
}

export async function getPost(id: string): Promise<BlogPost> {
    const doc = await adminDatabases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id
    );
    return mapDocumentToBlogPost(doc);
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
        adsenseTag: doc.adsenseTag,
    };
}
