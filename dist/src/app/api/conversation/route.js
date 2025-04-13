"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const transformers_1 = require("@xenova/transformers");
const dotenv_1 = __importDefault(require("dotenv"));
const groq_sdk_1 = require("groq-sdk");
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
dotenv_1.default.config();
let embeddingExtractor;
(0, transformers_1.pipeline)("feature-extraction", "Xenova/all-MiniLM-L6-v2")
    .then((extractor) => {
    embeddingExtractor = extractor;
    console.log("Embedding extractor initialized");
})
    .catch((error) => {
    console.error("Failed to initialize embedding extractor:", error);
});
const getPreviousMessages = async (database, tenantId, uuid, limit = 5) => {
    try {
        const tenantCollection = database.collection(tenantId);
        const conversation = await tenantCollection.findOne({ tenantId, uuid });
        if (!conversation || !conversation.messages) {
            return "";
        }
        // Get the last 'limit' messages
        const recentMessages = conversation.messages
            .slice(-limit)
            .map((msg) => `User: ${msg.question}\nAssistant: ${msg.answer}`)
            .join("\n\n");
        return recentMessages;
    }
    catch (error) {
        console.error("Error fetching previous messages:", error);
        return "";
    }
};
async function POST(request) {
    var _a, _b, _c;
    let connection;
    try {
        const body = await request.json();
        const { uuid, tenantId, message } = body;
        if (!tenantId || !uuid || !message) {
            return server_1.NextResponse.json({ message: "Tenant ID, UUID, and message are required." }, { status: 400 });
        }
        connection = await mongodb_1.MongoClient.connect(process.env.MONGODB_URL_2);
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
            return server_1.NextResponse.json({
                chatResponse: "No relevant documents found for your query.",
            });
        }
        const vectorSearchContext = vectorSearch
            .filter((doc) => typeof doc.text === "string" && doc.text.trim().length > 10)
            .map((doc) => doc.text)
            .join("\n");
        // Combine vector search results with conversation history
        const fullContext = `Previous conversation:\n${conversationHistory}\n\nRelevant documents:\n${vectorSearchContext}`;
        const GROQ_KEYS = [
            process.env.GROQ_API_KEY_1,
            process.env.GROQ_API_KEY_2,
            process.env.GROQ_API_KEY_3,
        ].filter(Boolean);
        const getRandomAPIKey = (keys) => keys[Math.floor(Math.random() * keys.length)];
        const groq = new groq_sdk_1.Groq({ apiKey: getRandomAPIKey(GROQ_KEYS) });
        console.log("Sending query to Groq with full context...");
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are DuneFox, a professional and knowledgeable assistant. Your role is to assist users by providing concise, accurate, and contextually relevant answers to their queries. Maintain a professional and friendly tone. Consider both the conversation history and relevant documents when formulating your response give the highest prioity to the question asked right now then talk about the recent questions.",
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
        const aiResponse = ((_c = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "No response from AI.";
        console.log("AI Response:", aiResponse);
        const messageDocument = {
            question: message,
            answer: aiResponse,
            timestamp: new Date().toISOString(),
        };
        const tenantCollection = database.collection(tenantId);
        const result = await tenantCollection.updateOne({ tenantId, uuid }, {
            $set: { tenantId, uuid },
            $push: { messages: messageDocument },
        }, { upsert: true });
        return server_1.NextResponse.json({
            message: "Message added successfully.",
            aiResponse,
            documentId: result.upsertedId || `${tenantId}-${uuid}`,
        });
    }
    catch (error) {
        console.error("Error in conversation route:", error);
        return server_1.NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (closeError) {
                console.error("Error closing MongoDB connection:", closeError);
            }
        }
    }
}
