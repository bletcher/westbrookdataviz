/**
 * Convert PNG images to WebP format
 * Run with: node scripts/convert-to-webp.js
 */

import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, parse } from 'path';

const DATA_DIR = './src/data';

async function convertToWebP() {
  const files = await readdir(DATA_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  console.log(`Found ${pngFiles.length} PNG files to convert\n`);

  for (const file of pngFiles) {
    const inputPath = join(DATA_DIR, file);
    const { name } = parse(file);
    const outputPath = join(DATA_DIR, `${name}.webp`);

    try {
      const info = await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      // Get original size
      const originalStats = await sharp(inputPath).metadata();
      const savings = ((1 - info.size / (originalStats.size || info.size)) * 100).toFixed(1);

      console.log(`✓ ${file} → ${name}.webp (${savings}% smaller)`);
    } catch (err) {
      console.error(`✗ Failed to convert ${file}:`, err.message);
    }
  }

  console.log('\nDone! Update cases.js to use .webp files.');
}

convertToWebP();
