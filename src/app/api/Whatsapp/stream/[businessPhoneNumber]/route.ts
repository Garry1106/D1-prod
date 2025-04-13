import { NextRequest } from 'next/server';
import connectToDatabase, { ensureCollections, getTenantDatabase } from "@/lib/mongodb";

// This is a special Next.js API route for SSE (Server-Sent Events)
export async function GET(
  request: NextRequest,
  { params }: { params: { businessPhoneNumber: string } }
) {
  const { businessPhoneNumber } = await params;

  // Validate business phone number
  if (!businessPhoneNumber) {
    return new Response(
      JSON.stringify({ success: false, error: "Business phone number is required." }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Set up SSE response headers
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  try {
    // Connect to MongoDB and set up collections
    await connectToDatabase();
    await ensureCollections(businessPhoneNumber);
    const db = await  getTenantDatabase(businessPhoneNumber);
    const chatsCollection = db.collection("chats");

    // Create an encoder for text
    const encoder = new TextEncoder();

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial data
        const initialData = await chatsCollection.find({}).toArray();
        const initialDataString = JSON.stringify(initialData);
        controller.enqueue(encoder.encode(`data: ${initialDataString}\n\n`));

        // Set up change stream
        const changeStream = chatsCollection.watch();

        // Handle change stream events
        changeStream.on('change', async () => {
          try {
            // Fetch the updated data
            const updatedData = await chatsCollection.find({}).toArray();
            const updatedDataString = JSON.stringify(updatedData);
            
            // Send the updated data to the client
            controller.enqueue(encoder.encode(`data: ${updatedDataString}\n\n`));
          } catch (error) {
            console.error('Error processing change stream update:', error);
            // Send an error message
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Error processing update' })}\n\n`));
          }
        });

        // Handle connection close
        request.signal.addEventListener('abort', () => {
          changeStream.close();
        });

        // Send a keep-alive message every 30 seconds to prevent timeouts
        const keepAliveInterval = setInterval(() => {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        }, 30000);

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          clearInterval(keepAliveInterval);
        });
      }
    });

    // Return the stream as the response
    return new Response(stream, { headers: responseHeaders });
  } catch (error) {
    console.error(`Error in stream API for ${businessPhoneNumber}:`, error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to set up change stream" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}