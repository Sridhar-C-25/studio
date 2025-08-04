
import { Client, Databases, Account } from 'node-appwrite';

const client = new Client();

if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY) {
    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
} else {
    // For client-side, we don't use the API key
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');
}

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
    databaseId: process.env.APPWRITE_DATABASE_ID!,
    postsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID!,
    categoriesCollectionId: process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
}
