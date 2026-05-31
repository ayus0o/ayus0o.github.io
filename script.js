/* ═══════════════════════════════════════════════════════
   ELENA VOSS — ARTIST PORTFOLIO
   script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   1. FOOTER YEAR
   Auto-updates the copyright year.
────────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ──────────────────────────────────────────────
   2. NAVIGATION — scroll state & mobile toggle
────────────────────────────────────────────── */
const nav         = document.getElementById('nav');
const navToggle   = document.getElementById('navToggle');
const navLinks    = nav.querySelector('.nav-links');

// Add "scrolled" class after 60px scroll to trigger frosted-glass effect
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile hamburger toggle
navToggle.addEventListener('click', () => {
  nav.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', nav.classList.contains('menu-open'));
});

// Close mobile menu when a nav link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ──────────────────────────────────────────────
   3. SCROLL REVEAL
   Adds the .visible class to elements with
   .reveal as they enter the viewport.
────────────────────────────────────────────── */
function initScrollReveal() {
  // Attach .reveal to the elements we want to animate
  const targets = [
    '.featured-inner',
    '.works .section-header',
    '.about .section-header',
    '.about-content',
    '.contact-inner',
    '.featured-figure',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Work cards get staggered delays
  document.querySelectorAll('.work-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  // Intersection Observer to trigger reveals
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

initScrollReveal();


/* ──────────────────────────────────────────────
   4. LIGHTBOX
   Gathers all .work-card elements, builds a
   navigable fullscreen viewer.

   To add more artworks to the gallery, add new
   .work-card elements in index.html (see the
   comment block in the works-grid section).
   The lightbox will automatically pick them up.
────────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lbImage       = document.getElementById('lightboxImage');
const lbTitle       = document.getElementById('lightboxTitle');
const lbMeta        = document.getElementById('lightboxMeta');
const lbDims        = document.getElementById('lightboxDims');
const lbStatus      = document.getElementById('lightboxStatus');
const lbClose       = document.getElementById('lightboxClose');
const lbPrev        = document.getElementById('lightboxPrev');
const lbNext        = document.getElementById('lightboxNext');

// Collect all artwork cards into an array for navigation
const cards = Array.from(document.querySelectorAll('.work-card'));
let currentIndex = 0;

/**
 * openLightbox(index)
 * Opens the lightbox and populates it with the artwork at `index`.
 */
function openLightbox(index) {
  currentIndex = index;
  const card = cards[index];

  // Reset image transition before swapping src
  lbImage.style.opacity = '0';
  lbImage.style.transform = 'scale(0.94)';

  // Read data attributes from the card
  lbImage.src    = card.dataset.src   || card.querySelector('img').src;
  lbImage.alt    = card.dataset.title || '';
  lbTitle.textContent  = card.dataset.title        || '';
  lbMeta.textContent   = card.dataset.medium       || '';
  lbDims.textContent   = card.dataset.dimensions   || '';
  lbStatus.textContent = card.dataset.availability || '';

  // Set status colour class
  lbStatus.className = 'lightbox-status';
  const avail = (card.dataset.availability || '').toLowerCase();
  if (avail === 'available') lbStatus.classList.add('available');
  else if (avail === 'sold')  lbStatus.classList.add('sold');

  // Open
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();

  // Trigger image transition after a micro-delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lbImage.style.opacity = '';
      lbImage.style.transform = '';
    });
  });
}

/**
 * closeLightbox()
 * Closes the lightbox and restores scroll.
 */
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Return focus to the card that opened the lightbox
  if (cards[currentIndex]) cards[currentIndex].focus();
}

/** Navigate between artworks inside the lightbox. */
function navigate(direction) {
  const next = (currentIndex + direction + cards.length) % cards.length;
  openLightbox(next);
}

// Attach click listeners to every work card
cards.forEach((card, i) => {
  card.addEventListener('click', () => openLightbox(i));
  // Keyboard: Enter / Space also open the lightbox
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

// Control buttons
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => navigate(-1));
lbNext.addEventListener('click',  () => navigate(+1));

// Click outside image to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  switch (e.key) {
    case 'Escape':    closeLightbox();   break;
    case 'ArrowLeft': navigate(-1);      break;
    case 'ArrowRight':navigate(+1);      break;
  }
});

// Touch / swipe support for mobile
(function initSwipe() {
  let startX = 0;
  lightbox.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  }, { passive: true });
})();


/* ──────────────────────────────────────────────
   5. SMOOTH ANCHOR OFFSET
   Accounts for the fixed nav height when jumping
   to in-page anchors.
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
