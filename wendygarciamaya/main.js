/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCE INVITATION — WENDY GARCIA MAYA
 * Interactive Controller, Petals Cascade Engine & Audio
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 * Master Webhook URL automatically syncs RSVP entries into Wendy's
 * dedicated private Google Sheet.
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'wendygarciamaya';
const CLIENT_NAME = "Wendy Garcia Maya's Quinceañera";
const CLIENT_EMAIL = 'wendyg292010@gmail.com';

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
      'invite-16': 'Mis XV Años',
      'invite-quince': 'Mis XV Años',
      'invite-parents': 'MARIBEL MAYA &amp; JAVIER GARCIA',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A LOS QUINCE AÑOS',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-day': 'SÁBADO',
      'invite-date-full': '10 de Octubre, 2026',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'DENVER • COLORADO',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'SANTA MISA',
      'program-mass-desc': 'ASUNCION CATHOLIC CHURCH,<br />14050 MAXWELL PL, DENVER, CO 80239',
      'program-reception-title': 'ENTRADA AL SALÓN &amp; FIESTA',
      'program-reception-desc': 'SALON OCAMPO,<br />1733 W MISSISSIPPI AVE, DENVER, CO 80223',
      'program-dinner-title': 'CENA &amp; BRINDIS DE HONOR',
      'program-dinner-desc': 'CENA DE GALA Y<br />BRINDIS DE HONOR',
      'tl-btn-location': 'UBICACIÓN',
      'court-title': 'CORTE DE HONOR',
      'padrinos-role': 'PADRINOS DE HONOR',
      'padrinos-subtext': '“Con profundo agradecimiento por su amor, guía y bendiciones”',
      'court-role-chambelan': 'CHAMBELÁN DE HONOR',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'FORMAL / ELEGANTE',
      'dresscode-no-caps': 'NO GORRAS',
      'dresscode-no-sneakers': 'NO TENIS',
      'dresscode-no-sportswear': 'ROPA DEPORTIVA',
      'dresscode-desc': 'Les pedimos amablemente a nuestros invitados asistir con vestimenta formal y elegante.',
      'registry-title': 'LLUVIA DE SOBRES',
      'registry-desc': 'Lo más importante para nosotros es celebrar juntos. Si desea tener un detalle especial con Wendy, sus buenos deseos en sobre serán recibidos con mucho cariño.',
      'message-quote': 'Ayer era una niña soñando con crecer; hoy celebro mis quince años rodeada del amor de mi familia y amigos. Gracias a mis papás por su apoyo incondicional y por enseñarme el verdadero valor de la familia.',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR ANTES DEL 5 DE OCTUBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Wendy',
      'modal-subtitle': 'Sábado, 10 de Octubre de 2026 • Denver, CO',
      'label-fullname': 'Nombre Completo o Familia *',
      'btn-submit': 'Confirmar Asistencia',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su confirmación ha sido guardada con éxito. ¡Esperamos celebrar juntos este gran día!'
    },
    en: {
      'invite-16': 'Quinceañera',
      'invite-quince': 'Quinceañera',
      'invite-parents': 'MARIBEL MAYA &amp; JAVIER GARCIA',
      'invite-preamble': 'CORDIALLY INVITE YOU TO CELEBRATE THE QUINCEAÑERA OF THEIR DAUGHTER',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-day': 'SATURDAY',
      'invite-date-full': 'October 10, 2026',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'DENVER • COLORADO',
      'program-title': 'PROGRAM',
      'program-mass-title': 'HOLY MASS',
      'program-mass-desc': 'ASUNCION CATHOLIC CHURCH,<br />14050 MAXWELL PL, DENVER, CO 80239',
      'program-reception-title': 'SALON ARRIVAL &amp; PARTY',
      'program-reception-desc': 'SALON OCAMPO,<br />1733 W MISSISSIPPI AVE, DENVER, CO 80223',
      'program-dinner-title': 'DINNER &amp; HONOR TOAST',
      'program-dinner-desc': 'CELEBRATORY DINNER &amp;<br />HONOR TOAST',
      'tl-btn-location': 'LOCATION',
      'court-title': 'COURT OF HONOR',
      'padrinos-role': 'GODPARENTS OF HONOR',
      'padrinos-subtext': '“With heartfelt gratitude for their love, guidance, and blessings”',
      'court-role-chambelan': 'MAIN CHAMBELÁN',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'FORMAL / ELEGANT',
      'dresscode-no-caps': 'NO HATS / CAPS',
      'dresscode-no-sneakers': 'NO SNEAKERS',
      'dresscode-no-sportswear': 'SPORTSWEAR',
      'dresscode-desc': 'We kindly ask our guests to attend in formal and elegant attire.',
      'registry-title': 'WISHING WELL',
      'registry-desc': 'Celebrating together is what matters most to us. If you wish to bless Wendy with a special token of love, an envelope wishing well will be available.',
      'message-quote': 'Yesterday I was a little girl dreaming of growing up; today I celebrate my fifteenth birthday surrounded by the love of my family and friends. Thank you to my parents for your endless support and for always being my greatest foundation.',
      'rsvp-deadline': 'PLEASE CONFIRM BY OCTOBER 5, 2026',
      'rsvp-btn': 'CONFIRM RSVP',
      'rsvp-instruction': 'CLICK THE BUTTON TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'RSVP for Wendy',
      'modal-subtitle': 'Saturday, October 10, 2026 • Denver, CO',
      'label-fullname': 'Full Name or Family Name *',
      'btn-submit': 'Confirm RSVP',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate together!'
    }
  };

  let currentLang = 'es';

  function applyLanguage(lang) {
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
  }

  const btnEs = document.getElementById('btn-lang-es');
  const btnEn = document.getElementById('btn-lang-en');
  if (btnEs) btnEs.addEventListener('click', () => applyLanguage('es'));
  if (btnEn) btnEn.addEventListener('click', () => applyLanguage('en'));

  // Default to Spanish on startup
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

    bindToggle(langBar, langToggle, 'Ocultar selector de idioma', 'Mostrar selector de idioma');
    bindToggle(audioBar, audioToggle, 'Ocultar reproductor', 'Mostrar reproductor de música');

    if (langBar && langToggle && langBar.dataset.userToggled !== 'true') {
      setCollapsed(langBar, langToggle, true, 'Ocultar selector de idioma', 'Mostrar selector de idioma');
    }
    if (audioBar && audioToggle && audioBar.dataset.userToggled !== 'true') {
      setCollapsed(audioBar, audioToggle, true, 'Ocultar reproductor', 'Mostrar reproductor de música');
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & BABY BLUE CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealTrigger = document.getElementById('wax-seal-trigger');
  let envelopeOpened = false;

  // Falling Petal Engine in Baby Blue, Sky Pastel & Sparkling Silver Palette
  class BabyBluePetalEngine {
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
          'rgba(91, 163, 208, 0.90)',   // baby blue
          'rgba(122, 189, 230, 0.92)',  // pastel sky blue
          'rgba(189, 224, 245, 0.92)',  // soft ice blue
          'rgba(216, 238, 250, 0.90)',  // airy powder blue
          'rgba(148, 163, 184, 0.88)',  // silver sheen
          'rgba(203, 213, 225, 0.90)',  // silver pearl
          'rgba(255, 255, 255, 0.96)',  // glistening white
          'rgba(241, 245, 249, 0.90)'   // white shimmer
        ][Math.floor(Math.random() * 8)],
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
        p.speedY = Math.abs(Math.sin(angle) * speed) + 0.8;
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
        this.ctx.shadowColor = 'rgba(91, 163, 208, 0.35)';
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

  const babyBluePetals = new BabyBluePetalEngine('entry-canvas');

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
    babyBluePetals.start();

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

  if (waxSealTrigger) {
    waxSealTrigger.addEventListener('click', (e) => {
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
     4. COUNTDOWN TIMER ENGINE (SATURDAY, OCT 10, 2026 AT 1:00 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (9 = October)
  const TARGET_DATE = new Date(2026, 9, 10, 13, 0, 0).getTime();
  // Show "thank you" message 5 hours after event starts (gives time for a late party)
  const AFTER_EVENT_MS = 5 * 60 * 60 * 1000;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  const numbersRow = document.querySelector('.pt-numbers-row');

  // Create message element once (injected into the countdown section)
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
      // Normal countdown — more than 0 whole days remaining
      showNumbers();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs  = Math.floor((diff % (1000 * 60)) / 1000);
      if (elDays)  elDays.textContent  = String(days).padStart(2, '0');
      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins)  elMins.textContent  = String(mins).padStart(2, '0');
      if (elSecs)  elSecs.textContent  = String(secs).padStart(2, '0');
    } else if (diff > 0 || -diff < AFTER_EVENT_MS) {
      // Day of (same day, hours counting down) OR event started but party is still going
      showMessage('countdown-today');
    } else {
      // 5+ hours after event start — party is over, show thank you
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
        color: Math.random() > 0.5 ? '255, 255, 255' : '186, 224, 247'
      });
    }

    function renderBokeh() {
      ambCtx.clearRect(0, 0, ambWidth, ambHeight);

      for (let i = 0; i < bokehs.length; i++) {
        const b = bokehs[i];
        b.y += b.speedY;
        b.x += b.speedX;

        if (b.y > ambHeight + b.radius) {
          b.y = -b.radius;
          b.x = Math.random() * ambWidth;
        }

        ambCtx.beginPath();
        const grad = ambCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `rgba(${b.color}, ${b.alpha})`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ambCtx.fillStyle = grad;
        ambCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ambCtx.fill();
      }

      requestAnimationFrame(renderBokeh);
    }

    renderBokeh();
  }


  /* ─────────────────────────────────────────────────────────────
     6. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => {
      observer.observe(el);
    });
  }


  /* ─────────────────────────────────────────────────────────────
     7. INTERACTIVE RSVP MODAL & CONFETTI CELEBRATION
     ───────────────────────────────────────────────────────────── */
  const rsvpModal = document.getElementById('rsvp-modal');
  const openModalBtn = document.getElementById('open-rsvp-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const successAlert = document.getElementById('modal-success-alert');

  function openRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.add('is-active');
    rsvpModal.setAttribute('aria-hidden', 'false');
  }

  function closeRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('is-active');
    rsvpModal.setAttribute('aria-hidden', 'true');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openRsvpModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeRsvpModal);

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) closeRsvpModal();
    });
  }

  const nameInput = document.getElementById('guest-fullname');
  if (nameInput) {
    nameInput.addEventListener('input', () => { nameInput.style.borderColor = ''; });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal && rsvpModal.classList.contains('is-active')) {
      closeRsvpModal();
    }
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const btn = document.getElementById('btn-submit-rsvp');

      if (!nameVal) {
        if (nameInput) {
          nameInput.focus();
          nameInput.style.borderColor = '#ef4444';
        }
        return;
      }

      const payload = {
        eventSlug: EVENT_SLUG,
        clientName: CLIENT_NAME,
        clientEmail: CLIENT_EMAIL,
        submittedAt: new Date().toISOString(),
        // Primary keys expected by Google Sheets
        fullname: nameVal,
        contact: 'Confirmado por Web',
        attendance: 'Joyfully Accept',
        partySize: '1',
        notes: '',
        // Fallback & descriptive aliases
        guestName: nameVal,
        name: nameVal,
        phone: '',
        email: '',
        attendance_es: 'Sí, Asistirá',
        attending: 'Yes',
        guests: '1',
        wishes: '',
        song: '',
        message: ''
      };

      const originalBtnText = btn ? btn.textContent : (currentLang === 'en' ? 'Confirm RSVP' : 'Confirmar Asistencia');
      if (btn) {
        btn.disabled = true;
        btn.textContent = currentLang === 'en' ? 'Saving RSVP...' : 'Guardando confirmación...';
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

        // Celebratory Confetti Burst
        triggerConfetti();

        // Show success feedback
        if (successAlert) {
          successAlert.hidden = false;
          rsvpForm.reset();
        }
        if (btn) {
          btn.textContent = currentLang === 'en' ? 'RSVP Confirmed! ✓' : '¡Confirmado con Éxito! ✓';
        }
      } catch (err) {
        console.error('[RSVP Error]:', err);
        alert(currentLang === 'en'
          ? 'There was an issue saving your confirmation. Please check your connection and try again.'
          : 'Hubo un problema al guardar su confirmación. Por favor verifique su conexión e intente nuevamente.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      }
    });
  }

  function triggerConfetti() {
    const confettiColors = ['#5ba3d0', '#7abde6', '#bce3fa', '#94a3b8', '#cbd5e1', '#ffffff', '#e2e8f0'];
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
