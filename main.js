/* ===========================
   PORTFOLIO — main.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // NAVBAR — scroll + active link
  // ===========================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ===========================
  // HAMBURGER MENU
  // ===========================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinksContainer.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ===========================
  // TYPING ANIMATION — Hero Title
  // ===========================
  const titles = ['AI/ML Engineer', 'Python Developer'];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typedTitle');

  function typeTitle() {
    if (!typedEl) return;
    const current = titles[titleIndex];

    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeTitle, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
      }
    }

    const speed = isDeleting ? 60 : 100;
    setTimeout(typeTitle, speed);
  }

  setTimeout(typeTitle, 800);

  // ===========================
  // COUNTER ANIMATION — Stats
  // ===========================
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  // ===========================
  // INTERSECTION OBSERVER — Reveal animations + counters
  // ===========================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Stats counter — trigger when stats come into view
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));

  // Add reveal class to sections dynamically
  document.querySelectorAll('.skill-card, .service-card, .project-card, .cert-card, .timeline-content, .stat-item').forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
    revealObserver.observe(el);
  });

  // ===========================
  // SKILLS FILTER
  // ===========================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      skillCards.forEach(card => {
        const categories = (card.dataset.category || '').trim().split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ===========================
  // PROJECTS FILTER + SEARCH
  // ===========================
  const projFilterBtns = document.querySelectorAll('.proj-filter');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projectSearch');

  let currentProjFilter = 'all';

  function applyProjectFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    projectCards.forEach(card => {
      const matchesFilter = currentProjFilter === 'all' || card.dataset.projType === currentProjFilter;
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const tech = card.querySelector('.project-tech')?.textContent.toLowerCase() || '';
      const matchesSearch = !query || title.includes(query) || tech.includes(query);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProjFilter = btn.dataset.proj;
      applyProjectFilters();
    });
  });

  searchInput?.addEventListener('input', applyProjectFilters);

  // ===========================
  // CONTACT FORM
  // ===========================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const sendBtn = document.getElementById('sendBtn');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const subject = document.getElementById('contactSubject')?.value.trim() || 'New Portfolio Inquiry';
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) return;

    const originalBtnHTML = sendBtn.innerHTML;
    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/subhi7649@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `Portfolio Message from ${name}: ${subject}`,
          message: message,
          _template: 'table'
        })
      });

      const result = await response.json();
      if (response.ok && (result.success === 'true' || result.success === true)) {
        contactForm.reset();
        formSuccess.textContent = "Message sent successfully! I'll get back to you soon.";
        formSuccess.classList.add('show');
        setTimeout(() => {
          formSuccess.classList.remove('show');
        }, 6000);
      } else {
        throw new Error(result.message || 'Error submitting form');
      }
    } catch (err) {
      // Graceful fallback to user's mail client if blocked by network or adblocker
      window.location.href = `mailto:subhi7649@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      formSuccess.textContent = "Redirecting to your email client to send...";
      formSuccess.classList.add('show');
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 6000);
    } finally {
      sendBtn.innerHTML = originalBtnHTML;
      sendBtn.disabled = false;
    }
  });

  // ===========================
  // FOOTER YEAR
  // ===========================
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ===========================
  // SMOOTH SCROLL — all anchor links
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===========================
  // BACK TO TOP
  // ===========================
  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===========================
  // CURSOR GLOW (subtle effect)
  // ===========================
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    background: radial-gradient(ellipse, rgba(0,200,255,0.04) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

});
