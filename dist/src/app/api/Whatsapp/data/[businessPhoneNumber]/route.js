"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const ioredis_1 = __importDefault(require("ioredis"));
const util_1 = __importDefault(require("util"));
const mongodb_1 = __importStar(require("@/lib/mongodb"));
const REDIS_CONFIG = {
    host: 'localhost',
    port: 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
};
let redisClient = null;
function getRedisClient() {
    if (!redisClient) {
        redisClient = new ioredis_1.default(REDIS_CONFIG);
        redisClient.on('error', (err) => {
            // console.error('Redis connection error:', err);
        });
        redisClient.on('connect', () => {
            // console.log('Successfully connected to Redis');
        });
    }
    return redisClient;
}
const getRedisKey = (businessPhoneNumber) => `chats:${businessPhoneNumber}`;
const activeChangeStreams = new Map();
// Use the simpler nextjs route handler pattern
async function GET(req) {
    // Get the business phone number from the URL path
    const businessPhoneNumber = req.nextUrl.pathname.split('/').pop();
    console.log("Business Phone number in data", businessPhoneNumber);
    if (!businessPhoneNumber) {
        return server_1.NextResponse.json({ success: false, error: "Business phone number is required." }, { status: 400 });
    }
    try {
        // Initialize Redis client
        const redis = getRedisClient();
        // Connect to MongoDB and set up collections
        await (0, mongodb_1.default)();
        await (0, mongodb_1.ensureCollections)(businessPhoneNumber);
        const db = await (0, mongodb_1.getTenantDatabase)(businessPhoneNumber);
        const chatsCollection = db.collection("chats");
        // Rest of your code remains the same...
        // Initialize change stream if not already active
        if (!activeChangeStreams.has(businessPhoneNumber)) {
            console.log(`Initializing change stream for ${businessPhoneNumber}...`);
            const changeStream = chatsCollection.watch();
            changeStream.on("change", async (change) => {
                // Use util.inspect to show full nested objects
                console.log("Change detected:", util_1.default.inspect(change, { depth: null, colors: true }));
                // Update Redis cache when changes occur
                const updatedChats = await chatsCollection.find({}).toArray();
                await redis.setex(getRedisKey(businessPhoneNumber), 3600, JSON.stringify(updatedChats));
                if (change.operationType === "insert") {
                    console.log("New document inserted:", util_1.default.inspect(change.fullDocument, { depth: null, colors: true }));
                }
            });
            activeChangeStreams.set(businessPhoneNumber, changeStream);
            console.log(`Change stream initialized for ${businessPhoneNumber}`);
        }
        // Try to get data from Redis
        const redisKey = getRedisKey(businessPhoneNumber);
        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            console.log("Data retrieved from Redis cache");
            return server_1.NextResponse.json({
                success: true,
                data: JSON.parse(cachedData),
                source: "cache",
                message: "Data retrieved from cache, change stream active"
            });
        }
        // If not in cache, get from MongoDB
        const chats = await chatsCollection.find({}).toArray();
        console.log("Current chats:", chats);
        // Cache the data in Redis
        await redis.setex(redisKey, 3600, JSON.stringify(chats));
        return server_1.NextResponse.json({
            success: true,
            data: chats,
            message: "Change stream initialized and current data fetched.",
            source: "database"
        });
    }
    catch (error) {
        console.error(`Error in GET /api/Whatsapp/data/${businessPhoneNumber}:`, error);
        return server_1.NextResponse.json({ success: false, error: "Failed to fetch data or set up change detection." }, { status: 500 });
    }
}
