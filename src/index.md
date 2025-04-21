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
```

```js
const cases = await createCases(images)
const filterButtons = createFilterButtons();
const filteredCases = createFilteredCases(cases);
const displayedCards = filteredCases.update("all");
setupFilterButtons(filterButtons, filteredCases, createCaseCards);
```

${createHeader()}
<main style="width: 100%">
  <div class="cases-container">
    <p>Test upload</p>
    <p>Some text(s) describing the project</p>
    <hr>
    <div class="filter-section">
      ${filterButtons}
    </div>
    <div class="cases-grid">
      ${await createCaseCards(displayedCards)}
    </div>
  </div>
</main>