import connectToDatabase, { ensureCollections, getTenantDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { businessPhoneNumber: string } }
) {
  const { businessPhoneNumber } = await params;

  if (!businessPhoneNumber) {
    return NextResponse.json(
      { success: false, error: "Business phone number is required." },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB and set up collections
    await connectToDatabase();
    await ensureCollections(businessPhoneNumber);
    const db = await getTenantDatabase(businessPhoneNumber);
    const chatsCollection = db.collection("chats");

    // Get data directly from MongoDB
    const chats = await chatsCollection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: chats,
      message: "Data fetched successfully"
    });
  } catch (error) {
    console.error(`Error in GET /api/data/${businessPhoneNumber}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}