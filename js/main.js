/* ============================================
   Miss Chooloub — GLOBAL JS
   ============================================ */

/* ------------------------------------------
   1. AGE GATE
   ------------------------------------------ */
function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    try {
      return sessionStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    try {
      sessionStorage.setItem(key, value);
    } catch (err) {
      // Storage unavailable, proceed without persistence
    }
  }
}

function initAgeGate() {
  var gate = document.getElementById('ageGate');
  if (!gate) return;

  var enter = document.getElementById('ageEnter');
  var leave = document.getElementById('ageLeave');

  function hideGate() {
    gate.classList.add('hidden');
    gate.style.opacity = '0';
    gate.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    setTimeout(function() {
      gate.style.display = 'none';
    }, 600);
  }

  // Check if already verified
  var verified = false;
  try { verified = localStorage.getItem('ml_age_verified') === 'true'; } catch(e) {}
  if (!verified) {
    try { verified = sessionStorage.getItem('ml_age_verified') === 'true'; } catch(e) {}
  }

  if (verified) {
    gate.style.display = 'none';
    gate.style.opacity = '0';
    gate.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    return;
  }

  // Show the gate
  document.body.style.overflow = 'hidden';

  // Make sure buttons are clickable above everything
  if (enter) {
    enter.style.position = 'relative';
    enter.style.zIndex = '10002';
    enter.style.cursor = 'pointer';
  }
  if (leave) {
    leave.style.position = 'relative';
    leave.style.zIndex = '10002';
    leave.style.cursor = 'pointer';
  }

  // Handler for ENTER
  function handleEnter(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try { localStorage.setItem('ml_age_verified', 'true'); } catch(ex) {}
    try { sessionStorage.setItem('ml_age_verified', 'true'); } catch(ex) {}
    hideGate();
  }

  // Handler for LEAVE
  function handleLeave(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    window.location.href = 'https://google.com';
  }

  // Attach via addEventListener
  if (enter) {
    enter.addEventListener('click', handleEnter, false);
    enter.addEventListener('touchend', handleEnter, false);
    // Inline backup
    enter.onclick = handleEnter;
  }

  if (leave) {
    leave.addEventListener('click', handleLeave, false);
    leave.addEventListener('touchend', handleLeave, false);
    leave.onclick = handleLeave;
  }

  // Event delegation fallback — listen on the gate itself
  gate.addEventListener('click', function(e) {
    var target = e.target;
    if (target.id === 'ageEnter' || target.closest('#ageEnter')) {
      handleEnter(e);
    } else if (target.id === 'ageLeave' || target.closest('#ageLeave')) {
      handleLeave(e);
    }
  }, false);
}

/* ------------------------------------------
   2. NAVIGATION SCROLL BEHAVIOUR
   ------------------------------------------ */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (!nav) return;

  // Scroll: transparent → solid
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          nav.classList.add('nav-solid');
        } else {
          nav.classList.remove('nav-solid');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ------------------------------------------
   3. SMOOTH SCROLL FOR ANCHOR LINKS
   ------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#telegram-placeholder') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ------------------------------------------
   4. CUSTOM CURSOR (hover-capable only)
   ------------------------------------------ */
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const ring = document.getElementById('cursorRing');
  if (!ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ring.classList.contains('visible')) {
      ring.classList.add('visible');
    }
  });

  function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const interactiveSelectors = 'a, button, .gallery-tile, .booking-card, .feature-card, .cta-card, .filter-tab, .service-card, input[type="checkbox"]';

  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

/* ------------------------------------------
   5. GSAP SCROLL ANIMATIONS
   ------------------------------------------ */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Individual reveals
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Staggered reveals for grid children
  const grids = [
    '.features', '.testimonials', '.gallery-grid', '.services-grid'
  ];

  grids.forEach(selector => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    const children = grid.children;
    if (!children.length) return;

    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          once: true
        }
      }
    );
  });
}

/* ------------------------------------------
   6. GALLERY FILTER
   ------------------------------------------ */
function initGalleryFilter() {
  // Handled dynamically by js/gallery.js
}

/* ------------------------------------------
   7. SPECIALTIES FADE ANIMATION
   ------------------------------------------ */
function initSpecialtiesFade() {
  const items = document.querySelectorAll('.specialty-item');
  if (items.length === 0) return;

  gsap.set(items, { opacity: 0, filter: 'blur(20px)', scale: 0.95 });

  const tl = gsap.timeline({ repeat: -1 });

  items.forEach((item, index) => {
    const startTime = index * 3.5;

    tl.to(item, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, startTime)
    .to(item, {
      scale: 1.05,
      duration: 2,
      ease: 'none'
    }, startTime + 1.5)
    .to(item, {
      opacity: 0,
      filter: 'blur(20px)',
      duration: 1.5,
      ease: 'power2.in'
    }, startTime + 2.5);
  });
}

/* ------------------------------------------
   8. TESTIMONIAL CAROUSEL
   ------------------------------------------ */
function initTestimonialCarousel() {
  const track = document.querySelector('.carousel-track');
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!track || !nextBtn || !prevBtn || !dots.length) return;

  let currentIndex = 0;
  const slideCount = dots.length; // 3

  function updateCarousel() {
    track.style.transform = `translateX(-${(currentIndex * 100) / slideCount}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
}

/* ------------------------------------------
   9. INTRO SLIDESHOW (Alternates every 7s)
   ------------------------------------------ */
function initIntroSlideshow() {
  const container = document.getElementById('introSlideshow');
  if (!container) return;
  const slides = container.querySelectorAll('.intro-slide');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 7000);
}

/* ------------------------------------------
   10. HOMEPAGE RANDOM HIGHLIGHTS (12 items)
   ------------------------------------------ */
function initHomepageHighlights() {
  const container = document.getElementById('homepageHighlights');
  if (!container || !window.GALLERY_VIDEOS || !window.GALLERY_IMAGES) return;

  const allItems = [...window.GALLERY_IMAGES];
  if (!allItems.length) return;

  for (let i = allItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
  }

  const selected = allItems.slice(0, 12);
  container.innerHTML = '';

  selected.forEach(item => {
    const tile = document.createElement('div');
    tile.className = `gallery-tile ${item.type === 'video' ? 'gallery-tile--video' : ''}`;
    
    if (item.type === 'video') {
      tile.innerHTML = `
        <video src="${item.src}" poster="${item.poster || \'\'}" preload="metadata" muted loop playsinline></video>
        <div class="gallery-play-icon">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="gallery-tile-overlay">
          <a href="gallery.html" class="gallery-tile-caption">Watch Video →</a>
        </div>
      `;
      const vid = tile.querySelector('video');
      tile.addEventListener('mouseenter', () => vid.play().catch(() => {}));
      tile.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    } else {
      tile.innerHTML = `
        <img src="${item.src}" alt="Miss Chooloub Media" loading="eager">
        <div class="gallery-tile-overlay">
          <a href="gallery.html" class="gallery-tile-caption">View in Gallery →</a>
        </div>
      `;
    }
    container.appendChild(tile);
  });
}

/* ------------------------------------------
   11. INIT EVERYTHING
   ------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initNav();
  initSmoothScroll();
  initCursor();
  initScrollAnimations();
  initGalleryFilter();
  initSpecialtiesFade();
  initTestimonialCarousel();
  initIntroSlideshow();
  initHomepageHighlights();
});
