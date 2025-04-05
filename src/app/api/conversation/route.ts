import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();

let embeddingExtractor: any;

pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  .then((extractor) => {
    embeddingExtractor = extractor;
    console.log("Embedding extractor initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize embedding extractor:", error);
  });

const getPreviousMessages = async (database: any, tenantId: string, uuid: string, limit = 5) => {
  try {
    const tenantCollection = database.collection(tenantId);
    const conversation = await tenantCollection.findOne({ tenantId, uuid });
    
    if (!conversation || !conversation.messages) {
      return "";
    }

    // Get the last 'limit' messages
    const recentMessages = conversation.messages
      .slice(-limit)
      .map((msg: { question: string; answer: string }) => 
        `User: ${msg.question}\nAssistant: ${msg.answer}`
      )
      .join("\n\n");

    return recentMessages;
  } catch (error) {
    console.error("Error fetching previous messages:", error);
    return "";
  }
};

export async function POST(request: NextRequest) {
  let connection: MongoClient | undefined;

  try {
    const body = await request.json();
    const { uuid, tenantId, message } = body;

    if (!tenantId || !uuid || !message) {
      return NextResponse.json(
        { message: "Tenant ID, UUID, and message are required." },
        { status: 400 }
      );
    }

    connection = await MongoClient.connect(process.env.MONGODB_URL_2 as string);
    const database = connection.db("Rag_doc");

    // Get previous conversation history
    const conversationHistory = await getPreviousMessages(database, tenantId, uuid);
    
    const vectorCollection = database.collection("vector_1");

    if (!embeddingExtractor) {
      throw new Error("Embedding extractor is not initialized.");
    }

    console.log("Generating embedding for the user query...");
    const messageEmbedding = await embeddingExtractor(message, { pooling: "mean", normalize: true });
    const queryEmbeddingArray = Array.from(messageEmbedding.data);

    console.log("Performing vector search in vector_1");
    const vectorSearch = await vectorCollection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_1_index",
            queryVector: queryEmbeddingArray,
            path: "embedding",
            exact: false,
            limit: 3,
            numCandidates: 3,
            filter: { tenantId },
          },
        },
      ])
      .toArray();

    if (vectorSearch.length === 0) {
      return NextResponse.json({
        chatResponse: "No relevant documents found for your query.",
      });
    }

    const vectorSearchContext = vectorSearch
      .filter((doc: any) => typeof doc.text === "string" && doc.text.trim().length > 10)
      .map((doc: any) => doc.text)
      .join("\n");

    // Combine vector search results with conversation history
    const fullContext = `Previous conversation:\n${conversationHistory}\n\nRelevant documents:\n${vectorSearchContext}`;

    const GROQ_KEYS = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean) as string[];

    const getRandomAPIKey = (keys: string[]) => keys[Math.floor(Math.random() * keys.length)];

    const groq = new Groq({ apiKey: getRandomAPIKey(GROQ_KEYS) });

    console.log("Sending query to Groq with full context...");
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are DuneFox, a professional and knowledgeable assistant. Your role is to assist users by providing concise, accurate, and contextually relevant answers to their queries. Maintain a professional and friendly tone. Consider both the conversation history and relevant documents when formulating your response give the highest prioity to the question asked right now then talk about the recent questions.",
        },
        {
          role: "user",
          content: `User query: ${message}\n\nContext: ${fullContext}`,
        },
      ],
      model: "llama3-8b-8192",
      max_tokens: 4000,
      temperature: 0.6,
    });

    const aiResponse = completion.choices?.[0]?.message?.content || "No response from AI.";
    console.log("AI Response:", aiResponse);

    const messageDocument = {
      question: message,
      answer: aiResponse,
      timestamp: new Date().toISOString(),
    };

    const tenantCollection = database.collection(tenantId);

    const result = await tenantCollection.updateOne(
      { tenantId, uuid },
      {
        $set: { tenantId, uuid },
        $push: { messages: messageDocument as any },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Message added successfully.",
      aiResponse,
      documentId: result.upsertedId || `${tenantId}-${uuid}`,
    });
  } catch (error) {
    console.error("Error in conversation route:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}