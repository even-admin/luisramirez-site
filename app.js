/* ============================================
   luisracosta.com — iOS Product Launch Feel
   GSAP + ScrollTrigger + Lenis
   Desktop: cinematic scroll reveals
   Mobile: untouched, free scroll
   ============================================ */

(function () {
  'use strict';

  var lenis;
  var isDesktop = window.innerWidth >= 768;

  // ── Lenis Smooth Scroll ───────────────────

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      lerp: isDesktop ? 0.1 : 0.12,
      smoothWheel: true,
      touchMultiplier: isDesktop ? 1 : 1.5
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
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

  // ── Hero Entrance ─────────────────────────

  function runEntrance() {
    var items = document.querySelectorAll('.hero-anim');
    if (!items.length || typeof gsap === 'undefined') {
      items.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      startCoordLottery();
      return;
    }

    gsap.to(items, {
      opacity: 1, y: 0,
      duration: isDesktop ? 0.8 : 0.6,
      ease: 'power3.out',
      stagger: isDesktop ? 0.18 : 0.12,
      delay: 0.15,
      onComplete: startCoordLottery
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
      if (step > steps) { clearInterval(interval); el.textContent = finalText; }
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
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
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

  // ── Sticky Nav ────────────────────────────

  function initNav() {
    var nav = document.getElementById('site-nav');
    var hero = document.getElementById('hero');
    if (!nav || !hero || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: hero, start: 'bottom top',
      onEnter: function () { nav.classList.add('visible'); },
      onLeaveBack: function () { nav.classList.remove('visible'); }
    });

    var links = document.querySelectorAll('.nav-link');
    var sections = ['about', 'setup', 'work', 'writing', 'newsletter'];

    sections.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section, start: 'top center', end: 'bottom center',
        onEnter: function () { setActiveNav(id); },
        onEnterBack: function () { setActiveNav(id); }
      });
    });

    function setActiveNav(id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        nav.classList.remove('nav-open');
        var target = document.getElementById(link.getAttribute('data-section'));
        if (target && lenis) lenis.scrollTo(target, { offset: -60 });
        else if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    var panelLinks = document.querySelectorAll('.nav-panel .nav-link');
    panelLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        nav.classList.remove('nav-open');
        var target = document.getElementById(link.getAttribute('data-section'));
        if (target && lenis) lenis.scrollTo(target, { offset: -60 });
        else if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ── Hamburger ─────────────────────────────

  function initHamburger() {
    var btn = document.getElementById('nav-hamburger');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () { nav.classList.toggle('nav-open'); });
  }

  // ── Scroll Progress ───────────────────────

  function initScrollProgress() {
    var fill = document.getElementById('scroll-fill');
    if (!fill) return;
    window.addEventListener('scroll', function () {
      var pct = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      fill.style.height = Math.min(pct, 100) + '%';
    });
  }

  // ── Section Animations ────────────────────

  function initSectionAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }

    // Section label fade-in
    document.querySelectorAll('.section').forEach(function (section) {
      ScrollTrigger.create({
        trigger: section, start: 'top 80%', once: true,
        onEnter: function () { section.classList.add('visible'); }
      });
    });

    if (isDesktop) {
      initDesktopAnimations();
    } else {
      initMobileAnimations();
    }
  }

  // ── MOBILE: Simple, fast, no drama ────────

  function initMobileAnimations() {
    document.querySelectorAll('.section').forEach(function (section) {
      var items = section.querySelectorAll('[data-animate]');
      if (!items.length) return;
      gsap.to(items, {
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        opacity: 1, y: 0, x: 0, scale: 1, rotation: 0,
        duration: 0.5, ease: 'power2.out', stagger: 0.06
      });
    });
  }

  // ── DESKTOP: iOS product launch reveals ───

  function initDesktopAnimations() {

    // About — slow cinematic paragraph reveals
    var aboutItems = document.querySelectorAll('#about [data-animate]');
    if (aboutItems.length) {
      gsap.to(aboutItems, {
        scrollTrigger: { trigger: '#about', start: 'top 75%', once: true },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2
      });
    }

    // Setup intro
    var setupIntro = document.querySelector('.setup-intro[data-animate]');
    if (setupIntro) {
      gsap.to(setupIntro, {
        scrollTrigger: { trigger: setupIntro, start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
      });
    }

    // Hardware images — big cinematic scale reveal
    document.querySelectorAll('.hw-image[data-animate]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        opacity: 1, scale: 1, y: 0,
        duration: 1.2, ease: 'power3.out'
      });
    });

    // Hardware names — slide up with clip reveal feel
    document.querySelectorAll('.hw-name[data-animate]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out'
      });
    });

    // Hardware taglines — gentle fade after name
    document.querySelectorAll('.hw-tagline[data-animate]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 1, x: 0, duration: 0.7, ease: 'power2.out', delay: 0.15
      });
    });

    // Hardware specs — each row cascades in like a typewriter
    document.querySelectorAll('.hw-specs[data-animate]').forEach(function (specsBlock) {
      var rows = specsBlock.querySelectorAll('.spec-row');
      gsap.fromTo(rows,
        { opacity: 0, x: 15 },
        {
          scrollTrigger: { trigger: specsBlock, start: 'top 80%', once: true },
          opacity: 1, x: 0,
          duration: 0.5, ease: 'power2.out', stagger: 0.1
        }
      );

      // "Replaces" highlight — slight scale pulse after specs land
      var highlight = specsBlock.querySelector('.spec-highlight');
      if (highlight) {
        gsap.fromTo(highlight,
          { scale: 1 },
          {
            scrollTrigger: { trigger: specsBlock, start: 'top 80%', once: true },
            scale: 1.03, duration: 0.3, ease: 'power2.out',
            delay: rows.length * 0.1 + 0.3,
            yoyo: true, repeat: 1
          }
        );
      }
    });

    // Subsection labels
    document.querySelectorAll('.subsection-label[data-animate]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
      });
    });

    // AI primary cards — scale up with slight rotation snap
    var aiCards = document.querySelectorAll('.ai-primary-grid [data-animate]');
    if (aiCards.length) {
      gsap.to(aiCards, {
        scrollTrigger: { trigger: '.ai-primary-grid', start: 'top 80%', once: true },
        opacity: 1, y: 0, scale: 1, duration: 0.8,
        ease: 'back.out(1.2)', stagger: 0.15
      });
    }

    // Logo grid cards — ripple from top-left
    document.querySelectorAll('.logo-grid').forEach(function (grid) {
      var cards = grid.querySelectorAll('[data-animate]');
      if (!cards.length) return;
      gsap.to(cards, {
        scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
        opacity: 1, y: 0, scale: 1,
        duration: 0.5, ease: 'back.out(1.4)', stagger: 0.05
      });
    });

    // Work card — confident slide up
    var workItems = document.querySelectorAll('#work [data-animate]');
    if (workItems.length) {
      gsap.to(workItems, {
        scrollTrigger: { trigger: '#work', start: 'top 78%', once: true },
        opacity: 1, y: 0, rotation: 0,
        duration: 0.9, ease: 'power3.out', stagger: 0.12
      });
    }

    // Writing — articles slide in from left, staggered
    var writingItems = document.querySelectorAll('#writing [data-animate]');
    if (writingItems.length) {
      gsap.to(writingItems, {
        scrollTrigger: { trigger: '#writing', start: 'top 78%', once: true },
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08
      });
    }

    // Newsletter — clean fade up
    var nlItems = document.querySelectorAll('#newsletter [data-animate]');
    if (nlItems.length) {
      gsap.to(nlItems, {
        scrollTrigger: { trigger: '#newsletter', start: 'top 78%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12
      });
    }
  }

  // ── Hardware Parallax (desktop only) ──────

  function initHardwareParallax() {
    if (!isDesktop || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ['hw-mini', 'hw-mbp'].forEach(function (id) {
      var showcase = document.getElementById(id);
      if (!showcase) return;
      var img = showcase.querySelector('.hw-image');
      if (!img) return;

      gsap.to(img, {
        scrollTrigger: { trigger: showcase, start: 'top bottom', end: 'bottom top', scrub: true },
        y: -40, ease: 'none'
      });
    });
  }

  // ── Copy Email ────────────────────────────

  function initCopyEmail() {
    var btn = document.getElementById('copy-email');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('contacto@luisracosta.com').then(function () { showToast('Copied'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = 'contacto@luisracosta.com';
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied');
      }
    });
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast'; toast.textContent = msg;
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

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();
    initPreloader();
    initNav();
    initHamburger();
    initScrollProgress();
    initSectionAnimations();
    initHardwareParallax();
    initCopyEmail();
    initNewsletter();
  });

})();
