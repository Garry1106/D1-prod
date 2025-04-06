import { NextRequest, NextResponse } from "next/server";
import Redis, { RedisOptions } from "ioredis";
import util from 'util';
import connectToDatabase, { ensureCollections, getTenantDatabase } from "@/lib/mongodb";

const REDIS_CONFIG: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 5,
};

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_CONFIG);

    redisClient.on('error', (err) => {
      // console.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      // console.log('Successfully connected to Redis');
    });
  }

  return redisClient;
}

const getRedisKey = (businessPhoneNumber: string) => `chats:${businessPhoneNumber}`;

const activeChangeStreams = new Map();

// Use the simpler nextjs route handler pattern
export async function GET(req: NextRequest) {
  // Get the business phone number from the URL path
  const businessPhoneNumber = req.nextUrl.pathname.split('/').pop();

  console.log("Business Phone number in data", businessPhoneNumber);

  if (!businessPhoneNumber) {
    return NextResponse.json(
      { success: false, error: "Business phone number is required." },
      { status: 400 }
    );
  }

  try {
    // Initialize Redis client
    const redis = getRedisClient();
    
    // Connect to MongoDB and set up collections
    await connectToDatabase();
    await ensureCollections(businessPhoneNumber);
    const db = await getTenantDatabase(businessPhoneNumber);
    const chatsCollection = db.collection("chats");
    
    // Rest of your code remains the same...
    // Initialize change stream if not already active
    if (!activeChangeStreams.has(businessPhoneNumber)) {
      console.log(`Initializing change stream for ${businessPhoneNumber}...`);
      const changeStream = chatsCollection.watch();
      
      changeStream.on("change", async (change) => {
        // Use util.inspect to show full nested objects
        console.log("Change detected:", util.inspect(change, { depth: null, colors: true }));
        
        // Update Redis cache when changes occur
        const updatedChats = await chatsCollection.find({}).toArray();
        await redis.setex(getRedisKey(businessPhoneNumber), 3600, JSON.stringify(updatedChats));

        if (change.operationType === "insert") {
          console.log("New document inserted:", 
            util.inspect(change.fullDocument, { depth: null, colors: true }));
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
      return NextResponse.json({
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

    return NextResponse.json({
      success: true,
      data: chats,
      message: "Change stream initialized and current data fetched.",
      source: "database"
    });
  } catch (error) {
    console.error(`Error in GET /api/Whatsapp/data/${businessPhoneNumber}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data or set up change detection." },
      { status: 500 }
    );
  }
}