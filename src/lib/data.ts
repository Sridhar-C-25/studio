"use server";

import { Models, AppwriteException, ID, Query } from "node-appwrite";
import type { BlogPost, Category } from "@/types";
import { getAdminClient } from "./appwrite";
import { InputFile } from "node-appwrite/file";

function makeSlug(title: string) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\- ]/g, '')   // remove invalid chars
    .replace(/\s+/g, '-')           // collapse whitespace to dashes
    .replace(/\-+/g, '-');          // collapse multiple dashes
}

export async function uploadFile(
  base64: string,
  fileName: string
): Promise<Models.File> {
  const { storage } = await getAdminClient();
  const fileId = ID.unique();
  const buffer = Buffer.from(base64.split(",")[1], "base64");

  return await storage.createFile(
    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
    fileId,
    InputFile.fromBuffer(buffer, fileName)
  );
}

export async function getFilePreview(fileId: string) {
  return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.APPWRITE_PROJECT_ID}&role=admin`;
}

export async function getCategories(): Promise<Category[]> {
  const { databases } = await getAdminClient();
  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
  );
  return response.documents.map(mapDocumentToCategory);
}

export async function getCategory(id: string): Promise<Category | null> {
  const { databases } = await getAdminClient();
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
  const { databases } = await getAdminClient();
  const response = await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    ID.unique(),
    { name }
  );
  return mapDocumentToCategory(response);
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  const { databases } = await getAdminClient();
  const response = await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    id,
    { name }
  );
  return mapDocumentToCategory(response);
}

export async function deleteCategory(id: string): Promise<void> {
  const { databases } = await getAdminClient();
  await databases.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    id
  );
}

export async function getPosts(): Promise<BlogPost[]> {
  const { databases } = await getAdminClient();
  const [postsResponse, categoriesResponse] = await Promise.all([
    databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!
    ),
    databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    ),
  ]);

  const allCategories = categoriesResponse.documents.map(mapDocumentToCategory);

  const posts = await Promise.all(
    postsResponse.documents.map((doc) =>
      mapDocumentToBlogPost(doc, allCategories)
    )
  );

  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPost(id: string): Promise<BlogPost | null> {
  const { databases } = await getAdminClient();
  try {
    const postDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      id
    );

    const allCategories = await getCategories();
    return await mapDocumentToBlogPost(postDoc, allCategories);
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) {
      return null;
    }
    console.error("Failed to fetch post:", error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { databases } = await getAdminClient();
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [Query.equal("slug", slug)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const postDoc = response.documents[0];
      const allCategories = await getCategories();
      return await mapDocumentToBlogPost(postDoc, allCategories);
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 404) {
        return null;
      }
      console.error("Failed to fetch post by slug:", error);
      throw error;
    }
}

type PostInput = Omit<BlogPost, "id" | "createdAt" | "category" | "slug"> & {
  status: "Published" | "Draft";
  category: string[];
  banner_image?: string;
};

export async function createPost(data: PostInput): Promise<BlogPost> {
  const { databases } = await getAdminClient();
  const slug = makeSlug(data.title);
  const response = await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
    ID.unique(),
    {
      ...data,
      slug,
      category: data.category,
    }
  );
  const allCategories = await getCategories();
  return await mapDocumentToBlogPost(response, allCategories);
}

export async function updatePost(
  id: string,
  data: Partial<PostInput>
): Promise<BlogPost> {
  const { databases } = await getAdminClient();
  const slug = data.title ? makeSlug(data.title) : undefined;
  const response = await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
    id,
    {
      ...data,
      slug,
      category: data.category,
    }
  );
  const allCategories = await getCategories();
  return await mapDocumentToBlogPost(response, allCategories);
}

export async function deletePost(id: string): Promise<void> {
  const { databases } = await getAdminClient();
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

async function mapDocumentToBlogPost(
  doc: Models.Document,
  allCategories: Category[]
): Promise<BlogPost> {
  const categoryIds =
    doc.category?.map((cat: string | { $id: string }) =>
      typeof cat === "string" ? cat : cat.$id
    ) || [];
  const relatedCategories = allCategories.filter((cat) =>
    categoryIds.includes(cat.id)
  );

  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    category: relatedCategories,
    createdAt: doc.$createdAt,
    status: doc.status,
    adsenseTag: doc.adsenseTag,
    banner_image: doc.banner_image,
  };
}
