"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const zod_1 = require("zod");
const prisma2_1 = require("@/lib/prisma/prisma2");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const drive_1 = require("@/lib/drive");
// Remove the context import since it can't be used in API routes
// import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';
// =================
// 1. Form Validation
// =================
const formSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Campaign name is required'),
    templateId: zod_1.z.string().min(1, 'Template is required'),
    groupId: zod_1.z.string().min(1, 'Group is required'),
    scheduledFor: zod_1.z.date().optional(),
    // Add these two fields to the schema to receive them from the client
    accessToken: zod_1.z.string().min(1, 'Access token is required'),
    phoneNumberId: zod_1.z.string().min(1, 'Phone number ID is required'),
});
// ================================
// 2. Helper to Download Media File
// ================================
async function downloadToTempFile(mediaUrl, tempDir) {
    // Ensure the directory exists
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    // Extract file extension
    const urlParts = mediaUrl.split('?')[0];
    const extension = path_1.default.extname(urlParts);
    if (!extension) {
        throw new Error('Unable to determine file extension from media URL');
    }
    // Create temp filename
    const tempFilePath = path_1.default.join(tempDir, `temp-file-${Date.now()}${extension}`);
    return new Promise((resolve, reject) => {
        const file = fs_1.default.createWriteStream(tempFilePath);
        https_1.default
            .get(mediaUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(tempFilePath);
            });
        })
            .on('error', (err) => {
            fs_1.default.unlink(tempFilePath, () => { });
            reject(err);
        });
    });
}
// =========================================
// 3. Fetch Template from Meta (and upload)
// =========================================
async function fetchTemplate(templateId, accessToken) {
    var _a, _b, _c, _d, _e;
    console.log('Fetching template from Meta API...');
    // 3a. Fetch template data from Meta
    const templateResponse = await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${templateId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Use accessToken passed as parameter
        },
    });
    if (!templateResponse.ok) {
        const errorData = await templateResponse.json();
        console.error('Meta API Error:', errorData);
        throw new Error('Failed to fetch template from Meta API');
    }
    const templateData = await templateResponse.json();
    if (!templateData || !templateData.components) {
        throw new Error('Invalid template data structure from Meta API');
    }
    console.log('Template fetched successfully:', templateData);
    // 3b. Check for a header component to see if there's a media URL
    const headerComponent = templateData.components.find((comp) => comp.type === 'HEADER');
    let mediaUrl;
    if (headerComponent === null || headerComponent === void 0 ? void 0 : headerComponent.format) {
        mediaUrl =
            ((_b = (_a = headerComponent.example) === null || _a === void 0 ? void 0 : _a.header_handle) === null || _b === void 0 ? void 0 : _b[0]) ||
                ((_d = (_c = headerComponent.example) === null || _c === void 0 ? void 0 : _c.header_text) === null || _d === void 0 ? void 0 : _d[0]);
    }
    // 3c. If there's a media URL, download locally & then upload to Drive
    let filepath;
    let url;
    if (mediaUrl) {
        // Download to /tmp
        filepath = await downloadToTempFile(mediaUrl, '/tmp');
        console.log('Downloaded media file:', filepath);
        url = await (0, drive_1.uploadFileToDrive)(filepath, path_1.default.basename(filepath));
        console.log('Media uploaded successfully. Public URL:', url);
    }
    // Return relevant template fields
    return {
        templateName: templateData.name,
        tempLanguage: templateData.language,
        mediaType: (_e = headerComponent === null || headerComponent === void 0 ? void 0 : headerComponent.format) === null || _e === void 0 ? void 0 : _e.toLowerCase(),
        url,
    };
}
// =============================
// 4. Fetch Group from Database
// =============================
async function fetchGroup(groupId) {
    console.log(`Fetching group with ID: ${groupId}...`);
    const group = await prisma2_1.client2.group.findUnique({
        where: { id: groupId },
    });
    if (!group) {
        throw new Error('Group not found');
    }
    console.log('Group found:', group);
    return group;
}
// =============================
// 5. Parse Contacts from Group
// =============================
function parseContacts(group) {
    console.log('Parsing contacts JSON field...');
    let contacts = [];
    try {
        if (typeof group.contacts === 'string') {
            contacts = JSON.parse(group.contacts);
        }
        else if (Array.isArray(group.contacts)) {
            contacts = group.contacts;
        }
        else {
            throw new Error('Invalid contacts data in the group');
        }
        if (!contacts.every((c) => c.name && c.phone)) {
            throw new Error('Each contact must have `name` and `phone`');
        }
    }
    catch (error) {
        console.error('Error parsing contacts:', error);
        throw new Error('Invalid contacts data in the group');
    }
    console.log('Contacts parsed successfully:', contacts);
    return contacts;
}
// ================================
// 6. Send Messages to Each Contact
// ================================
async function sendMessagesToContacts(contacts, templateName, tempLanguage, accessToken, phoneNumberId, mediaType, url) {
    console.log('Sending messages to contacts...');
    for (const contact of contacts) {
        console.log(`Sending message to ${contact.name} (${contact.phone})...`);
        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: contact.phone,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: tempLanguage,
                },
            },
        };
        // If there's a header media, attach it
        if (mediaType && url) {
            payload.template.components = [
                {
                    type: 'header',
                    parameters: [
                        {
                            type: mediaType,
                            [mediaType]: {
                                link: url,
                            },
                        },
                    ],
                },
            ];
        }
        try {
            const response = await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Use accessToken parameter
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Facebook API Error:', errorData);
                throw new Error(`Failed to send message to ${contact.name} (${contact.phone})`);
            }
            console.log(`Message sent successfully to ${contact.name} (${contact.phone})`);
        }
        catch (error) {
            console.error(`Error sending message to ${contact.name} (${contact.phone}):`, error);
        }
    }
}
// ===============================
// 7. Main POST Handler (Campaign)
// ===============================
async function POST(request) {
    try {
        console.log('Starting campaign creation process...');
        // 7a. Validate environment
        if (!process.env.WHATSAPP_API_VERSION) {
            throw new Error('Missing required environment variables for Meta API');
        }
        console.log('Environment variables validated successfully.');
        // 7b. Parse request data
        const body = await request.json();
        console.log('Request body:', body);
        // Parse with added fields for accessToken and phoneNumberId
        const { name, templateId, groupId, scheduledFor, accessToken, phoneNumberId } = formSchema.parse(body);
        console.log('Parsed request body:', { name, templateId, groupId, scheduledFor });
        // Validate input to protect against injection attacks
        if (!/^[a-zA-Z0-9-]+$/.test(templateId) || !/^[a-zA-Z0-9-]+$/.test(groupId)) {
            return server_1.NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
        }
        // 7c. Fetch group + parse contacts
        const group = await fetchGroup(groupId);
        const contacts = parseContacts(group);
        // 7d. Fetch template and (possibly) upload media
        const { templateName, tempLanguage, mediaType, url } = await fetchTemplate(templateId, accessToken);
        // 7e. Create campaign record in DB
        const campaign = await prisma2_1.client2.campaign.create({
            data: {
                name,
                templateId,
                templateName,
                tempLanguage,
                tempType: mediaType || null,
                tempHeader: url || null,
                groupId,
                groupName: group.groupName,
                scheduledFor: scheduledFor || null,
                status: scheduledFor ? 'scheduled' : 'draft',
            },
        });
        console.log('Campaign created successfully:', campaign);
        // 7f. If not scheduled, send messages immediately
        if (!scheduledFor) {
            console.log('Campaign is not scheduled. Sending messages now...');
            await sendMessagesToContacts(contacts, templateName, tempLanguage, accessToken, phoneNumberId, mediaType, url);
            console.log('Updating campaign status to "sent"...');
            await prisma2_1.client2.campaign.update({
                where: { id: campaign.id },
                data: { status: 'sent' },
            });
            console.log('Campaign status updated to "sent".');
        }
        else {
            console.log('Campaign is scheduled; messages will not be sent immediately.');
        }
        return server_1.NextResponse.json(campaign, { status: 201 });
    }
    catch (error) {
        console.error('Error creating campaign:', error instanceof Error ? error.message : error);
        return server_1.NextResponse.json({ error: 'Failed to create campaign. Please check the server logs.' }, { status: 500 });
    }
}
// ===============================
// 8. Fetch (Campaigns)
// ===============================
async function GET() {
    try {
        const campaigns = await prisma2_1.client2.campaign.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return server_1.NextResponse.json(campaigns);
    }
    catch (error) {
        console.error('Error fetching campaigns:', error);
        return server_1.NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}
