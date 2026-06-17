# WestBrook DataViz

Interactive data visualization portfolio built with Observable Framework.

**Live Site:** [westbrookdataviz.org](https://westbrookdataviz.org)

## Project Structure

```
westbrookdataviz/
├── src/
│   ├── components/
│   │   ├── cases.js          # Case cards and filtering logic
│   │   ├── config.js         # Centralized configuration (URLs, settings)
│   │   ├── header.js         # Header with mobile navigation
│   │   └── footer.js         # Footer component
│   ├── data/
│   │   ├── css/
│   │   │   ├── variables.css       # CSS custom properties
│   │   │   ├── layout.css          # Grid and containers
│   │   │   ├── responsive.css      # Media queries
│   │   │   ├── components/
│   │   │   │   ├── nav.css         # Navigation styles
│   │   │   │   ├── cards.css       # Card styles
│   │   │   │   └── footer.css      # Footer styles
│   │   │   └── pages/
│   │   │       ├── about.css       # About page styles
│   │   │       └── contact.css     # Contact page styles
│   │   ├── custom.css        # Main CSS (imports all modules)
│   │   └── *.png             # Card images
│   ├── index.md              # Home page
│   ├── about.md              # About page
│   └── contact.md            # Contact page
├── dist/                     # Built files (generated)
├── observablehq.config.js    # Observable Framework config
├── invalidate.ps1            # CloudFront cache invalidation
└── package.json              # Project configuration
```

## Development

### Prerequisites

- Node.js 18 or later
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Clear cache
npm run clean
```

## Configuration

All external URLs and site settings are centralized in `src/components/config.js`:

```javascript
import { config } from "./config.js";

// Access URLs
config.externalLinks.streamFlow  // Observable notebook URL
config.externalLinks.pitData     // WestBrook hosted app URL

// Access social links
config.social.github
config.social.linkedin
```

### Adding a New Case

1. Add the image to `src/data/` directory (use .webp format for best performance)

2. Update `src/components/config.js` with the URL:
```javascript
externalLinks: {
  // ... existing links ...
  newProject: "https://example.com/new-project"
}
```

3. Update `src/components/cases.js`:
```javascript
// Add image import
const NEW_IMAGE = FileAttachment("/data/new_image.webp");

// Add to images object
export const images = {
  // ... existing images ...
  newProject: NEW_IMAGE
};

// Add case to array in createCases()
{
  title: "New Project Title",
  category: "dataStory", // or "dataExplorer" or "music"
  image: images.newProject,
  imageStyle: "cover", // or "contain"
  description: "Description of the project.",
  url: externalLinks.newProject
}
```

## Features

- **Responsive Design** - Mobile-first with hamburger menu navigation
- **Category Filtering** - Filter projects by Data Stories, Data Explorers, or Music
- **Analytics** - Google Analytics tracking for all card clicks and filter usage
- **Modular CSS** - Organized stylesheets for easy maintenance

### Categories

- **Data Stories** - Interactive data visualization narratives
- **Data Explorers** - Tools for exploring datasets
- **Music** - Music-related visualizations and tools

## Deployment

The site is deployed to AWS S3 with CloudFront CDN.

### Build & Deploy

Deploy with a single command (requires the AWS CLI configured with credentials
for the `westbrookdataviz.org` bucket and CloudFront distribution):

```bash
npm run deploy
```

This runs `deploy.ps1`, which:

1. Builds the site (`npm run build`).
2. Syncs `dist/` to S3 with `aws s3 sync`:
   - content-hashed assets (`_file`, `_import`, `_node`, `_observablehq`) are
     uploaded with a 1-year immutable cache;
   - HTML and root assets get a short, must-revalidate cache;
   - `--delete` removes files left over from previous builds.
3. Invalidates the CloudFront cache (`npm run invalidate-cache`).

To invalidate the cache on its own, run `npm run invalidate-cache`.

### AWS Infrastructure

- **S3 Bucket:** `westbrookdataviz.org`
- **CloudFront:** CDN for content delivery
- **Route53:** DNS management
- **ACM:** SSL/TLS certificate

### Cache Control

- Static assets (JS, CSS, images): 1 year cache
- HTML files: 5 minutes with stale-while-revalidate
- JSON data: 1 hour with stale-while-revalidate

## Technologies

- [Observable Framework](https://observablehq.com/framework)
- HTML/CSS/JavaScript
- AWS S3 + CloudFront

## License

MIT License
