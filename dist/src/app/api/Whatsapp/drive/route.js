"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
const mime_types_1 = __importDefault(require("mime-types"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const os_1 = __importDefault(require("os"));
async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const fileName = formData.get('fileName');
        if (!file || !fileName) {
            return server_1.NextResponse.json({ error: 'File and fileName are required' }, { status: 400 });
        }
        // Use the system's default temporary directory
        const tmpDir = os_1.default.tmpdir();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = path_1.default.join(tmpDir, sanitizedFileName);
        // Write the file to the temporary directory
        const buffer = Buffer.from(await file.arrayBuffer());
        fs_1.default.writeFileSync(filePath, buffer);
        // Google Drive authentication
        const keyFilePath = path_1.default.join(process.cwd(), 'src', 'app', 'api', 'Whatsapp', 'drive', 'whatsapp-446508-ad0a51269ba9.json');
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const mimeType = mime_types_1.default.lookup(filePath) || 'application/octet-stream';
        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs_1.default.createReadStream(filePath),
            },
        });
        const fileId = response.data.id;
        if (!fileId) {
            throw new Error('File ID not found in response');
        }
        // Set permissions to make the file publicly readable
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        // Generate the direct download link
        const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log(`File uploaded successfully. File ID: ${fileId}`);
        console.log(`Direct Download URL: ${directDownloadUrl}`);
        let mediaId = null;
        // Check if the uploaded file is a document or audio
        if (mimeType.startsWith('application/') || mimeType.startsWith('audio/')) {
            const data = new form_data_1.default();
            data.append('messaging_product', 'whatsapp');
            data.append('file', fs_1.default.createReadStream(filePath));
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://graph.facebook.com/v22.0/${process.env.PHONE_ID}/media`,
                headers: Object.assign({ 'Authorization': `Bearer ${process.env.TOKEN}` }, data.getHeaders()),
                data: data
            };
            try {
                const whatsappResponse = await axios_1.default.request(config);
                mediaId = whatsappResponse.data.id;
                console.log(mediaId);
            }
            catch (error) {
                console.error('Error uploading file to WhatsApp:', error);
            }
        }
        // Clean up: Delete the temporary file after upload
        fs_1.default.unlinkSync(filePath);
        return server_1.NextResponse.json({ publicUrl: directDownloadUrl, mediaId });
    }
    catch (error) {
        console.error('Error uploading file:', error);
        return server_1.NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
