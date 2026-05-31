/* ═══════════════════════════════════════════════════════════════
   IVAN AYUSO — script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Footer year ─────────────────────────────────────────── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();


/* ── 2. Nav scroll state ────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── 3. Mobile menu ─────────────────────────────────────────────
   Uses a separate overlay div for reliable cross-browser behavior.
   Tested on iOS Safari and Android Chrome.
────────────────────────────────────────────────────────────────── */
const burger  = document.getElementById('navBurger');
const overlay = document.getElementById('mobileOverlay');
const mLinks  = document.getElementById('mobileLinks');

function openMenu() {
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  // Show overlay as flex, then fade in
  overlay.style.display = 'flex';
  // Force reflow so transition fires
  overlay.getBoundingClientRect();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  // Lock scroll (iOS Safari needs both)
  document.body.style.overflow   = 'hidden';
  document.body.style.position   = 'fixed';
  document.body.style.width      = '100%';
}

function closeMenu() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  // Restore scroll
  document.body.style.overflow   = '';
  document.body.style.position   = '';
  document.body.style.width      = '';
  // Hide overlay after transition completes
  overlay.addEventListener('transitionend', function hide() {
    overlay.style.display = 'none';
    overlay.removeEventListener('transitionend', hide);
  });
}

burger.addEventListener('click', () => {
  if (overlay.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close when a link is tapped
mLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) {
    closeMenu();
  }
});


/* ── 4. Smooth scroll with nav offset ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 5. Scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  [
    '.works-header', '.sketchbook-header',
    '.about-inner',  '.contact-inner',
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


/* ── 6. Apple-style carousel ────────────────────────────────── */
(function initCarousel() {
  const track   = document.getElementById('track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.card'));
  if (!cards.length) return;

  // Build dots
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

  function scrollToCard(index) {
    const card    = cards[Math.max(0, Math.min(index, cards.length - 1))];
    const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollTo({ left: card.offsetLeft - padLeft, behavior: 'smooth' });
  }

  function pageBy(dir) {
    track.scrollBy({ left: dir * track.clientWidth * 0.82, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => pageBy(-1));
  nextBtn.addEventListener('click', () => pageBy(+1));

  let rafId = null;
  track.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateButtons();
      const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      let closest = 0, closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - padLeft - track.scrollLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      updateDots(closest);
    });
  }, { passive: true });

  updateButtons();

  // Mouse drag with momentum
  let dragging = false, startX = 0, startScroll = 0, velocity = 0, lastX = 0, lastTime = 0;

  track.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true; startX = e.clientX; startScroll = track.scrollLeft;
    lastX = e.clientX; lastTime = performance.now(); velocity = 0;
    track.setPointerCapture(e.pointerId);
    track.style.cursor = 'grabbing';
    track.style.userSelect = 'none';
    track.style.scrollBehavior = 'auto';
  });

  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now();
    velocity = (e.clientX - lastX) / (now - lastTime || 1);
    lastX = e.clientX; lastTime = now;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.style.cursor = ''; track.style.userSelect = ''; track.style.scrollBehavior = '';
    if (Math.abs(velocity * 120) > 30) {
      track.scrollBy({ left: -velocity * 120, behavior: 'smooth' });
    }
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', e => {
    if (Math.abs(track.scrollLeft - startScroll) > 5) e.stopPropagation();
  }, true);
})();


/* ── 7. Lightbox ─────────────────────────────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta  = document.getElementById('lbMeta');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb) return;

  const carouselCards = Array.from(document.querySelectorAll('.card'));
  const sketchImgs    = Array.from(document.querySelectorAll('.sk-item'));

  const items = [
    ...carouselCards.map(card => ({
      src:    card.querySelector('img').src,
      title:  card.dataset.title  || '',
      medium: card.dataset.medium || '',
    })),
    ...sketchImgs.map(img => ({
      src: img.src, title: '', medium: '',
    })),
  ];

  let current = 0;

  function open(index) {
    current = Math.max(0, Math.min(index, items.length - 1));
    const item = items[current];
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.94) translateZ(0)';
    lbImg.src = item.src; lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbMeta.textContent  = item.medium;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    lbClose.focus();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lbImg.style.opacity = '';
      lbImg.style.transform = '';
    }));
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width    = '';
  }

  function go(dir) {
    open((current + dir + items.length) % items.length);
  }

  carouselCards.forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver ${card.dataset.title || 'obra'}`);
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

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
