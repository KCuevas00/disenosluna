/**
 * ═════════════════════════════════════════════════════════════════════
 * SWEET 16 / 16 AÑOS INVITATION — KAYLEE JANETH PALAPA MAYOR
 * Interactive Controller, Petals Cascade Engine, Bilingual Audio & RSVP
 * Cielito Lindo Theme — Champagne & Blush System
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'kayleepalapamayor';
const CLIENT_NAME = "Kaylee Janeth Palapa Mayor's Sweet 16";
const CLIENT_EMAIL = 'yeseniapalapa@yahoo.com';
const ORDER_REFERENCE = 'DL-2026-8V45N';

document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser from restoring a previous scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

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
      'invite-16': '16 Años',
      'invite-quince': '16 Años',
      'invite-parents': 'JUAN PALAPA &amp; ROSA MAYOR',
      'invite-preamble': 'TIENEN EL PLACER DE INVITARLE A CELEBRAR LOS',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-day': 'SÁBADO',
      'invite-date-full': '21 de Noviembre, 2026',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'LOS ANGELES • CALIFORNIA',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'SANTA MISA',
      'program-mass-desc': 'IGLESIA INMACULADA CONCEPCIÓN,<br />1433 JAMES M. WOOD BLVD, LOS ANGELES, CA 90015',
      'program-reception-title': 'ENTRADA',
      'program-reception-desc': '1437 OAK ST,<br />1437 OAK ST, LOS ANGELES, CA 90015',
      'program-dinner-title': 'COMIDA',
      'program-waltz-title': 'VALS',
      'program-party-title': 'BAILE &amp; FIESTA',
      'program-end-title': 'FIN DEL EVENTO',
      'tl-btn-location': 'UBICACIÓN',
      'court-title': 'CORTE DE HONOR',
      'padrinos-role': 'PADRINOS DE HONOR',
      'padrinos-subtext': '“Con profundo agradecimiento por su amor, guía y bendiciones”',
      'court-madrina-cake': 'MADRINA DE PASTEL',
      'court-madrinas-toast': 'MADRINAS DE BRINDIS',
      'court-chambelanes-title': 'CHAMBELANES',
      'court-chambelan-badge': 'CHAMBELÁN',
      'registry-title': 'LLUVIA DE SOBRES',
      'registry-desc': 'Lo más importante para nosotros es celebrar juntos. Si desea tener un detalle especial con Kaylee, sus buenos deseos en sobre serán recibidos con mucho cariño.',
      'message-quote': 'Hay momentos en la vida que son inolvidables, y cumplir 16 años es uno de ellos. Por eso quiero celebrar este día tan especial rodeada de las personas que más quiero. Gracias a mi familia y an mis amigos por ser parte de mi vida!',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR ANTES DEL 21 DE OCTUBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Kaylee',
      'modal-subtitle': 'Sábado, 21 de Noviembre de 2026 • Los Angeles, CA',
      'label-fullname': 'Nombre Completo o Familia *',
      'label-party': 'Número de Personas o Pases *',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">SÍ, ASISTIRÉ</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">NO PODRÉ ASISTIR</span>',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su respuesta ha sido guardada con éxito. ¡Esperamos celebrar juntos este gran día!',
      'modal-decline-desc': 'Gracias por avisarnos. Su respuesta ha sido guardada.'
    },
    en: {
      'invite-16': 'Sweet 16',
      'invite-quince': 'Sweet 16',
      'invite-parents': 'JUAN PALAPA &amp; ROSA MAYOR',
      'invite-preamble': 'HAVE THE PLEASURE OF INVITING YOU TO CELEBRATE THE',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-day': 'SATURDAY',
      'invite-date-full': 'November 21, 2026',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'LOS ANGELES • CALIFORNIA',
      'program-title': 'PROGRAM',
      'program-mass-title': 'HOLY MASS',
      'program-mass-desc': 'IMMACULATE CONCEPTION CATHOLIC CHURCH,<br />1433 JAMES M. WOOD BLVD, LOS ANGELES, CA 90015',
      'program-reception-title': 'ENTRANCE',
      'program-reception-desc': '1437 OAK ST,<br />1437 OAK ST, LOS ANGELES, CA 90015',
      'program-dinner-title': 'DINNER',
      'program-waltz-title': 'WALTZ',
      'program-party-title': 'PARTY &amp; DANCING',
      'program-end-title': 'EVENT CONCLUSION',
      'tl-btn-location': 'LOCATION',
      'court-title': 'COURT OF HONOR',
      'padrinos-role': 'GODPARENTS OF HONOR',
      'padrinos-subtext': '“With heartfelt gratitude for their love, guidance, and blessings”',
      'court-madrina-cake': 'CAKE GODMOTHER',
      'court-madrinas-toast': 'TOAST GODMOTHERS',
      'court-chambelanes-title': 'CHAMBELANES',
      'court-chambelan-badge': 'CHAMBELÁN',
      'registry-title': 'WISHING WELL',
      'registry-desc': 'Celebrating together is what matters most to us. If you wish to bless Kaylee with a special token of love, an envelope wishing well will be available.',
      'message-quote': 'There are moments in life that are unforgettable, and turning 16 is one of them. That’s why I want to celebrate this special day surrounded by the people I love most. Thank you to my family and friends for being part of my life!',
      'rsvp-deadline': 'PLEASE CONFIRM BY OCTOBER 21, 2026',
      'rsvp-btn': 'CONFIRM RSVP',
      'rsvp-instruction': 'CLICK THE BUTTON TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'RSVP for Kaylee',
      'modal-subtitle': 'Saturday, November 21, 2026 • Los Angeles, CA',
      'label-fullname': 'Full Name or Family Name *',
      'label-party': 'Number of Guests *',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">YES, ATTENDING</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">CANNOT ATTEND</span>',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate together!',
      'modal-decline-desc': 'Thank you for letting us know! Your response has been saved.'
    }
  };

  let currentLang = 'en';

  function applyLanguage(lang) {
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
  }

  const btnEs = document.getElementById('btn-lang-es');
  const btnEn = document.getElementById('btn-lang-en');
  if (btnEs) btnEs.addEventListener('click', () => applyLanguage('es'));
  if (btnEn) btnEn.addEventListener('click', () => applyLanguage('en'));

  // Default to English on startup per customer preference
  applyLanguage('en');

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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');

  let isAudioPlaying = false;

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    if (audioToggleBtn) {
      if (playing) {
        audioToggleBtn.classList.add('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'none';
        if (audioPauseIcon) audioPauseIcon.style.display = 'inline-flex';
      } else {
        audioToggleBtn.classList.remove('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'inline-flex';
        if (audioPauseIcon) audioPauseIcon.style.display = 'none';
      }
    }
  }

  function playAudio() {
    if (!bgAudio) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
        })
        .catch(err => {
          console.warn('Audio play interrupted or restricted:', err);
        });
    }
  }

  function pauseAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    updatePlayState(false);
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // Calculate dynamic ping-pong marquee distance for song title ticker
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & PETALS CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  let envelopeOpened = false;

  // Falling Petal Engine in Champagne Ivory, Blush Rose & Gold
  class ChampagneBlushPetalEngine {
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

    createPetal(initialY = -25) {
      return {
        x: Math.random() * this.width,
        y: initialY,
        size: Math.random() * 9 + 8, // 8px to 17px visible lush petals
        speedY: Math.random() * 1.5 + 0.9, // steady elegant downward drift
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.9,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.8,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmplitude: Math.random() * 30 + 15,
        time: Math.random() * 100,
        opacity: Math.random() * 0.35 + 0.65,
        color: [
          'rgba(244, 194, 203, 0.95)', // delicate blush rose
          'rgba(232, 165, 178, 0.92)', // dusty blush petal
          'rgba(216, 138, 150, 0.90)', // warm rose
          'rgba(255, 248, 238, 0.96)', // soft champagne ivory
          'rgba(247, 235, 215, 0.94)', // warm champagne cream
          'rgba(223, 189, 130, 0.90)', // shimmering champagne gold
          'rgba(203, 163, 104, 0.88)', // warm antique gold
          'rgba(196, 208, 192, 0.85)', // pale sage eucalyptus leaf
          'rgba(255, 255, 255, 0.96)'  // sparkling pure ivory
        ][Math.floor(Math.random() * 9)],
        bend: Math.random() * 0.5 + 0.5
      };
    }

    triggerCelebratoryBurst() {
      if (this.hasTriggeredBurst) return;
      this.hasTriggeredBurst = true;
      const burstCount = window.innerWidth < 600 ? 55 : 85;

      for (let i = 0; i < burstCount; i++) {
        const startY = (Math.random() * -0.6 * this.height) - 10;
        const p = this.createPetal(startY);
        p.speedY = Math.random() * 2.8 + 1.6;
        p.speedX = (Math.random() - 0.5) * 2.4;
        p.rotationSpeed = (Math.random() - 0.5) * 3.5;
        this.particles.push(p);
      }

      // Radial burst around envelope
      const originX = this.width / 2;
      const originY = this.height / 2;
      const ringCount = window.innerWidth < 600 ? 25 : 40;

      for (let j = 0; j < ringCount; j++) {
        const p = this.createPetal(originY);
        p.x = originX + (Math.random() - 0.5) * 80;
        p.y = originY + (Math.random() - 0.5) * 60;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.2 + 1.2;
        p.speedX = Math.cos(angle) * speed;
        p.speedY = Math.abs(Math.sin(angle)) * speed + 0.8;
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

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.time += p.swaySpeed;
        p.x += Math.sin(p.time) * (p.swayAmplitude * 0.04) + p.speedX * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.scale(Math.cos(p.time * 0.8), p.bend);

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-p.size * 0.7, -p.size * 0.5, -p.size * 0.8, p.size * 0.8, 0, p.size);
        this.ctx.bezierCurveTo(p.size * 0.8, p.size * 0.8, p.size * 0.7, -p.size * 0.5, 0, 0);
        this.ctx.closePath();

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(184, 98, 115, 0.35)';
        this.ctx.fill();
        this.ctx.restore();

        if (p.y > this.height + 40) {
          if (this.particles.length > (window.innerWidth < 600 ? 30 : 50)) {
            this.particles.splice(i, 1);
            i--;
          } else {
            this.particles[i] = this.createPetal(-25);
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const petalsEngine = new ChampagneBlushPetalEngine('entry-canvas');

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // 1. Open envelope flap and glide up invitation card
    if (overlay) {
      overlay.classList.add('is-opened');
    }
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Start petals cascade
    petalsEngine.start();

    // 3. Start audio soundtrack
    playAudio();

    // 4. Smoothly fade out envelope overlay and unveil main site
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
    }, 1500);

    // 5. Final cleanup of overlay
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
     4. COUNTDOWN TIMER ENGINE (SATURDAY, NOV 21, 2026 AT 2:00 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (10 = November)
  const TARGET_DATE = new Date(2026, 10, 21, 14, 0, 0).getTime();
  const AFTER_EVENT_MS = 5 * 60 * 60 * 1000;

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
    const dict = translations[currentLang] || translations.en;
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
     5. AMBIENT BOKEH BACKGROUND CANVAS
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
    const count = window.innerWidth < 600 ? 16 : 30;

    for (let i = 0; i < count; i++) {
      bokehs.push({
        x: Math.random() * ambWidth,
        y: Math.random() * ambHeight,
        radius: Math.random() * 20 + 6,
        speedY: (Math.random() * 0.18 + 0.05),
        speedX: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.28 + 0.08,
        color: Math.random() > 0.4 ? '255, 255, 255' : (Math.random() > 0.6 ? '223, 189, 130' : (Math.random() > 0.5 ? '242, 184, 198' : '203, 163, 104'))
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
        ambCtx.shadowColor = `rgba(${b.color}, 0.4)`;
        ambCtx.fill();
        ambCtx.restore();
      }

      requestAnimationFrame(renderBokeh);
    }

    renderBokeh();
  }

  /* ─────────────────────────────────────────────────────────────
     6. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    const reveals = document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  triggerScrollReveals();

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
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const partySelect = document.getElementById('guest-party-size');
    const partyVal = partySelect ? partySelect.value : '1';

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
      orderRef: ORDER_REFERENCE,
      submittedAt: new Date().toISOString(),
      fullname: nameVal,
      contact: 'Confirmado por Web',
      attendance: isAttending ? 'Joyfully Accept' : 'Regretfully Decline',
      partySize: isAttending ? partyVal : '0',
      notes: isAttending ? `Party size: ${partyVal}` : 'No podrá asistir',
      guestName: nameVal,
      name: nameVal,
      phone: '',
      email: '',
      attendance_es: isAttending ? 'Sí, Asistirá' : 'No Podrá Asistir',
      attending: isAttending ? 'Yes' : 'No',
      guests: isAttending ? partyVal : '0',
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
        triggerConfetti();
      }

      // Tailored feedback display
      if (successAlert) {
        const dict = translations[currentLang] || translations.en;
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
        if (!isAttending && originalText) btnAccept.innerHTML = translations[currentLang]?.['btn-accept'] || '✓ YES, ATTENDING';
      }
      if (btnDecline) {
        btnDecline.disabled = false;
        if (isAttending && originalText) btnDecline.innerHTML = translations[currentLang]?.['btn-decline'] || '✕ CANNOT ATTEND';
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

  function triggerConfetti() {
    const confettiColors = ['#cba368', '#dfbd82', '#d48896', '#e5a5b2', '#fbf6ec', '#ffffff', '#7a3543', '#fdf5f6'];
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '9999';
      conf.style.left = '50%';
      conf.style.top = '50%';
      conf.style.width = (6 + Math.random() * 8) + 'px';
      conf.style.height = (8 + Math.random() * 12) + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = '2px';
      conf.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 14;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx;
        posY += vy;
        vy += 0.4; // gravity
        opacity -= 0.02;

        conf.style.transform = `translate(${posX}px, ${posY}px) rotate(${posX * 4}deg)`;
        conf.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(anim);
          conf.remove();
        }
      }, 16);
    }
  }
});
