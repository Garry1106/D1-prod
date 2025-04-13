"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdfFile = parsePdfFile;
exports.safeParsePdfFile = safeParsePdfFile;
const fs_1 = require("fs");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
async function parsePdfFile(filePath) {
    try {
        console.log(`Parsing PDF file: ${filePath}`);
        // Use fs.promises to read the file asynchronously
        const pdfBuffer = await fs_1.promises.readFile(filePath);
        console.log("PDF Buffer loaded successfully");
        // Parse the PDF content
        const pdfData = await (0, pdf_parse_1.default)(pdfBuffer);
        console.log(`PDF text extracted, length: ${pdfData.text.length}`);
        return pdfData.text;
    }
    catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
}
// Optional: Add a wrapper function for more robust error handling
async function safeParsePdfFile(filePath) {
    try {
        return await parsePdfFile(filePath);
    }
    catch (error) {
        console.error("Safe PDF parsing failed:", error);
        return ''; // Return empty string instead of throwing
    }
}
