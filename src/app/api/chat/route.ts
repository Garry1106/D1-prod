import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { NextResponse } from 'next/server';

dotenv.config();

// Define the structure of a document in the tenant collection (if known)
interface TenantDocument {
  _id: string;
  [key: string]: any; // Allow for other fields if the structure isn't fixed
}

export async function GET(request: Request) {
  // Parse the URL to get query parameters
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  console.log("Received request for tenant ID:", tenantId);

  if (!tenantId) {
    console.error("Invalid Tenant ID:", tenantId);
    return NextResponse.json(
      { message: "Tenant ID is required and must be a string." },
      { status: 400 }
    );
  }

  let connection: MongoClient | undefined;

  try {
    console.log("Connecting to MongoDB...");
    connection = await MongoClient.connect(process.env.MONGODB_URL_2 as string);
    console.log("Connected to MongoDB");

    const database = connection.db("Rag_doc");
    console.log("Accessing database: Rag_doc");

    const tenantCollection = database.collection<TenantDocument>(tenantId);
    console.log("Accessing collection for tenant ID:", tenantId);

    // Fetch all documents for the given tenant ID
    const documents = await tenantCollection.find({}).toArray();

    console.log(`Fetched ${documents.length} documents for tenant ID:`, tenantId);

    if (documents.length === 0) {
      console.warn("No documents found for the given Tenant ID:", tenantId);
      return NextResponse.json(
        { message: "No documents found for the given Tenant ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Documents fetched successfully.",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("MongoDB connection closed.");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}