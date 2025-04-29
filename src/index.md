---
toc: false
style: data/custom.css
---

```js
import { 
  createCaseCards, 
  createCases, 
  images, 
  createFilterButtons,
  createFilteredCases,
  setupFilterButtons
} from "./components/cases.js";
import { html } from "htl";
import { createHeader } from "./components/header.js";
import { createFooter } from "./components/footer.js";
```

```js
const cases = await createCases(images)
const filterButtons = createFilterButtons();
const filteredCases = createFilteredCases(cases);
const displayedCards = filteredCases.update("all");
setupFilterButtons(filterButtons, filteredCases, createCaseCards);
```

<div class="header-container">
  ${createHeader()}
</div>
<main style="width: 100%">  
  <div class="intro-container">
    My goal is to make scientific data and models easier to understand and explore using data visualization<span class="down-arrow">↓</span>
  </div>
  <div class="cases-container">
    <hr>
    <div class="filter-section">
      ${filterButtons}
    </div>
    <div class="cases-grid">
      ${await createCaseCards(displayedCards)}
    </div>
  </div>
</main>
<div class="footer-container">
  <hr>
  ${createFooter()}
</div>