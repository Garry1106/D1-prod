"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const mongodb_1 = require("mongodb");
const server_1 = require("next/server");
const client = new mongodb_1.MongoClient(process.env.MONGODB_URL_2);
async function POST(request) {
    var _a;
    try {
        const body = await request.json();
        const { tenantId, uuid, name, email } = body;
        if (!tenantId || !uuid || !name || !email) {
            return server_1.NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        await client.connect();
        const db = client.db("Rag_doc");
        const leadsCollection = db.collection("lead");
        // Check if tenantId already exists
        const existingTenant = await leadsCollection.findOne({ tenantId });
        if (existingTenant) {
            // Check if the name, email, and uuid already exist
            const existingLead = (_a = existingTenant.leads) === null || _a === void 0 ? void 0 : _a.find((lead) => lead.name === name && lead.email === email && lead.uuid === uuid);
            if (existingLead) {
                return server_1.NextResponse.json({ message: 'Lead already exists' }, { status: 409 });
            }
            // Append new lead to the existing tenant's leads array
            await leadsCollection.updateOne({ tenantId }, { $push: { leads: { name, email, uuid, createdAt: new Date() } } });
        }
        else {
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
        return server_1.NextResponse.json({ message: 'Lead saved successfully' }, { status: 201 });
    }
    catch (error) {
        console.error('Error saving lead:', error);
        return server_1.NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    finally {
        await client.close();
    }
}
