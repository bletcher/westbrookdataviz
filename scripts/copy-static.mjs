// Copies everything in static/ into dist/ root after the Observable build.
// Wired to npm's postbuild lifecycle, so `npm run build` ships these files.
// Used for assets that must live at a stable, predictable URL (robots.txt,
// sitemap.xml, og-image.png, apple-touch-icon.png) — Observable Framework
// otherwise content-hashes referenced files into dist/_file/.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "static");
const dist = join(root, "dist");

if (!existsSync(src)) {
  console.warn("copy-static: no static/ directory, nothing to copy");
  process.exit(0);
}
mkdirSync(dist, { recursive: true });
cpSync(src, dist, { recursive: true });
console.log("copy-static: copied static/ → dist/");
