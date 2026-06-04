// Generates raster brand assets from the hand-authored src/favicon.svg:
//   - static/apple-touch-icon.png (180x180)
//   - static/og-image.png (1200x630) social share card
// Files in static/ are copied to dist/ by scripts/copy-static.mjs (postbuild).
// Run manually after changing branding: npm run assets
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const out = join(root, "static");
mkdirSync(out, { recursive: true });

// Apple touch icon — rasterize the favicon tile.
await sharp(join(src, "favicon.svg"))
  .resize(180, 180)
  .png()
  .toFile(join(out, "apple-touch-icon.png"));

// Social share card (1200x630). Arial is used because it is reliably
// available on the build host; the layout mirrors the site hero.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fffef9"/>
  <circle cx="1040" cy="150" r="220" fill="#fefae0" opacity="0.55"/>
  <circle cx="180" cy="520" r="150" fill="#ccd5ae" opacity="0.35"/>
  <g transform="translate(90,150)">
    <rect width="84" height="84" rx="20" fill="#3a6a91"/>
    <path d="M18 26 L28 60 L37 34 L46 60 L56 26" fill="none" stroke="#fffef9" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="65" cy="29" r="7" fill="#ffe135"/>
  </g>
  <text x="190" y="212" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#3a6a91" letter-spacing="1">WESTBROOK DATAVIZ</text>
  <rect x="392" y="306" width="212" height="30" rx="6" fill="#ffe135" opacity="0.7"/>
  <text x="88" y="340" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#1a1a1a">Making Data</text>
  <text x="88" y="450" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#1a1a1a">Make Sense</text>
  <text x="90" y="560" font-family="Arial, sans-serif" font-size="34" font-weight="500" fill="#666">Interactive data visualization &amp; exploratory tools</text>
  <text x="90" y="600" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="#3a6a91">westbrookdataviz.org</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(join(out, "og-image.png"));

console.log("Generated static/apple-touch-icon.png and static/og-image.png");
