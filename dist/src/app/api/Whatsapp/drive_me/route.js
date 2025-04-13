"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
async function POST(request) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const fileName = formData.get("fileName");
        // Get access token and WAID from request instead of context
        const accessToken = formData.get("accessToken");
        const waid = formData.get("waba_id");
        // Validate required inputs
        if (!file || !fileName) {
            return server_1.NextResponse.json({ error: "File and fileName are required" }, { status: 400 });
        }
        if (!accessToken || !waid) {
            return server_1.NextResponse.json({ error: "Access token and WAID are required" }, { status: 400 });
        }
        // Validate token format to prevent injection attacks
        if (!/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(accessToken)) {
            return server_1.NextResponse.json({ error: "Invalid access token format" }, { status: 400 });
        }
        // Validate WAID format (should be numeric)
        if (!/^\d+$/.test(waid)) {
            return server_1.NextResponse.json({ error: "Invalid WAID format" }, { status: 400 });
        }
        // Use the system's default temporary directory
        const tmpDir = os_1.default.tmpdir();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = path_1.default.join(tmpDir, sanitizedFileName);
        // Write the file to the temporary directory
        const buffer = Buffer.from(await file.arrayBuffer());
        fs_1.default.writeFileSync(filePath, buffer);
        // Step 1: Create upload session
        const uploadRequestData = new form_data_1.default();
        uploadRequestData.append("file_name", sanitizedFileName);
        uploadRequestData.append("file_length", file.size.toString());
        uploadRequestData.append("file_type", file.type);
        try {
            const uploadSessionResponse = await axios_1.default.post(`https://graph.facebook.com/v22.0/${waid}/uploads?access_token=${accessToken}`, uploadRequestData, {
                headers: Object.assign({}, uploadRequestData.getHeaders()),
                timeout: 30000, // Set a reasonable timeout
            });
            const uploadSessionId = (_a = uploadSessionResponse.data) === null || _a === void 0 ? void 0 : _a.id;
            console.log("Upload session ID:", uploadSessionId);
            if (!uploadSessionId) {
                throw new Error("Upload session ID not found in response.");
            }
            // Step 2: Upload file data
            const headers = {
                Authorization: `OAuth ${accessToken}`,
                file_offset: "0", // Starting byte offset
                "Content-Type": file.type, // MIME type
                "Content-Length": file.size.toString(), // Total file size in bytes
            };
            // Read the file as a stream (better for large files)
            const fileStream = fs_1.default.createReadStream(filePath);
            const uploadResponse = await axios_1.default.post(`https://graph.facebook.com/v22.0/${uploadSessionId}`, fileStream, {
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 60000, // Longer timeout for file upload
            });
            console.log("Upload response:", uploadResponse.data.h);
            // Clean up the temporary file
            fs_1.default.unlinkSync(filePath);
            return server_1.NextResponse.json({ responseData: uploadResponse.data.h });
        }
        catch (apiError) {
            // Clean up the temporary file in case of API error
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            throw apiError; // Re-throw for the outer catch block
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Error uploading file:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
            return server_1.NextResponse.json({
                error: ((_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message) ||
                    ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) ||
                    error.message ||
                    "Failed to upload file",
            }, { status: ((_h = error.response) === null || _h === void 0 ? void 0 : _h.status) || 500 });
        }
        else {
            console.error("Error uploading file:", error);
            return server_1.NextResponse.json({
                error: error instanceof Error ? error.message : "Failed to upload file",
            }, { status: 500 });
        }
    }
}
