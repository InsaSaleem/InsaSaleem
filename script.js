// ============================================
//  CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// Grow cursor on hoverable elements
const hoverTargets = 'a, button, .project-card, .menu-circle, .about-details div, .image';

document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// Also grow when hovering any element dynamically
document.addEventListener('mouseover', (e) => {
  const el = e.target;
  if (el.matches(hoverTargets) || el.closest(hoverTargets)) {
    cursor.classList.add('hovering');
  } else {
    cursor.classList.remove('hovering');
  }
});

// ============================================
//  DARK / LIGHT MODE TOGGLE
// ============================================
const html       = document.documentElement;
const toggleBtn  = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
toggleIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  toggleIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// ============================================
//  HAMBURGER MENU (Mobile)
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav when a link is tapped on mobile
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});
