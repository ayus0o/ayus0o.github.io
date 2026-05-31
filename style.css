/* ═══════════════════════════════════════════════════════════════
   ARTIST PORTFOLIO — style.css
   Personal, poetic, intimate. More notebook than store.
   ═══════════════════════════════════════════════════════════════ */

/* ── Variables ─────────────────────────────────────────────── */
:root {
  --white:       #ffffff;
  --warm-white:  #faf9f6;
  --paper:       #f4f2ed;
  --paper-dark:  #ede9e1;
  --dust:        #d6d0c4;
  --mid:         #9a9186;
  --ink-soft:    #5c5549;
  --ink:         #2c2720;
  --near-black:  #181410;

  --f-display:   'Cormorant Garamond', Georgia, serif;
  --f-body:      'EB Garamond', Georgia, serif;

  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-std:    cubic-bezier(0.4, 0, 0.2, 1);

  --gutter: clamp(1.5rem, 6vw, 5rem);
  --max:    1320px;
}

/* ── Reset ─────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--white);
  color: var(--ink);
  font-family: var(--f-body);
  font-size: clamp(1rem, 1.05vw, 1.1rem);
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img { display: block; max-width: 100%; height: auto; }
a   { color: inherit; text-decoration: none; }
ul  { list-style: none; }

button {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
}


/* ══════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════ */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem var(--gutter);
  transition: background 0.5s var(--ease-std),
              border-color 0.5s var(--ease-std);
  border-bottom: 1px solid transparent;
}

.nav.scrolled {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom-color: rgba(44,39,32,0.08);
}

/* Artist name in nav — Cormorant italic, feels like a signature */
.nav-name {
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 400;
  font-size: 1.15rem;
  color: var(--ink);
  letter-spacing: 0.01em;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
}

.nav-links a {
  font-family: var(--f-body);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mid);
  position: relative;
  transition: color 0.2s;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: var(--ink-soft);
  transition: width 0.3s var(--ease-out);
}

.nav-links a:hover { color: var(--ink); }
.nav-links a:hover::after { width: 100%; }

/* Hamburger */
.nav-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  z-index: 91;
}
.nav-burger span {
  display: block;
  width: 20px; height: 1px;
  background: var(--ink);
  transition: transform 0.3s var(--ease-out), opacity 0.3s;
}
.nav-burger.open span:first-child { transform: translateY(6px) rotate(45deg); }
.nav-burger.open span:last-child  { transform: translateY(-6px) rotate(-45deg); }


/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem var(--gutter) 5rem;
  position: relative;
  background: var(--white);
}

.hero-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
}

/* The name — large, italic, calligraphic — feels like a signature */
.hero-name {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(5rem, 16vw, 14rem);
  line-height: 0.88;
  letter-spacing: -0.025em;
  color: var(--near-black);

  opacity: 0;
  transform: translateY(18px);
  animation: riseIn 1.2s 0.15s var(--ease-out) forwards;
}

.hero-name em {
  font-style: italic;
  font-weight: 300;
  /* slightly lighter — two-tone signature effect */
  opacity: 0.55;
}

/* "I paint what stays with me." */
.hero-line {
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.15rem, 2.2vw, 1.8rem);
  color: var(--ink-soft);
  letter-spacing: 0.01em;

  opacity: 0;
  transform: translateY(10px);
  animation: riseIn 1s 0.6s var(--ease-out) forwards;
}

.hero-origin {
  font-family: var(--f-body);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--dust);

  opacity: 0;
  animation: riseIn 0.8s 1s var(--ease-out) forwards;
}

/* Scroll cue arrow */
.hero-down {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--dust);
  transition: color 0.2s;
  opacity: 0;
  animation: riseIn 0.7s 1.4s var(--ease-out) forwards;
}
.hero-down:hover { color: var(--ink-soft); }
.hero-down svg {
  animation: nudge 2.2s 2s ease-in-out infinite;
}

@keyframes nudge {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(6px); }
}

@keyframes riseIn {
  to { opacity: 1; transform: translateY(0); }
}


/* ══════════════════════════════════════════════════════════════
   FEATURED WORK
══════════════════════════════════════════════════════════════ */
.featured {
  padding: clamp(4rem, 10vw, 9rem) var(--gutter);
  background: var(--warm-white);
}

.featured-wrap {
  max-width: var(--max);
  margin: 0 auto;
}

/* The figure respects orientation — portrait or landscape */
.featured-figure {
  margin: 0 auto;
  max-width: 860px; /* generous but not edge-to-edge */
}

.featured-figure[data-orient="landscape"] {
  max-width: 100%;
}

.featured-img {
  width: 100%;
  height: auto;
  display: block;
  /* Gentle paper shadow — feels like a physical object */
  box-shadow:
    0 2px 4px rgba(44,39,32,0.06),
    0 12px 40px rgba(44,39,32,0.10),
    0 32px 80px rgba(44,39,32,0.07);
}

.featured-caption {
  margin-top: 1.6rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--dust);
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.featured-title {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 400;
  color: var(--near-black);
}

