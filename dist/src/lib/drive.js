"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToDrive = uploadFileToDrive;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
async function uploadFileToDrive(filePath, fileName) {
    var _a;
    try {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const keyFilePath = path_1.default.join(process.cwd(), 'src', 'lib', 'whatsapp-446508-ad0a51269ba9.json');
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const response = await drive.files.create({
            requestBody: {
                name: fileName, // Use the provided file name
            },
            media: {
                body: fs_1.default.createReadStream(filePath),
            },
            uploadType: 'resumable',
        });
        const fileId = response.data.id;
        if (!fileId) {
            throw new Error('File upload failed: No file ID returned.');
        }
        console.log(`File uploaded successfully. File ID: ${fileId}`);
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        const previewUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log(`Public URL: ${previewUrl}`);
        return previewUrl;
    }
    catch (error) {
        console.error('Error uploading file:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
}
