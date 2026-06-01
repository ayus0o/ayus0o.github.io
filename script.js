/*  IVAN AYUSO — script.js
    Escrito para máxima compatibilidad móvil:
    iOS Safari 12+, Android Chrome, desktop.
    Sin arrow functions. Sin const/let. Sin pointer events.
    Touch events nativos para swipe en móvil.
*/

/* ─── 1. AÑO EN FOOTER ─────────────────────────────────────── */
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


/* ─── 3. MENÚ HAMBURGUESA ────────────────────────────────────── */
var burger  = document.getElementById('navBurger');
var overlay = document.getElementById('mobileOverlay');
var mLinks  = document.getElementById('mobileLinks');
var menuOpen = false;

function openMenu() {
  menuOpen = true;
  burger.classList.add('open');
  overlay.style.display = 'flex';
  /* void para forzar reflow — necesario para que la transición CSS funcione */
  void overlay.offsetWidth;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  burger.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  /* esconder después de que termine la transición */
  setTimeout(function () {
    if (!menuOpen) { overlay.style.display = 'none'; }
  }, 400);
}

/* touchstart: respuesta inmediata en iOS sin delay de 300ms */
burger.addEventListener('touchstart', function (e) {
  e.preventDefault();
  if (menuOpen) { closeMenu(); } else { openMenu(); }
}, { passive: false });

/* click: fallback para desktop */
burger.addEventListener('click', function () {
  if (menuOpen) { closeMenu(); } else { openMenu(); }
});

/* Cerrar al tocar un link */
if (mLinks) {
  var mlA = mLinks.querySelectorAll('a');
  for (var i = 0; i < mlA.length; i++) {
    mlA[i].addEventListener('touchstart', function () { closeMenu(); }, { passive: true });
    mlA[i].addEventListener('click',      function () { closeMenu(); });
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
  var sels = ['.works-header','.sketchbook-header','.about-inner','.contact-inner'];
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


/* ─── 6. CARRUSEL ───────────────────────────────────────────────
   El navegador maneja el swipe nativo en móvil gracias a
   overflow-x: scroll + scroll-snap. Nosotros solo manejamos:
   • barra de progreso
   • botones de flecha
   • drag con mouse en desktop
────────────────────────────────────────────────────────────── */
(function () {
  var track   = document.getElementById('track');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var barFill = document.getElementById('carouselBarFill');
  if (!track) { return; }

  function updateBar() {
    if (!barFill) { return; }
    var max = track.scrollWidth - track.clientWidth;
    barFill.style.width = (max > 0 ? (track.scrollLeft / max) * 100 : 0) + '%';
  }

  function updateBtns() {
    if (prevBtn) { prevBtn.disabled = track.scrollLeft < 4; }
    if (nextBtn) { nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4; }
  }

  /* Scroll listener — rAF throttled */
  var raf = null;
  function onTrackScroll() {
    if (raf) { return; }
    raf = requestAnimationFrame(function () {
      raf = null;
      updateBar();
      updateBtns();
    });
  }
  track.addEventListener('scroll', onTrackScroll, { passive: true });

  /* Flechas — click y touchstart */
  function attachArrow(btn, dir) {
    if (!btn) { return; }
    function fire(e) {
      if (e.type === 'touchstart') { e.preventDefault(); }
      track.scrollBy({ left: dir * track.clientWidth * 0.82, behavior: 'smooth' });
    }
    btn.addEventListener('touchstart', fire, { passive: false });
    btn.addEventListener('click', fire);
  }
  attachArrow(prevBtn, -1);
  attachArrow(nextBtn,  1);

  updateBar();
  updateBtns();

  /* Drag con mouse (solo desktop) */
  var dragging = false;
  var mx0 = 0, sl0 = 0, mdx = 0;

  track.addEventListener('mousedown', function (e) {
    if (e.button !== 0) { return; }
    dragging = true; mx0 = e.clientX; sl0 = track.scrollLeft; mdx = 0;
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
  });
  /* Evitar que drag abra lightbox */
  track.addEventListener('click', function (e) {
    if (Math.abs(mdx) > 8) { e.stopPropagation(); mdx = 0; }
  }, true);
}());


/* ─── 7. LIGHTBOX ───────────────────────────────────────────────
   Abre al tap/click en .card o .sk-item.
   Swipe horizontal para ir a la imagen siguiente/anterior.
   Distingue tap de swipe para no abrir accidentalmente.
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

  /* Construir lista de items */
  var items = [];
  var cardEls   = document.querySelectorAll('.card');
  var sketchEls = document.querySelectorAll('.sk-item');

  for (var ci = 0; ci < cardEls.length; ci++) {
    var cimg = cardEls[ci].querySelector('img');
    items.push({
      src:    cimg ? cimg.src : '',
      title:  cardEls[ci].getAttribute('data-title')  || '',
      medium: cardEls[ci].getAttribute('data-medium') || ''
    });
  }
  for (var si = 0; si < sketchEls.length; si++) {
    items.push({ src: sketchEls[si].src, title: '', medium: '' });
  }

  var current = 0;

  function lbOpen(index) {
    current = Math.max(0, Math.min(index, items.length - 1));
    var item = items[current];
    lbImg.style.opacity   = '0';
    lbImg.style.transform = 'scale(0.94)';
    lbImg.src = item.src;
    lbImg.alt = item.title;
    if (lbTitleEl) { lbTitleEl.textContent = item.title; }
    if (lbMetaEl)  { lbMetaEl.textContent  = item.medium; }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lbImg.style.opacity   = '';
        lbImg.style.transform = '';
      });
    });
  }

  function lbClose() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function lbGo(dir) { lbOpen((current + dir + items.length) % items.length); }

  /* ── Attach a las cards ──
     Usamos touchend para detectar tap limpio vs swipe en móvil.
     swipeDx guarda el desplazamiento horizontal del toque.
  ── */
  var swipeDx = 0;

  function attachItem(el, index) {
    el.style.cursor = 'pointer';

    el.addEventListener('touchstart', function (e) {
      swipeDx = e.touches[0].clientX;
    }, { passive: true });

    el.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeDx;
      /* Solo abrir si no fue un swipe (< 12px de movimiento) */
      if (Math.abs(dx) < 12) {
        e.preventDefault();
        lbOpen(index);
      }
    }, { passive: false });

    /* click para desktop */
    el.addEventListener('click', function () { lbOpen(index); });
  }

  for (var cai = 0; cai < cardEls.length; cai++) {
    attachItem(cardEls[cai], cai);
  }
  var skOff = cardEls.length;
  for (var sai = 0; sai < sketchEls.length; sai++) {
    attachItem(sketchEls[sai], skOff + sai);
  }

  /* ── Controles del lightbox ── */
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

  /* ── Swipe dentro del lightbox ── */
  var lbTx = 0;
  lb.addEventListener('touchstart', function (e) {
    lbTx = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - lbTx;
    if (Math.abs(dx) > 50) { lbGo(dx < 0 ? 1 : -1); }
  }, { passive: true });
}());
