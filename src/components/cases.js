import { html } from "htl";
import { FileAttachment } from "npm:@observablehq/stdlib";

const PIT_IMAGE = FileAttachment("/data/PIT_card_image.png");
const TEMP_IMAGE = FileAttachment("/data/temperature_viewer_image.png");
const PIT_IMAGE2 = FileAttachment("/data/PIT_card_image2.png");
const STREAMFLOW_IMAGE = FileAttachment("/data/streamFlow_image.png");
const DAYLENGTH_IMAGE = FileAttachment("/data/dayLength_image.png");
const POLYRHYTHM_IMAGE = FileAttachment("/data/polyrhythm_image.png");
const TROUTGROWTH_IMAGE = FileAttachment("/data/troutGrowth_image.png");
const DRUMS_IMAGE = FileAttachment("/data/drums_image.png");
const PITSTORIES_IMAGE = FileAttachment("/data/pitStories2_image.png");
const TSE_IMAGE = FileAttachment("/data/tse_image.png");

export const images = {
  pit: PIT_IMAGE,
  temp: TEMP_IMAGE,
  pit2: PIT_IMAGE2,
  streamFlow: STREAMFLOW_IMAGE,
  dayLength: DAYLENGTH_IMAGE,
  polyrhythm: POLYRHYTHM_IMAGE,
  troutGrowth: TROUTGROWTH_IMAGE,
  drums: DRUMS_IMAGE,
  pitStories: PITSTORIES_IMAGE,
  tse: TSE_IMAGE
};

/*export const imagesArray = [
  FileAttachment("/data/PIT_card_image.png"),
  FileAttachment("/data/temperature_viewer_image.png")
];*/

export async function createCases(images) {
  return [
    {
      title: "Measuring stream flow",
      category: "dataStory",
      image: images.streamFlow,
      description: "An interactive observable notebook to explore how stream flow is measured.",
      url: "https://observablehq.com/@bletcher/measuring-stream-flow2"
    },
    {
      title: "Trout Growth Explorer",
      category: "dataExplorer",
      image: images.troutGrowth,
      description: "An interactive observable notebook to explore how trout growth varies with temperature and stream flow.",
      url: "https://observablehq.com/@bletcher/predictedtroutgrowth-predictions"
    },
    {
      title: "Fish tagging data stories",
      category: "dataStory",
      image: images.pitStories,
      description: "Three data stories about fish tagging data from two study areas.",
      url: "https://www.usgs.gov/apps/ecosheds/pitdata/"
    },
    {
      title: "Time series data explorer",
      category: "dataExplorer",
      image: images.tse,
      description: "Three data stories about fish tagging data from two study areas.",
      url: "https://www.usgs.gov/apps/ecosheds/tse/"
    },
    {
      title: "Day length",
      category: "dataStory",
      image: images.dayLength,
      description: "An interactive observable notebook to explore how day length varies with latitude and day of year.",
      url: "https://observablehq.com/@bletcher/daylength"
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
      url: "https://westbrookdataviz.org/set-list-drums"
    },
    { 
      title: "PIT Data Explorer - DEV VERSION",
      category: "dataExplorer",
      image: images.pit,
      description: "An interactive application to explore tag data from a long-term study in western MA.",
      //url: "https://pit-antenna-data-viewer.s3.us-east-2.amazonaws.com/index.html"
      url: "https://westbrookdataviz.org/pit-data"
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

export function createFilterButtons() {
  return html`<div class="filter-buttons">
    <button class="filter-button active" data-filter="all">All</button>
    <button class="filter-button" data-filter="dataExplorer">Data Explorer</button>
    <button class="filter-button" data-filter="dataStory">Data story</button>
    <button class="filter-button" data-filter="music">Music</button>
  </div>`;
}

export function createFilteredCases(cases) {
  return {
    filter: "all",
    update(newFilter) {
      this.filter = newFilter;
      return cases.filter(item => this.filter === "all" || item.category === this.filter);
    }
  };
}

export function setupFilterButtons(filterButtons, filteredCases, createCaseCards) {
  filterButtons.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      // Update active state
      filterButtons.querySelectorAll('.filter-button').forEach(btn => 
        btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      const grid = document.querySelector('.cases-grid');
      
      // Fade out current cards
      const currentCards = grid.querySelectorAll('.case-card');
      currentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s ease';
      });

      // Update filtered cases and create new cards
      setTimeout(async () => {
        const filteredItems = filteredCases.update(filter);
        
        // Create new cards for filtered cases
        const newCards = await createCaseCards(filteredItems);
        
        // Clear and update grid
        grid.innerHTML = '';
        newCards.forEach(card => {
          card.style.opacity = '0';
          card.style.transition = 'opacity 0.3s ease';
          grid.appendChild(card);
          
          // Force reflow and fade in
          void card.offsetHeight;
          card.style.opacity = '1';
        });
      }, 300);
    });
  });
}