// ===== Nav scroll state =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover)').matches;

// ===== Ambient grain particles (subtle, drifting, mouse-parallax) =====
if (!reduceMotion) {
  const canvas = document.getElementById('grainCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  let targetParallaxX = 0, targetParallaxY = 0;
  let parallaxX = 0, parallaxY = 0;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles(){
    const count = Math.round((w * h) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.35 + 0.08,
      vy: Math.random() * 0.06 + 0.02,
      drift: Math.random() * 0.4 - 0.2,
    }));
  }
  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if (hasHover) {
    window.addEventListener('mousemove', (e) => {
      targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 12;
      targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 12;
    }, { passive: true });
  }

  function draw(){
    parallaxX += (targetParallaxX - parallaxX) * 0.04;
    parallaxY += (targetParallaxY - parallaxY) * 0.04;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.vy;
      p.x += p.drift * 0.02;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x + parallaxX, p.y + parallaxY, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== Card tilt + local spotlight on mouse move =====
if (!reduceMotion && hasHover) {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 6;
      const rotateX = -((y - cy) / cy) * 6;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.01)`;
        card.style.setProperty('--lx', x + 'px');
        card.style.setProperty('--ly', y + 'px');
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

// ===== Subtle glow-follow on buttons and skill chips =====
if (!reduceMotion && hasHover) {
  const glowTargets = document.querySelectorAll('.btn, .skill-chip, .contact-link');
  glowTargets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--lx', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--ly', (e.clientY - rect.top) + 'px');
    });
  });
}

// ===== Hero: typed name =====
const nameEl = document.getElementById('typedName');
const fullName = "Alvin Joe\nBridson";
let i = 0;
function typeName(){
  if(i <= fullName.length){
    nameEl.innerHTML = fullName.slice(0, i).replace(/\n/g, '<br>') + '<span class="tcursor">_</span>';
    i++;
    setTimeout(typeName, 55);
  } else {
    nameEl.innerHTML = fullName.replace(/\n/g, '<br>') + '<span class="tcursor">_</span>';
  }
}

// ===== Terminal side panel: sequential boot lines =====
const termBody = document.getElementById('termBody');
const termLines = [
  { text: "whoami", type: "prompt" },
  { text: "alvin.bridson — cybersecurity, ai & grc", type: "" },
  { text: "role --current", type: "prompt" },
  { text: "cybersecurity consultant @ intello protect", type: "" },
  { text: "interests --list", type: "prompt" },
  { text: "offensive security · grc & compliance · web3 security", type: "" },
  { text: "status", type: "prompt" },
  { text: "available for opportunities", type: "ok" },
];

function renderTerminal(){
  let idx = 0;
  function next(){
    if(idx >= termLines.length) return;
    const line = termLines[idx];
    const el = document.createElement('span');
    el.className = 'line ' + (line.type || '');
    el.textContent = (line.type === 'prompt' ? '$ ' : '  ') + line.text;
    termBody.appendChild(el);
    idx++;
    setTimeout(next, line.type === 'prompt' ? 400 : 300);
  }
  next();
}

// Kick off hero sequence, respecting reduced motion
if (reduceMotion) {
  nameEl.innerHTML = fullName.replace(/\n/g, '<br>');
  termLines.forEach(line => {
    const el = document.createElement('span');
    el.className = 'line ' + (line.type || '');
    el.textContent = (line.type === 'prompt' ? '$ ' : '  ') + line.text;
    termBody.appendChild(el);
  });
} else {
  typeName();
  setTimeout(renderTerminal, 500);
}
