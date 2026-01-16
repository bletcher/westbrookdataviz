import { html } from "htl";

export function createHeader() {
  const header = html`
    <div class="nav-container">
      <div class="nav-content">
        <a href="index.html" class="logo" style="text-decoration: none;">WestBrook DataViz</a>

        <!-- Desktop Navigation -->
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>

        <!-- Hamburger Button (Mobile) -->
        <button class="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <div class="nav-overlay"></div>

    <!-- Mobile Navigation Drawer -->
    <nav class="mobile-nav" aria-label="Mobile navigation">
      <div class="mobile-nav-links">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </div>
    </nav>
  `;

  // Get elements
  const hamburger = header.querySelector('.hamburger');
  const mobileNav = header.querySelector('.mobile-nav');
  const navOverlay = header.querySelector('.nav-overlay');
  const mobileLinks = header.querySelectorAll('.mobile-nav-links a');

  // Toggle mobile menu
  function toggleMenu() {
    const isOpen = hamburger.classList.contains('active');

    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    navOverlay.classList.toggle('active');

    // Update ARIA
    hamburger.setAttribute('aria-expanded', !isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  // Close menu
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Event listeners
  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu on window resize (if switching to desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });

  return header;
}
