/* ═══════════════════════════════════════════════════════════════
   IVAN AYUSO — script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Footer year ─────────────────────────────────────────── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();


/* ── 2. Nav scroll + mobile toggle ─────────────────────────── */
const nav    = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const links  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ── 3. Smooth scroll with nav offset ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


/* ── 4. Scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  [
    '.featured-wrap', '.featured-caption',
    '.works-header',  '.sketchbook-header',
    '.about-inner',   '.contact-inner',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('will-reveal'));
  });

  document.querySelectorAll('.sk-item').forEach((el, i) => {
    el.classList.add('will-reveal');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.will-reveal').forEach(el => io.observe(el));
})();


/* ── 5. Apple-style carousel ────────────────────────────────── */
(function initCarousel() {
  const track   = document.getElementById('track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.card'));
  if (!cards.length) return;

  // ── Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Artwork ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsEl.appendChild(dot);
  });

  const dots = Array.from(dotsEl.querySelectorAll('.carousel-dot'));

  function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function updateButtons() {
    prevBtn.disabled = track.scrollLeft < 4;
    nextBtn.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
  }

  /*
   * scrollToCard — snaps to a card with Apple-style momentum.
   * Uses scrollLeft assignment inside requestAnimationFrame
   * so the browser's own scroll engine handles inertia.
   */
  function scrollToCard(index) {
    const card      = cards[Math.max(0, Math.min(index, cards.length - 1))];
    const padLeft   = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const cardLeft  = card.offsetLeft - padLeft;
    track.scrollTo({ left: cardLeft, behavior: 'smooth' });
  }

  /*
   * Page by ~80% of visible width — feels like swiping one
   * "page" at a time, matching Apple carousel UX.
   */
  function pageBy(direction) {
    const pageWidth = track.clientWidth * 0.82;
    track.scrollBy({ left: direction * pageWidth, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => pageBy(-1));
  nextBtn.addEventListener('click', () => pageBy(+1));

  // ── Update dots + buttons on scroll (throttled with rAF)
  let rafId = null;
  track.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateButtons();

      // Find closest card to left edge
      const padLeft   = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const viewLeft  = track.scrollLeft + padLeft;
      let closest = 0, closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - padLeft - track.scrollLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      updateDots(closest);
    });
  }, { passive: true });

  updateButtons();

  // ── Mouse drag-to-scroll (desktop)
  // Uses pointer events for smoother capture
  let dragging    = false;
  let startX      = 0;
  let startScroll = 0;
  let velocity    = 0;
  let lastX       = 0;
  let lastTime    = 0;

  track.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging    = true;
    startX      = e.clientX;
    startScroll = track.scrollLeft;
    lastX       = e.clientX;
    lastTime    = performance.now();
    velocity    = 0;
    track.setPointerCapture(e.pointerId);
    track.style.cursor       = 'grabbing';
    track.style.userSelect   = 'none';
    track.style.scrollBehavior = 'auto'; // disable smooth during drag
  });

  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now  = performance.now();
    const dx   = e.clientX - lastX;
    const dt   = now - lastTime || 1;

    velocity   = dx / dt;            // px/ms
    lastX      = e.clientX;
    lastTime   = now;

    track.scrollLeft = startScroll - (e.clientX - startX);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.style.cursor       = '';
    track.style.userSelect   = '';
    track.style.scrollBehavior = ''; // restore smooth

    /*
     * Momentum flick — throw the scroll based on final velocity.
     * Mimics iOS/macOS momentum scrolling on desktop.
     */
    const momentum = velocity * 120; // scale px/ms → px
    if (Math.abs(momentum) > 30) {
      track.scrollBy({ left: -momentum, behavior: 'smooth' });
    }
  }

  track.addEventListener('pointerup',     endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Prevent accidental link clicks after a drag
  track.addEventListener('click', e => {
    if (Math.abs(track.scrollLeft - startScroll) > 5) e.stopPropagation();
  }, true);

})();


/* ── 6. Lightbox ─────────────────────────────────────────────
   Opens on card click with garnet background (set in CSS).
   Sketchbook images also open in the lightbox.
────────────────────────────────────────────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta  = document.getElementById('lbMeta');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb) return;

  // Collect carousel cards + sketchbook images into one unified list
  const carouselCards = Array.from(document.querySelectorAll('.card'));
  const sketchImgs    = Array.from(document.querySelectorAll('.sk-item'));

  // Unified item list — each entry has { src, title, medium }
  const items = [
    ...carouselCards.map(card => ({
      src:    card.querySelector('img').src,
      title:  card.dataset.title  || '',
      medium: card.dataset.medium || '',
    })),
    ...sketchImgs.map(img => ({
      src:    img.src,
      title:  '',
      medium: '',
    })),
  ];

  let current = 0;

  function open(index) {
    current = Math.max(0, Math.min(index, items.length - 1));
    const item = items[current];

    // Reset image so transition fires again
    lbImg.style.opacity   = '0';
    lbImg.style.transform = 'scale(0.94) translateZ(0)';

    lbImg.src           = item.src;
    lbImg.alt           = item.title;
    lbTitle.textContent = item.title;
    lbMeta.textContent  = item.medium;

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();

    // Trigger CSS transition on next paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lbImg.style.opacity   = '';
      lbImg.style.transform = '';
    }));
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function go(dir) {
    open((current + dir + items.length) % items.length);
  }

  // Attach to carousel cards
  carouselCards.forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver ${card.dataset.title || 'obra'}`);
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  // Attach to sketchbook images (offset by carousel card count)
  sketchImgs.forEach((img, i) => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Ver boceto');
    img.addEventListener('click', () => open(carouselCards.length + i));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(carouselCards.length + i); }
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  () => go(-1));
  lbNext.addEventListener('click',  () => go(+1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(+1);
  });

  // Touch swipe
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
