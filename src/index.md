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
//import { setupAnalytics } from "./components/analytics.js";
```

```js
// Initialize analytics first
//setupAnalytics();
import { AwsRum, AwsRumConfig } from 'aws-rum-web';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-2:ace87ca1-6eaa-4f02-9b0e-cf9ac1a67014",
    endpoint: "https://dataplane.rum.us-east-2.amazonaws.com",
    telemetries: ["performance","errors","http"],
    allowCookies: true,
    enableXRay: false
  };

  const APPLICATION_ID: string = '25e7c184-e75c-43a2-93b4-5d571327cbd9';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'us-east-2';

  const awsRum: AwsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}
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
    Our mission is to make scientific data and models easier to understand and explore. Here are some apps. 
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