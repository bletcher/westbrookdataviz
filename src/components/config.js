/**
 * Centralized configuration for WestBrook DataViz
 * Edit URLs and site settings here
 */

export const config = {
  // Site metadata
  site: {
    name: "WestBrook DataViz",
    description: "Interactive data visualizations and exploratory tools for environmental and ecological science — making complex data make sense. By ecologist Ben Letcher.",
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
    montaguaHalloween: "https://westbrookdataviz.org/montague-halloween",
    events: "https://westbrookdataviz.org/events",
    waterPhysics: "https://westbrookdataviz.org/water-physics/"
  },

  // Social links
  social: {
    github: "https://github.com/bletcher",
    linkedin: "https://www.linkedin.com/in/ben-letcher-732087179/",
    bluesky: "https://bsky.app/profile/bletcher.bsky.social"
  },

  // Analytics
  analytics: {
    googleAnalyticsId: "G-3WCF3TGZ9V"
  },

  // Categories for filtering. Order here drives the filter button order.
  categories: {
    dataExplorer: "Data Explorer",
    dataStory: "Data story",
    music: "Music"
  }
};
