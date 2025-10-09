/* ===== START GATE ===== */
const gate = document.getElementById('start-gate');
const press = document.getElementById('press-start');
const site = document.getElementById('site');

if (press) {
  press.addEventListener('click', () => {
    // zoom/fade the gate
    gate.classList.add('gate-close');

    // after animation, hide gate and reveal site
    setTimeout(() => {
      gate.style.display = 'none';
      site.classList.remove('hidden');
      site.classList.add('reveal-site');
      document.body.classList.remove('gated');
    }, 900);
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  });
});

/* ===== HOVER TITLE -> SHOW INFO PANEL (scroll into view on mobile) ===== */
document.querySelectorAll('.project-title').forEach(title => {
  const sel = title.getAttribute('data-info');
  const panel = sel ? document.querySelector(sel) : null;
  if (!panel) return;

  title.addEventListener('mouseenter', () => panel.classList.add('hover'));
  title.addEventListener('mouseleave', () => panel.classList.remove('hover'));
  // On mobile tap: scroll to panel
  title.addEventListener('click', e => {
    if (matchMedia('(hover:none)').matches) {
      e.preventDefault();
      panel.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
});

// === Custom pixel rocket cursor with purple smoke ===
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

  rocket.style.left = mouseX - 16 + "px";
  rocket.style.top = mouseY - 16 + "px";

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
