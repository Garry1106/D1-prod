"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
async function POST(req) {
    const uri = 'mongodb+srv://shitolemukul47:ozT5QTChtW2EhEhK@clusterdunefox.myjice7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDuneFox'; // Replace with your MongoDB connection string
    const client = new mongodb_1.MongoClient(uri);
    try {
        // Parse the JSON body from the incoming request
        const userData = await req.json();
        console.log('Received user data:', userData);
        // Connect to MongoDB
        await client.connect();
        // Create or access the "business" database
        const database = client.db('business');
        // Create or access the "users" collection
        const collection = database.collection('users');
        // // Check if a document with the same clerkId already exists
        // const existingUser = await collection.findOne({ clerkId: userData.clerkId });
        // if (existingUser) {
        //   // If a document with the same clerkId exists, return an error response
        //   return NextResponse.json({ error: 'User with this clerkId already exists' }, { status: 400 });
        // }
        // If no document with the same clerkId exists, insert the new user data
        const result = await collection.insertOne(userData);
        return server_1.NextResponse.json({ message: `New user inserted with _id: ${result.insertedId}` });
    }
    catch (err) {
        console.error('Error inserting document:', err);
        return server_1.NextResponse.json({ error: 'Failed to insert user data' }, { status: 500 });
    }
    finally {
        await client.close();
    }
}
