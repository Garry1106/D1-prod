"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const axios_1 = __importDefault(require("axios"));
const mongodb_1 = require("@/lib/mongodb");
const mongodb_2 = require("@/lib/mongodb");
// Next.js API route handler
async function POST(request) {
    try {
        console.log(`[POST] Incoming request received.`);
        const body = await request.json();
        console.log(`[POST] Request Body:`, JSON.stringify(body, null, 2));
        const { waId, phoneNumberId, businessPhoneNumber, message, mediaType, mediaUrl, mediaId, caption, filename } = body;
        // Input validation
        if (!waId || !phoneNumberId || !businessPhoneNumber || (!message && !mediaUrl && !mediaId && !filename)) {
            console.error(`[POST] Validation Error: Missing required fields.`);
            return server_1.NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        console.log(`[POST] Fetching tenant configuration for phoneNumberId: ${phoneNumberId}`);
        // Fetch tenant configuration
        const tenantConfig = await (0, mongodb_2.getTenantConfig)(phoneNumberId);
        console.log(`[POST] Tenant Config Retrieved:`, JSON.stringify(tenantConfig, null, 2));
        // Generate preview URL for media (if applicable)
        let previewUrl = '';
        if (mediaUrl) {
            const fileIdMatch = mediaUrl.match(/[&?]id=([^&]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                const fileId = fileIdMatch[1];
                previewUrl = `https://drive.google.com/file/d/${fileId}/preview,type:${mediaType}`;
                console.log(`[POST] Generated preview URL: ${previewUrl}`);
            }
            else {
                console.error(`[POST] Invalid mediaUrl format: ${mediaUrl}`);
                return server_1.NextResponse.json({ error: 'Invalid mediaUrl format' }, { status: 400 });
            }
        }
        // Send the custom message
        console.log(`[POST] Sending custom message to: ${waId}`);
        await sendCustomMessage(waId, message, tenantConfig, { mediaType, mediaUrl, mediaId, caption, filename });
        console.log(`[POST] Message sent successfully. Saving chat history.`);
        const autoResponseMessage = "";
        // Save chat history
        await (0, mongodb_1.saveChatHistory)(businessPhoneNumber, waId, autoResponseMessage, previewUrl + (message ? " " + message : "") || caption + previewUrl);
        console.log(`[POST] Chat history saved successfully.`);
        // Return success response
        return server_1.NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    }
    catch (error) {
        console.error(`[POST] Error processing request:`, error);
        return server_1.NextResponse.json({ error: 'Failed to send custom message', details: error.message }, { status: 500 });
    }
}
// Utility function to send a custom message
async function sendCustomMessage(waId, messageContent, tenantConfig, mediaOptions = {}) {
    console.log(`[sendCustomMessage] Preparing message for: ${waId}`);
    const { mediaType, mediaUrl, mediaId, caption, filename } = mediaOptions;
    // Base payload structure
    const data = {
        messaging_product: 'whatsapp',
        to: waId,
    };
    // Handle media messages
    if (mediaType && (mediaUrl || mediaId)) {
        const whatsappMediaType = getWhatsAppMediaType(mediaType);
        data.type = whatsappMediaType;
        // Handle documents and audio files with mediaId
        if ((whatsappMediaType === 'document' || whatsappMediaType === 'audio') && mediaId) {
            data[whatsappMediaType] = Object.assign({ id: mediaId }, (whatsappMediaType === 'document' && Object.assign({ caption: caption || messageContent }, (filename && { filename }))));
        }
        // Handle media with URL
        else if (mediaUrl) {
            data[whatsappMediaType] = Object.assign(Object.assign({ link: mediaUrl }, (whatsappMediaType === 'document' && Object.assign({ caption: caption || messageContent }, (filename && { filename })))), (whatsappMediaType !== 'document' && whatsappMediaType !== 'audio' && caption && {
                caption
            }));
        }
    }
    // Handle text-only messages
    else if (messageContent) {
        data.type = 'text';
        data.text = {
            body: messageContent
        };
    }
    // Handle invalid case where neither media nor message content is provided
    else {
        throw new Error('Either messageContent or valid media options must be provided');
    }
    console.log(`[sendCustomMessage] Sending message data:`, JSON.stringify(data, null, 2));
    return await sendMessage(data, tenantConfig);
}
// Utility function to send the message via WhatsApp API
async function sendMessage(data, tenantConfig) {
    var _a;
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tenantConfig.accessToken}`,
    };
    const url = `https://graph.facebook.com/v22.0/${tenantConfig.phoneNumberId}/messages`;
    console.log(`[sendMessage] Sending request to WhatsApp API: ${url}`);
    try {
        const response = await axios_1.default.post(url, data, { headers });
        console.info(`[MESSAGE SENT SUCCESSFULLY] Response:`, response.data);
        return response;
    }
    catch (error) {
        console.error(`[WHATSAPP API ERROR]:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
}
// Map MIME type to WhatsApp media type
const getWhatsAppMediaType = (mimeType) => {
    if (mimeType.startsWith('image'))
        return 'image';
    if (mimeType.startsWith('video'))
        return 'video';
    if (mimeType.startsWith('audio'))
        return 'audio';
    if (mimeType.startsWith('text'))
        return 'document';
    if (mimeType === 'application/pdf' || mimeType.startsWith('application'))
        return 'document';
    throw new Error(`Unsupported media type: ${mimeType}`);
};
