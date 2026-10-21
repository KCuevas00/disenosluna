/**
 * ═════════════════════════════════════════════════════════════════════
 * SWEET 16 INVITATION — LUZ ISABELLA ALATORRE
 * Interactive Controller & RSVP
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'luzisabellealatore';
const CLIENT_NAME = "Luz Isabella's Sweet 16 (Luz Isabella Alatorre)";
const CLIENT_EMAIL = '';

document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser from restoring a previous scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (new URLSearchParams(window.location.search).get('og') === 'true') {
    document.documentElement.classList.add('og-mode');
  }

  // Strictly block any scrolling, wheeling or touchmove while envelope is unopened
  const blockScrollUntilEntered = (e) => {
    if (!document.body.classList.contains('site-entered')) {
      e.preventDefault();
      return false;
    }
  };

  const blockKeysUntilEntered = (e) => {
    if (!document.body.classList.contains('site-entered')) {
      const blockedKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', ' ', 'Home', 'End'];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  window.addEventListener('wheel', blockScrollUntilEntered, { passive: false });
  window.addEventListener('touchmove', blockScrollUntilEntered, { passive: false });
  window.addEventListener('keydown', blockKeysUntilEntered, { passive: false });

  /* ─────────────────────────────────────────────────────────────
     1. BILINGUAL TRANSLATION DICTIONARY (EN / ES)
     ───────────────────────────────────────────────────────────── */
  const translations = {
    en: {
      'entry-invited': "You're Invited!",
      'entry-subtitle': "LUZ ISABELLA'S SWEET 16",
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'invite-quince': 'Sweet 16 of',
      'invite-parents': '',
      'invite-preamble': 'CORDIALLY INVITES YOU TO CELEBRATE THE',
      'invite-daughter': "LUZ ISABELLA'S SWEET 16",
      'invite-date-month': 'DEC',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 5:00 PM',
      'countdown-title': 'COUNTING DOWN TO THE SWEET 16',
      'countdown-today': '🎉 Today Is the Big Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': '1770 PALM AVE • SAN DIEGO, CA',
      'program-title': 'SCHEDULE OF EVENTS',
      'program-ceremony-title': '',
      'program-ceremony-desc': '',
      'program-blessing-title': 'BLESSING',
      'program-blessing-desc': 'AT THE HALL<br />1770 PALM AVE, SAN DIEGO, CA',
      'program-arrival-title': 'COCKTAIL HOUR &amp; GUEST ARRIVAL',
      'program-arrival-desc': 'WITH LIVE MARIACHI',
      'program-dinner-title': 'DINNER',
      'program-dinner-desc': 'DINNER WITH LIVE MARIACHI',
      'program-waltz-title': 'WALTZ (VALS)',
      'program-waltz-desc': 'PRESENTATION &amp; WALTZ',
      'tl-btn-location': 'DIRECTIONS',
      'tl-btn-directions': 'DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'FORMAL ATTIRE',
      'dresscode-desc': 'We kindly request our guests to dress in elegant formal attire to celebrate this special evening.',
      'registry-title': 'GIFT REGISTRY',
      'registry-subtitle': 'WISHING WELL',
      'registry-desc': 'Your presence is the greatest gift of all.',
      'message-quote': 'With much joy and love in our hearts, we cordially invite you to celebrate with us.',
      'message-signature': 'Luz Isabella',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BEFORE NOVEMBER 15, 2026',
      'rsvp-btn': 'CONFIRM ATTENDANCE',
      'rsvp-instruction': 'CLICK THE BUTTON BELOW TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': "Confirm Attendance for Luz Isabella's Sweet 16",
      'modal-subtitle': 'Saturday, December 12, 2026 • San Diego, CA',
      'label-fullname': 'Full Name or Family *',
      'label-phone': 'Phone Number (Optional)',
      'label-party': 'Number of Attendees (Optional)',
      'opt-party-1': '1 Guest',
      'opt-party-2': '2 Guests',
      'opt-party-3': '3 Guests',
      'opt-party-4': '4 Guests',
      'opt-party-5': '5+ Guests (Family)',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">YES, ATTENDING</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">CANNOT ATTEND</span>',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your response has been saved successfully. We look forward to celebrating together!',
      'modal-decline-desc': 'Thank you for letting us know. Your response has been saved.'
    },
    es: {
      'entry-invited': '¡Estás Invitado!',
      'entry-subtitle': 'LUZ ISABELLA • SWEET 16',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'invite-quince': 'Sweet 16 de',
      'invite-parents': '',
      'invite-preamble': 'CORDIALMENTE TE INVITA A CELEBRAR EL',
      'invite-daughter': 'SWEET 16 DE LUZ ISABELLA',
      'invite-date-month': 'DIC',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 5:00 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL SWEET 16',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': '1770 PALM AVE • SAN DIEGO, CA',
      'program-title': 'PROGRAMA DEL EVENTO',
      'program-ceremony-title': '',
      'program-ceremony-desc': '',
      'program-blessing-title': 'BENDICIÓN',
      'program-blessing-desc': 'EN EL SALÓN<br />1770 PALM AVE, SAN DIEGO, CA',
      'program-arrival-title': 'HORA DE CÓCTEL Y LLEGADA',
      'program-arrival-desc': 'CON MARIACHI EN VIVO',
      'program-dinner-title': 'CENA',
      'program-dinner-desc': 'CENA CON MARIACHI EN VIVO',
      'program-waltz-title': 'VALS',
      'program-waltz-desc': 'PRESENTACIÓN Y VALS',
      'tl-btn-location': 'CÓMO LLEGAR',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'TRAJE FORMAL',
      'dresscode-desc': 'Agradecemos a nuestros invitados vestir atuendo formal y elegante para celebrar esta noche inolvidable.',
      'registry-title': 'MESA DE REGALOS',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Tu presencia es nuestro mejor regalo.',
      'message-quote': 'Con mucha alegría y amor en nuestros corazones, te invitamos cordialmente a celebrar con nosotros.',
      'message-signature': 'Luz Isabella',
      'rsvp-deadline': 'POR FAVOR CONFIRMAR ASISTENCIA ANTES DEL 15 DE NOVIEMBRE, 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAZ CLIC EN EL BOTÓN PARA<br />CONFIRMAR TU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia - Sweet 16 de Luz Isabella',
      'modal-subtitle': 'Sábado, 12 de Diciembre de 2026 • San Diego, CA',
      'label-fullname': 'Nombre Completo o Familia *',
      'label-phone': 'Número de Teléfono (Opcional)',
      'label-party': 'Número de Asistentes (Opcional)',
      'opt-party-1': '1 Invitado',
      'opt-party-2': '2 Invitados',
      'opt-party-3': '3 Invitados',
      'opt-party-4': '4 Invitados',
      'opt-party-5': '5+ Invitados (Familia)',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">SÍ, ASISTIRÉ</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">NO PODRÉ ASISTIR</span>',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Tu respuesta ha sido guardada exitosamente. ¡Esperamos celebrar juntos!',
      'modal-decline-desc': 'Gracias por avisarnos. Tu respuesta ha sido guardada.'
    }
  };

  let currentLang = 'en';
  let userSelectedLang = false;

  function applyLanguage(lang = 'en') {
    currentLang = lang;
    document.documentElement.lang = lang;
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    const btnEs = document.getElementById('btn-lang-es');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnEs && btnEn) {
      btnEs.classList.toggle('active', lang === 'es');
      btnEn.classList.toggle('active', lang === 'en');
    }

    document.querySelectorAll('.entry-lang-btn').forEach(b => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  const btnEs = document.getElementById('btn-lang-es');
  const btnEn = document.getElementById('btn-lang-en');
  if (btnEs) btnEs.addEventListener('click', () => { userSelectedLang = true; applyLanguage('es'); });
  if (btnEn) btnEn.addEventListener('click', () => { userSelectedLang = true; applyLanguage('en'); });

  // Language picker under the envelope (before the invitation is opened)
  document.querySelectorAll('.entry-lang-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      userSelectedLang = true;
      applyLanguage(b.dataset.lang);
    });
  });

  // Default to English on startup unless specified by ?lang=
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  applyLanguage(urlLang === 'es' ? 'es' : 'en');

  // Collapsible utility tabs (Language bar top-left, audio bar top-right)
  let expandAudioBarFn = null;

  function initControlToggles() {
    const langBar = document.getElementById('lang-control-bar');
    const langToggle = document.getElementById('lang-collapse-toggle');
    const audioBar = document.getElementById('audio-control-bar');
    const audioToggle = document.getElementById('audio-collapse-toggle');

    function setCollapsed(bar, btn, collapsed, hiddenLabel, shownLabel) {
      if (!bar || !btn) return;
      bar.classList.toggle('collapsed', collapsed);
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.setAttribute('aria-label', collapsed ? shownLabel : hiddenLabel);
    }

    expandAudioBarFn = () => {
      setCollapsed(audioBar, audioToggle, false, 'Hide music player', 'Show music player');
      setTimeout(updateSongTickerOffset, 60);
      setTimeout(updateSongTickerOffset, 420);
    };

    function bindToggle(bar, btn, hiddenLabel, shownLabel) {
      if (!bar || !btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        bar.dataset.userToggled = 'true';
        setCollapsed(bar, btn, !bar.classList.contains('collapsed'), hiddenLabel, shownLabel);
        if (bar === audioBar) {
          setTimeout(updateSongTickerOffset, 60);
          setTimeout(updateSongTickerOffset, 420);
        }
      });
    }

    bindToggle(langBar, langToggle, 'Hide language selector', 'Show language selector');
    bindToggle(audioBar, audioToggle, 'Hide music player', 'Show music player');

    if (langBar && langToggle && langBar.dataset.userToggled !== 'true') {
      setCollapsed(langBar, langToggle, true, 'Hide language selector', 'Show language selector');
    }
    if (audioBar && audioToggle && audioBar.dataset.userToggled !== 'true') {
      setCollapsed(audioBar, audioToggle, true, 'Hide music player', 'Show music player');
    }
  }

  initControlToggles();

  /* ─────────────────────────────────────────────────────────────
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER (Peso Pluma & Tito Double P - Daño)
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');

  let isAudioPlaying = false;
  let wasAudioPlayingBeforeHide = false;

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    if (audioToggleBtn) {
      if (playing) {
        audioToggleBtn.classList.add('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'none';
        if (audioPauseIcon) audioPauseIcon.style.display = 'inline';
        audioToggleBtn.setAttribute('aria-label', 'Pause music');
      } else {
        audioToggleBtn.classList.remove('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'inline';
        if (audioPauseIcon) audioPauseIcon.style.display = 'none';
        audioToggleBtn.setAttribute('aria-label', 'Play music');
      }
    }
  }

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
        })
        .catch((err) => {
          console.warn('[Audio autoplay notice]:', err);
          updatePlayState(false);
        });
    }
  }

  function pauseAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    updatePlayState(false);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isAudioPlaying) {
        wasAudioPlayingBeforeHide = true;
        pauseAudio();
      }
    } else {
      if (wasAudioPlayingBeforeHide) {
        playAudio();
        wasAudioPlayingBeforeHide = false;
      }
    }
  });

  window.addEventListener('pagehide', () => {
    wasAudioPlayingBeforeHide = false;
    pauseAudio();
  });

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        wasAudioPlayingBeforeHide = false;
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  function updateSongTickerOffset() {
    const ticker = document.querySelector('.song-title-ticker');
    const viewport = document.querySelector('.song-marquee-viewport');
    if (!ticker || !viewport) return;

    const overflow = ticker.scrollWidth - viewport.clientWidth;
    if (overflow > 1) {
      ticker.style.setProperty('--scroll-offset', `-${Math.ceil(overflow) + 8}px`);
    } else {
      ticker.style.setProperty('--scroll-offset', '0px');
    }
  }

  updateSongTickerOffset();
  window.addEventListener('resize', updateSongTickerOffset);

  /* ─────────────────────────────────────────────────────────────
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER, CONFETTI & PETALS ENGINE
     ───────────────────────────────────────────────────────────── */

  // Canvas Petal & Multi-Shape Confetti Engine (Western Charra Theme)
  class WesternPetalConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.isRunning = false;
      this.hasTriggeredBurst = false;

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.width = (this.canvas.width = window.innerWidth);
      this.height = (this.canvas.height = window.innerHeight);
    }

    createParticle(initialY = -25) {
      const isMobile = this.width < 600;
      const shapes = ['petal', 'ribbon', 'glitter', 'sequin', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      const colors = [
        'rgba(92, 140, 111, 0.95)',  // Deep sage green
        'rgba(126, 175, 146, 0.95)', // Soft meadow sage
        'rgba(232, 182, 187, 0.92)', // Delicate blush pink rose petal
        'rgba(212, 175, 55, 0.95)',  // Shimmering royal gold leaf
        'rgba(245, 228, 189, 0.96)', // Warm champagne gold
        'rgba(255, 250, 242, 0.98)', // Pure ivory silk
        'rgba(58, 99, 74, 0.92)',    // Forest sage leaf
        'rgba(201, 159, 87, 0.94)'   // Radiant antique gold
      ];

      return {
        x: Math.random() * this.width,
        y: initialY,
        shape: shape,
        size: isMobile ? (Math.random() * 7 + 7) : (Math.random() * 10 + 8),
        aspectRatio: Math.random() * 1.4 + 1.2,
        speedY: Math.random() * 1.6 + 0.9,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 1.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.2,
        swaySpeed: Math.random() * 0.025 + 0.012,
        swayAmplitude: Math.random() * 32 + 16,
        time: Math.random() * 100,
        opacity: Math.random() * 0.35 + 0.65,
        color: colors[Math.floor(Math.random() * colors.length)],
        bend: Math.random() * 0.5 + 0.5
      };
    }

    triggerCelebratoryBurst() {
      if (this.hasTriggeredBurst) return;
      this.hasTriggeredBurst = true;
      const isMobile = this.width < 600;

      // 1. High-volume top shower cascading across screen
      const topCount = isMobile ? 55 : 85;
      for (let i = 0; i < topCount; i++) {
        const startY = (Math.random() * -0.65 * this.height) - 10;
        const p = this.createParticle(startY);
        p.speedY = Math.random() * 3.2 + 1.8;
        p.speedX = (Math.random() - 0.5) * 3.0;
        p.rotationSpeed = (Math.random() - 0.5) * 4.5;
        this.particles.push(p);
      }

      // 2. 360-degree radial blast exploding directly from envelope wax seal
      const seal = document.getElementById('wax-seal-btn');
      let originX = this.width / 2;
      let originY = this.height / 2;
      if (seal) {
        const rect = seal.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          originX = rect.left + rect.width / 2;
          originY = rect.top + rect.height / 2;
        }
      }

      const ringCount = isMobile ? 32 : 50;
      for (let j = 0; j < ringCount; j++) {
        const p = this.createParticle(originY);
        p.x = originX + (Math.random() - 0.5) * 70;
        p.y = originY + (Math.random() - 0.5) * 50;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 2.0;
        p.speedX = Math.cos(angle) * speed;
        p.speedY = Math.sin(angle) * speed - 1.2;
        p.rotationSpeed = (Math.random() - 0.5) * 5.5;
        this.particles.push(p);
      }
    }

    start() {
      if (!this.canvas || !this.ctx || this.isRunning) return;
      this.isRunning = true;
      this.triggerCelebratoryBurst();
      this.animate();
    }

    animate() {
      if (!this.isRunning || !this.canvas || !this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);
      const isMobile = this.width < 600;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.time += p.swaySpeed;
        p.x += Math.sin(p.time) * (p.swayAmplitude * 0.04) + p.speedX * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(92, 140, 111, 0.35)';

        if (p.shape === 'petal') {
          this.ctx.scale(Math.cos(p.time * 0.8), p.bend);
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.bezierCurveTo(-p.size * 0.7, -p.size * 0.5, -p.size * 0.8, p.size * 0.8, 0, p.size);
          this.ctx.bezierCurveTo(p.size * 0.8, p.size * 0.8, p.size * 0.7, -p.size * 0.5, 0, 0);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (p.shape === 'ribbon') {
          this.ctx.scale(Math.cos(p.time * 1.5), Math.sin(p.time * 0.8));
          this.ctx.beginPath();
          const w = p.size;
          const h = p.size * p.aspectRatio;
          this.ctx.rect(-w / 2, -h / 2, w, h);
          this.ctx.fill();
        } else if (p.shape === 'star') {
          this.ctx.scale(Math.cos(p.time * 1.2), Math.cos(p.time * 1.2));
          this.ctx.beginPath();
          const s = p.size * 0.7;
          this.ctx.moveTo(0, -s);
          this.ctx.quadraticCurveTo(0, 0, s, 0);
          this.ctx.quadraticCurveTo(0, 0, 0, s);
          this.ctx.quadraticCurveTo(0, 0, -s, 0);
          this.ctx.quadraticCurveTo(0, 0, 0, -s);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (p.shape === 'sequin') {
          this.ctx.scale(Math.cos(p.time * 1.6), 1);
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          // 'glitter' diamond
          this.ctx.scale(Math.cos(p.time * 1.4), Math.sin(p.time * 1.4));
          this.ctx.beginPath();
          const d = p.size * 0.6;
          this.ctx.moveTo(0, -d);
          this.ctx.lineTo(d, 0);
          this.ctx.lineTo(0, d);
          this.ctx.lineTo(-d, 0);
          this.ctx.closePath();
          this.ctx.fill();
        }

        this.ctx.restore();

        // Check if fallen below viewport
        if (p.y > this.height + 30 || p.x < -40 || p.x > this.width + 40) {
          const targetContinuousCount = isMobile ? 32 : 54;
          if (this.particles.length > targetContinuousCount) {
            this.particles.splice(i, 1);
            i--;
          } else {
            this.particles[i] = this.createParticle(-25);
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const confettiPetalEngine = new WesternPetalConfettiEngine('entry-canvas');

  // DOM Physical Confetti Burst from Wax Seal
  function triggerSealConfetti() {
    const confettiColors = [
      '#5c8c6f', '#7eaf92', '#3a634a', '#d4af37', '#f5e4bd',
      '#e8b6bb', '#ffffff', '#fff8ea', '#c99f57', '#f7d6d9', '#ffd700'
    ];
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    const seal = document.getElementById('wax-seal-btn');
    if (seal) {
      const rect = seal.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }

    const count = window.innerWidth < 600 ? 55 : 80;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.className = 'luxury-confetti-particle';
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = originX + 'px';
      conf.style.top = originY + 'px';
      const width = (5 + Math.random() * 8);
      const height = (7 + Math.random() * 12);
      conf.style.width = width + 'px';
      conf.style.height = height + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() > 0.4 ? '2px' : '50%';
      conf.style.boxShadow = '0 2px 6px rgba(45, 79, 59, 0.3)';
      conf.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 18;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 2.8;
      let rotation = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 16;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const startTime = performance.now();
      function stepAnim(now) {
        const elapsed = (now - startTime) / 1000;
        posX += vx * 0.98;
        posY += vy;
        vy += 0.4; // gravity
        rotation += rotSpeed;
        opacity -= 0.015;

        conf.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${Math.max(0, 1 - elapsed * 0.22)})`;
        conf.style.opacity = Math.max(0, opacity);

        if (opacity > 0 && posY < window.innerHeight + 100) {
          requestAnimationFrame(stepAnim);
        } else {
          conf.remove();
        }
      }
      requestAnimationFrame(stepAnim);
    }
  }

  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Default to English upon opening the invite unless Spanish was explicitly chosen
    if (!userSelectedLang || currentLang !== 'es') {
      applyLanguage('en');
    }

    // 1. Open envelope flap and glide up invitation card
    if (overlay) {
      overlay.classList.add('is-opened');
    }
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Trigger rich celebratory confetti & petals explosion
    try {
      if (confettiPetalEngine && typeof confettiPetalEngine.start === 'function') {
        confettiPetalEngine.start();
      }
      triggerSealConfetti();
    } catch (err) {
      console.warn('[Confetti notice]:', err);
    }

    // 3. Start background music if available
    try {
      playAudio();
      if (expandAudioBarFn) {
        expandAudioBarFn();
      }
    } catch (err) {}

    // 4. Smoothly fade out envelope overlay and unveil main site (1500ms)
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      if (expandAudioBarFn) {
        expandAudioBarFn();
      }
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#fbf8f3');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
    }, 1500);

    // 5. Final cleanup of overlay (2350ms)
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
      void document.body.offsetHeight;
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 50);
    }, 2350);

    triggerScrollReveals();
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. COUNTDOWN TIMER ENGINE (SATURDAY, DEC 12, 2026 AT 5:00 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (11 = December)
  const TARGET_DATE = new Date(2026, 11, 12, 17, 0, 0).getTime();
  const AFTER_EVENT_MS = 6 * 60 * 60 * 1000;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  const numbersRow = document.querySelector('.pt-numbers-row');

  // Create message element once
  let cdMsgEl = document.getElementById('cd-message');
  if (!cdMsgEl) {
    cdMsgEl = document.createElement('p');
    cdMsgEl.id = 'cd-message';
    cdMsgEl.className = 'cd-special-message';
    cdMsgEl.style.display = 'none';
    if (numbersRow) numbersRow.parentNode.insertBefore(cdMsgEl, numbersRow);
  }

  function showNumbers() {
    if (numbersRow) numbersRow.style.display = '';
    cdMsgEl.style.display = 'none';
  }

  function showMessage(key) {
    if (numbersRow) numbersRow.style.display = 'none';
    const dict = translations[currentLang] || translations.es;
    cdMsgEl.textContent = dict[key] || '';
    cdMsgEl.style.display = '';
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = TARGET_DATE - now;
    const days = diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;

    if (diff > 0 && days > 0) {
      showNumbers();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs  = Math.floor((diff % (1000 * 60)) / 1000);
      if (elDays)  elDays.textContent  = String(days).padStart(2, '0');
      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins)  elMins.textContent  = String(mins).padStart(2, '0');
      if (elSecs)  elSecs.textContent  = String(secs).padStart(2, '0');
    } else if (diff > 0 || -diff < AFTER_EVENT_MS) {
      showMessage('countdown-today');
    } else {
      showMessage('countdown-thankyou');
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─────────────────────────────────────────────────────────────
     5. SCROLL REVEAL (ALL ELEMENTS VISIBLE IMMEDIATELY)
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  triggerScrollReveals();

  /* ─────────────────────────────────────────────────────────────
     6. AMBIENT BOKEH BACKGROUND CANVAS
     ───────────────────────────────────────────────────────────── */
  const ambCanvas = document.getElementById('ambient-canvas');
  if (ambCanvas) {
    const ambCtx = ambCanvas.getContext('2d');
    let ambWidth = (ambCanvas.width = window.innerWidth);
    let ambHeight = (ambCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      ambWidth = ambCanvas.width = window.innerWidth;
      ambHeight = ambCanvas.height = window.innerHeight;
    });

    const bokehs = [];
    const count = window.innerWidth < 600 ? 16 : 28;

    for (let i = 0; i < count; i++) {
      bokehs.push({
        x: Math.random() * ambWidth,
        y: Math.random() * ambHeight,
        radius: Math.random() * 22 + 6,
        speedY: (Math.random() * 0.18 + 0.05),
        speedX: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.28 + 0.08,
        color: Math.random() > 0.4
          ? '255, 255, 255'
          : (Math.random() > 0.6
            ? '92, 140, 111'
            : (Math.random() > 0.5 ? '232, 182, 187' : '212, 175, 55'))
      });
    }

    function renderBokeh() {
      ambCtx.clearRect(0, 0, ambWidth, ambHeight);

      for (let i = 0; i < bokehs.length; i++) {
        const b = bokehs[i];
        b.y += b.speedY;
        b.x += b.speedX;

        if (b.y > ambHeight + 30) b.y = -30;
        if (b.x > ambWidth + 30) b.x = -30;
        if (b.x < -30) b.x = ambWidth + 30;

        ambCtx.save();
        ambCtx.beginPath();
        ambCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ambCtx.fillStyle = `rgba(${b.color}, ${b.alpha})`;
        ambCtx.shadowBlur = 12;
        ambCtx.shadowColor = `rgba(${b.color}, 0.5)`;
        ambCtx.fill();
        ambCtx.restore();
      }

      requestAnimationFrame(renderBokeh);
    }

    renderBokeh();
  }

  /* ─────────────────────────────────────────────────────────────
     7. RSVP MODAL & SUBMISSION SYSTEM
     ───────────────────────────────────────────────────────────── */
  const rsvpModal = document.getElementById('rsvp-modal');
  const openModalBtn = document.getElementById('open-rsvp-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const btnAccept = document.getElementById('btn-rsvp-accept');
  const btnDecline = document.getElementById('btn-rsvp-decline');
  const successAlert = document.getElementById('modal-success-alert');

  function openRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.add('is-active');
    rsvpModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (successAlert) successAlert.hidden = true;
    const nameInput = document.getElementById('guest-fullname');
    if (nameInput) setTimeout(() => nameInput.focus(), 200);
  }

  function closeRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('is-active');
    rsvpModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openRsvpModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeRsvpModal);

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) closeRsvpModal();
    });
  }

  async function processRsvp(isAttending) {
    const nameInput = document.getElementById('guest-fullname');
    const phoneInput = document.getElementById('guest-phone');
    const partySelect = document.getElementById('guest-party-size');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const partyVal = partySelect ? partySelect.value : (isAttending ? '1' : '0');

    if (!nameVal) {
      if (nameInput) {
        nameInput.focus();
        nameInput.classList.add('input-error');
        setTimeout(() => nameInput.classList.remove('input-error'), 1200);
      }
      return;
    }

    const payload = {
      eventSlug: EVENT_SLUG,
      clientName: CLIENT_NAME,
      clientEmail: CLIENT_EMAIL,
      submittedAt: new Date().toISOString(),
      fullname: nameVal,
      contact: phoneVal || 'Confirmed via Web',
      phone: phoneVal,
      email: '',
      attendance: isAttending ? 'Joyfully Accept' : 'Regretfully Decline',
      partySize: isAttending ? partyVal : '0',
      guests: isAttending ? partyVal : '0',
      notes: isAttending ? '' : 'Cannot attend',
      guestName: nameVal,
      name: nameVal,
      attendance_es: isAttending ? 'Sí, Asistirá' : 'No Podrá Asistir',
      attending: isAttending ? 'Yes' : 'No',
      wishes: '',
      song: '',
      message: ''
    };

    const targetBtn = isAttending ? btnAccept : btnDecline;
    const originalText = targetBtn ? targetBtn.innerHTML : '';

    if (btnAccept) btnAccept.disabled = true;
    if (btnDecline) btnDecline.disabled = true;

    if (targetBtn) {
      targetBtn.innerHTML = currentLang === 'en' ? '<span>Saving...</span>' : '<span>Guardando...</span>';
    }

    try {
      if (GOOGLE_SHEETS_RSVP_URL && GOOGLE_SHEETS_RSVP_URL.trim() !== '') {
        await fetch(GOOGLE_SHEETS_RSVP_URL.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      }

      // Confetti celebration if attending
      if (isAttending) {
        triggerRsvpConfetti();
      }

      // Tailored feedback display
      if (successAlert) {
        const dict = translations[currentLang] || translations.es;
        const descP = successAlert.querySelector('p');
        if (descP) {
          descP.textContent = isAttending ? dict['modal-success-desc'] : dict['modal-decline-desc'];
        }
        if (isAttending) {
          successAlert.classList.remove('is-decline');
        } else {
          successAlert.classList.add('is-decline');
        }
        successAlert.hidden = false;
        if (rsvpForm) rsvpForm.reset();
      }

      if (targetBtn) {
        targetBtn.innerHTML = currentLang === 'en' ? '<span>✓ Saved!</span>' : '<span>✓ ¡Guardado!</span>';
      }
    } catch (err) {
      console.error('[RSVP Error]:', err);
      alert(currentLang === 'en'
        ? 'There was an issue saving your response. Please check your connection and try again.'
        : 'Hubo un problema al guardar su respuesta. Por favor verifique su conexión e intente nuevamente.');
      if (btnAccept) {
        btnAccept.disabled = false;
        if (!isAttending && originalText) btnAccept.innerHTML = translations[currentLang]?.['btn-accept'] || translations.es['btn-accept'];
      }
      if (btnDecline) {
        btnDecline.disabled = false;
        if (isAttending && originalText) btnDecline.innerHTML = translations[currentLang]?.['btn-decline'] || translations.es['btn-decline'];
      }
      if (targetBtn && originalText) {
        targetBtn.innerHTML = originalText;
      }
    }
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', () => processRsvp(true));
  }

  if (btnDecline) {
    btnDecline.addEventListener('click', () => processRsvp(false));
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processRsvp(true);
    });
  }

  function triggerRsvpConfetti() {
    const confettiColors = [
      '#5c8c6f', '#7eaf92', '#3a634a', '#d4af37', '#f5e4bd',
      '#e8b6bb', '#ffffff', '#fff8ea', '#c99f57', '#f7d6d9', '#ffd700'
    ];
    const count = window.innerWidth < 600 ? 55 : 80;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.className = 'luxury-confetti-particle';
      conf.style.position = 'fixed';
      conf.style.zIndex = '9999';
      conf.style.left = '50%';
      conf.style.top = '50%';
      const width = 6 + Math.random() * 8;
      const height = 8 + Math.random() * 12;
      conf.style.width = width + 'px';
      conf.style.height = height + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() > 0.4 ? '2px' : '50%';
      conf.style.pointerEvents = 'none';
      conf.style.boxShadow = '0 2px 6px rgba(45, 79, 59, 0.3)';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 16;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 2.5;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx * 0.98;
        posY += vy;
        vy += 0.4; // gravity
        opacity -= 0.016;

        conf.style.transform = `translate(${posX}px, ${posY}px) rotate(${posX * 5}deg)`;
        conf.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(anim);
          conf.remove();
        }
      }, 16);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     COPY VENUE ADDRESS FUNCTIONALITY
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address') || '1770 Palm Ave, San Diego, CA 92154';
      const textSpan = copyBtn.querySelector('.copy-btn-text');
      const isEs = document.documentElement.lang === 'es';

      const showSuccess = () => {
        copyBtn.classList.add('copied');
        if (textSpan) textSpan.textContent = isEs ? '¡COPIADO! ✓' : 'COPIED! ✓';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (textSpan) textSpan.textContent = isEs ? 'COPIAR DIRECCIÓN' : 'COPY ADDRESS';
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(showSuccess).catch(() => {
          // Fallback via textarea
          fallbackCopy(address, showSuccess);
        });
      } else {
        fallbackCopy(address, showSuccess);
      }
    });

    function fallbackCopy(text, cb) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        cb();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  }

});
