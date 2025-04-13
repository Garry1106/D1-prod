"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
dotenv_1.default.config();
async function GET(request) {
    // Parse the URL to get query parameters
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    console.log("Received request for tenant ID:", tenantId);
    if (!tenantId) {
        console.error("Invalid Tenant ID:", tenantId);
        return server_1.NextResponse.json({ message: "Tenant ID is required and must be a string." }, { status: 400 });
    }
    let connection;
    try {
        console.log("Connecting to MongoDB...");
        connection = await mongodb_1.MongoClient.connect(process.env.MONGODB_URL_2);
        console.log("Connected to MongoDB");
        const database = connection.db("Rag_doc");
        console.log("Accessing database: Rag_doc");
        const tenantCollection = database.collection(tenantId);
        console.log("Accessing collection for tenant ID:", tenantId);
        // Fetch all documents for the given tenant ID
        const documents = await tenantCollection.find({}).toArray();
        console.log(`Fetched ${documents.length} documents for tenant ID:`, tenantId);
        if (documents.length === 0) {
            console.warn("No documents found for the given Tenant ID:", tenantId);
            return server_1.NextResponse.json({ message: "No documents found for the given Tenant ID." }, { status: 404 });
        }
        return server_1.NextResponse.json({
            message: "Documents fetched successfully.",
            data: documents,
        });
    }
    catch (error) {
        console.error("Error fetching documents:", error);
        return server_1.NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
    finally {
        if (connection) {
            try {
                await connection.close();
                console.log("MongoDB connection closed.");
            }
            catch (closeError) {
                console.error("Error closing MongoDB connection:", closeError);
            }
        }
    }
}
