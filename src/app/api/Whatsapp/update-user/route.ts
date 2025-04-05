import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const uri = 'mongodb+srv://sunnydhakane136:EG4v1mGIVOyTEsj6@cluster0.1eluu.mongodb.net/testDB?retryWrites=true&w=majority'; 
  const client = new MongoClient(uri);

  try {
    // Parse the JSON body from the incoming request
    const businessData = await req.json();
    console.log('Received business data:', businessData);

    // Connect to MongoDB and insert the data
    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('Business');

    const result = await collection.insertOne(businessData);
    return NextResponse.json({ message: `New business inserted with _id: ${result.insertedId}` });
  } catch (err) {
    console.error('Error inserting document:', err);
    return NextResponse.json({ error: 'Failed to insert business data' }, { status: 500 });
  } finally {
    await client.close();
  }
}
