/*  IVAN AYUSO — script.js
    iOS Safari 12+, Android Chrome, desktop.
    Sin arrow functions. Sin const/let.
*/

/* ─── 1. FOOTER YEAR ────────────────────────────────────────── */
var yrEl = document.getElementById('yr');
if (yrEl) { yrEl.textContent = new Date().getFullYear(); }


/* ─── 2. NAV SCROLL ─────────────────────────────────────────── */
var nav = document.getElementById('nav');
window.addEventListener('scroll', function () {
  if (window.pageYOffset > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });


/* ─── 3. HAMBURGER MENU ──────────────────────────────────────── */
var burger   = document.getElementById('navBurger');
var overlay  = document.getElementById('mobileOverlay');
var mLinks   = document.getElementById('mobileLinks');
var menuOpen = false;

function openMenu() {
  menuOpen = true;
  burger.classList.add('open');
  overlay.style.display = 'flex';
  void overlay.offsetWidth; /* force reflow for CSS transition */
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  burger.classList.remove('open');
  overlay.classList.remove('open');
  overlay.style.pointerEvents = 'none';
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  setTimeout(function () {
    if (!menuOpen) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = '';
    }
  }, 400);
}

burger.addEventListener('touchstart', function (e) {
  e.preventDefault();
  if (menuOpen) { closeMenu(); } else { openMenu(); }
}, { passive: false });

burger.addEventListener('click', function () {
  if (menuOpen) { closeMenu(); } else { openMenu(); }
});

