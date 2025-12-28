/**
 * Centralized configuration for WestBrook DataViz
 * Edit URLs and site settings here
 */

export const config = {
  // Site metadata
  site: {
    name: "WestBrook DataViz",
    description: "Interactive data visualization portfolio",
    url: "https://westbrookdataviz.org"
  },

  // External project URLs
  externalLinks: {
    // Observable notebooks
    streamFlow: "https://observablehq.com/@bletcher/measuring-stream-flow2",
    troutGrowth: "https://observablehq.com/@bletcher/predictedtroutgrowth-predictions",
    dayLength: "https://observablehq.com/@bletcher/daylength",
    polyrhythm: "https://observablehq.com/@bletcher/polyrhythm-explorer",

    // USGS EcoSheds apps
    pitStories: "https://www.usgs.gov/apps/ecosheds/pitdata/",
    tse: "https://www.usgs.gov/apps/ecosheds/tse/",

    // WestBrook DataViz hosted apps
    pitData: "https://westbrookdataviz.org/pit-data",
    setListDrums: "https://westbrookdataviz.org/set-list-drums",
    montaguaHalloween: "https://westbrookdataviz.org/montague-halloween"
  },

  // Social links
  social: {
    github: "https://github.com/bletcher",
    linkedin: "https://www.linkedin.com/in/ben-letcher",
    bluesky: "https://bsky.app/profile/bletcher.bsky.social"
  },

  // Analytics
  analytics: {
    googleAnalyticsId: "G-3WCF3TGZ9V"
  },

  // Categories for filtering
  categories: {
    dataStory: "Data story",
    dataExplorer: "Data Explorer",
    music: "Music"
  }
};

/**
 * Helper to get URL by key
 * @param {string} key - The key from externalLinks
 * @returns {string} The URL
 */
export function getExternalUrl(key) {
  return config.externalLinks[key] || '#';
}
