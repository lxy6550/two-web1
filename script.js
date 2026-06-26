// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// Hover effects on interactive elements
document.querySelectorAll('button, .card, .stat, a, .timeline-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
});

// ===== MAGNETIC CARDS =====
document.querySelectorAll('.magnetic-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-y * 0.03}deg) rotateY(${x * 0.03}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== PARTICLES =====
function createParticles(containerId, count, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.3 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles('particles0', 20, 'rgba(129,140,248,0.4)');
createParticles('particles1', 15, 'rgba(99,102,241,0.3)');
createParticles('particles2', 12, 'rgba(244,114,182,0.3)');
createParticles('particles3', 18, 'rgba(251,191,36,0.3)');
createParticles('particles4', 16, 'rgba(52,211,153,0.3)');
createParticles('particles5', 14, 'rgba(251,146,60,0.3)');
createParticles('particles6', 10, 'rgba(129,140,248,0.25)');
createParticles('particles7', 18, 'rgba(52,211,153,0.3)');
createParticles('particles8', 15, 'rgba(251,191,36,0.3)');
createParticles('particles9', 20, 'rgba(244,114,182,0.35)');

// ===== SLIDE SYSTEM =====
const slidesWrapper = document.getElementById('slidesWrapper');
const slidesTrack = document.getElementById('slidesTrack');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSlide = 0;
let isDragging = false;
let startX = 0;
let dragOffset = 0;

const sideNav = document.getElementById('sideNav');
slides.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.onclick = () => goToSlide(i);
  if (i === 0) btn.classList.add('active');
  sideNav.appendChild(btn);
});

function updateSlide(index) {
  currentSlide = Math.max(0, Math.min(totalSlides - 1, index));
  slidesTrack.style.transform = `translateX(-${currentSlide * 100}vw)`;
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
  });
  document.querySelectorAll('.side-nav button').forEach((b, i) => {
    b.classList.toggle('active', i === currentSlide);
  });
  document.getElementById('slideNum').textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function goToSlide(index) { updateSlide(index); }

updateSlide(0);
slides[0].classList.add('active');

// ===== MOUSE DRAG =====
slidesWrapper.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  slidesWrapper.classList.add('dragging');
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  dragOffset = e.clientX - startX;
  const base = -currentSlide * slidesWrapper.offsetWidth;
  slidesTrack.style.transform = `translateX(${base + dragOffset}px)`;
});
window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  slidesWrapper.classList.remove('dragging');
  if (Math.abs(dragOffset) > 80) {
    dragOffset < 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
  } else {
    goToSlide(currentSlide);
  }
  dragOffset = 0;
});

// ===== TOUCH =====
slidesWrapper.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  slidesWrapper.classList.add('dragging');
});
slidesWrapper.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  dragOffset = e.touches[0].clientX - startX;
  const base = -currentSlide * slidesWrapper.offsetWidth;
  slidesTrack.style.transform = `translateX(${base + dragOffset}px)`;
});
slidesWrapper.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;
  slidesWrapper.classList.remove('dragging');
  if (Math.abs(dragOffset) > 50) {
    dragOffset < 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
  } else {
    goToSlide(currentSlide);
  }
  dragOffset = 0;
});

// ===== KEYBOARD =====
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
});

// ===== SCROLL WHEEL =====
let wheelTimeout;
slidesWrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 0 || e.deltaX > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }, 50);
}, { passive: false });

// ===== MODAL =====
function showModal() { document.getElementById('contactModal').classList.add('show'); }
function hideModal() { document.getElementById('contactModal').classList.remove('show'); }
document.getElementById('contactModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) hideModal();
});

// ===== PARALLAX ON MOUSE MOVE (per slide) =====
document.addEventListener('mousemove', (e) => {
  const slide = slides[currentSlide];
  if (!slide) return;
  const inner = slide.querySelector('.slide-inner');
  if (!inner) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;
  inner.style.transform = slides[currentSlide].classList.contains('active')
    ? `translateY(0) translate(${x * 0.3}px, ${y * 0.3}px)` : `translateY(40px)`;
});