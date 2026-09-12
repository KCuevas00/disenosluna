/**
 * ═════════════════════════════════════════════════════════════════════
 * GRADUATION INVITATION — SOFIA ELENA
 * Interactive Controller, Petals Cascade Engine & Audio
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 * Master Webhook URL automatically syncs RSVP entries into Sofia's
 * dedicated Google Sheet.
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'gradtemplate';
const CLIENT_NAME = "Sofia Elena's Graduation";
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
      'invite-title': 'Graduation',
      'invite-school': 'UNIVERSITY OF NOTRE DAME',
      'invite-preamble': 'TOGETHER WITH HER FAMILY<br/>CORDIALLY INVITE YOU TO CELEBRATE THE GRADUATION OF',
      'invite-degree': 'B.S. IN MOLECULAR &amp; CELLULAR BIOLOGY &ensp;&middot;&ensp; MAGNA CUM LAUDE<br/><span class="honors-track">College of Science &bull; Class of 2026 &bull; Pre-Medicine Concentration</span>',
      'message-quote': 'the chapter where she actually gets the degree. thank you to everyone who kept me afloat.',
      'invite-date-day': 'SATURDAY',
      'invite-date-full': 'May 15, 2027',
      'invite-date-time': '5:00 PM – 9:00 PM',
      'invite-venue': 'NOTRE DAME • INDIANA',
      'countdown-title': 'COUNTING DOWN TO COMMENCEMENT',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'program-title': 'PARTY DETAILS',
      'program-food-title': 'FOOD &amp; DRINKS',
      'program-food-desc': 'Open bar, heavy bites, and sweet treats provided. Come hungry.',
      'program-location-title': 'LOCATION &amp; PARKING',
      'program-location-desc': 'Street parking available along Notre Dame Ave, or park in the Joyce Center visitor lot.',
      'program-vibe-title': 'THE VIBE / ATTIRE',
      'program-vibe-desc': 'Smart casual / garden party vibe. Wear comfortable shoes for the patio lawn.',
      'attire-avoid-label': 'PLEASE AVOID:',
      'avoid-caps': '<span class="avoid-x" aria-hidden="true">&times;</span> Caps / Hats',
      'avoid-sneakers': '<span class="avoid-x" aria-hidden="true">&times;</span> Sneakers',
      'avoid-sportswear': '<span class="avoid-x" aria-hidden="true">&times;</span> Sportswear',
      'tl-btn-location': 'LOCATION',
      'honors-title': 'ACADEMIC HONORS',
      'honors-badge': 'MAGNA CUM LAUDE',
      'honors-subtext': '<span class="honors-college">College of Science &bull; Class of 2026</span><br /><span class="honors-track-sub">Pre-Medicine Concentration</span>',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'SMART CASUAL / GARDEN PARTY',
      'dresscode-no-caps': 'NO CAPS / HATS',
      'dresscode-no-sneakers': 'NO SNEAKERS',
      'dresscode-no-sportswear': 'NO SPORTSWEAR',
      'dresscode-desc': 'Smart casual or garden party attire. Wear comfortable shoes for the patio lawn.',
      'registry-title': 'GIFT REGISTRY &amp; MEDICAL FUND',
      'registry-desc': 'Your presence is our greatest gift. If you wish to celebrate Sofia, <strong>warm wishes and contributions toward medical school transition funds are warmly appreciated</strong>.',
      'rsvp-deadline': 'PLEASE CONFIRM BY MAY 1, 2027',
      'rsvp-btn': 'CONFIRM RSVP',
      'rsvp-instruction': 'CLICK THE BUTTON TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'RSVP for Sofia Elena',
      'modal-subtitle': 'Saturday, May 15, 2027 • Notre Dame, IN',
      'label-fullname': 'Full Name(s) of Guests *',
      'label-email': 'Phone or Email Address *',
      'label-attend': 'Will You Be Attending? *',
      'opt-select': 'Please select...',
      'opt-yes': 'Yes, joyfully accept',
      'opt-no': 'No, regretfully decline',
      'label-party': 'Total Number of Guests Attending',
      'label-notes': 'Warm Wishes or Song Request for Sofia',
      'btn-submit': 'Submit RSVP',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate together!'
    },
    es: {
      'invite-title': 'Graduación',
      'invite-school': 'UNIVERSIDAD DE NOTRE DAME',
      'invite-preamble': 'JUNTO CON SU FAMILIA<br/>TIENEN EL HONOR DE INVITARLE A CELEBRAR LA GRADUACIÓN DE',
      'invite-degree': 'LICENCIATURA EN BIOLOGÍA MOLECULAR Y CELULAR &ensp;&middot;&ensp; MAGNA CUM LAUDE<br/><span class="honors-track">Facultad de Ciencias &bull; Generación 2026 &bull; Concentración Pre-Médica</span>',
      'message-quote': 'el capítulo donde de verdad obtiene el título. gracias a todos los que me mantuvieron a flote.',
      'invite-date-day': 'SÁBADO',
      'invite-date-full': '15 de Mayo, 2027',
      'invite-date-time': '5:00 PM – 9:00 PM',
      'invite-venue': 'NOTRE DAME • INDIANA',
      'countdown-title': 'CUENTA REGRESIVA PARA LA GRADUACIÓN',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'program-title': 'DETALLES DE LA FIESTA',
      'program-food-title': 'COMIDA &amp; BEBIDAS',
      'program-food-desc': 'Barra libre, botanas abundantes y postres incluidos. Vengan con hambre.',
      'program-location-title': 'UBICACIÓN &amp; ESTACIONAMIENTO',
      'program-location-desc': 'Estacionamiento disponible en Notre Dame Ave o en el lote de visitantes del Joyce Center.',
      'program-vibe-title': 'EL AMBIENTE / VESTIMENTA',
      'program-vibe-desc': 'Semi-formal / fiesta en jardín. Zapatos cómodos recomendados para el patio.',
      'attire-avoid-label': 'FAVOR DE EVITAR:',
      'avoid-caps': '<span class="avoid-x" aria-hidden="true">&times;</span> Gorras / Sombreros',
      'avoid-sneakers': '<span class="avoid-x" aria-hidden="true">&times;</span> Tenis',
      'avoid-sportswear': '<span class="avoid-x" aria-hidden="true">&times;</span> Ropa Deportiva',
      'tl-btn-location': 'UBICACIÓN',
      'honors-title': 'DISTINCIÓN ACADÉMICA',
      'honors-badge': 'MAGNA CUM LAUDE',
      'honors-subtext': '<span class="honors-college">Facultad de Ciencias • Generación 2026</span><br /><span class="honors-track-sub">Concentración Pre-Médica</span>',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'SEMI-FORMAL / FIESTA EN JARDÍN',
      'dresscode-no-caps': 'NO GORRAS',
      'dresscode-no-sneakers': 'NO TENIS',
      'dresscode-no-sportswear': 'ROPA DEPORTIVA',
      'dresscode-desc': 'Les pedimos asistir semi-formal o con ropa de jardín. Zapatos cómodos recomendados.',
      'registry-title': 'MESA DE REGALOS &amp; FONDO MÉDICO',
      'registry-desc': 'Su presencia es nuestro mayor regalo. Si desea tener un detalle con Sofia, <strong>las contribuciones y mejores deseos hacia su fondo de transición para la escuela de medicina son profundamente apreciados</strong>.',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR ANTES DEL 1 DE MAYO DE 2027',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Sofia Elena',
      'modal-subtitle': 'Sábado, 15 de Mayo de 2027 • Notre Dame, IN',
      'label-fullname': 'Nombre Completo de los Invitados *',
      'label-email': 'Teléfono o Correo Electrónico *',
      'label-attend': '¿Asistirá al Evento? *',
      'opt-select': 'Por favor seleccione...',
      'opt-yes': 'Sí, asistiré con mucho gusto',
      'opt-no': 'No podré asistir (los acompañaré en espíritu)',
      'label-party': 'Número Total de Personas',
      'label-notes': 'Mensaje de Felicitación o Canción para Sofia',
      'btn-submit': 'Enviar Confirmación',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su confirmación ha sido guardada con éxito. ¡Esperamos celebrar juntos este gran logro!'
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

  // Default to English on startup
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & SAKURA CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealTrigger = document.getElementById('wax-seal-trigger');
  let envelopeOpened = false;

  // Falling Petal Engine in Navy Blue, Champagne Gold & Pearl Shimmer Palette
  class RoyalPetalEngine {
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
          'rgba(15, 43, 92, 0.92)',    // azul marino (deep navy)
          'rgba(30, 64, 175, 0.90)',   // azul zafiro (sapphire blue)
          'rgba(212, 175, 55, 0.92)',  // oro champaña (champagne gold)
          'rgba(245, 228, 189, 0.95)', // oro suave (pale gold foil)
          'rgba(197, 160, 89, 0.90)',  // oro satinado (burnished gold)
          'rgba(255, 255, 255, 0.96)', // perla brillante (glistening white)
          'rgba(241, 245, 249, 0.92)'  // brillo plata suave
        ][Math.floor(Math.random() * 7)],
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
        this.ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
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

  const royalPetals = new RoyalPetalEngine('entry-canvas');

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // 1. Open envelope flap and glide up invitation card
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Start petals cascade
    royalPetals.start();

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

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('preview') === 'opened') {
    if (envelope) envelope.classList.add('is-opened');
  } else if (urlParams.get('preview') === 'site') {
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    document.body.classList.add('site-entered');
    document.documentElement.classList.add('site-entered');
    triggerScrollReveals();
    setTimeout(() => {
      document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => el.classList.add('is-visible'));
    }, 100);
  }

  /* ─────────────────────────────────────────────────────────────
     4. COUNTDOWN TIMER ENGINE (SATURDAY, MAY 15, 2027 AT 5:00 PM CDT)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (4 = May); local time used intentionally
  const TARGET_DATE = new Date(2027, 4, 15, 17, 0, 0).getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
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
        color: Math.random() > 0.5 ? '255, 255, 255' : '212, 175, 55'
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

  const attendInput = document.getElementById('guest-attend');
  const partyGroup = document.getElementById('group-guests-count');

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal && rsvpModal.classList.contains('is-active')) {
      closeRsvpModal();
    }
  });

  // Toggle party size visibility if declining
  if (attendInput && partyGroup) {
    attendInput.addEventListener('change', () => {
      partyGroup.style.display = attendInput.value === 'no' ? 'none' : 'block';
    });
  }

  [document.getElementById('guest-fullname'), document.getElementById('guest-email'), document.getElementById('guest-attend')].forEach(el => {
    if (el) {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
      el.addEventListener('change', () => { el.style.borderColor = ''; });
    }
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-fullname');
      const contactInput = document.getElementById('guest-email');
      const currentAttend = document.getElementById('guest-attend');
      const partySizeInput = document.getElementById('guest-party-size');
      const notesInput = document.getElementById('guest-notes');
      const btn = document.getElementById('btn-submit-rsvp');

      [nameInput, contactInput, currentAttend].forEach(el => {
        if (el) el.style.borderColor = '';
      });

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) {
          nameInput.focus();
          nameInput.style.borderColor = '#ef4444';
        }
        return;
      }
      if (!contactInput || !contactInput.value.trim()) {
        if (contactInput) {
          contactInput.focus();
          contactInput.style.borderColor = '#ef4444';
        }
        return;
      }
      if (!currentAttend || !currentAttend.value) {
        if (currentAttend) {
          currentAttend.focus();
          currentAttend.style.borderColor = '#ef4444';
        }
        return;
      }

      const isAttending = currentAttend.value === 'yes';
      // Google Sheet summary dashboard formulas look specifically for 'Joyfully Accept' / 'Regretfully Decline'
      const attendanceStandard = isAttending ? 'Joyfully Accept' : 'Regretfully Decline';
      const cleanPartySize = isAttending ? (partySizeInput ? partySizeInput.value.replace('+', '') : '1') : '0';

      const payload = {
        eventSlug: EVENT_SLUG,
        clientName: CLIENT_NAME,
        clientEmail: CLIENT_EMAIL,
        submittedAt: new Date().toISOString(),
        // Primary keys expected by Google Sheets
        fullname: nameInput.value.trim(),
        contact: contactInput.value.trim(),
        attendance: attendanceStandard,
        partySize: cleanPartySize,
        notes: notesInput ? notesInput.value.trim() : '',
        // Fallback & descriptive aliases
        guestName: nameInput.value.trim(),
        name: nameInput.value.trim(),
        phone: contactInput.value.trim(),
        email: contactInput.value.trim(),
        attendance_es: isAttending ? 'Sí, Asistirá' : 'No podré asistir',
        attending: isAttending ? 'Yes' : 'No',
        guests: cleanPartySize,
        wishes: notesInput ? notesInput.value.trim() : '',
        song: notesInput ? notesInput.value.trim() : '',
        message: notesInput ? notesInput.value.trim() : ''
      };

      const originalBtnText = btn ? btn.textContent : (currentLang === 'en' ? 'Submit RSVP' : 'Enviar Confirmación');
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

        // Celebratory Confetti Burst in Navy & Champagne Gold
        triggerConfetti();

        // Show success feedback
        if (successAlert) {
          successAlert.hidden = false;
          rsvpForm.reset();
          if (partyGroup) partyGroup.style.display = 'block';
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
    const confettiColors = ['#0f2b5c', '#1e40af', '#3b82f6', '#d4af37', '#f5e4bd', '#c5a059', '#ffffff', '#e2e8f0'];
    for (let i = 0; i < 65; i++) {
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
