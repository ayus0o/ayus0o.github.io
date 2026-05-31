/* ═══════════════════════════════════════════════════════════════
   ARTIST PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Footer year ─────────────────────────────────────────── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();


/* ── 2. Nav scroll state ────────────────────────────────────── */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
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


/* ── 3. Smooth anchor scroll (offset for fixed nav) ────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


/* ── 4. Scroll reveal ───────────────────────────────────────── */
function initReveal() {
  const selectors = [
    '.featured-wrap',
    '.works-header',
    '.sketchbook-header',
    '.about-inner',
    '.contact-inner',
    '.featured-caption',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('will-reveal'));
  });

  // Sketchbook items get staggered reveal
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
}

initReveal();


/* ── 5. Horizontal carousel ─────────────────────────────────── */
(function initCarousel() {
  const track   = document.getElementById('track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.card'));
  if (!cards.length) return;

  /* Build dots — one per card */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to artwork ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsEl.appendChild(dot);
  });

  const dots = Array.from(dotsEl.querySelectorAll('.carousel-dot'));

  function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function updateButtons() {
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }

  function scrollToCard(index) {
    const card = cards[index];
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect  = card.getBoundingClientRect();
    track.scrollBy({
      left: cardRect.left - trackRect.left - parseFloat(getComputedStyle(track).paddingLeft),
      behavior: 'smooth'
    });
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth * 0.7, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth * 0.7, behavior: 'smooth' });
  });

  /* Update dots as user scrolls */
  track.addEventListener('scroll', () => {
    updateButtons();

    // Find which card is most visible
    const trackRect = track.getBoundingClientRect();
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left - trackRect.left);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    updateDots(closest);
  }, { passive: true });

  updateButtons();

  /* ── Drag-to-scroll on desktop ── */
  let isDragging = false, startX = 0, startScroll = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    startScroll = track.scrollLeft;
    track.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = startScroll - (x - startX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.userSelect = '';
  });
})();


/* ── 6. Lightbox (for carousel cards) ──────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta  = document.getElementById('lbMeta');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');

  if (!lb) return;

  const cards = Array.from(document.querySelectorAll('.card'));
  let current = 0;

  function open(index) {
    current = index;
    const card = cards[index];

    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.95)';

    lbImg.src          = card.querySelector('img').src;
    lbImg.alt          = card.dataset.title || '';
    lbTitle.textContent = card.dataset.title  || '';
    lbMeta.textContent  = card.dataset.medium || '';

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();

    // Trigger the CSS transition
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lbImg.style.opacity = '';
      lbImg.style.transform = '';
    }));
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function go(dir) {
    open((current + dir + cards.length) % cards.length);
  }

  // Attach to each card
  cards.forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${card.dataset.title || 'artwork'}`);
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  () => go(-1));
  lbNext.addEventListener('click',  () => go(+1));

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   go(-1);
    if (e.key === 'ArrowRight')  go(+1);
  });

  // Swipe support
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
