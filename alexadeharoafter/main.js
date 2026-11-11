/* ═════════════════════════════════════════════════════════════════════
   ALEXA S. LACO DEHARO — AFTER PARTY INVITATION SCRIPT
   Diseños Luna Luxury Stationary
   ═════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────
     1. BILINGUAL TRANSLATIONS (EN / ES)
     ───────────────────────────────────────────────────────────── */
  const translations = {
    en: {
      'card-supertitle': 'QUINCEAÑERA',
      'title-script': 'Party',
      'card-subtitle': 'CELEBRATION',
      'card-honoring': 'HONORING',
      'event-day': 'SATURDAY',
      'event-month': 'JANUARY',
      'event-time': '6:30 – 11 PM',
      'open-invite-text': 'OPEN INVITATION FOR ALL FRIENDS',
      'venue-note': 'Join us to celebrate with music, drinks, and dancing from 6:30 PM to 11:00 PM!',
      'btn-maps': 'GET DIRECTIONS',
      'btn-calendar': 'ADD TO CALENDAR',
      'host-line': 'Hosted with love by the Deharo Family',
      'link-main-quince': '‹ View Main Quinceañera Invitation',
      'theme-midnight': 'Midnight Mode',
      'theme-ivory': 'Ivory Mode'
    },
    es: {
      'card-supertitle': 'XV AÑOS',
      'title-script': 'Party',
      'card-subtitle': 'CELEBRACIÓN',
      'card-honoring': 'EN HONOR A',
      'event-day': 'SÁBADO',
      'event-month': 'ENERO',
      'event-time': '6:30 – 11 PM',
      'open-invite-text': 'INVITACIÓN ABIERTA PARA AMIGOS',
      'venue-note': '¡Acompáñanos a celebrar con música, bebidas y baile de 6:30 PM a 11:00 PM!',
      'btn-maps': 'CÓMO LLEGAR',
      'btn-calendar': 'AGREGAR AL CALENDARIO',
      'host-line': 'Con cariño, la Familia Deharo',
      'link-main-quince': '‹ Ver Invitación Principal de Quinceañera',
      'theme-midnight': 'Modo Medianoche',
      'theme-ivory': 'Modo Marfil'
    }
  };

  let currentLang = 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Update active pill button
    const btnEn = document.getElementById('lang-en-btn');
    const btnEs = document.getElementById('lang-es-btn');
    if (btnEn && btnEs) {
      btnEn.classList.toggle('active', lang === 'en');
      btnEs.classList.toggle('active', lang === 'es');
    }

    updateThemeButtonLabel();
    document.documentElement.lang = lang;
  }

  // URL query parameter ?lang=
  const urlParams = new URLSearchParams(window.location.search);
  const requestedLang = urlParams.get('lang');
  if (requestedLang === 'es') {
    applyLanguage('es');
  } else {
    applyLanguage('en');
  }

  document.getElementById('lang-en-btn')?.addEventListener('click', () => applyLanguage('en'));
  document.getElementById('lang-es-btn')?.addEventListener('click', () => applyLanguage('es'));


  /* ─────────────────────────────────────────────────────────────
     2. THEME SWITCHER (IVORY ROYAL vs MIDNIGHT ROYAL)
     ───────────────────────────────────────────────────────────── */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeBtnLabel = document.getElementById('theme-btn-label');
  const themeMeta = document.getElementById('theme-color-meta');

  function updateThemeButtonLabel() {
    if (!themeBtnLabel) return;
    const isDark = document.body.classList.contains('theme-dark');
    const dict = translations[currentLang] || translations.en;
    themeBtnLabel.textContent = isDark ? dict['theme-ivory'] : dict['theme-midnight'];
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      if (themeMeta) themeMeta.setAttribute('content', '#040e14');
      localStorage.setItem('alexa-after-theme', 'dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (themeMeta) themeMeta.setAttribute('content', '#c5e4ee');
      localStorage.setItem('alexa-after-theme', 'light');
    }
    updateThemeButtonLabel();
  }

  // Check saved theme
  const savedTheme = localStorage.getItem('alexa-after-theme');
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    setTheme(isDark ? 'light' : 'dark');
  });


  /* ─────────────────────────────────────────────────────────────
     3. MAP PLATFORM DETECTION (APPLE MAPS FOR iOS / MACOS)
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
     4. AMBIENT BOKEH & STARDUST CANVAS
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
        // Frosted ice blue, pearl white or cyan
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
