
import { Client, Databases, Account } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
    .setProject(process.env.APPWRITE_PROJECT_ID || '');

if (typeof window === 'undefined' && process.env.APPWRITE_API_KEY) {
  client.setKey(process.env.APPWRITE_API_KEY);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
    databaseId: process.env.APPWRITE_DATABASE_ID!,
    postsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID!,
    categoriesCollectionId: process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
}