if (mLinks) {
  var mlA = mLinks.querySelectorAll('a');
  for (var i = 0; i < mlA.length; i++) {
    mlA[i].addEventListener('touchstart', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      closeMenu();
      setTimeout(function () {
        var target = href ? document.querySelector(href) : null;
        if (target) {
          var offset = nav ? nav.offsetHeight + 8 : 8;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 50);
    }, { passive: false });

    mlA[i].addEventListener('click', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      closeMenu();
      setTimeout(function () {
        var target = href ? document.querySelector(href) : null;
        if (target) {
          var offset = nav ? nav.offsetHeight + 8 : 8;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 50);
    });
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && menuOpen) { closeMenu(); }
});


/* ─── 4. SMOOTH SCROLL ──────────────────────────────────────── */
var anchorEls = document.querySelectorAll('a[href^="#"]');
for (var ai = 0; ai < anchorEls.length; ai++) {
  anchorEls[ai].addEventListener('click', function (e) {
    var id = this.getAttribute('href');
    if (!id || id === '#') { return; }
    var target = document.querySelector(id);
    if (!target) { return; }
    e.preventDefault();
    var offset = nav ? nav.offsetHeight + 8 : 8;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}


/* ─── 5. SCROLL REVEAL ──────────────────────────────────────── */
(function () {
  var sels = ['.works-header', '.sketchbook-header', '.contact-inner'];
  for (var i = 0; i < sels.length; i++) {
    var found = document.querySelectorAll(sels[i]);
    for (var j = 0; j < found.length; j++) { found[j].classList.add('will-reveal'); }
  }
  var sk = document.querySelectorAll('.sk-item');
  for (var k = 0; k < sk.length; k++) {
    sk[k].classList.add('will-reveal');
    sk[k].style.transitionDelay = ((k % 6) * 0.07) + 's';
  }
  if (!window.IntersectionObserver) {
    var all = document.querySelectorAll('.will-reveal');
    for (var m = 0; m < all.length; m++) { all[m].classList.add('revealed'); }
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    for (var n = 0; n < entries.length; n++) {
      if (entries[n].isIntersecting) {
        entries[n].target.classList.add('revealed');
        io.unobserve(entries[n].target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  var rv = document.querySelectorAll('.will-reveal');
  for (var r = 0; r < rv.length; r++) { io.observe(rv[r]); }
}());


/* ─── 6. CAROUSEL ───────────────────────────────────────────────
   Cards are now full-screen width.
   Arrows scroll exactly one card width (100% of card).
   Swipe handled natively by the browser via scroll-snap.
   Drag-to-scroll on desktop.
────────────────────────────────────────────────────────────── */
(function () {
  var track   = document.getElementById('track');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var barFill = document.getElementById('carouselBarFill');
  if (!track) { return; }

  var cards = track.querySelectorAll('.card');
  var cardCount = cards.length;

  /* Progress bar */
  function updateBar() {
    if (!barFill) { return; }
    var max = track.scrollWidth - track.clientWidth;
    barFill.style.width = (max > 0 ? (track.scrollLeft / max) * 100 : 0) + '%';
  }

  function updateBtns() {
    if (prevBtn) { prevBtn.disabled = track.scrollLeft < 4; }
    if (nextBtn) { nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4; }
  }

  /* Scroll to a specific card index */
  function scrollToCard(index) {
    if (index < 0) { index = 0; }
    if (index >= cardCount) { index = cardCount - 1; }
    var card = cards[index];
    if (!card) { return; }
    /* Scroll so the card's left edge aligns with track's left edge */
    var trackLeft = track.getBoundingClientRect().left;
    var cardLeft  = card.getBoundingClientRect().left;
    var scrollBy  = cardLeft - trackLeft;
    track.scrollBy({ left: scrollBy, behavior: 'smooth' });
  }

  /* Find which card is currently most visible */
  function currentCardIndex() {
    var trackLeft = track.getBoundingClientRect().left;
    var closest = 0;
    var closestDist = Infinity;
    for (var i = 0; i < cardCount; i++) {
      var dist = Math.abs(cards[i].getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    }
    return closest;
  }

  /* Arrows — jump exactly one card */
  function attachArrow(btn, dir) {
    if (!btn) { return; }
    function fire(e) {
      if (e.type === 'touchstart') { e.preventDefault(); }
      scrollToCard(currentCardIndex() + dir);
    }
    btn.addEventListener('touchstart', fire, { passive: false });
    btn.addEventListener('click', fire);
  }
  attachArrow(prevBtn, -1);
  attachArrow(nextBtn,  1);

  /* Update bar + buttons on scroll */
  var raf = null;
  track.addEventListener('scroll', function () {
    if (raf) { return; }
    raf = requestAnimationFrame(function () {
      raf = null;
      updateBar();
      updateBtns();
    });
  }, { passive: true });

  /* Also update after touch ends (snap may still be settling) */
  track.addEventListener('touchend', function () {
    setTimeout(function () { updateBar(); updateBtns(); }, 350);
  }, { passive: true });

  updateBar();
  updateBtns();

  /* Drag-to-scroll on desktop */
  var dragging = false;
  var mx0 = 0, sl0 = 0, mdx = 0;

  track.addEventListener('mousedown', function (e) {
    if (e.button !== 0) { return; }
    dragging = true;
    mx0 = e.clientX; sl0 = track.scrollLeft; mdx = 0;
    track.style.cursor = 'grabbing';
    track.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) { return; }
    mdx = e.clientX - mx0;
    track.scrollLeft = sl0 - mdx;
  });

  document.addEventListener('mouseup', function () {
    if (!dragging) { return; }
    dragging = false;
    track.style.cursor = '';
    track.style.userSelect = '';
    /* Snap to nearest card after drag */
    scrollToCard(currentCardIndex());
  });

  /* Prevent accidental lightbox open after drag */
  track.addEventListener('click', function (e) {
    if (Math.abs(mdx) > 8) { e.stopPropagation(); mdx = 0; }
  }, true);
}());


/* ─── 7. LIGHTBOX ───────────────────────────────────────────────
   Opens on click/tap of .sk-item (sketchbook images only).
   Carousel cards are now full-screen — no lightbox needed for them.
   Swipe left/right inside lightbox to navigate.
────────────────────────────────────────────────────────────── */
(function () {
  var lb         = document.getElementById('lb');
  var lbImg      = document.getElementById('lbImg');
  var lbTitleEl  = document.getElementById('lbTitle');
  var lbMetaEl   = document.getElementById('lbMeta');
  var lbCloseBtn = document.getElementById('lbClose');
  var lbPrevBtn  = document.getElementById('lbPrev');
  var lbNextBtn  = document.getElementById('lbNext');
  if (!lb || !lbImg) { return; }

  var items = [];
  var sketchEls = document.querySelectorAll('.sk-item');

  for (var si = 0; si < sketchEls.length; si++) {
    items.push({ src: sketchEls[si].src, title: '', medium: '' });
  }

  var current = 0;

  function lbOpen(index) {
    current = Math.max(0, Math.min(index, items.length - 1));
    var item = items[current];
    lbImg.style.opacity = '0';
    lbImg.src = item.src;
    lbImg.alt = item.title;
    if (lbTitleEl) { lbTitleEl.textContent = item.title; }
    if (lbMetaEl)  { lbMetaEl.textContent  = item.medium; }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { lbImg.style.opacity = ''; });
    });
  }

  function lbClose() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function lbGo(dir) { lbOpen((current + dir + items.length) % items.length); }

  /* Attach to sketchbook images */
  var swipeDx = 0;
  for (var sai = 0; sai < sketchEls.length; sai++) {
    (function (index) {
      var el = sketchEls[index];
      el.style.cursor = 'pointer';
      el.addEventListener('touchstart', function (e) {
        swipeDx = e.touches[0].clientX;
      }, { passive: true });
      el.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - swipeDx;
        if (Math.abs(dx) < 12) { e.preventDefault(); lbOpen(index); }
      }, { passive: false });
      el.addEventListener('click', function () { lbOpen(index); });
    }(sai));
  }

  /* Lightbox controls */
  function attachLbBtn(btn, fn) {
    if (!btn) { return; }
    btn.addEventListener('touchstart', function (e) { e.preventDefault(); fn(); }, { passive: false });
    btn.addEventListener('click', fn);
  }
  attachLbBtn(lbCloseBtn, lbClose);
  attachLbBtn(lbPrevBtn,  function () { lbGo(-1); });
  attachLbBtn(lbNextBtn,  function () { lbGo(+1); });

  lb.addEventListener('click', function (e) { if (e.target === lb) { lbClose(); } });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) { return; }
    if (e.key === 'Escape')     { lbClose(); }
    if (e.key === 'ArrowLeft')  { lbGo(-1); }
    if (e.key === 'ArrowRight') { lbGo(+1); }
  });

  /* Swipe inside lightbox */
  var lbTx = 0;
  lb.addEventListener('touchstart', function (e) {
    lbTx = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - lbTx;
    if (Math.abs(dx) > 50) { lbGo(dx < 0 ? 1 : -1); }
  }, { passive: true });
}());


