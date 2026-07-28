/**
 * Wisdom Collectives LLP — Site Interactions
 * Handles: navbar scroll, mobile menu, scroll-reveal, smooth navigation
 */

(function () {
  'use strict';

  // ── Navbar Scroll Effect ──
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;

  function handleNavbarScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  // ── Mobile Menu Toggle ──
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  // ── Scroll-Reveal Animation ──
  // Using IntersectionObserver for maximum browser compatibility
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    // Check for native scroll-driven animation support
    const hasNativeSupport = CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

    if (!hasNativeSupport) {
      const revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // If native scroll-driven animations are supported, just show elements
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }


  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── Active Nav Link Highlighting ──
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0) {
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksAll.forEach(function (link) {
              link.style.color = '';
              if (link.getAttribute('href') === '#' + id) {
                link.style.color = 'var(--text-primary)';
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -40% 0px'
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }


  // ── Animated Counter (for hero stats) ──
  function animateCounter(element, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statElements = document.querySelectorAll('[data-count]');
  if (statElements.length > 0) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            animateCounter(entry.target, target, 2000);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statElements.forEach(function (el) {
      statsObserver.observe(el);
    });
  }


  // ── Copyright Year ──
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