.featured-meta {
  font-size: 0.875rem;
  color: var(--mid);
  flex: 1;
}

.featured-size {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--dust);
  white-space: nowrap;
}


/* ══════════════════════════════════════════════════════════════
   SELECTED WORKS — horizontal carousel
══════════════════════════════════════════════════════════════ */
.works {
  padding: clamp(4rem, 8vw, 7rem) 0 clamp(3rem, 5vw, 5rem);
  background: var(--white);
}

.works-header {
  padding: 0 var(--gutter);
  margin-bottom: 2.5rem;
}

/* Shared eyebrow label style */
.section-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--dust);
}

/* Outer — hides overflow, shows the fade edges */
.carousel-outer {
  position: relative;
  overflow: hidden;
  cursor: grab;
}
.carousel-outer:active { cursor: grabbing; }

/* The scrolling track */
.track {
  display: flex;
  align-items: flex-end; /* bottom-align so portrait/landscape sit on same baseline */
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: 0 var(--gutter);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
}
.track::-webkit-scrollbar { display: none; }

/* Individual artwork card */
.card {
  flex-shrink: 0;
  scroll-snap-align: start;
  cursor: pointer;
  position: relative;
}

/*
  Portrait cards: based on 35×50 ratio (0.7 w/h)
  The image takes up roughly 75vh tall to feel grand.
*/
.card[data-orient="portrait"] .card-img-wrap {
  width: auto;
  height: clamp(340px, 72vh, 680px);
  aspect-ratio: 35 / 50;
}

/*
  Landscape cards: based on 50×35 ratio (50/35 ≈ 1.43)
*/
.card[data-orient="landscape"] .card-img-wrap {
  width: auto;
  height: clamp(240px, 50vh, 476px);
  aspect-ratio: 50 / 35;
}

.card-img-wrap {
  overflow: hidden;
  background: var(--paper);
  box-shadow:
    0 2px 4px rgba(44,39,32,0.05),
    0 8px 28px rgba(44,39,32,0.09);
  transition: box-shadow 0.4s var(--ease-std);
}

.card:hover .card-img-wrap {
  box-shadow:
    0 4px 8px rgba(44,39,32,0.07),
    0 18px 50px rgba(44,39,32,0.15);
}

.card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.7s var(--ease-std);
}
.card:hover .card-img-wrap img {
  transform: scale(1.03);
}

.card-cap {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-top: 0.85rem;
}

.card-title {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--ink);
  line-height: 1.2;
}

.card-year {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--mid);
}

/* Fade edges — hint of more content */
.carousel-fade-left,
.carousel-fade-right {
  position: absolute;
  top: 0; bottom: 0;
  width: clamp(2rem, 5vw, 4rem);
  pointer-events: none;
  z-index: 2;
}
.carousel-fade-left  {
  left: 0;
  background: linear-gradient(to right, var(--white), transparent);
}
.carousel-fade-right {
  right: 0;
  background: linear-gradient(to left, var(--white), transparent);
}

/* Carousel nav */
.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem var(--gutter) 0;
}

.carousel-btn {
  font-size: 1.1rem;
  color: var(--mid);
  padding: 0.4rem 0.6rem;
  transition: color 0.2s;
  line-height: 1;
  user-select: none;
}
.carousel-btn:hover { color: var(--ink); }
.carousel-btn:disabled { color: var(--dust); cursor: default; }

.carousel-dots {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}

.carousel-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--dust);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.25s, transform 0.25s;
}
.carousel-dot.active {
  background: var(--ink-soft);
  transform: scale(1.35);
}


/* ══════════════════════════════════════════════════════════════
   SKETCHBOOK
══════════════════════════════════════════════════════════════ */
.sketchbook {
  padding: clamp(4rem, 9vw, 8rem) var(--gutter);
  background: var(--warm-white);
  overflow: hidden;
}

.sketchbook-header {
  margin-bottom: 0.6rem;
}

.sketchbook-note {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  font-weight: 300;
  color: var(--mid);
  margin-top: 0.5rem;
  margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
}

/*
  The scatter layout: items flow in a multi-column CSS columns
  layout so portrait and landscape images arrange naturally,
  with subtle rotations and offsets to feel organic.
*/
.sketchbook-scatter {
  columns: 3;
  column-gap: clamp(1rem, 2.5vw, 2rem);
  max-width: var(--max);
  margin: 0 auto;
}

.sk-item {
  break-inside: avoid;
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: clamp(1rem, 2.5vw, 2rem);
  box-shadow:
    0 1px 3px rgba(44,39,32,0.06),
    0 6px 20px rgba(44,39,32,0.08);
  transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
}

.sk-item:hover {
  box-shadow:
    0 3px 6px rgba(44,39,32,0.09),
    0 14px 40px rgba(44,39,32,0.14);
  transform: scale(1.015) rotate(0.3deg);
}

