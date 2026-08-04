import { html } from "htl";

// All three links fit at 360px, so there is no hamburger and no drawer.
const LINKS = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" }
];

// "/" and "/index.html" are the same page; anything else matches on file name.
function currentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

// Cancels the previous listener if the cell re-runs during development.
let stuckWatcher;

// The bar only grows its hairline once there is content behind it, so the top
// of the page stays clean.
function watchStuck(nav) {
  stuckWatcher?.abort();
  stuckWatcher = new AbortController();

  const update = () => nav.classList.toggle("is-stuck", window.scrollY > 4);
  window.addEventListener("scroll", update, { passive: true, signal: stuckWatcher.signal });
  update();
}

export function createHeader() {
  const here = currentPage();

  const links = LINKS.map(({ href, label }) => {
    const isCurrent = href === here;
    return html`<a href="${href}"
        class="${isCurrent ? "is-current" : ""}"
        aria-current="${isCurrent ? "page" : null}">${label}</a>`;
  });

  const header = html`
    <a class="skip-link" href="#main">Skip to content</a>
    <nav class="site-nav" aria-label="Main">
      <div class="site-nav-inner">${links}</div>
    </nav>
  `;

  watchStuck(header.querySelector(".site-nav"));

  return header;
}
