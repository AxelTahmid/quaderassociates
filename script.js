/* =============================================
   QUADER ASSOCIATES — script.js
   ============================================= */

(function () {
  'use strict';

  /* ── Language Toggle ── */
  let currentLang = 'en';

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    document.body.classList.toggle('bn', lang === 'bn');

    document.querySelectorAll('[data-en]').forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (!text) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.innerHTML.includes('<br>') || el.innerHTML.includes('<svg')) {
        // preserve inner HTML structure, only update text nodes
        const span = el.querySelector('span[data-en]');
        if (!span) el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // lang button label swap
    const btn = document.getElementById('langToggle');
    if (btn) {
      const en = btn.querySelector('.lang-en');
      const bn = btn.querySelector('.lang-bn');
      if (en && bn) {
        en.style.display = lang === 'en' ? 'inline' : 'none';
        bn.style.display = lang === 'bn' ? 'inline' : 'none';
      }
    }

    // re-apply innerHTML for hero title (has <br>)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const txt = heroTitle.getAttribute('data-' + lang);
      if (txt) heroTitle.innerHTML = txt;
    }

    localStorage.setItem('qa-lang', lang);
  }

  document.getElementById('langToggle').addEventListener('click', function () {
    applyLang(currentLang === 'en' ? 'bn' : 'en');
  });

  // Restore saved language
  const saved = localStorage.getItem('qa-lang');
  if (saved && saved !== 'en') applyLang(saved);


  /* ── Sticky Navbar ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ── Mobile Menu ── */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ── Counter Animation ── */
  function animateCounter(el, target, duration) {
    var start = 0;
    var step  = Math.ceil(target / (duration / 16));
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start.toLocaleString();
    }, 16);
  }

  var countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    var statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    var rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
        animateCounter(el, parseInt(el.dataset.target, 10), 1600);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters(); // in case already visible on load


  /* ── Scroll Reveal (fade-up) ── */
  var animatedEls = [];

  function collectFadeTargets() {
    var selectors = [
      '.service-card',
      '.dest-card',
      '.step',
      '.emp-card',
      '.contact-item',
      '.cred-badge',
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fade-up');
        animatedEls.push(el);
      });
    });
  }

  function revealOnScroll() {
    animatedEls.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  collectFadeTargets();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // reveal anything already in view


  /* ── Smooth scroll for older browsers ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = navbar ? navbar.offsetHeight : 0;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── Active nav link highlight ── */
  var sections = document.querySelectorAll('section[id], div[id]');
  var links    = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    var scrollY = window.scrollY + 100;
    var active  = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) active = sec.id;
    });
    links.forEach(function (a) {
      a.style.color = a.getAttribute('href') === '#' + active
        ? 'var(--gold-light)'
        : '';
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

})();
