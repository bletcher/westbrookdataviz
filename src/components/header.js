import { html } from "htl";

export function createHeader() {
  // Create the header element
  const header = html`
    <div class="nav-container">
      <div class="nav-content">
        <a href="/" class="logo" style="text-decoration: none;">WestBrook DataViz</a>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/">Cases</a>
          <a href="/about">About us</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </div>
  `;
  
  // Force a single render
  return html`${header}`;
} 