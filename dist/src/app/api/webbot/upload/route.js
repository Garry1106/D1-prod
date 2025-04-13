"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.POST = POST;
const test_1 = require("@/actions/utils/test");
const client_s3_1 = require("@aws-sdk/client-s3");
const transformers_1 = require("@xenova/transformers");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
// Specify Node.js runtime
exports.runtime = 'nodejs';
// Load environment variables
dotenv_1.default.config();
// S3 Configuration
const s3Client = new client_s3_1.S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
// Upload file to S3
async function uploadToS3(filePath, key, contentType) {
    console.log(`Uploading file to S3: ${filePath}`);
    const fileBuffer = fs_1.default.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer); // Convert Buffer to Uint8Array
    const command = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: uint8Array,
        ContentType: contentType,
    });
    await s3Client.send(command);
    const s3Url = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${key}`;
    console.log(`File uploaded to S3: ${s3Url}`);
    return s3Url;
}
// Initialize embedding extractor
let embeddingExtractor;
(async () => {
    try {
        embeddingExtractor = await (0, transformers_1.pipeline)("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        console.log("Embedding extractor initialized");
    }
    catch (error) {
        console.error("Failed to initialize embedding extractor:", error);
    }
})();
// MongoDB setup
const setupMongoDB = async () => {
    console.log("Setting up MongoDB...");
    const connection = await mongodb_1.MongoClient.connect(process.env.MONGODB_URL_2);
    const database = connection.db("Rag_doc");
    // Ensure "metadata" collection exists
    const metadataCollection = database.collection("metadata");
    const metadataExists = await metadataCollection.findOne({});
    if (!metadataExists) {
        await metadataCollection.insertOne({
            currentCollection: "vector_1",
            totalClerks: 0,
            clerkMappings: {}, // Stores tenantId -> vector_X mapping (keeping name for backward compatibility)
        });
        console.log("Metadata collection initialized.");
    }
    return { connection, database, metadataCollection };
};
// Ensure vector index exists
const ensureVectorIndex = async (database, collectionName) => {
    console.log(`Ensuring vector index for collection: ${collectionName}`);
    const collection = database.collection(collectionName);
    const dynamicIndexName = `${collectionName}_index`;
    const indexes = await collection.listSearchIndexes().toArray();
    const vectorIndexExists = indexes.some((index) => index.name === dynamicIndexName);
    if (!vectorIndexExists) {
        console.log(`Creating vector index for ${collectionName}...`);
        await collection.createSearchIndex({
            name: dynamicIndexName,
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        numDimensions: 384,
                        path: "embedding",
                        similarity: "cosine",
                    },
                    {
                        type: "filter",
                        path: "tenantId", // Changed from clerkId to tenantId
                    },
                ],
            },
        });
        console.log(`Vector index created for ${collectionName}.`);
    }
    else {
        console.log(`Vector index already exists for ${collectionName}.`);
    }
};
// Get active collection
const getActiveCollection = async (metadataCollection, database) => {
    console.log("Determining active collection...");
    const metadata = await metadataCollection.findOne({});
    const { currentCollection, totalClerks } = metadata;
    if (totalClerks % 10 === 0 && totalClerks !== 0) {
        const nextCollectionNumber = Math.floor(totalClerks / 10) + 1;
        const newCollection = `vector_${nextCollectionNumber}`;
        const collectionExists = await database.listCollections({ name: newCollection }).hasNext();
        if (!collectionExists) {
            await database.createCollection(newCollection);
            await ensureVectorIndex(database, newCollection);
        }
        await metadataCollection.updateOne({}, { $set: { currentCollection: newCollection } });
        console.log(`Switched to new collection: ${newCollection}`);
    }
    return { currentCollection, totalClerks };
};
// Store clerk information
async function storeClerkInfo(tenantId, // Changed from clerkId to tenantId
documentInfo) {
    console.log(`Storing clerk info for tenantId: ${tenantId}`);
    const client = await mongodb_1.MongoClient.connect(process.env.MONGODB_URL_2);
    try {
        const db = client.db(tenantId); // Changed from clerkId to tenantId
        const collection = db.collection('userinfo');
        const document = {
            tenantId, // Changed from clerkId to tenantId
            uploadedAt: new Date(),
            embedUrl: documentInfo.embedUrl,
            documentType: documentInfo.s3Url ? 'pdf' : 'website'
        };
        if (documentInfo.s3Url) {
            document.documentUrl = documentInfo.s3Url;
        }
        if (documentInfo.websiteUrl) {
            document.websiteUrl = documentInfo.websiteUrl;
        }
        await collection.insertOne(document);
        console.log("Clerk info stored in MongoDB.");
    }
    finally {
        await client.close();
    }
}
// Scrape website content
async function scrapeWebsiteContent(url) {
    console.log(`Scraping website content from URL: ${url}`);
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.evaluate(() => {
        return document.body.innerText;
    });
    await browser.close();
    console.log(`Scraped content length: ${content.length}`);
    return content;
}
// Make sure uploads directory exists
try {
    if (!fs_1.default.existsSync('./uploads')) {
        fs_1.default.mkdirSync('./uploads', { recursive: true });
        console.log("Created uploads directory");
    }
}
catch (err) {
    console.error("Error creating uploads directory:", err);
}
// POST handler
async function POST(req) {
    console.log("POST request received for /api/webbot/upload");
    try {
        // Parse the incoming form data
        const formData = await req.formData();
        // Initialize variables to store the extracted values
        let clerkId = ""; // Keep variable name as clerkId for form data extraction
        let websiteUrl = null;
        let file = null;
        // Temporary array to store key-value pairs
        const entries = [];
        // Iterate over the FormData entries
        for (const [key, value] of formData.entries()) {
            console.log(`Field: ${key}, Value: ${value}`);
            entries.push([key, value]);
        }
        // Process the entries to extract values
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            // Check if the value is the key (e.g., "clerkId", "websiteUrl", or "document")
            if (typeof value === 'string' && (value === 'clerkId' || value === 'url' || value === 'document')) {
                // The next entry will contain the actual value
                const nextEntry = entries[i + 1];
                if (nextEntry) {
                    const [nextKey, nextValue] = nextEntry;
                    if (value === 'clerkId') {
                        clerkId = nextValue;
                    }
                    else if (value === 'url') {
                        websiteUrl = nextValue;
                    }
                    else if (value === 'document') {
                        file = nextValue;
                    }
                    // Skip the next entry since it's already processed
                    i++;
                }
            }
        }
        // Rename clerkId to tenantId for rest of the processing
        const tenantId = clerkId;
        // Log the extracted fields separately
        console.log("Following are the values ");
        console.log('Tenant ID (from clerkId):', tenantId);
        console.log('Website URL:', websiteUrl);
        console.log('File:', file);
        let rawText = '';
        let s3Url = '';
        if (file) {
            console.log("Processing file upload...");
            const documentPath = `./uploads/${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await fs_1.default.promises.writeFile(documentPath, buffer);
            const fileName = `${tenantId}/${path_1.default.basename(documentPath)}`; // Changed from clerkId to tenantId
            const contentType = file.type;
            console.log("hello world in file", documentPath);
            console.log("FileName: ", fileName);
            console.log("Content Type:", contentType);
            // Upload file to S3
            s3Url = await uploadToS3(documentPath, fileName, contentType);
            console.log(`File uploaded to S3: ${s3Url}`);
            // Use the PDF parser server action
            rawText = await (0, test_1.parsePdfFile)(documentPath);
            console.log("Raw text is:", rawText);
            console.log(`PDF text extracted, length: ${rawText.length}`);
            // Clean up the file
            try {
                await fs_1.default.promises.unlink(documentPath);
                console.log("Temporary file deleted.");
            }
            catch (err) {
                console.error("Error deleting file:", err);
            }
        }
        else if (websiteUrl) {
            console.log(`Scraping website content from URL: ${websiteUrl}`);
            rawText = await scrapeWebsiteContent(websiteUrl);
            console.log("Raw text of Website scraping", rawText);
        }
        // Define chunk size and overlap
        const chunkSize = 512;
        const overlapSize = 50;
        const chunks = [];
        for (let start = 0; start < rawText.length; start += chunkSize - overlapSize) {
            chunks.push(rawText.slice(start, start + chunkSize));
        }
        console.log(`Text split into ${chunks.length} chunks.`);
        const { connection, database, metadataCollection } = await setupMongoDB();
        try {
            // Get the active collection and ensure it is indexed
            const { currentCollection, totalClerks } = await getActiveCollection(metadataCollection, database);
            const activeCollection = database.collection(currentCollection);
            console.log(`Active collection: ${currentCollection}`);
            // Ensure embeddingExtractor is ready
            if (!embeddingExtractor)
                throw new Error("Embedding extractor not initialized.");
            // Generate embed URL
            const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';
            const embedUrl = `${baseUrl}/${tenantId}`; // Changed from clerkId to tenantId
            console.log(`Generated embed URL: ${embedUrl}`);
            // Store clerk information
            await storeClerkInfo(tenantId, {
                s3Url: s3Url || undefined,
                websiteUrl: websiteUrl || undefined,
                embedUrl,
            });
            console.log("Clerk information stored in MongoDB.");
            // Process and store embeddings
            for (const chunk of chunks) {
                const embedding = await embeddingExtractor(chunk, {
                    pooling: "mean",
                    normalize: true,
                });
                await activeCollection.insertOne({
                    tenantId, // Changed from clerkId to tenantId
                    text: chunk,
                    embedding: Array.from(embedding.data),
                    createdAt: new Date(),
                });
            }
            console.log("Embeddings processed and stored in MongoDB.");
            // Update total clerks count in metadata
            await metadataCollection.updateOne({}, { $inc: { totalClerks: 1 } });
            console.log("Total clerks count updated in metadata.");
            console.log("embeded url", embedUrl);
            console.log("S3 url", s3Url);
            return server_1.NextResponse.json({
                message: "Document uploaded and processed successfully!",
                embedUrl,
                url: s3Url || websiteUrl,
            });
        }
        finally {
            await connection.close();
            console.log("MongoDB connection closed.");
        }
    }
    catch (error) {
        console.error("Error uploading document:", error);
        return server_1.NextResponse.json({ message: error.message }, { status: 500 });
    }
}
