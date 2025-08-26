import { getAdminClient } from "@/lib/appwrite";
import { mapDocumentToBlogPost } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const { databases } = await getAdminClient();

    // Fetch all categories once
    const categoriesResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    const allCategories = categoriesResponse.documents.map(
      mapDocumentToCategory
    );

    // Perform parallel searches
    const [titleResults, contentResults, keywordsResults] = await Promise.all([
      databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [Query.search("title", query), Query.equal("status", "Published")]
      ),
      databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [Query.search("content", query), Query.equal("status", "Published")]
      ),
        databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [Query.search("keywords", query), Query.equal("status", "Published")]
      ),
    ]);

    // Combine and deduplicate results
    const combinedDocuments = new Map();
    [...titleResults.documents, ...contentResults.documents, ...keywordsResults.documents].forEach(doc => {
        if (!combinedDocuments.has(doc.$id)) {
            combinedDocuments.set(doc.$id, doc);
        }
    });

    const posts = Array.from(combinedDocuments.values()).map(doc => mapDocumentToBlogPost(doc, allCategories));
    
    // Sort by creation date
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(posts);

  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for posts." },
      { status: 500 }
    );
  }
}
