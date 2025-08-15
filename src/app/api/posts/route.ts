// posts handler
import { getAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models, Query } from "node-appwrite";
import { BlogPost, Category } from "@/types";
import { mapDocumentToBlogPost, mapDocumentToCategory } from "@/lib/helper";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
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
    const { title, content, category, status, adsenseTag, banner_image } = body;
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
