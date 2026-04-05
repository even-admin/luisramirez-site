/* ============================================
   luisracosta.com V3 — app.js
   GSAP + ScrollTrigger + Lenis
   Clock, lottery, nav, scroll reveals,
   hardware parallax, copy email, newsletter
   ============================================ */

(function () {
  'use strict';

  // ── Lenis Smooth Scroll ───────────────────

  var lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.1, smooth: true });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ── Preloader ─────────────────────────────

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) { runEntrance(); return; }

    setTimeout(function () {
      preloader.classList.add('fade-out');
      setTimeout(function () {
        preloader.remove();
        runEntrance();
      }, 400);
    }, 800);
  }

  // ── Hero Entrance (GSAP staggered) ────────

  function runEntrance() {
    var items = document.querySelectorAll('.hero-anim');
    if (!items.length || typeof gsap === 'undefined') {
      // Fallback: show everything
      items.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      startCoordLottery();
      return;
    }

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      delay: 0.1,
      onComplete: function () {
        startCoordLottery();
      }
    });
  }

  // ── Coordinate Lottery ────────────────────

  function startCoordLottery() {
    var el = document.getElementById('coordinates');
    if (!el) return;

    var finalText = '20.9674\u00B0 N, 89.5926\u00B0 W';
    var chars = '0123456789';
    var steps = 20;
    var step = 0;

    var interval = setInterval(function () {
      el.textContent = finalText.split('').map(function (c, i) {
        if (!/[0-9]/.test(c)) return c;
        var lock = (step / steps) * finalText.length;
        return i < lock ? c : chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      step++;
      if (step > steps) {
        clearInterval(interval);
        el.textContent = finalText;
      }
    }, 40);
  }

  // ── Live Clock ────────────────────────────

  function initClock() {
    var el = document.getElementById('clock');
    if (!el) return;

    function tick() {
      try {
        el.textContent = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Merida',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        }).format(new Date());
      } catch (e) {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── Dark Mode ─────────────────────────────

  function initTheme() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    var stored = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', stored);

    toggle.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ── Sticky Nav (show on scroll past hero) ─

  function initNav() {
    var nav = document.getElementById('site-nav');
    var hero = document.getElementById('hero');
    if (!nav || !hero || typeof ScrollTrigger === 'undefined') return;

    // Show/hide nav
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: function () { nav.classList.add('visible'); },
      onLeaveBack: function () { nav.classList.remove('visible'); }
    });

    // Active section highlighting
    var links = document.querySelectorAll('.nav-link');
    var sections = ['about', 'setup', 'work', 'writing', 'newsletter'];

    sections.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: function () { setActiveNav(id); },
        onEnterBack: function () { setActiveNav(id); }
      });
    });

    function setActiveNav(id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }

    // Smooth scroll for nav links
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(link.getAttribute('data-section'));
        if (target && lenis) {
          lenis.scrollTo(target, { offset: -60 });
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── Scroll Reveal Animations (GSAP) ───────

  function initScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }

    // Generic data-animate elements per section
    document.querySelectorAll('.section').forEach(function (section) {
      var children = section.querySelectorAll('[data-animate]');
      if (!children.length) return;

      gsap.to(children, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1
      });
    });
  }

  // ── Hardware Parallax ─────────────────────

  function initHardwareParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.innerWidth < 768) return; // Skip on mobile

    ['hw-mini', 'hw-mbp'].forEach(function (id) {
      var showcase = document.getElementById(id);
      if (!showcase) return;

      var img = showcase.querySelector('.hw-image');
      if (!img) return;

      // Parallax: image moves slower than surrounding content
      gsap.to(img, {
        scrollTrigger: {
          trigger: showcase,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        },
        y: -40,
        ease: 'none'
      });
    });
  }

  // ── Copy Email ────────────────────────────

  function initCopyEmail() {
    var btn = document.getElementById('copy-email');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('contacto@luisracosta.com').then(function () {
          showToast('Copied');
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = 'contacto@luisracosta.com';
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied');
      }
    });
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('visible'); });
    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  // ── Newsletter ────────────────────────────

  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email-input').value.trim();
      if (!email || email.indexOf('@') === -1) return;

      try {
        var subs = JSON.parse(localStorage.getItem('newsletter_subs') || '[]');
        if (subs.indexOf(email) === -1) subs.push(email);
        localStorage.setItem('newsletter_subs', JSON.stringify(subs));
      } catch (err) {}

      document.getElementById('form-row').hidden = true;
      document.getElementById('newsletter-success').hidden = false;
    });
  }

  // ── Init ──────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initClock();
    initLenis();

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initPreloader();
    initNav();
    initScrollReveals();
    initHardwareParallax();
    initCopyEmail();
    initNewsletter();
  });

})();
