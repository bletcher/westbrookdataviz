/**
 * deploy-to-s3.js
 * 
 * This script helps with manual deployment to S3.
 * It builds all apps and uploads them to S3 buckets.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { readdir, stat } from 'fs/promises';

const execAsync = promisify(exec);

// Configure S3 client
const s3Client = new S3Client({
  region: 'us-east-1', // Change this to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = 'westbrookdataviz.org';

async function buildApp(appPath) {
  console.log(`Building ${appPath}...`);
  await execAsync('npm install', { cwd: appPath });
  await execAsync('npm run build', { cwd: appPath });
  console.log(`${appPath} built successfully`);
}

async function uploadDirectoryToS3(localPath, prefix = '') {
  const files = await readdir(localPath);
  
  for (const file of files) {
    const filePath = join(localPath, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await uploadDirectoryToS3(filePath, `${prefix}${file}/`);
    } else {
      const key = `${prefix}${file}`;
      console.log(`Uploading ${key} to ${BUCKET_NAME}...`);
      
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: getContentType(file),
        CacheControl: getCacheControl(file)
      });
      
      await s3Client.send(command);
      console.log(`Uploaded ${key}`);
    }
  }
}

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject'
  };
  return types[ext] || 'application/octet-stream';
}

function getCacheControl(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  // Static assets that rarely change
  if (['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
    return 'public, max-age=31536000, immutable';
  }
  
  // HTML files that might change more frequently
  if (ext === 'html') {
    return 'public, max-age=300, stale-while-revalidate=60';
  }
  
  // JSON data files
  if (ext === 'json') {
    return 'public, max-age=3600, stale-while-revalidate=300';
  }
  
  // Default cache for other files
  return 'public, max-age=3600';
}

async function deploy() {
  try {
    // Build main site
    await buildApp('.');
    
    // Build PIT data app
    await buildApp('../pit_antenna_data_explorer');
    
    // Build set list drums app
    await buildApp('../set-list-drums');
    
    // Upload main site
    console.log('Uploading main site...');
    await uploadDirectoryToS3('dist');
    
    // Upload PIT data app
    console.log('Uploading PIT data app...');
    await uploadDirectoryToS3('../pit_antenna_data_explorer/dist', 'pit-data/');
    
    // Upload set list drums app
    console.log('Uploading set list drums app...');
    await uploadDirectoryToS3('../set-list-drums/dist', 'set-list-drums/');
    
    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy(); 