
import { Client, Databases, Account } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client();

if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT && process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

const adminClient = new Client();

if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT && process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY) {
    adminClient
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
}


export const account = new Account(client);
export const databases = new Databases(client);
export const adminDatabases = new Databases(adminClient);

export const APPWRITE_CONFIG = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    postsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
    categoriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
};
