/**
 * PARKOUR ADVENTURE CAMP — INTERACTIVE ENGINE
 * Microinteractions, 3D Tilt perspective, Parallax, CountUp, FAQ & Navigation
 * Zero backend, 100% Client-Side Pure JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParallax();
  init3DTilt();
  initCounters();
  initTimeline();
  initAccordion();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR SCROLL & MOBILE TOGGLE
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }
}

/* ==========================================================================
   2. HERO 3D PARALLAX DEPTH ON MOUSE MOVE
   ========================================================================== */
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const bgLayer = document.querySelector('.hero-layer-bg');
  const mistLayer = document.querySelector('.hero-layer-mist');
  const heroContent = document.querySelector('.hero-content');

  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    // Only apply on desktop viewports
    if (window.innerWidth < 992) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;

    requestAnimationFrame(() => {
      if (bgLayer) {
        bgLayer.style.transform = `scale(1.08) translate3d(${xPos * -15}px, ${yPos * -15}px, 0)`;
      }
      if (mistLayer) {
        mistLayer.style.transform = `translate3d(${xPos * 25}px, ${yPos * 20}px, 0)`;
      }
      if (heroContent) {
        heroContent.style.transform = `translate3d(${xPos * 10}px, ${yPos * 8}px, 0)`;
      }
    });
  });

  hero.addEventListener('mouseleave', () => {
    if (bgLayer) bgLayer.style.transform = `scale(1) translate3d(0, 0, 0)`;
    if (mistLayer) mistLayer.style.transform = `translate3d(0, 0, 0)`;
    if (heroContent) heroContent.style.transform = `translate3d(0, 0, 0)`;
  });
}

/* ==========================================================================
   3. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function init3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return; // Save mobile CPU

  const tiltCards = document.querySelectorAll('.card-3d, .level-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   4. STATS ANIMATED COUNTER
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const current = Math.floor(progress * (2 - progress) * target);

            el.innerHTML = `${current}<span class="accent">${suffix}</span>`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerHTML = `${target}<span class="accent">${suffix}</span>`;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. TIMELINE TABS & SCROLL CONTROLS
   ========================================================================== */
function initTimeline() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.day-card');
  const flow = document.querySelector('.timeline-cards-flow');

  if (!tabs.length || !cards.length || !flow) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const dayIndex = parseInt(tab.getAttribute('data-day'), 10);
      const targetCard = cards[dayIndex];

      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    });
  });
}

/* ==========================================================================
   6. ACCORDION (FAQ)
   ========================================================================== */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen = content.classList.contains('open');
      const icon = trigger.querySelector('.accordion-icon');

      // Close all others
      document.querySelectorAll('.accordion-content').forEach(c => {
        c.classList.remove('open');
        c.style.maxHeight = null;
      });
      document.querySelectorAll('.accordion-icon').forEach(i => {
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   7. SMOOTH SCROLL FOR IN-PAGE LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
