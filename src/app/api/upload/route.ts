// File upload handler
import { getAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

// POST /api/upload
//   - request body:
//     - file: string (base64 encoded file with data URL prefix)
//     - fileName: string
//   - response:
//     - fileId: string
//     - fileName: string
//     - fileUrl: string (preview URL)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { file, fileName } = body;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File data and fileName are required" },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!file.startsWith("data:")) {
      return NextResponse.json(
        { error: "Invalid file format. Expected base64 data URL" },
        { status: 400 }
      );
    }

    const { storage } = await getAdminClient();
    const fileId = ID.unique();

    // Extract base64 data from data URL
    const base64Data = file.split(",")[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: "Invalid base64 data" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(base64Data, "base64");

    // Upload file to Appwrite storage
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
      fileId,
      InputFile.fromBuffer(buffer, fileName)
    );

    // Generate preview URL
    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/preview?project=${process.env.APPWRITE_PROJECT_ID}&role=admin`;

    return NextResponse.json(
      {
        fileId: uploadedFile.$id,
        fileName: uploadedFile.name,
        fileUrl: fileUrl,
        size: uploadedFile.sizeOriginal,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

// GET /api/upload
//   - query parameters:
//     - fileId: string
//   - response:
//     - fileUrl: string (preview URL)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Generate preview URL
    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.APPWRITE_PROJECT_ID}&role=admin`;

    return NextResponse.json(
      {
        fileId,
        fileUrl,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting file URL:", error);
    return NextResponse.json(
      { error: "Error getting file URL" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload
//   - request body:
//     - fileId: string
//   - response:
//     - message: string
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const { storage } = await getAdminClient();

    // Delete file from Appwrite storage
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
      fileId
    );

    return NextResponse.json(
      {
        message: "File deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
