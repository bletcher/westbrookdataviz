import { html } from "htl";

/*export const images = {
  pit:  "/data/PIT_card_image.png",
  temp: "/data/temperature_viewer_image.png",
  pit2: "/data/PIT_card_image.png",
  temp2: "/data/temperature_viewer_image.png"
};*/



/*
export const imagesArray = [
  FileAttachment("/data/PIT_card_image.png"),
  FileAttachment("/data/temperature_viewer_image.png")
];*/

export async function createCases(images) {
  return [
    { 
      title: "PIT Data Explorer",
      category: "dataExplorer",
      image: images.pit,
      description: "An interactive application to explore tag data from a long-term study in western MA.",
      //url: "https://pit-antenna-data-viewer.s3.us-east-2.amazonaws.com/index.html"
      url: "https://westbrookdataviz.org/apps/pit-data"
    },
    {
      title: "Measuring stream flow",
      category: "dataStory",
      image: images.streamFlow,
      description: "An interactive observable notebook to explore how stream flow is measured.",
      url: "https://observablehq.com/@bletcher/measuring-stream-flow2"
    },
    {
      title: "Day length",
      category: "dataStory",
      image: images.dayLength,
      description: "An interactive observable notebook to explore how day length varies with latitude and day of year.",
      url: "https://observablehq.com/@bletcher/daylength"
    },
    {
      title: "Trout Growth Explorer",
      category: "dataExplorer",
      image: images.troutGrowth,
      description: "An interactive observable notebook to explore how trout growth varies with temperature and stream flow.",
      url: "https://observablehq.com/@bletcher/predictedtroutgrowth-predictions"
    },
    {
      title: "Polyrhythms",
      category: "music",
      image: images.polyrhythm,
      description: "An interactive observable notebook to explore how polyrhythms sound and look.",
      url: "https://observablehq.com/@bletcher/polyrhythm-explorer"
    },
    {
      title: "Song library and set list creator",
      category: "music",
      image: images.drums,
      description: "A tool to create song libraries and set lists, especially for drum set players.",
      url: "https://westbrookdataviz.org/apps/set-list-drums"
    }
  ]
};

export async function createCaseCards(cases) {
  // Load all images first
  const imageCache = new Map();
  
  for (const attachment of new Set(cases.map(c => c.image))) {
    const imageUrl = await attachment.url();
    //const imageUrl = await FileAttachment(path).url();
    imageCache.set(attachment, imageUrl);
  }
  
  // Create cards using cached image URLs
  return cases.map((caseItem) => html`
    <article class="case-card" data-category="${caseItem.category}" 
      onclick="window.open('${caseItem.url}', '_blank');" style="cursor: pointer;">
      <div class="case-card-inner">
        <img class="case-image" src="${imageCache.get(caseItem.image)}" alt="${caseItem.title}">
        <div class="case-content">
          <h3 class="case-title">${caseItem.title}</h3>
          <p>${caseItem.description}</p>
        </div>
      </div>
    </article>`
  );
}