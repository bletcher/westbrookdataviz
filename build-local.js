import { execSync } from 'child_process';
import { join } from 'path';
import { mkdir, cp, rm, access } from 'fs/promises';

// List of apps to copy
const apps = {
  'set-list-drums': {
    name: 'set-list-drums',
    localSource: '../set-list-drums/dist',
    remoteSource: 'https://github.com/bletcher/set-list-drums.git',
    target: 'apps/set-list-drums/dist',
    needsBuild: true
  },
  'pit-data': {
    name: 'pit-data',
    localSource: '../pit_antenna_data_explorer/dist',
    remoteSource: 'https://github.com/bletcher/pit_antenna_data_explorer.git',
    target: 'apps/pit-data/dist',
    needsBuild: false
  }
};

async function buildApp(app, tempDir) {
  console.log('\nBuilding app...');
  
  // Install dependencies
  console.log('\nInstalling dependencies...');
  execSync('npm install', { cwd: tempDir, stdio: 'inherit' });
  
  // Build the app
  console.log('\nBuilding app...');
  execSync('npm run build', { cwd: tempDir, stdio: 'inherit' });
  
  return join(tempDir, 'dist');
}

async function getDistFromRemote(app, tempDir) {
  console.log('\nGetting dist from remote...');
  
  // Clone the repository
  execSync(`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 ${app.remoteSource} ${tempDir}`, { stdio: 'inherit' });
  
  // If the app needs building, build it
  if (app.needsBuild) {
    return await buildApp(app, tempDir);
  }
  
  // Otherwise, just return the dist directory
  return join(tempDir, 'dist');
}

async function copyAppFiles(appName) {
  const app = apps[appName];
  if (!app) {
    throw new Error(`Unknown app: ${appName}`);
  }

  console.log(`\nProcessing ${app.name}...`);
  
  try {
    let sourcePath;
    
    // First try local source
    try {
      sourcePath = join(process.cwd(), app.localSource);
      await access(sourcePath);
      console.log(`✓ Using local source: ${sourcePath}`);
    } catch (error) {
      console.log('Local source not found, getting from remote...');
      const tempDir = join(process.cwd(), `temp-${app.name}`);
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (e) {}
      sourcePath = await getDistFromRemote(app, tempDir);
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
  // Process all apps if no specific app is specified
  Promise.all(Object.keys(apps).map(copyAppFiles))
    .then(() => console.log('\n✓ All apps processed successfully'))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 