// ============================================
//  CINEMATIC LOADER (STRICT 3-SECOND DELAY)
// ============================================
const loadStartTime = Date.now();

window.addEventListener('load', () => {
  const elapsedTime = Date.now() - loadStartTime;
  // Forces loader screen to show for at least 3000ms (3 seconds)
  const remainingTime = Math.max(3000 - elapsedTime, 0); 

  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hide');
    }
  }, remainingTime);
});

// ============================================
//  DYNAMIC ASSET EXTENSION ENGINE (PNG MANIPULATION)
// ============================================
function handleThemeAssets(theme) {
  const navbarLogo = document.getElementById('navbarLogo');
  const loaderLogo = document.getElementById('loaderLogo');
  const faviconEl = document.getElementById('dynamicFavicon');

  // Rules: 
  // Dark Theme UI Background (#050505) -> Needs White Logo ("dark.png")
  // Light Theme UI Background (#f4f5f7) -> Needs Black Logo ("light.png")
  const targetImage = theme === 'dark' ? './images/dark.png' : './images/light.png';

  if (navbarLogo) navbarLogo.src = targetImage;
  if (loaderLogo) loaderLogo.src = targetImage;

  // Browser Title Icon Requirements: Force light logo icon on browser tab
  if (faviconEl) {
    faviconEl.href = './images/light.png';
  }
}

