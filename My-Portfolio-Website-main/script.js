document.addEventListener('DOMContentLoaded', () => {

  /* ---------- year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- boot sequence preloader ---------- */
  (function boot() {
    const preloader = document.getElementById('preloader');
    const bootLog = document.getElementById('bootLog');
    const bootBarFill = document.getElementById('bootBarFill');
    if (!preloader || !bootLog) return;

    const lines = [
      '$ initializing dushyant-mittal/portfolio...',
      '$ loading modules [react, node, gemini-api]',
      '$ compiling assets... done',
      '$ starting dev server on localhost:3000',
      '$ ready ✓'
    ];

    let lineIndex = 0, charIndex = 0;
    const totalChars = lines.reduce((a, l) => a + l.length, 0);
    let typedChars = 0;

    function typeBootLine() {
      if (lineIndex >= lines.length) {
        bootBarFill.style.width = '100%';
        setTimeout(() => {
          preloader.classList.add('done');
          document.body.style.overflow = '';
        }, 380);
        return;
      }
      const line = lines[lineIndex];
      if (charIndex <= line.length) {
        const priorLines = lines.slice(0, lineIndex).map(l => `<span class="dim">${l}</span>`).join('\n');
        bootLog.innerHTML = (priorLines ? priorLines + '\n' : '') + line.slice(0, charIndex);
        charIndex++;
        typedChars++;
        bootBarFill.style.width = Math.min(100, (typedChars / totalChars) * 100) + '%';
        setTimeout(typeBootLine, 10 + Math.random() * 12);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeBootLine, 140);
      }
    }
    document.body.style.overflow = 'hidden';
    typeBootLine();
    // safety fallback in case something stalls
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.overflow = '';
    }, 4500);
  })();

  /* ---------- particle network background ---------- */
  (function particles() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particlesArr, mouse = { x: null, y: null };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 700 ? 34 : 70;
    particlesArr = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesArr) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            p.x += dx / dist * 0.6;
            p.y += dy / dist * 0.6;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(126,231,135,0.55)';
        ctx.fill();
      }
      for (let i = 0; i < particlesArr.length; i++) {
        for (let j = i + 1; j < particlesArr.length; j++) {
          const a = particlesArr[i], b = particlesArr[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(121,192,255,${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(step);
    }
    step();
  })();

  /* ---------- profile image fallback ---------- */
  (function profileFallback() {
    const img = document.getElementById('profileImg');
    const fallback = document.getElementById('profileFallback');
    if (!img || !fallback) return;
    fallback.style.display = 'none';
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    });
  })();

  /* ---------- tilt effect (profile frame + project cards) ---------- */
  (function tilt() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const targets = document.querySelectorAll('#profileFrame, .tilt-card .project-thumb');
    targets.forEach(el => {
      const strength = el.id === 'profileFrame' ? 14 : 10;
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
    });
  })();

  /* ---------- magnetic buttons ---------- */
  (function magnetic() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  })();

  /* ---------- cursor ring follow (slight lag for depth) ---------- */
  (function cursorRing() {
    const ring = document.getElementById('cursorRing');
    if (!ring || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
    let targetX = ringX, targetY = ringY;
    window.addEventListener('mousemove', e => { targetX = e.clientX; targetY = e.clientY; });
    function loop() {
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  })();

  /* ---------- line numbers generator ---------- */
  document.querySelectorAll('.line-numbers[data-lines]').forEach(el => {
    const count = parseInt(el.dataset.lines, 10);
    let html = '';
    for (let i = 1; i <= count; i++) html += i + '\n';
    el.textContent = html;
  });

  /* ---------- custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  if (cursorDot && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
    });
  }

  /* ---------- mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const explorer = document.getElementById('explorer');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => explorer.classList.toggle('open'));
    document.querySelectorAll('.tree-file').forEach(link => {
      link.addEventListener('click', () => explorer.classList.remove('open'));
    });
  }

  /* ---------- hero typing animation ---------- */
  const typedCodeEl = document.getElementById('typedCode');
  const heroLineNumbers = document.getElementById('heroLineNumbers');

  const codeLines = [
    [['kw', 'const'], [' ', ''], ['fn', ' developer'], [' = {', '']],
    [['  ', ''], ['str', "'name'"], [': ', ''], ['str', "'Dushyant Mittal'"], [',', '']],
    [['  ', ''], ['str', "'role'"], [': ', ''], ['str', "'CS Engineering Student & Web Developer'"], [',', '']],
    [['  ', ''], ['str', "'stack'"], [': [', ''], ['str', "'React'"], [', ', ''], ['str', "'Node'"], [', ', ''], ['str', "'MongoDB'"], ['],', '']],
    [['  ', ''], ['fn', 'buildsThingsThat'], ['(', ''], [')', ''], [' {', '']],
    [['    ', ''], ['kw', 'return'], [' ', ''], ['str', "'fast, real-time, and well-engineered.'"], [';', '']],
    [['  }', '']],
    [['};', '']],
    [['', ''], ['cm', '// Full-Stack Developer  · Patent Holder   .  5★ C++ on HackerRank  .  1800+ DSA problems solved • HDFC & IndusInd Bank Scholar'], ['', '']],
  ];

  function renderLineHTML(tokens) {
    return tokens.map(([cls, text]) => {
      if (cls === '') return escapeHtml(text);
      return `<span class="${cls}">${escapeHtml(text)}</span>`;
    }).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async function typeHero() {
    if (!typedCodeEl) return;
    let lineNumHTML = '';
    for (let li = 0; li < codeLines.length; li++) {
      const tokens = codeLines[li];
      const fullText = renderLineHTML(tokens);
      const lineSpan = document.createElement('div');
      typedCodeEl.appendChild(lineSpan);
      lineNumHTML += (li + 1) + '\n';
      if (heroLineNumbers) heroLineNumbers.textContent = lineNumHTML;

      // type char by char using the plain text length, then set final HTML for styling
      const plainLength = tokens.reduce((acc, [, t]) => acc + t.length, 0);
      const speed = plainLength > 40 ? 8 : 16;

      for (let i = 1; i <= plainLength; i++) {
        lineSpan.textContent = sliceTokens(tokens, i);
        await sleep(speed);
      }
      lineSpan.innerHTML = fullText;
    }
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    typedCodeEl.appendChild(cursor);
  }

  function sliceTokens(tokens, n) {
    let result = '';
    let remaining = n;
    for (const [, text] of tokens) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, text.length);
      result += text.slice(0, take);
      remaining -= take;
    }
    return result;
  }

  function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

  typeHero();

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- skill bar fill ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        const level = entry.target.dataset.level;
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillCards.forEach(card => skillObserver.observe(card));

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- active nav tracking (scrollspy) ---------- */
  const sections = document.querySelectorAll('.pane');
  const treeFiles = document.querySelectorAll('.tree-file');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        treeFiles.forEach(f => f.classList.toggle('active', f.getAttribute('href') === '#' + id));
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => spyObserver.observe(s));

  /* ---------- contact form (front-end only demo) ---------- */
  const form = document.getElementById('contactForm');
  const submitLabel = document.getElementById('submitLabel');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitLabel.textContent = 'sending...';
      setTimeout(() => {
        submitLabel.textContent = 'message sent ✓';
        form.reset();
        setTimeout(() => { submitLabel.textContent = 'send --message'; }, 2600);
      }, 900);
    });
  }

});
