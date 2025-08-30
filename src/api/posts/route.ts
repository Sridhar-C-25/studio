// posts handler
import { getAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models, Query } from "node-appwrite";
import { BlogPost, Category } from "@/types";
import {
  makeSlug,
  mapDocumentToBlogPost,
  mapDocumentToCategory,
} from "@/lib/helper";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const categoryId = searchParams.get("categoryId");
    const { databases } = await getAdminClient();

    if (slug) {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [Query.equal("slug", slug)]
      );

      if (response.documents.length === 0) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const postDoc = response.documents[0];
      const allCategoriesResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
      );
      const allCategories = allCategoriesResponse.documents.map(
        mapDocumentToCategory
      );
      return NextResponse.json(mapDocumentToBlogPost(postDoc, allCategories), {
        status: 200,
      });
    }

    if (id) {
      const response = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id
      );
      const allCategoriesResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
      );
      const allCategories = allCategoriesResponse.documents.map(
        mapDocumentToCategory
      );
      return NextResponse.json(mapDocumentToBlogPost(response, allCategories), {
        status: 200,
      });
    }
    
    const queries = [];
    if (categoryId) {
        queries.push(Query.equal("category", categoryId))
    }

    const [postsResponse, categoriesResponse] = await Promise.all([
      databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        queries
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
      ),
    ]);

    const allCategories = categoriesResponse.documents.map(
      mapDocumentToCategory
    );

    const posts = await Promise.all(
      postsResponse.documents.map((doc) =>
        mapDocumentToBlogPost(doc, allCategories)
      )
    );

    return NextResponse.json(
      posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts
//   - request body:
//     - title: string
//     - content: string
//     - category: string[]
//     - status: "Published" | "Draft"
//     - adsenseTag?: string
//     - banner_image?: string
//   - response:
//     - post: BlogPost
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      title,
      content,
      category,
      status,
      adsenseTag,
      banner_image,
      src_link,
      keywords,
      description,
    } = body;
    if (!title || !content || !category || !status) {
      return NextResponse.json(
        { error: "Title, content, category, and status are required" },
        { status: 400 }
      );
    }
    const { databases } = await getAdminClient();
    const post = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      ID.unique(),
      {
        title,
        content,
        category,
        status,
        adsenseTag,
        banner_image,
        src_link,
        slug: makeSlug(title),
        keywords,
        description,
      }
    );
    const allCategoriesResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    const allCategories = allCategoriesResponse.documents.map(
      mapDocumentToCategory
    );
    return NextResponse.json(mapDocumentToBlogPost(post, allCategories), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

// PUT /api/posts
//   - request body:
//     - id: string
//     - title?: string
//     - content?: string
//     - category?: string[]
//     - status?: "Published" | "Draft"
//     - adsenseTag?: string
//     - banner_image?: string
//   - response:
//     - post: BlogPost
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      id,
      title,
      content,
      category,
      status,
      adsenseTag,
      banner_image,
      src_link,
      keywords,
      description,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const { databases } = await getAdminClient();

    // Create slug if title is being updated
    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\- ]/g, "")
        .replace(/\s+/g, "-")
        .replace(/\-+/g, "-");
    }
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (adsenseTag !== undefined) updateData.adsenseTag = adsenseTag;
    if (banner_image !== undefined) updateData.banner_image = banner_image;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (description !== undefined) updateData.description = description;
    updateData.src_link = src_link;

    const post = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      id,
      updateData
    );

    const allCategoriesResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    const allCategories = allCategoriesResponse.documents.map(
      mapDocumentToCategory
    );

    return NextResponse.json(mapDocumentToBlogPost(post, allCategories), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

// DELETE /api/posts
//   - request body:
//     - id: string
//   - response:
//     - message: string
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const { databases } = await getAdminClient();

    // First check if post exists
    try {
      await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        id
      );
    } catch (error) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the post
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      id
    );

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
