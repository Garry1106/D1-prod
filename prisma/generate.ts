// prisma/generate.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDirectoryExists(dirPath:any) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Generate Prisma clients
function generatePrisma() {
  try {
    // Ensure output directories exist
    ensureDirectoryExists(path.join(__dirname, 'generated/client1'));
    ensureDirectoryExists(path.join(__dirname, 'generated/client2'));
    
    // Generate Prisma clients
    console.log('Generating Prisma client 1...');
    execSync('npx prisma generate --schema=./prisma/schema1.prisma', { stdio: 'inherit' });
    
    console.log('Generating Prisma client 2...');
    execSync('npx prisma generate --schema=./prisma/schema2.prisma', { stdio: 'inherit' });
    
    // Copy engine binaries to locations that Next.js might look for them
    const engineSourceDir1 = path.join(__dirname, 'generated/client1/libquery_engine-rhel-openssl-3.0.x.so.node');
    const engineSourceDir2 = path.join(__dirname, 'generated/client2/libquery_engine-rhel-openssl-3.0.x.so.node');
    
    const engineDestDirs = [
      path.join(process.cwd(), '.prisma/client'),
      path.join(process.cwd(), '.next/server')
    ];
    
    for (const destDir of engineDestDirs) {
      ensureDirectoryExists(destDir);
      if (fs.existsSync(engineSourceDir1)) {
        fs.copyFileSync(engineSourceDir1, path.join(destDir, 'libquery_engine-rhel-openssl-3.0.x.so.node'));
        console.log(`Copied engine to ${destDir}`);
      }
    }
    
    console.log('Prisma clients generated successfully');
  } catch (error) {
    console.error('Error generating Prisma clients:', error);
    process.exit(1);
  }
}

generatePrisma();