// ============================================
//  INTERACTIVE BACKGROUND PARTICLE ENGINE
// ============================================
class InteractiveAmbientEngine {
  constructor() {
    this.canvas = document.getElementById('ambientCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.maxParticles = 90; 
    this.connectionRadius = 125;
    this.resizeTimeout = null;
    
    this.mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null,
      radius: 220, 
      active: false
    };

    this.init();
    this.setupListeners();
    this.animate();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particles = [];

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        baseRadius: Math.random() * 2.5 + 1,
        currentRadius: Math.random() * 2.5 + 1
      });
    }
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.init(), 200);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;
      
      if (this.mouse.x === null) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.targetX = null;
      this.mouse.targetY = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.mouse.active && this.mouse.targetX !== null) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.35;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.35;
    } else {
      this.mouse.x = null;
      this.mouse.y = null;
    }

    const currentTheme = document.documentElement.getAttribute('data-theme');
    let baseColor, lineAlphaFactor, dotAlpha;
    
    if (currentTheme === 'light') {
      baseColor = '59, 130, 246'; 
      lineAlphaFactor = 0.25;
      dotAlpha = 0.55;
    } else {
      baseColor = '162, 124, 255'; 
      lineAlphaFactor = 0.18;
      dotAlpha = 0.45;
    }

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      if (this.mouse.x !== null) {
        let dx = this.mouse.x - p.x;
        let dy = this.mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          let force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 1.6;
          p.y -= (dy / dist) * force * 1.6;
          p.currentRadius = p.baseRadius * (1 + force * 0.9);
        } else {
          p.currentRadius += (p.baseRadius - p.currentRadius) * 0.08;
        }
      } else {
        p.currentRadius += (p.baseRadius - p.currentRadius) * 0.08;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${baseColor}, ${dotAlpha})`;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        let p2 = this.particles[j];
        let ldx = p.x - p2.x;
        let ldy = p.y - p2.y;
        let ldist = Math.sqrt(ldx * ldx + ldy * ldy);

        if (ldist < this.connectionRadius) {
          let alpha = (1 - ldist / this.connectionRadius) * lineAlphaFactor;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
          this.ctx.lineWidth = 0.9;
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize components immediately on parse 
const saved = localStorage.getItem('insaTheme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);
handleThemeAssets(saved);

document.addEventListener('DOMContentLoaded', () => {
  new InteractiveAmbientEngine();
});

// ============================================
//  THEME CONTROLLER & SYSTEM REACTION
// ============================================
const html      = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

if (themeIcon) themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';

if (toggleBtn) {
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('insaTheme', next);
    handleThemeAssets(next);
  });
}

// ============================================
//  HAMBURGER MENU SIDE NAVIGATION COMPONENT
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenuWrapper = document.getElementById('navMenuWrapper');

if (hamburger && navMenuWrapper) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navMenuWrapper.classList.toggle('open');
  });

  navMenuWrapper.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenuWrapper.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenuWrapper.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenuWrapper.classList.remove('open');
    }
  });
}

// ============================================
//  ACCURATE SMOOTH OFFSET CALCULATOR SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    const navOffset = document.getElementById('navbar')?.offsetHeight || 65;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// ============================================
//  TYPING TERMINAL ENGINE EFFECT
// ============================================
const phrases = ['Web Developer.', 'Data Analyst.', 'Problem Solver.'];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;
  const cur = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++cIdx);
    if (cIdx === cur.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 65);
  } else {
    typedEl.textContent = cur.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, 35);
  }
}
if (typedEl) setTimeout(type, 800);

// ============================================
//  INTERSECTION ENTRANCE OBSERVER FOR REVEALS
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx, 4) * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => observer.observe(el));

// ============================================
//  PKT LIVE REGIONAL CLOCK & DATE
// ============================================
function updateTimeAndDate() {
  const timeEl = document.getElementById('localTime');
  const dateEl = document.getElementById('localDate');
  if (!timeEl) return;

  // Force system time calculation into Pakistan Standard Time zone
  const pkt = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
  
  // 1. Live Time Formatting
  const h = pkt.getHours();
  const m = String(pkt.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = String(h % 12 || 12).padStart(2, '0');
  timeEl.textContent = h12 + ':' + m + ' ' + ampm;

  // 2. Live Date Formatting (Triggers dynamically on day change)
  if (dateEl) {
    const day = pkt.getDate();
    const year = pkt.getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[pkt.getMonth()];

    // Generate accurate English ordinal numbers (1st, 2nd, 3rd, 4th...)
    let suffix = "th";
    if (day < 10 || day > 20) {
      switch (day % 10) {
        case 1: suffix = "st"; break;
        case 2: suffix = "nd"; break;
        case 3: suffix = "rd"; break;
      }
    }
    dateEl.textContent = `${day}${suffix} ${monthName} ${year}`;
  }
}

// Initialize immediately and refresh every second
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);


// ============================================
//   CONTACT FORM — EMAILJS API SERVICE
// ============================================
(function () {
  emailjs.init('ptjm6lBUOgZ0F60Hy');
})();

async function sendMsg() {
  const name   = document.getElementById('cName')?.value.trim();
  const email  = document.getElementById('cEmail')?.value.trim();
  const msg    = document.getElementById('cMsg')?.value.trim();
  const btn    = document.getElementById('sendBtn');

  if (!name || !email || !msg) {
    showStatus('⚠️ Please fill in all fields.', '#e0a030');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('⚠️ Please enter a valid email address.', '#e0a030');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending…';
  }

  try {
    // Sending both key styles to guarantee a match against any cached template variations
    await emailjs.send(
      'service_x4ws8md',
      'template_7hwbynu',
      { 
        from_name: name,
        from_email: email,
        message: msg,
        to_email: 'insasaleem6@gmail.com',
        reply_to: email,
        
        // Secondary mapping fallback
        name: name,
        email: email
      }
    );
    
    showStatus("✅ Message sent! I'll get back to you soon.", '#60c060');
    if (document.getElementById('cName')) document.getElementById('cName').value = '';
    if (document.getElementById('cEmail')) document.getElementById('cEmail').value = '';
    if (document.getElementById('cMsg')) document.getElementById('cMsg').value = '';
    
    if (btn) btn.textContent = 'Message Sent!';
    setTimeout(() => { 
      if (btn) {
        btn.textContent = 'Send Message'; 
        btn.disabled = false; 
      }
    }, 4000);

  } catch (err) {
    console.error('EmailJS error details:', err);
    showStatus('❌ Something went wrong. Please email: insasaleem6@gmail.com', '#e05555');
    if (btn) {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  }
}

function showStatus(text, color) {
  const status = document.getElementById('formStatus');
  if (!status) return;
  status.textContent = text;
  status.style.color = color;
  status.style.display = 'block';
  setTimeout(() => { status.style.display = 'none'; }, 6000);
}