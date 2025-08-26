import { getAdminClient } from "@/lib/appwrite";
import { mapDocumentToBlogPost, mapDocumentToCategory } from "@/lib/helper";
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

    // Alternative approach: Use contains instead of search if fulltext indexes aren't set up
    // This is less efficient but works without indexes
    const searchQueries = [
      Query.contains("title", query),
      Query.contains("content", query),
      Query.contains("keywords", query),
    ];

    let posts = [];

    try {
      // Try fulltext search first (requires indexes)
      const [titleResults, contentResults, keywordsResults] = await Promise.all(
        [
          databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            [Query.contains("title", query), Query.equal("status", "Published")]
          ),
          databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            [
              Query.contains("content", query),
              Query.equal("status", "Published"),
            ]
          ),
          databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            [
              Query.contains("keywords", query),
              Query.equal("status", "Published"),
            ]
          ),
        ]
      );

      // Combine and deduplicate results
      const combinedDocuments = new Map();
      [
        ...titleResults.documents,
        ...contentResults.documents,
        ...keywordsResults.documents,
      ].forEach((doc) => {
        if (!combinedDocuments.has(doc.$id)) {
          combinedDocuments.set(doc.$id, doc);
        }
      });

      posts = Array.from(combinedDocuments.values()).map((doc) =>
        mapDocumentToBlogPost(doc, allCategories)
      );
    } catch (searchError: any) {
      console.warn(
        "Fulltext search failed, falling back to contains search:",
        searchError.message
      );

      // Fallback to contains search (works without fulltext indexes)
      const fallbackResults = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        [
          Query.equal("status", "Published"),
          Query.limit(100), // Limit results for performance
        ]
      );

      // Filter results manually
      const filteredPosts = fallbackResults.documents.filter((doc) => {
        const searchTerm = query.toLowerCase();
        return (
          doc.title?.toLowerCase().includes(searchTerm) ||
          doc.content?.toLowerCase().includes(searchTerm) ||
          doc.keywords?.toLowerCase().includes(searchTerm)
        );
      });

      posts = filteredPosts.map((doc) =>
        mapDocumentToBlogPost(doc, allCategories)
      );
    }

    // Sort by creation date
    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for posts." },
      { status: 500 }
    );
  }
}
