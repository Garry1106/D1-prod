"use server"

import { promises as fsPromises } from 'fs';
import pdfParse from 'pdf-parse';

export async function parsePdfFile(filePath: string): Promise<string> {
  try {
    console.log(`Parsing PDF file: ${filePath}`);

    // Use fs.promises to read the file asynchronously
    const pdfBuffer = await fsPromises.readFile(filePath);
    console.log("PDF Buffer loaded successfully");

    // Parse the PDF content
    const pdfData = await pdfParse(pdfBuffer);
    console.log(`PDF text extracted, length: ${pdfData.text.length}`);

    return pdfData.text;
  } catch (error: any) {
    console.error("Error parsing PDF:", error);
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