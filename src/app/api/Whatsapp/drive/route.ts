import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import mime from 'mime-types';
import axios from 'axios';
import FormData from 'form-data';
import os from 'os';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return NextResponse.json({ error: 'File and fileName are required' }, { status: 400 });
    }

    // Use the system's default temporary directory
    const tmpDir = os.tmpdir();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(tmpDir, sanitizedFileName);

    // Write the file to the temporary directory
    const buffer:any = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Google Drive authentication
    const keyFilePath = path.join(process.cwd(), 'src', 'app', 'api','Whatsapp', 'drive', 'whatsapp-446508-ad0a51269ba9.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
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
  const data = new FormData();
  data.append('messaging_product', 'whatsapp');
  data.append('file', fs.createReadStream(filePath));

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v22.0/${process.env.PHONE_ID}/media`,
    headers: {
      'Authorization': `Bearer ${process.env.TOKEN}`,
      ...data.getHeaders()
    },
    data: data
  };

  try {
    const whatsappResponse = await axios.request(config);
    mediaId = whatsappResponse.data.id;
    console.log(mediaId);
  } catch (error) {
    console.error('Error uploading file to WhatsApp:', error);
  }
}

    // Clean up: Delete the temporary file after upload
    fs.unlinkSync(filePath);

    return NextResponse.json({ publicUrl: directDownloadUrl, mediaId });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
