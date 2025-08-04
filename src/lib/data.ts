import { databases, APPWRITE_CONFIG } from './appwrite';
import { BlogPost, Category } from '@/types';
import { ID, Models } from 'node-appwrite';

export async function getCategories(): Promise<Category[]> {
  const response = await databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.categoriesCollectionId
  );
  return response.documents.map(doc => mapDocumentToCategory(doc));
}

export async function getCategory(id: string): Promise<Category> {
    const doc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.categoriesCollectionId,
        id
    );
    return mapDocumentToCategory(doc);
}

export async function createCategory(name: string): Promise<Category> {
  const response = await databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.categoriesCollectionId,
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}


export async function getPosts(): Promise<BlogPost[]> {
    const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.postsCollectionId
    );
    return response.documents.map(doc => mapDocumentToBlogPost(doc));
}

export async function getPost(id: string): Promise<BlogPost> {
    const doc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.postsCollectionId,
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