/* ─── 8. LANGUAGE SWITCH ─────────────────────────────────────────
   Toggles all data-es / data-en attributes across the page.
   Default: Spanish. Toggle switches to English and back.
   Prices: MXN ↔ USD at fixed rate of 17 MXN = 1 USD.
────────────────────────────────────────────────────────────── */
(function () {
  var langToggle = document.getElementById('langToggle');
  if (!langToggle) { return; }

  var langEs  = langToggle.querySelector('.lang-es');
  var langEn  = langToggle.querySelector('.lang-en');
  var current = 'es'; /* default: Spanish */

  function switchLang(lang) {
    current = lang;

    /* Update toggle appearance */
    if (lang === 'en') {
      langEs.classList.remove('lang-active');
      langEs.classList.add('lang-inactive');
      langEn.classList.add('lang-active');
      langEn.classList.remove('lang-inactive');
      document.documentElement.lang = 'en';
    } else {
      langEn.classList.remove('lang-active');
      langEn.classList.add('lang-inactive');
      langEs.classList.add('lang-active');
      langEs.classList.remove('lang-inactive');
      document.documentElement.lang = 'es';
    }

    /* Switch all elements that have data-es and data-en */
    var els = document.querySelectorAll('[data-es][data-en]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
      if (val !== null) {
        el.textContent = val;
      }
    }

    /* Switch nav link text separately (they have href so textContent = just text node) */
    var navLinks = document.querySelectorAll('a[data-es][data-en]');
    for (var j = 0; j < navLinks.length; j++) {
      var a = navLinks[j];
      a.textContent = lang === 'en' ? a.getAttribute('data-en') : a.getAttribute('data-es');
    }
  }

  langToggle.addEventListener('click', function () {
    switchLang(current === 'es' ? 'en' : 'es');
  });

  langToggle.addEventListener('touchstart', function (e) {
    e.preventDefault();
    switchLang(current === 'es' ? 'en' : 'es');
  }, { passive: false });

  /* Init — set ES as active */
  langEs.classList.add('lang-active');
  langEn.classList.add('lang-inactive');
}());
