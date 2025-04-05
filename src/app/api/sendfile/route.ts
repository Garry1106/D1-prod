import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

// S3 Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

async function uploadToS3(fileBuffer: Buffer, key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
    });
    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        
        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create file key for S3
        const fileKey = `uploads/${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
        const contentType = file.type;
        
        try {
            const fileUrl = await uploadToS3(buffer, fileKey, contentType);
            console.log("File uploaded successfully to S3:", fileUrl);
            return NextResponse.json({ 
                success: true, 
                message: "file uploaded to S3", 
                fileUrl 
            });
        } catch (error) {
            console.error("Error uploading to S3:", error);
            return NextResponse.json(
                { success: false, message: "Error uploading file to S3", error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Request processing error:", error);
        return NextResponse.json(
            { success: false, message: "Error processing request", error },
            { status: 500 }
        );
    }
}