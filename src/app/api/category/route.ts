// categories handler
import { getAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { makeSlug, mapDocumentToCategory } from "@/lib/helper";

// GET /api/category
//   - query parameter:
//     - id: string // category id
//   - response:
//     - if id is provided:
//       - category: Category
//     - if id is not provided:
//       - categories: Category[]
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { databases } = await getAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (id) {
      const category = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        id
      );
      return NextResponse.json(mapDocumentToCategory(category), {
        status: 200,
      });
    }
    const categories = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    const response = categories.documents.map(mapDocumentToCategory);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}

// POST /api/category
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const name = body?.name;
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }
    const { databases } = await getAdminClient();
    const category = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
      makeSlug(name),
      { name }
    );
    return NextResponse.json(mapDocumentToCategory(category), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Error creating category" },
      { status: 500 }
    );
  }
}

// PUT /api/category/:id
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const name = body?.name;
    const id = body?.id;
    if (!name || !id) {
      return NextResponse.json(
        { error: "Category name and id are required" },
        { status: 400 }
      );
    }
    const { databases } = await getAdminClient();
    const category = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
      id,
      { name }
    );
    return NextResponse.json(mapDocumentToCategory(category), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE /api/category/:id
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const id = body?.id;
    if (!id) {
      return NextResponse.json(
        { error: "Category id is required" },
        { status: 400 }
      );
    }
    const { databases } = await getAdminClient();
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
      id
    );
    return NextResponse.json(
      { message: "Category deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 }
    );
  }
}
