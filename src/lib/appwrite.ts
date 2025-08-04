
import { Client, Databases, Account } from 'node-appwrite';

const createClient = () => {
    const client = new Client();
    if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
        client
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID);
    }
    return client;
};

const createAdminClient = () => {
    const client = createClient();
    if (process.env.APPWRITE_API_KEY) {
        client.setKey(process.env.APPWRITE_API_KEY);
    }
    return client;
};

const client = createClient();
const adminClient = createAdminClient();

export const account = new Account(client);
export const databases = new Databases(client);
export const adminDatabases = new Databases(adminClient);

export const APPWRITE_CONFIG = {
    databaseId: process.env.APPWRITE_DATABASE_ID!,
    postsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID!,
    categoriesCollectionId: process.env.APPWRITE_CATEGORIES_COLLECTION_ID!,
};
