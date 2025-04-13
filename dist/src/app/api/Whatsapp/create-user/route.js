"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
async function POST(req) {
    const uri = 'mongodb+srv://sunnydhakane136:EG4v1mGIVOyTEsj6@cluster0.1eluu.mongodb.net/testDB?retryWrites=true&w=majority';
    const client = new mongodb_1.MongoClient(uri);
    try {
        // Parse the JSON body from the incoming request
        const businessData = await req.json();
        console.log('Received business data:', businessData);
        // Connect to MongoDB
        await client.connect();
        const database = client.db('testDB');
        const collection = database.collection('Business');
        // Check if a document with the same clerkId already exists
        const existingBusiness = await collection.findOne({ clerkId: businessData.clerkId });
        if (existingBusiness) {
            // If a document with the same clerkId exists, return an error response
            return server_1.NextResponse.json({ error: 'Business with this clerkId already exists' }, { status: 400 });
        }
        // If no document with the same clerkId exists, insert the new business data
        const result = await collection.insertOne(businessData);
        return server_1.NextResponse.json({ message: `New business inserted with _id: ${result.insertedId}` });
    }
    catch (err) {
        console.error('Error inserting document:', err);
        return server_1.NextResponse.json({ error: 'Failed to insert business data' }, { status: 500 });
    }
    finally {
        await client.close();
    }
}
