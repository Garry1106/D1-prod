"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.DELETE = DELETE;
exports.POST = POST;
const server_1 = require("next/server");
async function GET(request) {
    try {
        // Get API credentials from request headers
        const headers = request.headers;
        const API_VERSION = process.env.WHATSAPP_API_VERSION;
        const WABA_ID = headers.get("x-waba-id");
        const ACCESS_TOKEN = headers.get("x-access-token");
        // Validate required credentials
        if (!API_VERSION || !WABA_ID || !ACCESS_TOKEN) {
            return server_1.NextResponse.json({ error: "Missing WhatsApp API configuration" }, { status: 401 });
        }
        const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${WABA_ID}/message_templates`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
            return server_1.NextResponse.json({ error: "WhatsApp API error", details: data }, { status: response.status });
        }
        if (!data || !Array.isArray(data.data)) {
            return server_1.NextResponse.json({ error: "Invalid response format from WhatsApp API" }, { status: 500 });
        }
        return server_1.NextResponse.json({ data: data.data });
    }
    catch (error) {
        console.error("Template fetch error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}
async function DELETE(request) {
    try {
        // Get API credentials from request headers
        const headers = request.headers;
        const API_VERSION = process.env.WHATSAPP_API_VERSION;
        const WABA_ID = headers.get("x-waba-id");
        const ACCESS_TOKEN = headers.get("x-access-token");
        // Validate required credentials
        if (!API_VERSION || !WABA_ID || !ACCESS_TOKEN) {
            return server_1.NextResponse.json({ error: "Missing WhatsApp API configuration" }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const templateName = searchParams.get("name");
        if (!templateName) {
            return server_1.NextResponse.json({ error: "Template name is required" }, { status: 400 });
        }
        const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${WABA_ID}/message_templates?name=${encodeURIComponent(templateName)}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return server_1.NextResponse.json({ error: "WhatsApp API error", details: data }, { status: response.status });
        }
        return server_1.NextResponse.json({ success: true, data });
    }
    catch (error) {
        console.error("Template delete error:", error);
        return server_1.NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
}
async function POST(request) {
    try {
        // Get API credentials from request headers
        const headers = request.headers;
        const API_VERSION = process.env.WHATSAPP_API_VERSION;
        const WABA_ID = headers.get("x-waba-id");
        const ACCESS_TOKEN = headers.get("x-access-token");
        // Validate required credentials
        if (!API_VERSION || !WABA_ID || !ACCESS_TOKEN) {
            return server_1.NextResponse.json({ error: "Missing WhatsApp API configuration" }, { status: 401 });
        }
        const payload = await request.json();
        // Basic payload validation
        if (!payload || !payload.name || !payload.language || !payload.category) {
            return server_1.NextResponse.json({ error: "Invalid template payload" }, { status: 400 });
        }
        console.log("Incoming Payload from Frontend:", JSON.stringify(payload, null, 2));
        const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${WABA_ID}/message_templates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log("WhatsApp API Response:", JSON.stringify(data, null, 2));
        if (!response.ok) {
            console.error("WhatsApp API Error:", data);
            return server_1.NextResponse.json({
                error: "WhatsApp API error",
                details: data.error || data,
            }, { status: response.status });
        }
        return server_1.NextResponse.json({ success: true, data });
    }
    catch (error) {
        console.error("Template submission error:", error);
        return server_1.NextResponse.json({
            error: "Failed to submit template",
            details: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
