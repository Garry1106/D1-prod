//src/app/api/get-response-mode/route.ts
import { NextResponse } from "next/server";
import connectToDatabase, { getTenantDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { waId, businessPhoneNumber } = body;

    if (!waId || !businessPhoneNumber) {
      return NextResponse.json(
        { success: false, error: "waId and businessPhoneNumber are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const db = await getTenantDatabase(businessPhoneNumber);
    const chatsCollection = db.collection("chats");

    const chat = await chatsCollection.findOne({ wa_id: String(waId) });
    if (!chat) {
      return NextResponse.json(
        { success: false, error: "No chat found with the provided waId." },
        { status: 404 }
      );
    }

    // Return the responseMode, defaulting to 'auto' if not set
    return NextResponse.json({
      success: true,
      responseMode: chat.responseMode || "auto",
    });
  } catch (error) {
    console.error("Error in POST /api/get-response-mode:", error);
    return NextResponse.json({ success: false, error: "Failed to get response mode." }, { status: 500 });
  }
}