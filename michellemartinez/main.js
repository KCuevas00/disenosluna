/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCEAÑERA INVITATION — MICHELLE MARTINEZ (BASIC PACKAGE)
 * Interactive Controller & RSVP (Spanish Only, No Music, Static Opened Invitation)
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'michellemartinez';
const CLIENT_NAME = "Michelle Martinez's Quinceañera (Griselda Martinez)";
const CLIENT_EMAIL = 'floresmarlene56@yahoo.com';

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
    es: {
      'entry-invited': '¡Estás Invitada!',
      'entry-subtitle': 'MICHELLE MARTINEZ • XV AÑOS',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'invite-quince': 'XV Años',
      'invite-parents': 'HERASMO Y GRISELDA MARTINEZ',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A CELEBRAR',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-month': 'NOV',
      'invite-date-day': 'VIERNES',
      'invite-date-time': 'A LAS 5:30 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'TUCSON • ARIZONA',
      'program-title': 'PROGRAMA',
      'program-arrival-title': 'LLEGADA DE INVITADOS',
      'program-arrival-desc': 'CRYSTAL EVENT CENTER<br />610 W PRINCE RD, TUCSON, AZ 85705',
      'program-dinner-title': 'CENA',
      'program-dinner-desc': 'BANQUETE EN HONOR A MICHELLE MARTINEZ',
      'program-entrance-title': 'ENTRADA TRIUNFAL',
      'program-entrance-desc': '',
      'program-waltz-title': 'VALS',
      'program-waltz-desc': 'TRADICIONAL VALS DE QUINCEAÑERA',
      'program-toast-title': 'BRINDIS',
      'program-toast-desc': 'BRINDIS DE HONOR',
      'program-surprise-title': 'BAILE SORPRESA',
      'program-surprise-desc': 'PRESENTACIÓN COREOGRÁFICA ESPECIAL',
      'program-cake-title': 'CORTE DE PASTEL',
      'program-cake-desc': 'CORTE DE PASTEL Y MAÑANITAS',
      'program-dance-title': 'BAILE',
      'program-dance-desc': 'PISTA DE BAILE ABIERTA Y MÚSICA',
      'program-end-title': 'FIN DEL EVENTO',
      'program-end-desc': '¡AGRADECIMIENTO Y DESPEDIDA A NUESTROS INVITADOS!',
      'tl-btn-location': 'CÓMO LLEGAR',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'court-title': 'CORTE DE HONOR Y PADRINOS',
      'court-chambelan-title': 'CHAMBELÁN DE HONOR',
      'court-parejas-title': 'PAREJAS DE HONOR',
      'court-mini-title': 'MINI QUINCEAÑERA',
      'padrinos-title': 'PADRINOS',
      'registry-title': 'LLUVIA DE SOBRES',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Tu presencia en este día tan especial es el regalo más hermoso. Si deseas obsequiarme un detalle adicional, habrá una lluvia de sobres durante la celebración. Gracias por acompañar y ser parte de un recuerdo que guardaré siempre en mi corazón.',
      'message-quote': 'Con mucha alegría y con el corazón lleno de amor, tenemos el honor de invitarles a celebrar los XV años de nuestra querida hija, Michelle Martinez.<br /><br />Este día tan especial marca una etapa hermosa en su vida, y nos llena de felicidad poder compartir este momento tan importante con nuestros familiares y amigos.<br /><br />Será un honor contar con su presencia para celebrar juntos esta ocasión inolvidable, llena de amor, alegría y bendiciones.',
      'message-signature': 'Herasmo y Griselda Martinez',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR SU ASISTENCIA ANTES DEL 13 DE NOVIEMBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Michelle Martinez',
      'modal-subtitle': 'Viernes, 13 de Noviembre de 2026 • Tucson, AZ',
      'label-fullname': 'Nombre Completo o Familia *',
      'label-phone': 'Número de Teléfono (Opcional)',
      'label-party': 'Número de Asistentes (Opcional)',
      'opt-party-1': '1 Persona',
      'opt-party-2': '2 Personas',
      'opt-party-3': '3 Personas',
      'opt-party-4': '4 Personas',
      'opt-party-5': '5+ Personas (Familia)',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">SÍ, ASISTIRÉ</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">NO PODRÉ ASISTIR</span>',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su respuesta ha sido guardada con éxito. ¡Esperamos celebrar juntos este gran día!',
      'modal-decline-desc': 'Gracias por avisarnos. Su respuesta ha sido guardada.'
    },
    en: {
      'entry-invited': "You've Been Invited!",
      'entry-subtitle': 'MICHELLE MARTINEZ • QUINCEAÑERA',
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'invite-quince': 'Quinceañera',
      'invite-parents': 'HERASMO &amp; GRISELDA MARTINEZ',
      'invite-preamble': 'CORDIALLY INVITE YOU TO CELEBRATE THE',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-month': 'NOV',
      'invite-date-day': 'FRIDAY',
      'invite-date-time': 'AT 5:30 PM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Big Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'TUCSON • ARIZONA',
      'program-title': 'EVENT SCHEDULE',
      'program-arrival-title': 'GUEST ARRIVAL',
      'program-arrival-desc': 'CRYSTAL EVENT CENTER<br />610 W PRINCE RD, TUCSON, AZ 85705',
      'program-dinner-title': 'DINNER',
      'program-dinner-desc': 'BANQUET IN HONOR OF MICHELLE MARTINEZ',
      'program-entrance-title': 'GRAND ENTRANCE',
      'program-entrance-desc': '',
      'program-waltz-title': 'WALTZ',
      'program-waltz-desc': 'TRADITIONAL QUINCEAÑERA WALTZ',
      'program-toast-title': 'TOAST',
      'program-toast-desc': 'HONOR TOAST',
      'program-surprise-title': 'SURPRISE DANCE',
      'program-surprise-desc': 'SPECIAL CHOREOGRAPHED DANCE PERFORMANCE',
      'program-cake-title': 'CAKE CUTTING',
      'program-cake-desc': 'CAKE CUTTING &amp; CELEBRATION',
      'program-dance-title': 'DANCE PARTY',
      'program-dance-desc': 'OPEN DANCE FLOOR &amp; MUSIC',
      'program-end-title': 'FAREWELL',
      'program-end-desc': 'THANK YOU AND FAREWELL TO OUR GUESTS!',
      'tl-btn-location': 'GET DIRECTIONS',
      'tl-btn-directions': 'GET DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'court-title': 'COURT OF HONOR &amp; GODPARENTS',
      'court-chambelan-title': 'CHAMBELÁN OF HONOR',
      'court-parejas-title': 'HONOR COUPLES',
      'court-mini-title': 'MINI QUINCEAÑERA',
      'padrinos-title': 'GODPARENTS',
      'registry-title': 'WISHING WELL',
      'registry-subtitle': 'CASH / ENVELOPE SHOWER',
      'registry-desc': 'Your presence on this special day is our greatest gift. If you wish to bless Michelle with an additional token of love, an envelope shower will take place during the celebration. Thank you for being part of a memory she will cherish forever in her heart.',
      'message-quote': 'With great joy and our hearts full of love, we have the honor of inviting you to celebrate the XV years of our beloved daughter, Michelle Martinez.<br /><br />This special day marks a beautiful milestone in her life, and it brings us immense happiness to share this momentous celebration with our dear family and friends.<br /><br />It will be an absolute honor to celebrate together this unforgettable occasion, filled with love, joy, and blessings.',
      'message-signature': 'Herasmo &amp; Griselda Martinez',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BEFORE NOVEMBER 13, 2026',
      'rsvp-btn': 'CONFIRM ATTENDANCE',
      'rsvp-instruction': 'CLICK THE BUTTON BELOW TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'Confirm Attendance for Michelle Martinez',
      'modal-subtitle': 'Friday, November 13, 2026 • Tucson, AZ',
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
    }
  };

  let currentLang = 'es';
  let userSelectedLang = false;

  function applyLanguage(lang = 'es') {
    currentLang = lang;
    document.documentElement.lang = lang;
    const dict = translations[lang] || translations.es;

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

  // Default strictly to Spanish on startup
  applyLanguage('es');

  // Collapsible utility tabs (Language bar top-left, audio bar top-right)
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

    function bindToggle(bar, btn, hiddenLabel, shownLabel) {
      if (!bar || !btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        bar.dataset.userToggled = 'true';
        setCollapsed(bar, btn, !bar.classList.contains('collapsed'), hiddenLabel, shownLabel);
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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER (Selena - Dreaming of You)
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

  // Canvas Petal & Multi-Shape Confetti Engine (Masquerade Theme)
  class MasqueradePetalConfettiEngine {
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
        'rgba(133, 83, 186, 0.95)', // Regal royal lavender
        'rgba(71, 38, 110, 0.95)',  // Deep masquerade amethyst
        'rgba(192, 132, 252, 0.92)',// Soft radiant lilac
        'rgba(147, 83, 211, 0.95)', // Dreamy orchid purple
        'rgba(212, 170, 99, 0.95)', // Champagne gold leaf
        'rgba(245, 228, 189, 0.96)',// Shimmering warm gold
        'rgba(176, 180, 196, 0.95)',// Sterling platinum silver
        'rgba(255, 255, 255, 0.98)',// Crystalline pearl white
        'rgba(93, 57, 134, 0.92)'   // Midnight velvet royal purple
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
      if (this.isRunning) return;
      this.isRunning = true;
      this.triggerCelebratoryBurst();
      this.animate();
    }

    animate() {
      if (!this.isRunning) return;
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
        this.ctx.shadowColor = 'rgba(133, 83, 186, 0.35)';

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

  const confettiPetalEngine = new MasqueradePetalConfettiEngine('entry-canvas');

  // DOM Physical Confetti Burst from Wax Seal
  function triggerSealConfetti() {
    const confettiColors = [
      '#8e54e9', '#9353d3', '#b0b7c6', '#c084fc', '#d8b4e2',
      '#7d4ac7', '#e6e6fa', '#ffffff', '#e9edf5', '#5d3986', '#d4aa63', '#f5e4bd'
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
      conf.style.boxShadow = '0 2px 6px rgba(93, 57, 134, 0.3)';
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

    // Default to Spanish upon opening the invite unless English was explicitly chosen
    if (!userSelectedLang || currentLang !== 'en') {
      applyLanguage('es');
    }

    // 1. Open envelope flap and glide up invitation card
    if (overlay) {
      overlay.classList.add('is-opened');
    }
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Trigger rich celebratory confetti & petals explosion
    confettiPetalEngine.start();
    triggerSealConfetti();

    // 3. Start background music automatically
    playAudio();

    // 4. Smoothly fade out envelope overlay and unveil main site (1500ms)
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#e6e6fa');
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
     4. COUNTDOWN TIMER ENGINE (FRIDAY, NOV 13, 2026 AT 5:30 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (10 = November)
  const TARGET_DATE = new Date(2026, 10, 13, 17, 30, 0).getTime();
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
            ? '133, 83, 186'
            : (Math.random() > 0.5 ? '192, 132, 252' : '212, 170, 99'))
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
      '#8e54e9', '#9353d3', '#b0b7c6', '#c084fc', '#d8b4e2',
      '#7d4ac7', '#e6e6fa', '#ffffff', '#e9edf5', '#5d3986', '#d4aa63', '#f5e4bd'
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
      conf.style.boxShadow = '0 2px 6px rgba(71, 38, 110, 0.3)';

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
      const address = copyBtn.getAttribute('data-address') || 'Crystal Event Center, 610 W Prince Rd, Tucson, AZ 85705';
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
