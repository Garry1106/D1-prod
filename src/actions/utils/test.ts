"use server"
import { promises as fsPromises } from 'fs';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export async function parsePdfFile(filePath: string): Promise<string> {
  try {
    console.log(`Parsing PDF file: ${filePath}`);

    // Use PDFLoader from Langchain Community
    const loader = new PDFLoader(filePath, {
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
  } catch (error: any) {
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
export async function safeParsePdfFile(filePath: string): Promise<string> {
  try {
    return await parsePdfFile(filePath);
  } catch (error) {
    console.error("Safe PDF parsing failed:", error);
    return ''; // Return empty string instead of throwing
  }
}