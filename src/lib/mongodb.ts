'use server'

import { MongoClient, Document } from 'mongodb';
import moment from 'moment-timezone';

interface ChatMessage {
  user: {
    message: string;
    timestamp: string;
  };
  response: {
    message: string;
    timestamp: string;
  };
}

interface ChatDocument extends Document {
  wa_id: string;
  responseMode: string;
  alert: boolean;
  messages: ChatMessage[];
}

interface TenantConfig extends Document {
  phoneNumberId: string;
  // Add other config fields as needed
}

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable in .env.local');

let mongoClient: MongoClient;

async function connectToDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log(`connected db`);
  }
  return mongoClient;
}

export async function getTenantDatabase(businessPhoneNumber: string) {
  console.log('getTenantDatabase called with businessPhoneNumber:', businessPhoneNumber);
  const tenantDbName = `tenant_${businessPhoneNumber}`;
  console.log('Accessing tenant database 1:', tenantDbName);
  return mongoClient.db(tenantDbName);
}

export async function ensureCollections(businessPhoneNumber: string) {
  const client = await connectToDatabase();
  if (client) {
    const db = await getTenantDatabase(businessPhoneNumber);
    const requiredCollections = ['chats', 'prompts'];
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map((col) => col.name);





    await Promise.race([
      Promise.all(
        requiredCollections.map(async (collection) => {
          if (!existingCollectionNames.includes(collection)) {
            await db.createCollection(collection);
          }
        })
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout creating collections')), 10000)
      ),
    ]);
  }
}

export async function saveChatHistory(
  businessPhoneNumber: string,
  waId: string,
  userMessage: string,
  responseMessage: string,
  alert: boolean = false
) {
  await ensureCollections(businessPhoneNumber);
  console.log("Response in save chat",businessPhoneNumber,waId,userMessage,responseMessage,alert);
  const tenantDb = await getTenantDatabase(businessPhoneNumber);
  const chatsCollection = tenantDb.collection<ChatDocument>('chats');
  const timestamp = getISTTimestamp();

  const newMessage: ChatMessage = {
    user: { message: userMessage || '', timestamp },
    response: { message: responseMessage || '', timestamp }
  };

  try {
    await chatsCollection.updateOne(
      { wa_id: waId },
      {
        $setOnInsert: { responseMode: "auto", alert },
        $push: { messages: newMessage as any } // Type assertion needed due to MongoDB typings limitation
      },
      { upsert: true }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error saving chat history: ${error.message}`);
    } else {
      console.error('An unknown error occurred while saving chat history');
    }
    throw error;
  }
}


export async function getTenantConfig(phoneNumberId: string): Promise<TenantConfig> {
  try {
    await connectToDatabase();
    const businessCollection = mongoClient.db('testDB').collection<TenantConfig>('Business');
    const tenantConfig = await businessCollection.findOne({ phoneNumberId: phoneNumberId });

    if (!tenantConfig) {
      throw new Error(`No tenant configuration found for phone_number_id: ${phoneNumberId}`);
    }

    return tenantConfig;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error loading tenant configuration: ${error.message}`);
    } else {
      console.error('An unknown error occurred while loading tenant configuration');
    }
    throw error;
  }
}

export async function getTenantConfigByClerk(clerkId: string): Promise<TenantConfig> {
  try {
    await connectToDatabase();
    const businessCollection = mongoClient.db('testDB').collection<TenantConfig>('Business');
    const tenantConfig = await businessCollection.findOne({ clerkId: clerkId });


    if (!tenantConfig) {
      throw new Error(`No tenant configuration found for phone_number_id: ${clerkId}`);
    }

    console.log("Tenant Config in Server is:", JSON.parse(JSON.stringify(tenantConfig)))
    return JSON.parse(JSON.stringify(tenantConfig));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error loading tenant configuration: ${error.message}`);
    } else {
      console.error('An unknown error occurred while loading tenant configuration');
    }
    throw error;
  }
}

export default connectToDatabase;



function getISTTimestamp() {
  return moment().tz('Asia/Kolkata').format();
}