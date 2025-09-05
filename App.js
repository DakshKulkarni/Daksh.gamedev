document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => (loader.style.display = 'none'), 500);
      }, 800);
    }
  });

  // Particles
  (function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = 15 + Math.random() * 10 + 's';
      container.appendChild(p);
    }
  })();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveal
  const opts = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        io.unobserve(entry.target);
      }
    });
  }, opts) : null;

  if (io) document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('fade-in'));

  // Navbar tint on scroll
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 100 ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.9)';
    });
  }

  // Typing effect
  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) {
    const txt = heroTitle.textContent || '';
    heroTitle.textContent = '';
    let i = 0;
    const type = () => {
      if (i < txt.length) {
        heroTitle.textContent += txt.charAt(i++);
        setTimeout(type, 80);
      }
    };
    setTimeout(type, 900);
  }

  // Ripple effect
  const addRipple = (el) => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = e.clientX - rect.left - size / 2 + 'px';
      span.style.top = e.clientY - rect.top - size / 2 + 'px';
      el.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  };
  document.querySelectorAll('.cta-button, .project-link').forEach(addRipple);

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,.3);
      transform: scale(0);
      animation: ripple .6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes ripple { to { transform: scale(2); opacity: 0; } }
  `;
  document.head.appendChild(style);
});
