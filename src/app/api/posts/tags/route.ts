import { getAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  try {
    // appwrite
    const tag = req.nextUrl.searchParams.get("tag");
    const limit = Math.max(
      1,
      Number(req.nextUrl.searchParams.get("limit") || 1)
    );
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || 2));
    if (!tag) {
      return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }
    const { databases } = await getAdminClient();
    const offset = (page - 1) * limit;
    const posts = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
      [
        Query.equal("status", "Published"),
        Query.contains("keywords_arr", [tag]),
        Query.limit(limit),
        Query.offset(offset),
        Query.select([
          "category.*",
          "title",
          "banner_image",
          "slug",
          "$createdAt",
        ]),
        Query.orderDesc("$createdAt"),
      ]
    );
    const totalPages = Math.ceil(posts.total / limit);
    return NextResponse.json({
      posts: posts.documents,
      meta: {
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
