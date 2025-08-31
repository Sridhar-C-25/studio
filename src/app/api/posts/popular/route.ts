import { getAdminClient } from "@/lib/appwrite";
import { getPopularPosts } from "@/lib/google-analytics";
import { mapDocumentToBlogPost, mapDocumentToCategory } from "@/lib/helper";
import { BlogPost } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get popular posts from Google Analytics
    const popularPostsGA = await getPopularPosts();

    if (!popularPostsGA || popularPostsGA.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const { databases } = await getAdminClient();

    // Extract slugs from GA paths (remove "/blogs/" prefix)
    const slugs = popularPostsGA.map((post) =>
      post.path.replace("/blogs/", "")
    );
    // Fetch posts and categories in parallel with optimized queries
    const postsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      [
        Query.equal("slug", slugs), // Filter by specific slugs only
        Query.equal("status", "Published"), // Only published posts
        Query.select(["title", "slug", "banner_image"]), // Select only needed fields
        Query.limit(slugs.length), // Limit to expected number of results
      ]
    );

    const posts_with_view = popularPostsGA
      .map((postGA) => {
        const post = postsResponse.documents.find(
          (post) => post.slug === postGA.path.replace("/blogs/", "")
        );
        return post
          ? { ...post, createdAt: post.$createdAt, views: postGA.views } // Merge GA views with Appwrite post
          : null; // Return null for posts not found in Appwrite
      })
      .filter(Boolean);
    // Merge GA data with Appwrite posts, maintaining GA popularity order

    return NextResponse.json(posts_with_view, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Error fetching popular posts" },
      { status: 500 }
    );
  }
}
