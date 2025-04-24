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
<main class="contact-container">
  <div class="contact-content">
    <h1>Contact Us</h1>
    <div class="contact-info">
      <h2>Get in Touch</h2>
      <p>I'd love to hear from you! Here's how you can reach Ben:</p>
      <div class="contact-details">
        <div class="contact-item">
          <h3>Email</h3>
          <p><a href="mailto:bletcher@umass.edu">bletcher@umass.edu</a></p>
        </div>
        <div class="contact-item">
          <h3>Location</h3>
          <p>Montague, Massachusetts, USA</p>
        </div>
        <div class="contact-item">
          <h3>Social Media</h3>
          <div class="social-links">
            <a href="https://bsky.app/profile/bletcher.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
            <a href="https://github.com/bletcher" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://scholar.google.com/citations?user=fwgbROwAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google scholar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>