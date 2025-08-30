"use server";

import type { BlogPost, Category } from "@/types";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

export async function uploadFile(
  base64: string,
  fileName: string
): Promise<{
  fileId: string;
  fileUrl: string;
  size: number;
  fileName: string;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ file: base64, fileName }),
      }
    );
    if (!response.ok) throw new Error("Failed to upload file");
    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getFilePreview(fileId: string) {
  return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.APPWRITE_PROJECT_ID}&role=admin`;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category?id=${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch category");
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message === "Not Found") {
      return null;
    }
    throw error;
  }
}

export async function createCategory(name: string): Promise<Category> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) throw new Error("Failed to create category");
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ name, id }),
      }
    );
    if (!response.ok) throw new Error("Failed to update category");
    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ id }),
      }
    );
    if (!response.ok) throw new Error("Failed to delete category");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export async function getPosts(categoryId?: string): Promise<BlogPost[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
    if (categoryId) {
        url.searchParams.append("categoryId", categoryId);
    }
    const response = await fetch(
      url.toString(),
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?id=${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch post");
    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?slug=${slug}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch post by slug");
    return await response.json();
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

type PostInput = Omit<BlogPost, "id" | "createdAt" | "category" | "slug"> & {
  status: "Published" | "Draft";
  category: string[];
  banner_image?: string;
  keywords?: string;
  description?: string;
};

export async function createPost(data: PostInput): Promise<BlogPost> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Failed to create post");
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function updatePost(
  id: string,
  data: Partial<PostInput>
): Promise<BlogPost> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ id, ...data }),
      }
    );
    if (!response.ok) throw new Error("Failed to update post");
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "appwrite-session":
            (await cookies()).get("appwrite-session")?.value || "",
        },
        body: JSON.stringify({ id }),
      }
    );
    if (!response.ok) throw new Error("Failed to delete post");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch search results for query "${query}": ${errorText}`);
            throw new Error(`Failed to fetch search results: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error searching posts:", error);
        return [];
    }
}
