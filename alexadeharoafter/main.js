/* ═════════════════════════════════════════════════════════════════════
   ALEXA S. LACO DEHARO — AFTER PARTY INVITATION SCRIPT
   Diseños Luna Luxury Stationary
   ═════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────
     1. MAP PLATFORM DETECTION (APPLE MAPS FOR iOS / MACOS)
     ───────────────────────────────────────────────────────────── */
  const mapBtn = document.getElementById('map-link-btn');
  if (mapBtn) {
    const isAppleDevice = /Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const appleUrl = mapBtn.getAttribute('data-apple-url');
    if (isAppleDevice && appleUrl) {
      mapBtn.setAttribute('href', appleUrl);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. AMBIENT BOKEH & STARDUST CANVAS
     ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = window.innerWidth < 600 ? 28 : 45;

    for (let i = 0; i < count; i++) {
      const isStar = Math.random() > 0.60;
      let pColor;
      if (isStar) {
        // Champagne gold or diamond white
        pColor = Math.random() > 0.35 ? '224, 186, 102' : '255, 255, 255';
      } else {
        // Frosted ice blue, pearl white or sky cyan
        const r = Math.random();
        pColor = r > 0.55 ? '255, 255, 255' : (r > 0.3 ? '210, 242, 250' : '165, 228, 242');
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isStar ? (Math.random() * 8 + 4) : (Math.random() * 15 + 4),
        speedY: Math.random() * 0.18 + 0.05,
        speedX: (Math.random() - 0.5) * 0.18,
        baseAlpha: isStar ? (Math.random() * 0.35 + 0.25) : (Math.random() * 0.22 + 0.08),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        isStar: isStar,
        color: pColor
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y > height + 30) p.y = -30;
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        const dynamicAlpha = Math.max(0.08, Math.min(0.75, p.baseAlpha + Math.sin(p.twinklePhase) * 0.18));

        ctx.save();
        ctx.fillStyle = `rgba(${p.color}, ${dynamicAlpha})`;
        ctx.shadowBlur = p.isStar ? 14 : 8;
        ctx.shadowColor = `rgba(${p.color}, 0.7)`;

        if (p.isStar) {
          const size = Math.max(5.5, p.radius * 1.25);
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.quadraticCurveTo(0, 0, size, 0);
          ctx.quadraticCurveTo(0, 0, 0, size);
          ctx.quadraticCurveTo(0, 0, -size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

});
