// NAHIMS SW – main.js

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.style.display === 'block';
      mobileNav.style.display = open ? 'none' : 'block';
      hamburger.setAttribute('aria-expanded', String(!open));
    });
    // close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.style.display = 'none';
      }
    });
  }

  // ── Tabs ──
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const btns = group.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = btn.closest('[data-tab-group]');
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = container.querySelector(`#${target}`);
        if (pane) pane.classList.add('active');
      });
    });
  });

  // ── Scroll animations ──
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => io.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  // ── Counter animation ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = el.dataset.count;
        const isNum = /^\d+$/.test(target);
        if (!isNum) { el.textContent = target; return; }
        const end = parseInt(target);
        const dur = 1400;
        const step = dur / end;
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + Math.ceil(end / 60), end);
          el.textContent = cur.toLocaleString();
          if (cur >= end) clearInterval(timer);
        }, step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  // ── Chapter filter ──
  const stateFilter = document.getElementById('stateFilter');
  const dueFilter = document.getElementById('dueFilter');
  const chapterRows = document.querySelectorAll('#chaptersBody tr[data-state]');
  function filterChapters() {
    const s = stateFilter ? stateFilter.value : '';
    const d = dueFilter ? dueFilter.value : '';
    chapterRows.forEach(row => {
      const sm = !s || row.dataset.state === s;
      const dm = !d || row.dataset.due === d;
      row.style.display = (sm && dm) ? '' : 'none';
    });
  }
  if (stateFilter) stateFilter.addEventListener('change', filterChapters);
  if (dueFilter) dueFilter.addEventListener('change', filterChapters);

  // ── Alert auto-dismiss ──
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });

  // ── Image preview on file input ──
  document.querySelectorAll('input[type="file"][data-preview]').forEach(input => {
    input.addEventListener('change', () => {
      const previewId = input.dataset.preview;
      const preview = document.getElementById(previewId);
      if (!preview) return;
      const file = input.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // ── Confirm delete ──
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', e => {
      if (!confirm(form.dataset.confirm || 'Are you sure?')) e.preventDefault();
    });
  });

  // ── Smooth active nav highlight ──
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPath) a.classList.add('active');
    else if (currentPath.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/') a.classList.add('active');
  });

});
