"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const prisma2_1 = require("@/lib/prisma/prisma2");
async function POST(req) {
    try {
        // Parse the request body
        const { groupName, contacts } = await req.json();
        // Validate the input
        if (!groupName || !contacts || !Array.isArray(contacts)) {
            return server_1.NextResponse.json({ error: 'Invalid input. Group name and contacts are required.' }, { status: 400 });
        }
        // Validate that each contact has a `phone` property
        if (!contacts.every(contact => contact.phone)) {
            return server_1.NextResponse.json({ error: 'Each contact must have a `phone` property.' }, { status: 400 });
        }
        // Create the group with embedded contacts
        const group = await prisma2_1.client2.group.create({
            data: {
                groupName,
                contacts: contacts, // Store contacts as JSON
            },
        });
        // Ensure the group was created successfully
        if (!group) {
            return server_1.NextResponse.json({ error: 'Failed to create group.' }, { status: 500 });
        }
        // Log the created group for debugging
        console.log('Created group:', group);
        return server_1.NextResponse.json(group, { status: 201 });
    }
    catch (error) {
        console.error('Error creating group:', error instanceof Error ? error.message : error);
        return server_1.NextResponse.json({ error: 'Failed to create group. Please check the server logs.' }, { status: 500 });
    }
}
async function GET() {
    try {
        // Fetch all groups
        const groups = await prisma2_1.client2.group.findMany();
        // Ensure the response is an array
        if (!Array.isArray(groups)) {
            return server_1.NextResponse.json({ error: 'Groups data is not in the expected format' }, { status: 500 });
        }
        // Log the fetched groups for debugging
        console.log('Fetched groups:', groups);
        return server_1.NextResponse.json(groups, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching groups:', error instanceof Error ? error.message : error);
        return server_1.NextResponse.json({ error: 'Failed to fetch groups. Please check the server logs.' }, { status: 500 });
    }
}
