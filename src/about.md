---
toc: false
style: data/custom.css
---

```js
import { createHeader } from "./components/header.js";
```

<div class="header-container">
  ${createHeader()}
</div>
<main class="about-container">
  <div class="about-content">
    <figure class="profile-image">
      <img src="data/ben_letcher.jpg" alt="Ben Letcher">
    </figure>
    <section class="about-section">
      <h2>Hi, I'm Ben Letcher</h2>
      <p>After a fun, invigorating and challenging career as a <a href="https://www.usgs.gov/staff-profiles/benjamin-h-letcher">research ecologist</a> with the US Geological Survey, I am focussing on creating interactive data apps. While at USGS, with a large group of amazing technicians, undergrads, grad students, post-docs and colleagues, I spent a lot of time tagging fish in a few small streams and analyzing the data. You can find some early data stories/tools about the study area, the West Brook, <a href="https://www.usgs.gov/apps/ecosheds/pitdata/">here</a>. Wait, is that why this site is called WestBrook DataViz? Yup. The West Brook is where I got to follow my dream of getting data on individual fish so we could understand how the fish grow, where they go, how likely they are to survive and who is related to who. </p>
      <p>We got amazing data on about 30,000 fish over almost 20 years. The trouble was that the data on these fish are really complex and the models are even more complex. This led to the need to develop creative ways to explore the data and to explain the models. Working mainly with <a href="https://walkerenvres.com/">Dr Jeff Walker</a>, we created the <a href="https://www.usgs.gov/apps/ecosheds/#/">EcoSheds</a> platform. This is where we have a number of data systems (database → model → visualization tool) and visualization tools. WestBrook DataViz shares the tools from EcoSheds that I developed mostly on my own and new apps that I am excited about or people ask me to make.</p>
      <h2>My Goal</h2>
      <p>At WestBrook DataViz, we create interactive data visualizations and exploratory tools to help people understand complex environmental and ecological systems. Our goal is to make scientific data and models more accessible and engaging through interactive experiences.</p>
    </section>
    <section class="about-section">
      <h2>I specialize in:</h2>
      <ul>
        <li>Interactive data explorers for scientific research</li>
        <li>Data storytelling through visualization</li>
        <li>Environmental and ecological data analysis</li>
        <li>Custom visualization tools for researchers</li>
      </ul>
    </section>
    <section class="about-section">
      <h2>I believe in:</h2>
      <ul style="list-style-type: none; padding-left: 0;">
        <li>Making data accessible and engaging</li>
        <li>Creating intuitive user experiences</li>
        <li>Supporting scientific understanding</li>
        <li>Open source and reproducible science</li>
      </ul>
    </section>
  </div>
</main> 