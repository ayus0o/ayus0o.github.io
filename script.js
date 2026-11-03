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
  var sels = ['.contact-inner'];
  for (var i = 0; i < sels.length; i++) {
    var found = document.querySelectorAll(sels[i]);
    for (var j = 0; j < found.length; j++) { found[j].classList.add('will-reveal'); }
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


/* ─── 6. WORK SLIDES — scroll reveal ────────────────────────────
   Each .work-slide fades in as the user scrolls to it.
   Uses IntersectionObserver for performance.
────────────────────────────────────────────────────────────── */
(function () {
  var slides = document.querySelectorAll('.work-slide');
  if (!slides.length) { return; }

  if (!window.IntersectionObserver) {
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.add('visible');
    }
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('visible');
        /* keep observing so re-entering also triggers */
      }
    }
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  for (var j = 0; j < slides.length; j++) {
    io.observe(slides[j]);
  }
}());


/* ─── 7. LIGHTBOX — work images (click to enlarge) ──────────────
   Clicking an artwork image opens it fullscreen in the garnet lightbox.
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
  var imgWraps = document.querySelectorAll('.work-img-wrap img');

  for (var wi = 0; wi < imgWraps.length; wi++) {
    var slide = imgWraps[wi].closest('.work-slide');
    items.push({
      src:    imgWraps[wi].src,
      title:  slide ? (slide.querySelector('.work-title') ? slide.querySelector('.work-title').textContent : '') : '',
      medium: slide ? (slide.querySelector('.work-medium') ? slide.querySelector('.work-medium').textContent : '') : '',
    });
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

  /* Attach click to each work image */
  var swipeDx = 0;
  for (var ai = 0; ai < imgWraps.length; ai++) {
    (function (index) {
      var el = imgWraps[index];
      el.style.cursor = 'zoom-in';
      el.addEventListener('touchstart', function (e) {
        swipeDx = e.touches[0].clientX;
      }, { passive: true });
      el.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - swipeDx;
        if (Math.abs(dx) < 12) { e.preventDefault(); lbOpen(index); }
      }, { passive: false });
      el.addEventListener('click', function () { lbOpen(index); });
    }(ai));
  }

  function attachBtn(btn, fn) {
    if (!btn) { return; }
    btn.addEventListener('touchstart', function (e) { e.preventDefault(); fn(); }, { passive: false });
    btn.addEventListener('click', fn);
  }
  attachBtn(lbCloseBtn, lbClose);
  attachBtn(lbPrevBtn,  function () { lbGo(-1); });
  attachBtn(lbNextBtn,  function () { lbGo(+1); });

  lb.addEventListener('click', function (e) { if (e.target === lb) { lbClose(); } });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) { return; }
    if (e.key === 'Escape')     { lbClose(); }
    if (e.key === 'ArrowLeft')  { lbGo(-1); }
    if (e.key === 'ArrowRight') { lbGo(+1); }
  });

  var lbTx = 0;
  lb.addEventListener('touchstart', function (e) { lbTx = e.touches[0].clientX; }, { passive: true });
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
