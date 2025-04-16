---
toc: false
style: data/custom.css
---

```js
import { createCaseCards, createCases } from "./components/cases.js";
import { html } from "htl";
import { createHeader } from "./components/header.js";
```

```js
// First, declare all file attachments explicitly
const PIT_IMAGE = FileAttachment("data/PIT_card_image.png");
const TEMP_IMAGE = FileAttachment("data/temperature_viewer_image.png");
const PIT_IMAGE2 = FileAttachment("data/PIT_card_image2.png");
const STREAMFLOW_IMAGE = FileAttachment("data/streamFlow_image.png");
const DAYLENGTH_IMAGE = FileAttachment("data/dayLength_image.png");
const POLYRHYTHM_IMAGE = FileAttachment("data/polyrhythm_image.png");
const TROUTGROWTH_IMAGE = FileAttachment("data/troutGrowth_image.png");
const DRUMS_IMAGE = FileAttachment("data/drums_image.png");
```

```js
// Then export them in the images object - these are now FileAttachment objects
const images = {
  pit: PIT_IMAGE,
  temp: TEMP_IMAGE,
  pit2: PIT_IMAGE2,
  streamFlow: STREAMFLOW_IMAGE,
  dayLength: DAYLENGTH_IMAGE,
  polyrhythm: POLYRHYTHM_IMAGE,
  troutGrowth: TROUTGROWTH_IMAGE,
  drums: DRUMS_IMAGE
};
```

```js
const cases = await createCases(images)
```

```js
const filterButtons = html`<div class="filter-buttons">
  <button class="filter-button active" data-filter="all">All</button>
  <button class="filter-button" data-filter="dataStory">Data story</button>
  <button class="filter-button" data-filter="dataExplorer">Data Explorer</button>
  <button class="filter-button" data-filter="music">Music</button>
</div>`;
```

```js
// Add filtered cases as a reactive cell
const filteredCases = {
  filter: "all",
  update(newFilter) {
    this.filter = newFilter;
    return cases.filter(item => this.filter === "all" || item.category === this.filter);
  }
};
```

```js
// Create cards from filtered cases
const displayedCards = filteredCases.update("all");
```

```js
// Update filter buttons to use the new approach
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
      const filteredCases = displayedCards.filter(item => 
        filter === "all" || item.category === filter
      );
      
      // Create new cards for filtered cases
      const newCards = await createCaseCards(filteredCases);
      
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
```

${createHeader()}
<main style="width: 100%">
  <div class="cases-container">
    <p>Some text() describing the project</p>
    <hr>
    <div class="filter-section">
      ${filterButtons}
    </div>
    <div class="cases-grid">
      ${await createCaseCards(displayedCards)}
    </div>
  </div>
</main>

test