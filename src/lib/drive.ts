import fs from 'fs';
import { google, drive_v3 } from 'googleapis';
import { ReadStream } from 'fs';
import path from 'path';

export async function uploadFileToDrive(filePath: string, fileName: string): Promise<string> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const keyFilePath = path.join(process.cwd(), 'src', 'lib', 'whatsapp-446508-ad0a51269ba9.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive: drive_v3.Drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: {
        name: fileName, // Use the provided file name
      },
      media: {
        body: fs.createReadStream(filePath) as ReadStream,
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
  } catch (error: any) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw error;
  }
}
