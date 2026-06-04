// See https://observablehq.com/framework/config for documentation.
import { config } from "./src/components/config.js";

const { site, analytics } = config;
const GA_ID = analytics.googleAnalyticsId;
const OG_IMAGE = `${site.url}/og-image.png`; // shipped to dist/ by scripts/copy-static.mjs

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: site.name,

  // Per-page <head>: SEO meta, Open Graph / Twitter cards, favicons, analytics.
  // `head` is called with the page's { title, path }, so canonical URLs and
  // social titles are page-specific.
  head: ({ title, path }) => {
    const canonical = path === "/index" ? `${site.url}/` : `${site.url}${path}.html`;
    const pageTitle = title && title !== site.name ? `${title} | ${site.name}` : site.name;
    const desc = site.description;
    return [
      `<meta name="description" content="${escapeAttr(desc)}">`,
      `<link rel="canonical" href="${canonical}">`,
      // Favicon (copied + hashed by Framework); apple-touch-icon via static/.
      `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
      `<link rel="apple-touch-icon" href="${site.url}/apple-touch-icon.png">`,
      `<meta name="theme-color" content="#3a6a91">`,
      // Open Graph
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${escapeAttr(site.name)}">`,
      `<meta property="og:title" content="${escapeAttr(pageTitle)}">`,
      `<meta property="og:description" content="${escapeAttr(desc)}">`,
      `<meta property="og:url" content="${canonical}">`,
      `<meta property="og:image" content="${OG_IMAGE}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      // Twitter / X
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeAttr(pageTitle)}">`,
      `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
      `<meta name="twitter:image" content="${OG_IMAGE}">`,
      // Google Analytics
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>`,
      `<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('set', { 'app_name': 'westbrookdataviz' });
      gtag('config', '${GA_ID}');
    </script>`
    ].join("\n");
  },

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
   sidebar: false,
   footer: false, // what to show in the footer (HTML)
   toc: false, // whether to show the table of contents
   pager: false, // whether to show previous & next links in the footer
   root: "src", // path to the source root for preview
   output: "dist", // path to the output root for build
   search: true, // activate search
   preserveExtension: true, // keep .html in URLs
};
