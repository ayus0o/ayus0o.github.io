/* ═══════════════════════════════════════════════════════════════
   IVAN AYUSO — script.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Footer year ───────────────────────────────────────── */
  var yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();


  /* ── 2. Nav scroll ────────────────────────────────────────── */
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ── 3. Mobile menu ───────────────────────────────────────── */
  var burger  = document.getElementById('navBurger');
  var overlay = document.getElementById('mobileOverlay');
  var mLinks  = document.getElementById('mobileLinks');
  var menuOpen = false;

  function openMenu() {
    menuOpen = true;
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.style.display = 'flex';
    /* tiny timeout so display:flex is painted before opacity transition */
    setTimeout(function () {
      overlay.classList.add('open');
    }, 10);
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    /* hide after fade-out transition (350ms) */
    setTimeout(function () {
      if (!menuOpen) overlay.style.display = 'none';
    }, 380);
  }

  if (burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuOpen) { closeMenu(); } else { openMenu(); }
    });
  }

  if (mLinks) {
    mLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });


  /* ── 4. Smooth anchor scroll ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (nav ? nav.offsetHeight : 0) + 8;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── 5. Scroll reveal ─────────────────────────────────────── */
  try {
    var revealEls = document.querySelectorAll(
      '.works-header, .sketchbook-header, .about-inner, .contact-inner'
    );
    revealEls.forEach(function (el) { el.classList.add('will-reveal'); });

    document.querySelectorAll('.sk-item').forEach(function (el, i) {
      el.classList.add('will-reveal');
      el.style.transitionDelay = (i % 6) * 0.07 + 's';
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.will-reveal').forEach(function (el) {
        io.observe(el);
      });
    } else {
      /* Fallback for old browsers — just show everything */
      document.querySelectorAll('.will-reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  } catch (e) { /* reveal is non-critical, swallow errors */ }


  /* ── 6. Carousel ──────────────────────────────────────────── */
  try {
    var track   = document.getElementById('track');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var dotsEl  = document.getElementById('carouselDots');

    if (track && dotsEl) {
      var cards = Array.prototype.slice.call(track.querySelectorAll('.card'));

      /* Build dots */
      cards.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Artwork ' + (i + 1));
        dot.addEventListener('click', function () { scrollToCard(i); });
        dotsEl.appendChild(dot);
      });

      var dots = Array.prototype.slice.call(dotsEl.querySelectorAll('.carousel-dot'));

      function updateDots(index) {
        dots.forEach(function (d, i) {
          if (i === index) { d.classList.add('active'); }
          else             { d.classList.remove('active'); }
        });
      }

      function updateButtons() {
        if (prevBtn) prevBtn.disabled = track.scrollLeft < 4;
        if (nextBtn) nextBtn.disabled =
          track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
      }

      function scrollToCard(index) {
        var card = cards[Math.max(0, Math.min(index, cards.length - 1))];
        var padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        track.scrollTo({ left: card.offsetLeft - padLeft, behavior: 'smooth' });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -track.clientWidth * 0.82, behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: track.clientWidth * 0.82, behavior: 'smooth' });
        });
      }

      var rafId = null;
      track.addEventListener('scroll', function () {
        if (rafId) return;
        rafId = requestAnimationFrame(function () {
          rafId = null;
          updateButtons();
          var padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
          var closest = 0, closestDist = Infinity;
          cards.forEach(function (card, i) {
            var dist = Math.abs(card.offsetLeft - padLeft - track.scrollLeft);
            if (dist < closestDist) { closestDist = dist; closest = i; }
          });
          updateDots(closest);
        });
      }, { passive: true });

      updateButtons();

      /* Drag to scroll on desktop */
      var dragging = false, startX = 0, startScroll = 0;

      track.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        dragging    = true;
        startX      = e.clientX;
        startScroll = track.scrollLeft;
        track.style.cursor     = 'grabbing';
        track.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        track.scrollLeft = startScroll - (e.clientX - startX);
      });

      document.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        track.style.cursor     = '';
        track.style.userSelect = '';
      });

      /* Prevent click after drag */
      track.addEventListener('click', function (e) {
        if (Math.abs(track.scrollLeft - startScroll) > 5) {
          e.stopPropagation();
        }
      }, true);
    }
  } catch (e) { /* carousel non-critical */ }


  /* ── 7. Lightbox ──────────────────────────────────────────── */
  try {
    var lb      = document.getElementById('lb');
    var lbImg   = document.getElementById('lbImg');
    var lbTitle = document.getElementById('lbTitle');
    var lbMeta  = document.getElementById('lbMeta');
    var lbCloseBtn = document.getElementById('lbClose');
    var lbPrev  = document.getElementById('lbPrev');
    var lbNext  = document.getElementById('lbNext');

    if (!lb || !lbImg) throw new Error('Lightbox elements missing');

    var carouselCards = Array.prototype.slice.call(
      document.querySelectorAll('.card')
    );
    var sketchImgs = Array.prototype.slice.call(
      document.querySelectorAll('.sk-item')
    );

    var items = [];

    carouselCards.forEach(function (card) {
      var img = card.querySelector('img');
      items.push({
        src:    img ? img.src : '',
        title:  card.getAttribute('data-title')  || '',
        medium: card.getAttribute('data-medium') || ''
      });
    });

    sketchImgs.forEach(function (img) {
      items.push({ src: img.src, title: '', medium: '' });
    });

    var current = 0;

    function lbOpen(index) {
      current = Math.max(0, Math.min(index, items.length - 1));
      var item = items[current];

      lbImg.style.opacity   = '0';
      lbImg.style.transform = 'scale(0.94)';
      lbImg.src             = item.src;
      lbImg.alt             = item.title;
      if (lbTitle) lbTitle.textContent = item.title;
      if (lbMeta)  lbMeta.textContent  = item.medium;

      lb.classList.add('open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      /* Trigger CSS transition */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lbImg.style.opacity   = '';
          lbImg.style.transform = '';
        });
      });
    }

    function closeLightbox() {
      lb.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    function lbGo(dir) {
      lbOpen((current + dir + items.length) % items.length);
    }

    /* Attach click to every carousel card */
    carouselCards.forEach(function (card, i) {
      card.style.cursor = 'pointer';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', function () { lbOpen(i); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lbOpen(i);
        }
      });
    });

    /* Attach click to sketchbook images */
    sketchImgs.forEach(function (img, i) {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () {
        lbOpen(carouselCards.length + i);
      });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lbOpen(carouselCards.length + i);
        }
      });
    });

    if (lbCloseBtn) lbCloseBtn.addEventListener('click', lbClose);
    if (lbPrev)  lbPrev.addEventListener('click',  function () { lbGo(-1); });
    if (lbNext)  lbNext.addEventListener('click',  function () { lbGo(+1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lbGo(-1);
      if (e.key === 'ArrowRight') lbGo(+1);
    });

    /* Touch swipe inside lightbox */
    var touchStartX = 0;
    lb.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1);
    }, { passive: true });

  } catch (e) {
    console.error('Lightbox error:', e);
  }

})();
