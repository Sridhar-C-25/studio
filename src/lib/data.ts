
'use server';

import { Client, Databases, ID, Models } from 'node-appwrite';
import type { BlogPost, Category } from '@/types';

const getDatabases = () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);
    return new Databases(client);
}

export async function getCategories(): Promise<Category[]> {
  const databases = getDatabases();
  const response = await databases.listDocuments(
    "668b02e70034a7479533",
    "668b0304003058882195"
  );
  return response.documents.map(doc => mapDocumentToCategory(doc));
}

export async function getCategory(id: string): Promise<Category | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            "668b02e70034a7479533",
            "668b0304003058882195",
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
    "668b02e70034a7479533",
    "668b0304003058882195",
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}

export async function updateCategory(id: string, name: string): Promise<Category> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        "668b02e70034a7479533",
        "668b0304003058882195",
        id,
        { name }
    );
    return mapDocumentToCategory(response);
}

export async function deleteCategory(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
        "668b02e70034a7479533",
        "668b0304003058882195",
        id
    );
}


export async function getPosts(): Promise<BlogPost[]> {
    const databases = getDatabases();
    const response = await databases.listDocuments(
        "668b02e70034a7479533",
        "668b02f20015904d2b9a"
    );
    return response.documents.map(doc => mapDocumentToBlogPost(doc));
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try {
        const databases = getDatabases();
        const doc = await databases.getDocument(
            "668b02e70034a7479533",
            "668b02f20015904d2b9a",
            id
        );
        return mapDocumentToBlogPost(doc);
    } catch(error) {
        return null;
    }
}

type PostInput = Omit<BlogPost, 'id' | 'createdAt' | 'status'> & { status?: 'Published' | 'Draft' };

export async function createPost(data: PostInput): Promise<BlogPost> {
  const databases = getDatabases();
  const response = await databases.createDocument(
    "668b02e70034a7479533",
    "668b02f20015904d2b9a",
    ID.unique(),
    { ...data, status: 'Draft' }
  );
  return mapDocumentToBlogPost(response);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<BlogPost> {
    const databases = getDatabases();
    const response = await databases.updateDocument(
        "668b02e70034a7479533",
        "668b02f20015904d2b9a",
        id,
        data
    );
    return mapDocumentToBlogPost(response);
}

export async function deletePost(id: string): Promise<void> {
    const databases = getDatabases();
    await databases.deleteDocument(
        "668b02e70034a7479533",
        "668b02f20015904d2b9a",
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
        adsenseTag: doc.adsenseTag,
    };
}
