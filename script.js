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
  { text: "alvin.bridson — cybersecurity + ai", type: "" },
  { text: "role --current", type: "prompt" },
  { text: "cybersecurity consultant @ intello protect", type: "" },
  { text: "scan --focus", type: "prompt" },
  { text: "offensive security · defensive ai", type: "" },
  { text: "status: available for opportunities", type: "ok" },
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
    setTimeout(next, line.type === 'prompt' ? 420 : 320);
  }
  next();
}

// Kick off hero sequence once, respecting reduced motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