/* Size/rotation variants — subtle and organic */
.sk-item.s1 { transform: rotate(-0.6deg); }
.sk-item.s2 { transform: rotate(0.4deg);  margin-top: 1.5rem; }
.sk-item.s3 { transform: rotate(-0.3deg); }
.sk-item.s4 { transform: rotate(0.7deg);  margin-top: 0.8rem; }
.sk-item.s5 { transform: rotate(-0.5deg); }
.sk-item.s6 { transform: rotate(0.2deg);  margin-top: 1.2rem; }
.sk-item.s7 { transform: rotate(-0.8deg); }
.sk-item.s8 { transform: rotate(0.5deg);  margin-top: 0.5rem; }
.sk-item.s9 { transform: rotate(-0.4deg); margin-top: 2rem; }

/* Hover resets rotation while scaling */
.sk-item:hover { transform: scale(1.015) rotate(0deg) !important; }


/* ══════════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════════ */
.about {
  padding: clamp(5rem, 10vw, 9rem) var(--gutter);
  background: var(--white);
}

.about-inner {
  max-width: 680px;
}

.about-inner .section-eyebrow {
  display: block;
  margin-bottom: 2.5rem;
}

.about-text p {
  font-family: var(--f-body);
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.85;
  color: var(--ink);
}

.about-text p + p {
  margin-top: 1.4rem;
}

/* Slightly softer for the final honest line */
.about-text p:last-child {
  color: var(--ink-soft);
  font-style: italic;
}


/* ══════════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════════ */
.contact {
  padding: clamp(4rem, 8vw, 7rem) var(--gutter);
  background: var(--paper);
  border-top: 1px solid var(--paper-dark);
}

.contact-inner { max-width: var(--max); margin: 0 auto; }

.contact-inner .section-eyebrow {
  display: block;
  margin-bottom: 2.5rem;
}

.contact-links {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--dust);
}

.contact-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--dust);
  gap: 1rem;
  transition: padding-left 0.3s var(--ease-out);
}

.contact-link:hover { padding-left: 0.75rem; }

.contact-label {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--dust);
  flex-shrink: 0;
  width: 90px;
}

.contact-value {
  font-family: var(--f-display);
  font-style: italic;
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  font-weight: 300;
  color: var(--ink);
  transition: color 0.2s;
}

.contact-link:hover .contact-value { color: var(--ink-soft); }


/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
.footer {
  padding: 1.75rem var(--gutter);
  background: var(--paper);
  border-top: 1px solid var(--paper-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-name {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--mid);
}

.footer-copy {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--dust);
}


/* ══════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════ */
.lb {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(24, 20, 16, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1.2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease-std);
}

.lb.open {
  opacity: 1;
  pointer-events: all;
}

.lb-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.lb-img {
  max-width: 100%;
  max-height: calc(100vh - 140px);
  object-fit: contain;
  display: block;
  box-shadow: 0 20px 80px rgba(0,0,0,0.5);
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.5s var(--ease-out), opacity 0.5s var(--ease-out);
}

.lb.open .lb-img {
  transform: scale(1);
  opacity: 1;
}

.lb-caption {
  text-align: center;
  display: flex;
  gap: 1.2rem;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: center;
}

.lb-title {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 1.2rem;
  color: rgba(255,255,255,0.85);
}

.lb-meta {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.35);
}

.lb-size {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.2);
}

.lb-close, .lb-prev, .lb-next {
  position: absolute;
  color: rgba(255,255,255,0.4);
  font-size: 1rem;
  padding: 0.75rem;
  transition: color 0.2s;
  line-height: 1;
}

.lb-close:hover, .lb-prev:hover, .lb-next:hover {
  color: rgba(255,255,255,0.9);
}

.lb-close { top: 1.5rem; right: 1.5rem; font-size: 1rem; }
.lb-prev  { left: 1rem;  top: 50%; transform: translateY(-50%); font-size: 1.3rem; }
.lb-next  { right: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.3rem; }


/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL UTILITY
══════════════════════════════════════════════════════════════ */
.will-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out);
}

.will-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}


/* ══════════════════════════════════════════════════════════════
   RESPONSIVE — tablet ≤ 960px
══════════════════════════════════════════════════════════════ */
@media (max-width: 960px) {
  .sketchbook-scatter {
    columns: 2;
  }
}


/* ══════════════════════════════════════════════════════════════
   RESPONSIVE — mobile ≤ 700px
══════════════════════════════════════════════════════════════ */
@media (max-width: 700px) {
  /* Nav */
  .nav-links {
    position: fixed;
    inset: 0;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.2rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: 90;
  }

  .nav-links a {
    font-size: 1rem;
    letter-spacing: 0.16em;
    color: var(--ink);
  }

  .nav.open .nav-links {
    opacity: 1;
    pointer-events: all;
  }

  .nav-burger {
    display: flex;
    position: relative;
    z-index: 92;
  }

  /* Featured */
  .featured-caption {
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Sketchbook */
  .sketchbook-scatter {
    columns: 1;
  }

  /* Contact */
  .contact-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
  .contact-label { width: auto; }

  /* Lightbox */
  .lb-prev { left: 0.25rem; }
  .lb-next { right: 0.25rem; }
  .lb-caption { flex-direction: column; gap: 0.3rem; align-items: center; }
}
