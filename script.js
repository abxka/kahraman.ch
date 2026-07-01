/* =============================================
   KAHRAMAN CONSULTING — script.js
   ============================================= */

// ── Secure transport ─────────────────────────
if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  window.location.replace(`https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`);
}

// ── Dark / Light mode ────────────────────────
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function getPreferred() {
  const saved = localStorage.getItem('kc-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('kc-theme', theme);
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
}

applyTheme(getPreferred());

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Navbar ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}));

// ── Scroll reveal ─────────────────────────────
const revealEls = document.querySelectorAll(
  '.service-card, .cred, .section-title, .section-sub, .about-body, .swiss-pillar'
);
revealEls.forEach(el => el.classList.add('reveal'));
const ro = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 75);
    ro.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => ro.observe(el));

// ── Smooth anchor scroll ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Contact form ──────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
  const fields = form.querySelectorAll('input, textarea, select');

  function ensureInputWrap(field) {
    let wrap = field.parentElement;
    if (!wrap || !wrap.classList.contains('input-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'input-wrap';
      field.parentNode.insertBefore(wrap, field);
      wrap.appendChild(field);
    }
    return wrap;
  }

  function validateField(field) {
    const value = field.value.trim();
    if (!value) return false;

    if (field.id === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (field.id === 'message') {
      return value.length >= 10;
    }

    if (field.id === 'service') {
      return value !== '';
    }

    return value.length >= 2;
  }

  function updateFieldStatus(field) {
    const wrapper = ensureInputWrap(field);
    if (!wrapper) return;

    let status = wrapper.querySelector('.field-status');
    if (!status) {
      status = document.createElement('span');
      status.className = 'field-status';
      wrapper.appendChild(status);
    }

    const isValid = validateField(field);
    status.textContent = isValid ? '✓' : '';
    status.classList.toggle('valid', isValid);
    field.classList.toggle('is-valid', isValid);
    field.classList.toggle('is-invalid', !isValid && field.value.trim() !== '');
  }

  function resetFieldStatuses() {
    fields.forEach(field => {
      const wrapper = field.parentElement;
      const status = wrapper?.querySelector('.field-status');
      if (status) {
        status.textContent = '';
        status.classList.remove('valid');
      }
      field.classList.remove('is-valid', 'is-invalid');
    });
  }

  fields.forEach(field => {
    field.addEventListener('input', () => updateFieldStatus(field));
    field.addEventListener('change', () => updateFieldStatus(field));
    field.addEventListener('blur', () => updateFieldStatus(field));
    updateFieldStatus(field);
  });

  form.addEventListener('reset', () => {
    setTimeout(resetFieldStatuses, 0);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;

    const FORMSPREE_ID = 'mdarwjbp';
    const formData = new FormData(form);
    const service = formData.get('service') || 'General';

    if (!FORMSPREE_ID || FORMSPREE_ID.includes('YOUR_FORMSPREE_FORM_ID')) {
      showError('Please set your Formspree form ID in script.js before sending.');
      btn.textContent = orig;
      btn.disabled = false;
      return;
    }

    formData.set('_replyto', formData.get('email'));
    formData.set('_subject', `Consulting enquiry — ${service}`);
    formData.set('_captcha', 'false');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      if (!res.ok) throw new Error('Submission failed');

      form.reset();
      resetFieldStatuses();
      showSuccess();
    } catch (error) {
      showError();
    } finally {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
}

function showSuccess() {
  const f = document.getElementById('contact-form');
  f.style.display = 'none';
  const d = document.createElement('div');
  d.className = 'form-success'; d.style.display = 'block';
  d.innerHTML = `<div style="font-size:2rem;margin-bottom:.75rem">✓</div><strong style="display:block;margin-bottom:.5rem;font-size:1.1rem">Message sent!</strong>Thank you — We will be in touch within 1–2 business days.`;
  f.parentElement.appendChild(d);
}

function showError(message = 'The message could not be sent right now. Please try again later.') {
  const existing = document.querySelector('.form-error');
  if (existing) existing.remove();

  const note = document.createElement('p');
  note.className = 'form-error';
  note.textContent = message;
  form.appendChild(note);
}

// ══════════════════════════════════════════════
//   INTERACTIVE NETWORK CANVAS
// ══════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const TURQ     = '#00D4AA';
  const TURQ_A   = (a) => `rgba(0,212,170,${a})`;
  const MINT_A   = (a) => `rgba(168,240,224,${a})`;
  const MAX_DIST = 150;
  const REPEL_R  = 72;
  const BASE_N   = 60;
  const HOVER_R  = 30;

  let W, H, nodes = [], dragging = null, hovered = null;
  let mouse = { x: -9999, y: -9999 };

  // ── Critical fix: size canvas from the hero section, not the canvas element ──
  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width  = hero.clientWidth  || window.innerWidth;
    H = canvas.height = hero.clientHeight || window.innerHeight;
  }

  function mkNode(x, y) {
    return {
      x:     x  ?? (Math.random() * W),
      y:     y  ?? (Math.random() * H),
      vx:    (Math.random() - 0.5) * 0.6,
      vy:    (Math.random() - 0.5) * 0.6,
      r:     Math.random() * 2 + 1.5,
      phase: Math.random() * Math.PI * 2,
      born:  performance.now()
    };
  }

  function init() {
    resize();
    nodes = [];
    for (let i = 0; i < BASE_N; i++) nodes.push(mkNode());
  }

  function update(now) {
    nodes.forEach((n, i) => {
      if (n === dragging) return;

      // Wall bounce
      if (n.x < n.r)     { n.x = n.r;     n.vx =  Math.abs(n.vx); }
      if (n.x > W - n.r) { n.x = W - n.r; n.vx = -Math.abs(n.vx); }
      if (n.y < n.r)     { n.y = n.r;     n.vy =  Math.abs(n.vy); }
      if (n.y > H - n.r) { n.y = H - n.r; n.vy = -Math.abs(n.vy); }

      // Node repulsion
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R * REPEL_R && d2 > 0.01) {
          const d  = Math.sqrt(d2);
          const f  = (REPEL_R * REPEL_R - d2) / (d2 * d) * 0.5;
          n.vx += dx * f; n.vy += dy * f;
          if (m !== dragging) { m.vx -= dx * f; m.vy -= dy * f; }
        }
      }

      // Gentle centre pull
      n.vx += (W * 0.5 - n.x) * 0.00004;
      n.vy += (H * 0.5 - n.y) * 0.00004;

      // Mouse attract
      const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 140 && md > 0.1) {
        const f = (1 - md / 140) * 0.022;
        n.vx += (mdx / md) * f;
        n.vy += (mdy / md) * f;
      }

      // Damping + speed cap
      n.vx *= 0.88; n.vy *= 0.88;
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (spd > 2.8) { n.vx = n.vx / spd * 2.8; n.vy = n.vy / spd * 2.8; }

      n.x += n.vx; n.y += n.vy;
    });
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST) continue;

        const isH  = a === hovered || b === hovered;
        const base = (1 - d / MAX_DIST);
        const alpha = isH ? base * 0.85 : base * 0.28;

        if (isH) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = TURQ_A(alpha * 0.35);
          ctx.lineWidth = 5; ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = TURQ_A(alpha);
        ctx.lineWidth = isH ? 1.5 : 0.8;
        ctx.stroke();
      }
    }

    // Nodes
    nodes.forEach(n => {
      const age   = Math.min(1, (now - n.born) / 500);
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.0012 + n.phase);
      const isH   = n === hovered, isD = n === dragging;
      const r     = n.r * (isH || isD ? 2.8 : 1) * (isH || isD ? 1 : 0.75 + 0.25 * pulse);

      // Glow
      if (isH || isD) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
        g.addColorStop(0, TURQ_A(0.22)); g.addColorStop(1, TURQ_A(0));
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }

      // Core
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isH || isD ? TURQ : MINT_A(age * (0.45 + 0.3 * pulse));
      ctx.fill();

      // Ring
      if (isH) {
        ctx.beginPath(); ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = TURQ_A(0.45); ctx.lineWidth = 1; ctx.stroke();
      }
    });
  }

  function loop(now) { update(now); draw(now); requestAnimationFrame(loop); }

  // ── Pointer utilities ──
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function nearest(px, py, r) {
    let best = null, bd = r * r;
    nodes.forEach(n => {
      const d2 = (n.x - px) ** 2 + (n.y - py) ** 2;
      if (d2 < bd) { bd = d2; best = n; }
    });
    return best;
  }

  // ── Events ──
  canvas.addEventListener('mousemove', e => {
    const { x, y } = getPos(e);
    mouse.x = x; mouse.y = y;
    if (dragging) {
      dragging.x = x; dragging.y = y;
      dragging.vx = 0; dragging.vy = 0;
    } else {
      hovered = nearest(x, y, HOVER_R);
    }
    canvas.style.cursor = hovered ? 'grab' : 'crosshair';
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
    if (!dragging) hovered = null;
  });

  canvas.addEventListener('mousedown', e => {
    const { x, y } = getPos(e);
    const n = nearest(x, y, HOVER_R);
    if (n) { dragging = n; canvas.style.cursor = 'grabbing'; }
  });

  canvas.addEventListener('mouseup', e => {
    if (dragging) {
      dragging.vx = 0; dragging.vy = 0;
      dragging = null;
      canvas.style.cursor = hovered ? 'grab' : 'crosshair';
    } else {
      const { x, y } = getPos(e);
      if (nodes.length < 120) nodes.push(mkNode(x, y));
    }
  });

  canvas.addEventListener('dblclick', e => {
    const { x, y } = getPos(e);
    const n = nearest(x, y, HOVER_R);
    if (n && nodes.length > 10) {
      nodes = nodes.filter(nd => nd !== n);
      if (hovered === n) hovered = null;
    }
  });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const n = nearest(x, y, HOVER_R * 1.8);
    if (n) { dragging = n; }
    else if (nodes.length < 120) nodes.push(mkNode(x, y));
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const { x, y } = getPos(e);
    mouse.x = x; mouse.y = y;
    if (dragging) { dragging.x = x; dragging.y = y; dragging.vx = 0; dragging.vy = 0; }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    if (dragging) { dragging.vx = 0; dragging.vy = 0; dragging = null; }
    mouse.x = -9999; mouse.y = -9999;
  }, { passive: false });

  window.addEventListener('resize', () => {
    resize();
    nodes.forEach(n => { n.x = Math.min(n.x, W); n.y = Math.min(n.y, H); });
  }, { passive: true });

  // ── Init after layout is ready ──
  // Use requestAnimationFrame to ensure hero has rendered dimensions
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      init();
      requestAnimationFrame(loop);
    });
  });

})();
