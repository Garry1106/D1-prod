"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdfFile = parsePdfFile;
exports.safeParsePdfFile = safeParsePdfFile;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
async function parsePdfFile(filePath) {
    try {
        console.log(`Parsing PDF file: ${filePath}`);
        // Use PDFLoader from Langchain Community
        const loader = new pdf_1.PDFLoader(filePath, {
            splitPages: true,
            // Optionally limit pages
            parsedItemSeparator: ' ',
            // You can add more configuration as needed
        });
        // Load the documents
        const docs = await loader.load();
        // Extract and clean the text
        const extractedText = docs
            .map(doc => doc.pageContent)
            .join(' ')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Remove any non-printable characters
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            // Normalize Unicode characters
            .trim()
            .normalize('NFC');
        console.log(`PDF text extracted, length: ${extractedText.length}`);
        return extractedText;
    }
    catch (error) {
        console.error("Error parsing PDF:", error);
        // More detailed error logging
        console.error("Detailed error:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            filePath: filePath
        });
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
