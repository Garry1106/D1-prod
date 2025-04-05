import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const client = new MongoClient(process.env.MONGODB_URL_2!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tenantId, uuid, name, email } = body;

        if (!tenantId || !uuid || !name || !email) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db("Rag_doc");
        const leadsCollection = db.collection("lead");

        // Check if tenantId already exists
        const existingTenant = await leadsCollection.findOne({ tenantId });
        if (existingTenant) {
            // Check if the name, email, and uuid already exist
            const existingLead = existingTenant.leads?.find(
                (lead: { name: string; email: string; uuid: string }) => 
                    lead.name === name && lead.email === email && lead.uuid === uuid
            );
            
            if (existingLead) {
                return NextResponse.json(
                    { message: 'Lead already exists' },
                    { status: 409 }
                );
            }

            // Append new lead to the existing tenant's leads array
            await leadsCollection.updateOne(
                { tenantId },
                { $push: { leads: { name, email, uuid, createdAt: new Date() } } as any }
            );
        } else {
            // Create a new tenant entry with the lead
            const leadData = {
                tenantId,
                leads: [
                    {
                        name,
                        email,
                        uuid,
                        createdAt: new Date(),
                    },
                ],
                metadata: {
                    source: 'chat_widget',
                    status: 'new',
                },
            };

            await leadsCollection.insertOne(leadData);
        }

        return NextResponse.json(
            { message: 'Lead saved successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error saving lead:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}