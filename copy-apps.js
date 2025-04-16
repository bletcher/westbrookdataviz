/**
 * copy-apps.js
 * 
 * This script copies built files from local dist directories to the final dist directory
 * for Amplify deployment. It checks for the existence of files before copying and
 * provides detailed error messages if files are missing.
 * 
 * Expected directory structure:
 * - Local: Files are in Documents/myApps/westbrookdataviz/dist and subdirectories
 * - Amplify: Files are in /codebuild/output/src/src/westbrookdataviz/dist and subdirectories
 */

import { mkdir, cp, access } from 'fs/promises';
import { join } from 'path';

async function checkDirectory(path, name) {
  try {
    await access(path);
    console.log(`${name} directory found:`, path);
    return true;
  } catch (e) {
    console.error(`${name} directory not found:`, path);
    console.error('This might mean:');
    console.error('1. The directory does not exist');
    console.error('2. The path is incorrect');
    console.error('3. The build process did not complete successfully');
    return false;
  }
}

async function copyFiles() {
  try {
    // Create dist directory
    await mkdir('dist', { recursive: true });
    
    // Check if files exist
    console.log('Checking for files...');
    
    // Get the base path based on environment
    let mainBasePath, pitDataBasePath, setListDrumsBasePath;
    if (process.env.CODEBUILD_SRC_DIR) {
      // In Amplify, look for directories in the parent directory of src
      const srcDir = process.env.CODEBUILD_SRC_DIR;
      const parentDir = join(srcDir, '..');
      mainBasePath = join(srcDir, 'westbrookdataviz');
      pitDataBasePath = join(parentDir, 'pit_antenna_data_explorer');
      setListDrumsBasePath = join(parentDir, 'set-list-drums');
      console.log('Using Amplify build directories:');
      console.log('- Main site:', mainBasePath);
      console.log('- PIT data:', pitDataBasePath);
      console.log('- Set list drums:', setListDrumsBasePath);
    } else {
      // In local development, use the current directory
      const cwd = process.cwd();
      mainBasePath = cwd;
      pitDataBasePath = join(cwd, '..', 'pit_antenna_data_explorer');
      setListDrumsBasePath = join(cwd, '..', 'set-list-drums');
      console.log('Using local directories:');
      console.log('- Main site:', mainBasePath);
      console.log('- PIT data:', pitDataBasePath);
      console.log('- Set list drums:', setListDrumsBasePath);
    }
    
    // First check if the directories exist
    const pitDataExists = await checkDirectory(pitDataBasePath, 'PIT data directory');
    const setListDrumsExists = await checkDirectory(setListDrumsBasePath, 'Set list drums directory');
    
    if (!pitDataExists || !setListDrumsExists) {
      throw new Error('Required directories not found. Please ensure all directories exist and contain built files.');
    }
    
    const mainDist = join(mainBasePath, 'dist');
    const pitDataDist = join(pitDataBasePath, 'dist');
    const setListDrumsDist = join(setListDrumsBasePath, 'dist');
    
    console.log('Looking for PIT data dist at:', pitDataDist);
    
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
      console.error('This might mean:');
      console.error('1. The build process for pit-data did not complete');
      console.error('2. The dist directory was not created');
      throw e;
    }
    
    try {
      await access(setListDrumsDist);
      console.log('Set list drums dist found');
    } catch (e) {
      console.error('Set list drums dist not found:', setListDrumsDist);
      console.error('This might mean:');
      console.error('1. The build process for set-list-drums did not complete');
      console.error('2. The dist directory was not created');
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