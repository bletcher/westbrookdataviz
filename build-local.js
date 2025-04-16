import { execSync } from 'child_process';
import { join } from 'path';
import { mkdir, cp, rm, writeFile, access } from 'fs/promises';

// List of apps to build
const apps = {
  'set-list-drums': {
    name: 'set-list-drums',
    source: 'https://github.com/bletcher/set-list-drums.git',
    target: 'apps/set-list-drums/dist'
  },
  'pit-data': {
    name: 'pit-data',
    source: 'https://github.com/bletcher/pit_antenna_data_explorer.git',
    target: 'apps/pit-data/dist',
    dataFiles: ['src/data/cdWB_all.RData']
  }
};

async function createPackageJson(appName, tempDir) {
  const packageJson = {
    "name": appName,
    "version": "1.0.0",
    "type": "module",
    "private": true,
    "scripts": {
      "clean": "rimraf docs/.observablehq/cache",
      "build": "rimraf dist && observable build",
      "dev": "observable preview",
      "deploy": "observable deploy",
      "observable": "observable"
    },
    "dependencies": {
      "@observablehq/framework": "latest",
      "d3-dsv": "^3.0.1",
      "d3-time-format": "^4.1.0"
    },
    "devDependencies": {
      "rimraf": "^5.0.5"
    },
    "engines": {
      "node": ">=18"
    }
  };

  await writeFile(
    join(tempDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('✓ Created package.json');
}

async function verifyDataFiles(app, tempDir) {
  if (!app.dataFiles) return true;
  
  for (const file of app.dataFiles) {
    const filePath = join(tempDir, file);
    try {
      await access(filePath);
      console.log(`✓ Data file exists: ${file}`);
    } catch (error) {
      console.error(`✗ Data file missing: ${file}`);
      return false;
    }
  }
  return true;
}

async function buildApp(appName) {
  const app = apps[appName];
  if (!app) {
    throw new Error(`Unknown app: ${appName}`);
  }

  console.log(`\nBuilding ${app.name}...`);
  
  try {
    // Create a temporary directory
    const tempDir = join(process.cwd(), `temp-${app.name}`);
    console.log(`Temporary directory: ${tempDir}`);
    
    // Clean up any existing temporary directory
    try {
      await rm(tempDir, { recursive: true, force: true });
      console.log('✓ Cleaned up existing temporary directory');
    } catch (error) {
      console.log('No existing temporary directory to clean up');
    }
    
    // Clone the repository with Git LFS
    console.log('\nCloning repository...');
    execSync(`git lfs clone ${app.source} ${tempDir}`, { stdio: 'inherit' });
    
    // Initialize Git LFS and fetch content
    console.log('\nInitializing Git LFS...');
    execSync('git lfs install', { cwd: tempDir, stdio: 'inherit' });
    execSync('git lfs fetch', { cwd: tempDir, stdio: 'inherit' });
    execSync('git lfs checkout', { cwd: tempDir, stdio: 'inherit' });
    
    // Verify data files are present
    if (!await verifyDataFiles(app, tempDir)) {
      throw new Error('Required data files are missing');
    }
    
    // Create a valid package.json
    await createPackageJson(app.name, tempDir);
    
    // Install dependencies
    console.log('\nInstalling dependencies...');
    execSync('npm install', { cwd: tempDir, stdio: 'inherit' });
    
    // Build the app
    console.log('\nBuilding app...');
    execSync('npm run build', { cwd: tempDir, stdio: 'inherit' });
    
    // Create target directory
    const targetPath = join(process.cwd(), app.target);
    await mkdir(targetPath, { recursive: true });
    
    // Copy built files
    console.log('\nCopying built files...');
    const builtDir = join(tempDir, 'dist');
    await cp(builtDir, targetPath, { 
      recursive: true,
      filter: (src) => !src.includes('.git')
    });
    console.log(`✓ Files copied to ${targetPath}`);
    
    // Clean up temporary directory
    await rm(tempDir, { recursive: true, force: true });
    console.log('✓ Cleaned up temporary directory');
    
    console.log(`\n✓ ${app.name} built successfully`);
  } catch (error) {
    console.error(`\nError building ${app.name}:`, error);
    throw error;
  }
}

// Get the app name from command line arguments
const appName = process.argv[2];
if (appName) {
  buildApp(appName).catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
  });
} else {
  // Build all apps if no specific app is specified
  Promise.all(Object.keys(apps).map(buildApp))
    .then(() => console.log('\n✓ All apps built successfully'))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 