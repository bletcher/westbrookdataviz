import { join } from 'path';
import { mkdir, cp, rm, access } from 'fs/promises';

// List of apps to copy
const apps = {
  'set-list-drums': {
    name: 'set-list-drums',
    source: '../set-list-drums/dist',
    target: 'apps/set-list-drums/dist'
  },
  'pit-data': {
    name: 'pit-data',
    source: '../pit_antenna_data_explorer/dist',
    target: 'apps/pit-data/dist'
  }
};

async function copyAppFiles(appName) {
  const app = apps[appName];
  if (!app) {
    throw new Error(`Unknown app: ${appName}`);
  }

  console.log(`\nCopying ${app.name}...`);
  
  try {
    // Verify source directory exists
    const sourcePath = join(process.cwd(), app.source);
    try {
      await access(sourcePath);
      console.log(`✓ Source directory exists: ${sourcePath}`);
    } catch (error) {
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
    
    console.log(`\n✓ ${app.name} copied successfully`);
  } catch (error) {
    console.error(`\nError copying ${app.name}:`, error);
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
  Promise.all(Object.keys(apps).map(copyAppFiles))
    .then(() => console.log('\n✓ All apps copied successfully'))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 