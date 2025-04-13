"use strict";
'use server';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantDatabase = getTenantDatabase;
exports.ensureCollections = ensureCollections;
exports.saveChatHistory = saveChatHistory;
exports.getTenantConfig = getTenantConfig;
exports.getTenantConfigByClerk = getTenantConfigByClerk;
const mongodb_1 = require("mongodb");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI)
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
let mongoClient;
async function connectToDatabase() {
    if (!mongoClient) {
        mongoClient = new mongodb_1.MongoClient(MONGODB_URI);
        await mongoClient.connect();
        console.log(`connected db`);
    }
    return mongoClient;
}
async function getTenantDatabase(businessPhoneNumber) {
    console.log('getTenantDatabase called with businessPhoneNumber:', businessPhoneNumber);
    const tenantDbName = `tenant_${businessPhoneNumber}`;
    console.log('Accessing tenant database 1:', tenantDbName);
    return mongoClient.db(tenantDbName);
}
async function ensureCollections(businessPhoneNumber) {
    const client = await connectToDatabase();
    if (client) {
        const db = await getTenantDatabase(businessPhoneNumber);
        const requiredCollections = ['chats', 'prompts'];
        const existingCollections = await db.listCollections().toArray();
        const existingCollectionNames = existingCollections.map((col) => col.name);
        await Promise.race([
            Promise.all(requiredCollections.map(async (collection) => {
                if (!existingCollectionNames.includes(collection)) {
                    await db.createCollection(collection);
                }
            })),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout creating collections')), 10000)),
        ]);
    }
}
async function saveChatHistory(businessPhoneNumber, waId, userMessage, responseMessage, alert = false) {
    await ensureCollections(businessPhoneNumber);
    console.log("Response in save chat", businessPhoneNumber, waId, userMessage, responseMessage, alert);
    const tenantDb = await getTenantDatabase(businessPhoneNumber);
    const chatsCollection = tenantDb.collection('chats');
    const timestamp = getISTTimestamp();
    const newMessage = {
        user: { message: userMessage || '', timestamp },
        response: { message: responseMessage || '', timestamp }
    };
    try {
        await chatsCollection.updateOne({ wa_id: waId }, {
            $setOnInsert: { responseMode: "auto", alert },
            $push: { messages: newMessage } // Type assertion needed due to MongoDB typings limitation
        }, { upsert: true });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error saving chat history: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while saving chat history');
        }
        throw error;
    }
}
async function getTenantConfig(phoneNumberId) {
    try {
        await connectToDatabase();
        const businessCollection = mongoClient.db('testDB').collection('Business');
        const tenantConfig = await businessCollection.findOne({ phoneNumberId: phoneNumberId });
        if (!tenantConfig) {
            throw new Error(`No tenant configuration found for phone_number_id: ${phoneNumberId}`);
        }
        return tenantConfig;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error loading tenant configuration: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while loading tenant configuration');
        }
        throw error;
    }
}
async function getTenantConfigByClerk(clerkId) {
    try {
        await connectToDatabase();
        const businessCollection = mongoClient.db('testDB').collection('Business');
        const tenantConfig = await businessCollection.findOne({ clerkId: clerkId });
        if (!tenantConfig) {
            throw new Error(`No tenant configuration found for phone_number_id: ${clerkId}`);
        }
        console.log("Tenant Config in Server is:", JSON.parse(JSON.stringify(tenantConfig)));
        return JSON.parse(JSON.stringify(tenantConfig));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error loading tenant configuration: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while loading tenant configuration');
        }
        throw error;
    }
}
exports.default = connectToDatabase;
function getISTTimestamp() {
    return (0, moment_timezone_1.default)().tz('Asia/Kolkata').format();
}
