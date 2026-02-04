// ===== START GATE =====
const gate = document.getElementById('start-gate');
const press = document.getElementById('press-start');
const site = document.getElementById('site');

function initScrollFX() {
  if (!(window.gsap && window.ScrollTrigger)) return;

  gsap.registerPlugin(ScrollTrigger);

  // progress bar
  const prog = document.querySelector('.scroll-progress');
  if (prog) {
    gsap.to(prog, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25
      }
    });
  }

  // section glow
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.add('section-glow');
    ScrollTrigger.create({
      trigger: sec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => sec.classList.add('active'),
      onEnterBack: () => sec.classList.add('active'),
      onLeave: () => sec.classList.remove('active'),
      onLeaveBack: () => sec.classList.remove('active')
    });
  });

  // reveal targets
  const targets = [
  '.section-title',
  '.about-grid',
  '.skills-grid',
  '.project-row',
  '.project-card',
  '.project-info',
  '.contact-card'
];

  document.querySelectorAll(targets.join(',')).forEach(el => el.classList.add('reveal'));

  gsap.utils.toArray('.reveal').forEach(el => {
   // hero intro (no scroll trigger, no reversing)
gsap.fromTo(
  ['.glow-title', '.tagline', '.badges', '.cta-row'],
  { opacity: 0, y: 18, filter: "blur(8px)" },
  { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.08 }
);
  });

  // hero parallax
  const heroTitle = document.querySelector('.glow-title');
  const heroBadges = document.querySelector('.badges');
  if (heroTitle) {
    gsap.to(heroTitle, {
      y: -60,
      ease: "none",
      scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.4 }
    });
  }
  if (heroBadges) {
    gsap.to(heroBadges, {
      y: -35,
      ease: "none",
      scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  // projects slide in
  gsap.utils.toArray('.project-row').forEach((row) => {
    const reverse = row.classList.contains('reverse');
    const card = row.querySelector('.project-card');
    const info = row.querySelector('.project-info');

    if (card) {
      gsap.fromTo(card,
        { x: reverse ? 90 : -90, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 75%" } }
      );
    }

    if (info) {
      gsap.fromTo(info,
        { x: reverse ? -90 : 90, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 75%" } }
      );
    }
  });

  ScrollTrigger.refresh();
}

if (press) {
  press.addEventListener('click', () => {
    gate.classList.add('gate-close');

    setTimeout(() => {
      gate.style.display = 'none';
      site.classList.remove('hidden');
      site.classList.add('reveal-site');
      document.body.classList.remove('gated');

      // init animations only after site is visible
      initScrollFX();
      if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 50);
    }, 900);
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ===== ROCKET CURSOR + SMOKE =====
const rocket = document.getElementById("rocketCursor");
const smokeCanvas = document.createElement("canvas");
const ctx = smokeCanvas.getContext("2d");

smokeCanvas.width = window.innerWidth;
smokeCanvas.height = window.innerHeight;
smokeCanvas.style.position = "fixed";
smokeCanvas.style.top = "0";
smokeCanvas.style.left = "0";
smokeCanvas.style.pointerEvents = "none";
smokeCanvas.style.zIndex = "9999";
document.body.appendChild(smokeCanvas);

let mouseX = 0, mouseY = 0;
let smokeParticles = [];

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (rocket) {
    rocket.style.display = 'block';
    rocket.style.left = (mouseX - 16) + "px";
    rocket.style.top  = (mouseY - 16) + "px";
  }

  smokeParticles.push({ x: mouseX, y: mouseY, alpha: 1, size: Math.random() * 6 + 3 });
});

function drawSmoke() {
  ctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

  smokeParticles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y + 20, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(186, 85, 255, ${p.alpha})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ba55ff";
    ctx.fill();
    p.y += 0.5;
    p.alpha -= 0.02;
  });

  smokeParticles = smokeParticles.filter((p) => p.alpha > 0);
  requestAnimationFrame(drawSmoke);
}
drawSmoke();

window.addEventListener("resize", () => {
  smokeCanvas.width = window.innerWidth;
  smokeCanvas.height = window.innerHeight;
});
