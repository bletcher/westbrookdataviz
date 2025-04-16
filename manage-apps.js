import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir, cp, access, rm } from 'fs/promises';
import fs from 'fs';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log('Current directory:', __dirname);
console.log('Working directory:', process.cwd());

// List of apps to manage
const apps = {
  'set-list-drums': {
    name: 'set-list-drums',
    source: '../set-list-drums/dist',  // Path to local built files
    target: 'dist/apps/set-list-drums'  // Path for deployment under westbrookdataviz.org/apps/set-list-drums
  },
  'pit-data': {
    name: 'pit-data',
    source: '../pit_antenna_data_explorer/dist',  // Path to local built files
    target: 'dist/apps/pit-data'  // Path for deployment under westbrookdataviz.org/apps/pit-data
  }
};

async function verifyPath(path, description) {
  try {
    await access(path);
    console.log(`✓ ${description} exists: ${path}`);
    return true;
  } catch (error) {
    console.error(`✗ ${description} does not exist: ${path}`);
    return false;
  }
}

async function copyAppFiles(appName) {
  const app = apps[appName];
  if (!app) {
    throw new Error(`Unknown app: ${appName}`);
  }

  console.log(`\nProcessing ${app.name}...`);
  
  try {
    // Verify source directory exists
    const sourcePath = join(process.cwd(), app.source);
    if (!await verifyPath(sourcePath, 'Source directory')) {
      throw new Error(`Source directory not found: ${sourcePath}`);
    }
    
    // Create target directory
    const targetPath = join(process.cwd(), app.target);
    await mkdir(targetPath, { recursive: true });
    
    // Copy files
    console.log('\nCopying files...');
    await cp(sourcePath, targetPath, { 
      recursive: true,
      filter: (src) => !src.includes('.git')
    });
    console.log(`✓ Files copied to ${targetPath}`);
    
    console.log(`\n✓ ${app.name} processed successfully`);
  } catch (error) {
    console.error(`\nError processing ${app.name}:`, error);
    throw error;
  }
}

// Get the app name from command line arguments
const appName = process.argv[2];
if (appName) {
  copyAppFiles(appName).catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
  });
} else {
  // Copy all apps if no specific app is specified
  Promise.all(Object.keys(apps).map(appName => copyAppFiles(appName)))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 