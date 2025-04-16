import { mkdir, cp } from 'fs/promises';
import { join } from 'path';

async function copyFiles() {
  try {
    // Create dist directory
    await mkdir('dist', { recursive: true });
    
    // Copy main site
    console.log('Copying main site...');
    await cp(join(process.cwd(), '../myApps/westbrookdataviz/dist'), 'dist', { recursive: true });
    
    // Copy pit-data app
    console.log('Copying pit-data app...');
    await mkdir('dist/pit-data', { recursive: true });
    await cp(join(process.cwd(), '../myApps/pit_antenna_data_explorer/dist'), 'dist/pit-data', { recursive: true });
    
    // Copy set-list-drums app
    console.log('Copying set-list-drums app...');
    await mkdir('dist/set-list-drums', { recursive: true });
    await cp(join(process.cwd(), '../myApps/set-list-drums/dist'), 'dist/set-list-drums', { recursive: true });
    
    console.log('All files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyFiles(); 