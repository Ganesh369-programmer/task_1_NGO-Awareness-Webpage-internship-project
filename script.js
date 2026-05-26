/* ===================================================
   InAmigos Foundation — script.js
   Author: Professional Web Developer
   =================================================== */

/* ==========================================
   1. NAVBAR — scroll effect & mobile toggle
   ========================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleIcon = darkModeToggle.querySelector('i');

// Persistence check on load
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggleIcon.className = 'fas fa-sun';
}

// Toggle listener
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    toggleIcon.className = 'fas fa-sun';
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    toggleIcon.className = 'fas fa-moon';
    localStorage.setItem('dark-mode', 'disabled');
  }
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ==========================================
   1b. HERO BACKGROUND SLIDER
   ========================================== */
const heroSlides = document.querySelectorAll('.hero-slide');
let currentHeroSlide = 0;
const heroSlideInterval = 5000; // Switch slide every 5 seconds

function nextHeroSlide() {
  if (!heroSlides.length) return;
  heroSlides[currentHeroSlide].classList.remove('active');
  currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
  heroSlides[currentHeroSlide].classList.add('active');
}

if (heroSlides.length > 1) {
  setInterval(nextHeroSlide, heroSlideInterval);
}

/* ==========================================
   2. HERO FLOATING EMOJI ICONS
   ========================================== */
const floatingIconsContainer = document.getElementById('floatingIcons');
const ICONS = ['❤️','🌱','📚','🙌','🌍','✨','🐾','🤝','💙','🎓','🌿','⭐'];

function createFloatingIcon() {
  const el = document.createElement('div');
  el.classList.add('float-icon');
  el.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
  el.style.left     = Math.random() * 100 + 'vw';
  el.style.fontSize = (Math.random() * 1.4 + 0.8) + 'rem';
  const dur         = Math.random() * 14 + 10;
  const delay       = Math.random() * 12;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = delay + 's';
  floatingIconsContainer.appendChild(el);

  // Remove after animation completes
  setTimeout(() => el.remove(), (dur + delay) * 1000);
}

// Spawn floating icons continuously
(function spawnIcons() {
  createFloatingIcon();
  setTimeout(spawnIcons, 800);
})();

/* ==========================================
   3. TYPING ANIMATION
   ========================================== */
const typingEl = document.getElementById('typingText');
const WORDS     = ['Education', 'Women Empowerment', 'Environment', 'Community Support', 'Animal Welfare'];
let wordIdx  = 0;
let charIdx  = 0;
let isDelete = false;
let typingTimeout;

function typeLoop() {
  const currentWord = WORDS[wordIdx];
  if (!isDelete) {
    typingEl.textContent = currentWord.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentWord.length) {
      isDelete = true;
      typingTimeout = setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDelete = false;
      wordIdx = (wordIdx + 1) % WORDS.length;
    }
  }
  typingTimeout = setTimeout(typeLoop, isDelete ? 55 : 100);
}

setTimeout(typeLoop, 1200);

/* ==========================================
   4. CANVAS PARTICLE BACKGROUND
   ========================================== */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 55;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.5;
    this.vy   = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5
      ? `rgba(37,99,235,${this.alpha})`
      : `rgba(22,163,74,${this.alpha})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(30,58,138,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==========================================
   5. SCROLL REVEAL OBSERVER
   ========================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Once revealed, keep revealed
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ==========================================
   6. ANIMATED COUNTERS
   ========================================== */
const counterEls = document.querySelectorAll('.counter-num');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterSection = document.querySelector('.impact');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.3 });

if (counterSection) counterObserver.observe(counterSection);

/* ==========================================
   7. SUPPORT METER ANIMATION
   ========================================== */
const supportRing = document.getElementById('supportRing');
const meterPct    = document.getElementById('meterPct');
const targetPct   = 85;
let meterAnimated = false;

function animateMeter() {
  const circumference = 2 * Math.PI * 80; // r = 80 → 502.65
  let current = 0;
  const duration = 2000;
  const interval = 16;
  const steps = duration / interval;
  const increment = targetPct / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetPct) {
      current = targetPct;
      clearInterval(timer);
    }
    const offset = circumference - (current / 100) * circumference;
    supportRing.style.strokeDashoffset = offset;
    meterPct.textContent = Math.floor(current) + '%';
  }, interval);
}

const meterEl = document.querySelector('.support-meter');
if (meterEl) {
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !meterAnimated) {
        meterAnimated = true;
        animateMeter();
      }
    });
  }, { threshold: 0.4 });
  meterObserver.observe(meterEl);
}

/* ==========================================
   8. SCROLL TO TOP BUTTON
   ========================================== */
const scrollTopBtn = document.getElementById('scrollTop');

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   9. VOLUNTEER FORM SUBMIT
   ========================================== */
function submitForm() {
  const name     = document.getElementById('volName').value.trim();
  const email    = document.getElementById('volEmail').value.trim();
  const phone    = document.getElementById('volPhone').value.trim();
  const interest = document.getElementById('volInterest').value;
  const message  = document.getElementById('volMessage').value.trim();

  // Simple validation
  if (!name || !email || !phone || !interest) {
    alert('Please fill in all required fields (Name, Email, Phone, Interest).');
    return;
  }

  // Email format check
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Show success message
  const successEl = document.getElementById('formSuccess');
  successEl.classList.remove('hidden');

  // Clear form
  document.getElementById('volName').value     = '';
  document.getElementById('volEmail').value    = '';
  document.getElementById('volPhone').value    = '';
  document.getElementById('volInterest').value = '';
  document.getElementById('volMessage').value  = '';

  // Hide after 5 seconds
  setTimeout(() => successEl.classList.add('hidden'), 5000);
}

/* ==========================================
   10. SMOOTH ACTIVE NAV LINK ON SCROLL
   ========================================== */
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#4ade80';
    }
  });
});

/* ==========================================
   11. PROJECT CARD — subtle tilt on hover
   ========================================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => card.style.transition = '', 400);
  });
});

/* ==========================================
   12. ABOUT CARDS — stagger on load
   ========================================== */
window.addEventListener('load', () => {
  // Cards in viewport on load get triggered immediately
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('active');
    }
  });
});

/* ==========================================
   13. GALLERY MASONRY HOVER — keyboard friendly
   ========================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('tabindex', '0');
  item.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const overlay = item.querySelector('.gallery-overlay');
      if (overlay) {
        overlay.style.opacity = overlay.style.opacity === '1' ? '' : '1';
      }
    }
  });
});

/* ==========================================
   14. PAGE LOAD — initial reveal
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Stagger hero entry
  document.querySelectorAll('.fade-in-up').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.2 + 0.1}s`;
  });
});
