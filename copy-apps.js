/**
 * copy-apps.js
 * 
 * This script copies built files from local dist directories to the final dist directory
 * for Amplify deployment. It checks for the existence of files before copying and
 * provides detailed error messages if files are missing.
 * 
 * Directory structure expected:
 * - dist/                    (main site dist)
 * - apps/
 *   ├── pit-data/
 *   │   └── dist/           (pit-data app dist)
 *   └── set-list-drums/
 *       └── dist/           (set-list-drums app dist)
 */

import { mkdir, cp, access } from 'fs/promises';
import { join } from 'path';

async function copyFiles() {
  try {
    // Create dist directory
    await mkdir('dist', { recursive: true });
    
    // Check if files exist
    console.log('Checking for files...');
    const mainDist = join(process.cwd(), 'dist');
    const pitDataDist = join(process.cwd(), 'apps/pit-data/dist');
    const setListDrumsDist = join(process.cwd(), 'apps/set-list-drums/dist');
    
    try {
      await access(mainDist);
      console.log('Main site dist found');
    } catch (e) {
      console.error('Main site dist not found:', mainDist);
      throw e;
    }
    
    try {
      await access(pitDataDist);
      console.log('PIT data dist found');
    } catch (e) {
      console.error('PIT data dist not found:', pitDataDist);
      throw e;
    }
    
    try {
      await access(setListDrumsDist);
      console.log('Set list drums dist found');
    } catch (e) {
      console.error('Set list drums dist not found:', setListDrumsDist);
      throw e;
    }
    
    // Copy main site
    console.log('Copying main site...');
    await cp(mainDist, 'dist', { recursive: true });
    
    // Copy pit-data app
    console.log('Copying pit-data app...');
    await mkdir('dist/pit-data', { recursive: true });
    await cp(pitDataDist, 'dist/pit-data', { recursive: true });
    
    // Copy set-list-drums app
    console.log('Copying set-list-drums app...');
    await mkdir('dist/set-list-drums', { recursive: true });
    await cp(setListDrumsDist, 'dist/set-list-drums', { recursive: true });
    
    console.log('All files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyFiles(); 