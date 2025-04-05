import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import os from "os";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    
    // Get access token and WAID from request instead of context
    const accessToken = formData.get("accessToken") as string;
    const waid = formData.get("waba_id") as string;

    // Validate required inputs
    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File and fileName are required" },
        { status: 400 }
      );
    }

    if (!accessToken || !waid) {
      return NextResponse.json(
        { error: "Access token and WAID are required" },
        { status: 400 }
      );
    }

    // Validate token format to prevent injection attacks
    if (!/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(accessToken)) {
      return NextResponse.json(
        { error: "Invalid access token format" },
        { status: 400 }
      );
    }

    // Validate WAID format (should be numeric)
    if (!/^\d+$/.test(waid)) {
      return NextResponse.json(
        { error: "Invalid WAID format" },
        { status: 400 }
      );
    }

    // Use the system's default temporary directory
    const tmpDir = os.tmpdir();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(tmpDir, sanitizedFileName);

    // Write the file to the temporary directory
    const buffer:any = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Step 1: Create upload session
    const uploadRequestData = new FormData();
    uploadRequestData.append("file_name", sanitizedFileName);
    uploadRequestData.append("file_length", file.size.toString());
    uploadRequestData.append("file_type", file.type);

    try {
      const uploadSessionResponse = await axios.post(
        `https://graph.facebook.com/v22.0/${waid}/uploads?access_token=${accessToken}`,
        uploadRequestData,
        {
          headers: {
            ...uploadRequestData.getHeaders(),
          },
          timeout: 30000, // Set a reasonable timeout
        }
      );

      const uploadSessionId = uploadSessionResponse.data?.id;
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
      const fileStream = fs.createReadStream(filePath);

      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v22.0/${uploadSessionId}`,
        fileStream,
        {
          headers: headers,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000, // Longer timeout for file upload
        }
      );

      console.log("Upload response:", uploadResponse.data.h);

      // Clean up the temporary file
      fs.unlinkSync(filePath);
      
      return NextResponse.json({ responseData: uploadResponse.data.h });
    } catch (apiError) {
      // Clean up the temporary file in case of API error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw apiError; // Re-throw for the outer catch block
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
      
      return NextResponse.json(
        {
          error: error.response?.data?.error?.message || 
                 error.response?.data?.error || 
                 error.message || 
                 "Failed to upload file",
        },
        { status: error.response?.status || 500 }
      );
    } else {
      console.error("Error uploading file:", error);
      
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Failed to upload file",
        },
        { status: 500 }
      );
    }
  }
}