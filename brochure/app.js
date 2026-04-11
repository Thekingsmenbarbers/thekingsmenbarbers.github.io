/* ===================================================
   The Kingsmen Barbers — Interactive Brochure JS
   =================================================== */

(function () {
  'use strict';

  // --- Navigation ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll-aware nav
  let lastScrollY = 0;
  function updateNav() {
    const sy = window.scrollY;
    if (sy > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScrollY = sy;
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 72; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for sibling reveals
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 80}ms`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Parallax Effect ---
  const parallaxSections = document.querySelectorAll('.section::before, .hero-bg-pattern');

  function updateParallax() {
    const sy = window.scrollY;
    const heroPattern = document.querySelector('.hero-bg-pattern');
    if (heroPattern) {
      heroPattern.style.transform = `translateY(${sy * 0.3}px)`;
    }

    document.querySelectorAll('.section').forEach(section => {
      const rect = section.getBoundingClientRect();
      const before = section.querySelector(':scope::before');
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        section.style.setProperty('--parallax-y', `${(progress - 0.5) * 40}px`);
      }
    });
  }

  // Throttled parallax
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // --- Interactive Logo: 3D Tilt Effect ---
  const logoContainer = document.getElementById('logoContainer');
  const heroLogo = document.getElementById('heroLogo');
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const ctx = sparkleCanvas.getContext('2d');

  // Resize canvas
  function resizeCanvas() {
    const rect = sparkleCanvas.getBoundingClientRect();
    sparkleCanvas.width = rect.width * window.devicePixelRatio;
    sparkleCanvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 3D tilt on mouse move
  let currentTiltX = 0;
  let currentTiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;

  logoContainer.addEventListener('mousemove', (e) => {
    const rect = logoContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetTiltX = (y - 0.5) * -20; // tilt around X axis
    targetTiltY = (x - 0.5) * 20;  // tilt around Y axis
  });

  logoContainer.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
  });

  // Touch support
  logoContainer.addEventListener('touchstart', (e) => {
    logoContainer.classList.add('touch-active');
    const touch = e.touches[0];
    const rect = logoContainer.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    targetTiltX = (y - 0.5) * -15;
    targetTiltY = (x - 0.5) * 15;
  }, { passive: true });

  logoContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = logoContainer.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    targetTiltX = (y - 0.5) * -15;
    targetTiltY = (x - 0.5) * 15;
  }, { passive: true });

  logoContainer.addEventListener('touchend', () => {
    logoContainer.classList.remove('touch-active');
    targetTiltX = 0;
    targetTiltY = 0;
  });

  // Smooth tilt animation loop
  function animateTilt() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;

    heroLogo.style.transform = `perspective(800px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;

    requestAnimationFrame(animateTilt);
  }
  animateTilt();

  // --- Sparkle Particles on Click ---
  const sparkles = [];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 1.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      // Gold color variants
      const colors = ['#C5A55A', '#D4BA7A', '#E8D59E', '#FFFFFF', '#C5A55A'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // gravity
      this.vx *= 0.98; // friction
      this.alpha -= this.decay;
      this.rotation += this.rotSpeed;
      this.size *= 0.995;
      return this.alpha > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;

      // Draw a 4-pointed star sparkle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const s = this.size;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(angle) * s * 2, Math.sin(angle) * s * 2);
        ctx.lineTo(Math.cos(angle + Math.PI / 4) * s * 0.5, Math.sin(angle + Math.PI / 4) * s * 0.5);
      }
      ctx.closePath();
      ctx.fill();

      // Add glow
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.restore();
    }
  }

  function emitSparkles(clientX, clientY) {
    const rect = sparkleCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = 0; i < 30; i++) {
      sparkles.push(new Sparkle(x, y));
    }
  }

  // Click handler
  logoContainer.addEventListener('click', (e) => {
    emitSparkles(e.clientX, e.clientY);
  });

  // Touch tap sparkles
  logoContainer.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    emitSparkles(touch.clientX, touch.clientY);
  }, { passive: true });

  // Sparkle animation loop
  function animateSparkles() {
    const rect = sparkleCanvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const alive = sparkles[i].update();
      if (alive) {
        sparkles[i].draw(ctx);
      } else {
        sparkles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();

  // --- Hero Logo fade-in animation ---
  heroLogo.style.opacity = '0';
  heroLogo.style.transform = 'perspective(800px) scale(0.9)';
  setTimeout(() => {
    heroLogo.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    heroLogo.style.opacity = '1';
    heroLogo.style.transform = 'perspective(800px) scale(1)';
  }, 200);

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const sy = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop - 80;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (sy >= top && sy < bottom) {
          link.style.opacity = '1';
          link.style.color = '#C5A55A';
        } else {
          link.style.opacity = '';
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

})();
