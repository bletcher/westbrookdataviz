/**
 * copy-apps.js
 * 
 * This script copies built files from local dist directories to the final dist directory
 * for Amplify deployment. It checks for the existence of files before copying and
 * provides detailed error messages if files are missing.
 * 
 * Expected directory structure:
 * - dist/                    (main site dist)
 * - pit-data/               (pit-data app files)
 * - set-list-drums/         (set-list-drums app files)
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
    const pitData = join(process.cwd(), 'pit-data');
    const setListDrums = join(process.cwd(), 'set-list-drums');
    
    try {
      await access(mainDist);
      console.log('Main site dist found');
    } catch (e) {
      console.error('Main site dist not found:', mainDist);
      throw e;
    }
    
    try {
      await access(pitData);
      console.log('PIT data files found');
    } catch (e) {
      console.error('PIT data files not found:', pitData);
      throw e;
    }
    
    try {
      await access(setListDrums);
      console.log('Set list drums files found');
    } catch (e) {
      console.error('Set list drums files not found:', setListDrums);
      throw e;
    }
    
    // Copy main site
    console.log('Copying main site...');
    await cp(mainDist, 'dist', { recursive: true });
    
    // Copy pit-data app
    console.log('Copying pit-data app...');
    await mkdir('dist/pit-data', { recursive: true });
    await cp(pitData, 'dist/pit-data', { recursive: true });
    
    // Copy set-list-drums app
    console.log('Copying set-list-drums app...');
    await mkdir('dist/set-list-drums', { recursive: true });
    await cp(setListDrums, 'dist/set-list-drums', { recursive: true });
    
    console.log('All files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyFiles(); 