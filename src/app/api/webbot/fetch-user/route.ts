import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) 
{
  try {
    const body = await request.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId in request body' }, { status: 400 });
    }

    const uri = 'mongodb+srv://shitolemukul47:ozT5QTChtW2EhEhK@clusterdunefox.myjice7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDuneFox'
    const client = new MongoClient(uri);

    console.log("Clerk id in db",clerkId)
    try {
      // Connect to MongoDB
      await client.connect();

      // Access the "business" database and "users" collection
      const database = client.db('business');
      const collection = database.collection('users');
      

      // Find the user with the provided clerkId
      const user = await collection.findOne({ clerkId });

      console.log("User in Collection",user)

      return NextResponse.json(user);
    } catch (err) {
      console.error('Error retrieving user:', err);
      return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 });
    } finally {
      await client.close();
    }
  }catch(err){
    console.error(err)
  }
}