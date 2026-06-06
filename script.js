/* ============================================
   RIJUL RANA — Portfolio Scripts
   Three.js · GSAP · Interactions
   ============================================ */

(function () {
  'use strict';

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  const preloaderPercent = document.querySelector('.preloader-percent');
  let loadProgress = 0;

  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      setTimeout(() => preloader.classList.add('hidden'), 400);
    }
    if (preloaderPercent) preloaderPercent.textContent = Math.floor(loadProgress) + '%';
  }, 120);

  // ---- Three.js Scene ----
  function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('three-canvas');
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 80 : 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const light1 = new THREE.PointLight(0x00e5ff, 0.6, 20);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x8b5cf6, 0.4, 20);
    light2.position.set(-5, -3, 3);
    scene.add(light2);

    // Main icosahedron
    const mainGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const mainMat = new THREE.MeshPhongMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.12,
      shininess: 100,
      transparent: true,
      opacity: 0.55,
      wireframe: false,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    scene.add(mainMesh);

    // Secondary orbs
    const orb2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.35, 0),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.15, transparent: true, opacity: 0.45 })
    );
    orb2.position.set(2.2, 1, -1);
    scene.add(orb2);

    const orb3 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25, 0),
      new THREE.MeshPhongMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.12, transparent: true, opacity: 0.4 })
    );
    orb3.position.set(-1.8, -0.8, 0.5);
    scene.add(orb3);

    // Torus ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2 })
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Inner ring
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.015, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.18 })
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Particles
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0x00e5ff, size: isMobile ? 0.035 : 0.025, transparent: true, opacity: 0.4, sizeAttenuation: true })
    );
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainMesh.rotation.x = elapsed * 0.3 + targetY * 0.3;
      mainMesh.rotation.y = elapsed * 0.2 + targetX * 0.3;
      mainMesh.position.y = Math.sin(elapsed * 0.8) * 0.15;

      orb2.rotation.x = elapsed * 0.5;
      orb2.rotation.y = elapsed * 0.3;
      orb2.position.y = 1 + Math.sin(elapsed * 1.2) * 0.2;

      orb3.rotation.x = elapsed * 0.4;
      orb3.rotation.y = elapsed * 0.6;
      orb3.position.y = -0.8 + Math.sin(elapsed * 1.5 + 1) * 0.15;

      ring.rotation.z = elapsed * 0.15;
      ring2.rotation.z = -elapsed * 0.1;

      particles.rotation.y = elapsed * 0.02;

      camera.position.x = targetX * 0.5;
      camera.position.y = -targetY * 0.3;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ---- GSAP Animations ----
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.to('.reveal-up', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.8,
    });

    gsap.set('.reveal-up', { y: 40 });

    // Scroll reveals
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Dashboard entrance
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
      gsap.from(dashboard, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      });
    }
  }

  // ---- Typed Text Effect ----
  function initTypedText() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
      'SEO & Technical SEO Expert',
      'Social Media Marketing Specialist',
      'Lead Generation Strategist',
      'Content Marketing Professional',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        delay = 2500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }

    setTimeout(type, 1500);
  }

  // ---- Animated Counters ----
  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const isDecimal = String(target).includes('.');

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = isDecimal ? (eased * target).toFixed(1) : current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
        if (suffix) {
          const suffixEl = el.nextElementSibling;
          if (suffixEl && suffixEl.classList.contains('hero-stat-suffix')) {
            /* suffix already in HTML */
          } else if (el.classList.contains('counter-value')) {
            el.textContent = target + suffix;
          }
        }
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    // Hero stats
    document.querySelectorAll('.hero-stat-value[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => animateCounter(el, target, '', 2000),
      });
    });

    // About counters
    document.querySelectorAll('.counter-value[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / 2000, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(update);
        },
      });
    });
  }

  // ---- Skill Bars ----
  function initSkillBars() {
    document.querySelectorAll('.skill-card').forEach((card) => {
      const level = card.dataset.skill;
      const fill = card.querySelector('.skill-fill');

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (fill) fill.style.width = level + '%';
        },
      });
    });
  }

  // ---- Theme Toggle ----
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      if (toggle) {
        const isLight = theme === 'light';
        toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        toggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      }
    }

    applyTheme(initialTheme);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }
  }

  // ---- Navbar ----
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);

      // Active section highlight
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
      });
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    });

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Custom Cursor ----
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = cursor && cursor.querySelector('.cursor-dot');
    const ring = cursor && cursor.querySelector('.cursor-ring');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!cursor || !dot || !ring || prefersReducedMotion || !hasFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;
    let isHovering = false;

    const interactiveSelector = 'a, button, input, textarea, select, label, .btn, .nav-link, .social-btn, .theme-toggle, .nav-toggle, .back-to-top';

    function showCursor() {
      visible = true;
      cursor.classList.add('is-visible');
    }

    function hideCursor() {
      visible = false;
      cursor.classList.remove('is-visible');
    }

    function updateDot() {
      const scale = isHovering ? 0.75 : 1;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${scale})`;
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateDot();
      if (!visible) showCursor();
    });

    document.addEventListener('mouseenter', showCursor);
    document.addEventListener('mouseleave', hideCursor);

    document.addEventListener('mouseover', (e) => {
      isHovering = Boolean(e.target.closest(interactiveSelector));
      cursor.classList.toggle('is-hovering', isHovering);
      updateDot();
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }

    updateDot();
    animateRing();
  }

  // ---- Contact Form (Web3Forms — works on Vercel static deploy) ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    const accessKey = form.dataset.accessKey;
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.user_subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        status.textContent = 'Please fill in all fields.';
        status.className = 'form-status error';
        return;
      }

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = 'Form is not configured yet. Add your Web3Forms access key.';
        status.className = 'form-status error';
        return;
      }

      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', `[Portfolio] ${subject}`);
      formData.append('message', message);
      formData.append('from_name', 'Rijul Rana Portfolio');

      if (submitBtn) submitBtn.disabled = true;
      status.textContent = 'Sending your message...';
      status.className = 'form-status';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          status.textContent = 'Thank you! Your message has been sent successfully.';
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email iamrishuuux@gmail.com directly.';
        status.className = 'form-status error';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ---- Back to Top ----
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 500 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 500 ? 'all' : 'none';
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Smooth anchor scroll enhancement ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Subtle card hover (readability-friendly) ----
  function initTiltEffect() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.service-card, .project-card, .cert-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Timeline animation ----
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      gsap.from(item.querySelector('.timeline-dot'), {
        scale: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: i * 0.1,
      });
    });
  }

  // ---- Init All ----
  function init() {
    initTheme();
    initCustomCursor();
    initThreeJS();
    initNavbar();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initTiltEffect();

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initGSAP();
      initCounters();
      initSkillBars();
      initTimeline();
    } else {
      document.querySelectorAll('.reveal, .reveal-up').forEach((el) => {
        el.style.opacity = '1';
      });
    }

    initTypedText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
