'use server';

import { Client, Databases, ID, Models, Query, Storage, AppwriteException } from 'node-appwrite';
import type { BlogPost, Category } from '@/types';
import { InputFile } from 'node-appwrite/file';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const storage = new Storage(client);


export async function uploadFile(base64: string, fileName: string): Promise<Models.File> {
    const fileId = ID.unique();
    const buffer = Buffer.from(base64.split(',')[1], 'base64');

    return await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        fileId,
        InputFile.fromBuffer(buffer, fileName)
    );

}


export async function getFilePreview(fileId: string) {
    return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.APPWRITE_PROJECT_ID}`;
}


export async function getCategories(): Promise<Category[]> {
    const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    return response.documents.map(mapDocumentToCategory);
}

export async function getCategory(id: string): Promise<Category | null> {
    try {
        const doc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
            id
        );
        return mapDocumentToCategory(doc);
    } catch (error) {
        if (error instanceof AppwriteException && error.code === 404) {
            return null;
        }
        throw error;
    }
}

export async function createCategory(name: string): Promise<Category> {
    const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        ID.unique(),
        { name }
    );
    return mapDocumentToCategory(response);
}

export async function updateCategory(id: string, name: string): Promise<Category> {
    const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id,
        { name }
    );
    return mapDocumentToCategory(response);
}

export async function deleteCategory(id: string): Promise<void> {
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id
    );
}


export async function getPosts(): Promise<BlogPost[]> {
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

    const posts = postsResponse.documents.map(doc => {
        return mapDocumentToBlogPost(doc, allCategories);
    });

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try {
        const postDoc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            id
        );

        const categoryIds = postDoc.category?.map((cat: any) => typeof cat === 'string' ? cat : cat.$id) || [];

        let categories: Category[] = [];
        if (categoryIds.length > 0) {
            const categoriesResponse = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
                [Query.equal('$id', categoryIds)]
            );
            categories = categoriesResponse.documents.map(mapDocumentToCategory);
        }

        return mapDocumentToBlogPost(postDoc, categories);
    } catch (error) {
        if (error instanceof AppwriteException && error.code === 404) {
            return null;
        }
        console.error("Failed to fetch post:", error);
        throw error;
    }
}

type PostInput = Omit<BlogPost, 'id' | 'createdAt' | 'category'> & { status: 'Published' | 'Draft', category: string[], banner_image?: string };

export async function createPost(data: PostInput): Promise<BlogPost> {
    const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        ID.unique(),
        {
            ...data,
            category: data.category,
        }
    );
    const allCategories = await getCategories();
    return mapDocumentToBlogPost(response, allCategories);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<BlogPost> {
    const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id,
        {
            ...data,
            category: data.category,
        }
    );
    const allCategories = await getCategories();
    return mapDocumentToBlogPost(response, allCategories);
}

export async function deletePost(id: string): Promise<void> {
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

function mapDocumentToBlogPost(doc: Models.Document, allCategories: Category[]): BlogPost {
    const categoryIds = doc.category?.map((cat: any) => typeof cat === 'string' ? cat : cat.$id) || [];

    const relatedCategories = allCategories.filter(cat => categoryIds.includes(cat.id));

    return {
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: relatedCategories,
        createdAt: doc.$createdAt,
        status: doc.status,
        adsenseTag: doc.adsenseTag,
        banner_image: doc.banner_image,
    };
}
