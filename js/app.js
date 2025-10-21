(function () {
  const doc = document;

  // Set current year
  const yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver reveals
  const revealEls = Array.from(doc.querySelectorAll('.reveal-up, .reveal-fade'));
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // Tilt effect for the device mockup
  const tiltEl = doc.querySelector('.device.tilt');
  const stage = doc.querySelector('.device-stage');
  if (tiltEl && stage) {
    let rect = stage.getBoundingClientRect();

    const updateRect = () => { rect = stage.getBoundingClientRect(); };
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

    const onMove = (e) => {
      if (prefersReduced) return;
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1
      const ry = clamp((x - 0.5) * 16, -12, 12);       // rotateY
      const rx = clamp((0.5 - y) * 10, -8, 8);         // rotateX
      tiltEl.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      tiltEl.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    };

    const onLeave = () => {
      tiltEl.style.setProperty('--ry', '0deg');
      tiltEl.style.setProperty('--rx', '0deg');
    };

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
  }

  // Smooth scroll for anchor links within the page
  doc.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = doc.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
          history.pushState(null, '', id);
        }
      }
    });
  });
})();
