import { html } from "htl";
import { FileAttachment } from "npm:@observablehq/stdlib";
import { config } from "./config.js";

const PIT_IMAGE = FileAttachment("/data/PIT_card_image.webp");
const STREAMFLOW_IMAGE = FileAttachment("/data/streamFlow_image.webp");
const DAYLENGTH_IMAGE = FileAttachment("/data/dayLength_image.webp");
const POLYRHYTHM_IMAGE = FileAttachment("/data/polyrhythm_image.webp");
const TROUTGROWTH_IMAGE = FileAttachment("/data/troutGrowth2_image.webp");
const DRUMS_IMAGE = FileAttachment("/data/drums_image.webp");
const PITSTORIES_IMAGE = FileAttachment("/data/pitStories2_image.webp");
const TSE_IMAGE = FileAttachment("/data/tse_image.webp");
const HALLOWEEN_IMAGE = FileAttachment("/data/montague-halloween.webp");

export const images = {
  pit: PIT_IMAGE,
  streamFlow: STREAMFLOW_IMAGE,
  dayLength: DAYLENGTH_IMAGE,
  polyrhythm: POLYRHYTHM_IMAGE,
  troutGrowth: TROUTGROWTH_IMAGE,
  drums: DRUMS_IMAGE,
  pitStories: PITSTORIES_IMAGE,
  tse: TSE_IMAGE,
  halloween: HALLOWEEN_IMAGE
};

export async function createCases(images) {
  const { externalLinks } = config;

  return [
    {
      title: "Measuring stream flow",
      category: "dataStory",
      image: images.streamFlow,
      imageStyle: "cover",
      description: "An interactive observable notebook to explore how stream flow is measured.",
      url: externalLinks.streamFlow
    },
    {
      title: "Trout Growth Explorer",
      category: "dataExplorer",
      image: images.troutGrowth,
      imageStyle: "cover",
      description: "An interactive observable notebook to explore how trout growth varies with temperature and stream flow.",
      url: externalLinks.troutGrowth
    },
    {
      title: "Fish tagging data stories",
      category: "dataStory",
      image: images.pitStories,
      imageStyle: "cover",
      description: "Data stories and explorers for fish tagging data from two study areas.",
      url: externalLinks.pitStories
    },
    {
      title: "Time series explorer",
      category: "dataExplorer",
      image: images.tse,
      imageStyle: "contain",
      description: "An interactive application to explore time series data with flexible start and end times for data chunks.",
      url: externalLinks.tse
    },
    {
      title: "Day length",
      category: "dataExplorer",
      image: images.dayLength,
      imageStyle: "contain",
      description: "An interactive observable notebook to explore how day length varies with latitude and day of year.",
      url: externalLinks.dayLength
    },
    {
      title: "Polyrhythms",
      category: "music",
      image: images.polyrhythm,
      imageStyle: "cover",
      description: "An interactive observable notebook to explore how polyrhythms sound and look.",
      url: externalLinks.polyrhythm
    },
    {
      title: "Song library and set list creator",
      category: "music",
      image: images.drums,
      imageStyle: "contain",
      description: "A tool to create song libraries and set lists, especially for drum set players.",
      url: externalLinks.setListDrums
    },
    {
      title: "PIT Data Explorer - DEV VERSION",
      category: "dataExplorer",
      image: images.pit,
      imageStyle: "contain",
      description: "An interactive application to explore tag data from a long-term study in western MA.",
      url: externalLinks.pitData
    },
    {
      title: "Halloween in Montague, MA",
      category: "dataStory",
      image: images.halloween,
      imageStyle: "contain",
      description: "Explore trends in Halloween activity in Montague, MA.",
      url: externalLinks.montaguaHalloween
    }
  ]
};

export async function createCaseCards(cases) {
  // Load all images first
  const imageCache = new Map();

  for (const attachment of new Set(cases.map(c => c.image))) {
    const imageUrl = await attachment.url();
    imageCache.set(attachment, imageUrl);
  }

  // Create cards using cached image URLs
  // First 3 cards load eagerly (above fold), rest are lazy loaded
  return cases.map((caseItem, index) => {
    const loadingStrategy = index < 3 ? 'eager' : 'lazy';
    const imageUrl = imageCache.get(caseItem.image);
    const url = caseItem.url;
    const title = caseItem.title;
    const category = caseItem.category;

    const card = html`<article class="case-card"
        data-category="${category}"
        data-url="${url}"
        data-title="${title}"
        tabindex="0"
        role="link"
        aria-label="${title}: ${caseItem.description}"
        style="cursor: pointer;">
        <div class="case-card-inner">
          <div class="case-image-wrapper">
            <img class="case-image"
              src="${imageUrl}"
              alt="${title}"
              loading="${loadingStrategy}"
              decoding="async"
              style="object-fit: ${caseItem.imageStyle || 'contain'};">
            <div class="case-image-placeholder" aria-hidden="true">
              <span>📊</span>
            </div>
          </div>
          <div class="case-content">
            <h3 class="case-title">${title}</h3>
            <p>${caseItem.description}</p>
          </div>
        </div>
      </article>`;

    // Handle image loading states
    const img = card.querySelector('.case-image');
    const wrapper = card.querySelector('.case-image-wrapper');
    const placeholder = card.querySelector('.case-image-placeholder');

    if (img) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
        if (wrapper) wrapper.classList.add('loaded');
      });

      img.addEventListener('load', () => {
        if (placeholder) placeholder.style.display = 'none';
        if (wrapper) wrapper.classList.add('loaded');
      });
    }

    // Click handler - open URL in new tab
    card.addEventListener('click', (e) => {
      e.preventDefault();

      // Track click
      if (typeof gtag !== 'undefined') {
        gtag('event', 'card_click', {
          'event_category': 'outbound_link',
          'event_label': title,
          'card_title': title,
          'card_url': url,
          'card_category': category,
          'link_domain': new URL(url).hostname
        });
      }

      window.open(url, '_blank');
    });

    // Keyboard handler (Enter and Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(url, '_blank');
      }
    });

    return card;
  });
}

export function createFilterButtons() {
  return html`<div class="filter-buttons" role="group" aria-label="Filter projects by category">
    <button class="filter-button active" data-filter="all" aria-pressed="true" aria-label="Show all projects">All</button>
    <button class="filter-button" data-filter="dataExplorer" aria-pressed="false" aria-label="Show data explorer projects">Data Explorer</button>
    <button class="filter-button" data-filter="dataStory" aria-pressed="false" aria-label="Show data story projects">Data story</button>
    <button class="filter-button" data-filter="music" aria-pressed="false" aria-label="Show music projects">Music</button>
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
      // Update active state and aria-pressed
      filterButtons.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const filter = button.dataset.filter;

      // Track filter usage
      if (typeof gtag !== 'undefined') {
        gtag('event', 'filter_click', {
          'event_category': 'engagement',
          'event_label': filter,
          'filter_category': filter
        });
      }
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