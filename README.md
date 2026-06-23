# WestBrook DataViz

Interactive data visualization portfolio built with Observable Framework.

**Live Site:** [westbrookdataviz.org](https://westbrookdataviz.org)

The landing site is a portfolio that links out to the individual data apps
(Observable notebooks, USGS EcoSheds apps, and other hosted apps). Those apps
are deployed separately into their own subdirectories of the same S3 bucket
(e.g. `/pit-data`, `/events`, `/set-list-drums`).

## Project Structure

```
westbrookdataviz/
├── src/
│   ├── components/
│   │   ├── cases.js          # Case cards, filtering, filter buttons (from config)
│   │   ├── config.js         # Centralized configuration (URLs, social, categories)
│   │   ├── header.js         # Header with mobile navigation + skip link
│   │   └── footer.js         # Footer (social links from config)
│   ├── data/
│   │   ├── css/
│   │   │   ├── variables.css       # CSS custom properties + dark mode
│   │   │   ├── layout.css          # Grid, containers, skip link
│   │   │   ├── responsive.css      # Media queries
│   │   │   ├── components/
│   │   │   │   ├── nav.css         # Navigation styles
│   │   │   │   ├── cards.css       # Card styles
│   │   │   │   └── footer.css      # Footer styles
│   │   │   └── pages/
│   │   │       ├── about.css       # About page styles
│   │   │       └── contact.css     # Contact page styles
│   │   ├── custom.css        # Main CSS (imports all modules)
│   │   └── *.webp / *.jpg    # Card images and assets
│   ├── favicon.svg           # Hand-authored brand favicon (source of truth)
│   ├── index.md              # Home page
│   ├── about.md              # About page
│   ├── contact.md            # Contact page
│   └── 404.md                # Custom 404 page
├── static/                   # Files copied verbatim to the dist/ root (postbuild)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── og-image.png          # Social share card (generated)
│   └── apple-touch-icon.png  # iOS icon (generated)
├── scripts/
│   ├── generate-assets.mjs   # Builds og-image.png + apple-touch-icon.png from favicon.svg
│   └── copy-static.mjs       # Copies static/ → dist/ after build (postbuild)
├── .github/workflows/
│   └── deploy.yml            # CI: build + deploy to S3 + invalidate CloudFront
├── dist/                     # Built files (generated)
├── observablehq.config.js    # Observable Framework config (SEO/OG meta, analytics)
├── deploy.ps1                # Manual build + sync + invalidate
├── invalidate.ps1            # CloudFront cache invalidation
└── package.json              # Project configuration
```

## Development

### Prerequisites

- Node.js 18 or later (CI builds on Node 20)
- npm

### npm scripts

```bash
npm install            # Install dependencies
npm run dev            # Start the dev server (observable preview)
npm run build          # Build to dist/ (runs copy-static afterward)
npm run clean          # Clear the Observable build cache
npm run assets         # Regenerate og-image.png + apple-touch-icon.png (needs sharp)
npm run deploy         # Manual build + sync to S3 + invalidate CloudFront
npm run invalidate-cache  # Invalidate the CloudFront cache only
```

## Configuration

All external URLs and site settings are centralized in `src/components/config.js`:

```javascript
import { config } from "./config.js";

config.site.description          // Used for SEO / Open Graph meta tags
config.externalLinks.streamFlow  // Observable notebook URL
config.externalLinks.pitData     // WestBrook hosted app URL
config.social.github             // Footer social links
config.categories                // Drives the filter buttons (label + order)
config.analytics.googleAnalyticsId  // Single source for the GA tag
```

`observablehq.config.js` imports this config to emit per-page SEO meta,
Open Graph / Twitter cards, favicon links, and the Google Analytics tag.

### Adding a New Case

1. Add the image to `src/data/` (use `.webp` for best performance).

2. Add the URL to `src/components/config.js`:

```javascript
externalLinks: {
  // ... existing links ...
  newProject: "https://example.com/new-project"
}
```

3. Register the image and case in `src/components/cases.js`:

```javascript
// Add image import
const NEW_IMAGE = FileAttachment("/data/new_image.webp");

// Add to images object
export const images = {
  // ... existing images ...
  newProject: NEW_IMAGE
};

// Add case to the array in createCases()
{
  title: "New Project Title",
  category: "dataStory", // or "dataExplorer" or "music"
  image: images.newProject,
  imageStyle: "cover", // or "contain"
  description: "Description of the project.",
  url: externalLinks.newProject
}
```

## Branding assets

The favicon is hand-authored at `src/favicon.svg` (the source of truth).
The social share image (`og-image.png`) and `apple-touch-icon.png` are
generated from it with `sharp`:

```bash
npm run assets
```

This writes both PNGs into `static/`, which is copied to the `dist/` root at
build time. Commit the regenerated files. Re-run only when the branding
changes.

## Features

- **Responsive Design** - Mobile-first with hamburger menu navigation
- **Category Filtering** - Filter projects by Data Stories, Data Explorers, or Music
- **SEO & Social** - Per-page meta description, Open Graph / Twitter cards, favicon, sitemap, robots.txt
- **Accessibility** - Skip-to-content link; project cards are real links (keyboard / middle-click / right-click friendly)
- **Custom 404** - Branded `404.html` served by S3 on unknown URLs
- **Analytics** - Google Analytics tracking for card clicks and filter usage
- **Modular CSS** - Organized stylesheets with dark-mode support

### Categories

- **Data Stories** - Interactive data visualization narratives
- **Data Explorers** - Tools for exploring datasets
- **Music** - Music-related visualizations and tools

## Deployment

The site is deployed to AWS S3 + CloudFront. The S3 bucket also hosts the
individual apps in their own subdirectories, so deploys of the landing site
**must never run a root-level `aws s3 sync --delete`** — it would wipe those
apps. Both deploy paths below scope their `--delete` to the four hashed-asset
prefixes that only the landing site owns (`_file`, `_import`, `_node`,
`_observablehq`) and sync root files without `--delete`.

### Automatic (GitHub Actions)

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
site, syncs it to S3 (app-safe scoping), and invalidates CloudFront. It can
also be run manually from the **Actions** tab (`workflow_dispatch`).

Required repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | IAM user key with bucket-wide write + `cloudfront:CreateInvalidation` |
| `AWS_SECRET_ACCESS_KEY` | matching secret key |
| `AWS_REGION` | `us-east-2` |
| `S3_BUCKET` | `westbrookdataviz.org` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E3EX9JVKMSIGL9` |

### Manual

Requires the AWS CLI configured locally with credentials for the bucket and
distribution:

```bash
npm run deploy
```

`deploy.ps1` builds the site, syncs to S3 (same app-safe scoping), and
invalidates CloudFront. Run `npm run invalidate-cache` to invalidate only.

### AWS Infrastructure

- **S3 Bucket:** `westbrookdataviz.org` (static website hosting; error document `404.html`)
- **CloudFront:** distribution `E3EX9JVKMSIGL9` (CDN, region `us-east-2`)
- **Route53:** DNS management
- **ACM:** SSL/TLS certificate

### Cache Control

- Content-hashed assets (`_file`, `_import`, `_node`, `_observablehq`): 1 year, immutable
- HTML and root assets (images, robots.txt, sitemap.xml): `max-age=300`, must-revalidate

## Technologies

- [Observable Framework](https://observablehq.com/framework) (pinned to 1.13.3)
- HTML/CSS/JavaScript
- AWS S3 + CloudFront, deployed via GitHub Actions

## License

MIT License
