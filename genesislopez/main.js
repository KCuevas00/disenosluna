/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCE INVITATION — GENESIS LOPEZ
 * Interactive Controller, Petals Cascade Engine & Audio
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 * Master Webhook URL automatically syncs RSVP entries into Genesis's
 * dedicated private Google Sheet.
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'genesislopez';
const CLIENT_NAME = "Genesis Lopez's Quinceañera";
const CLIENT_EMAIL = ''; // Optional parents' email to share Google Sheet with

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
      'invite-quince': 'Quinceañera',
      'invite-parents': 'OLGA LÓPEZ &amp; GENARO POCTECO',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A LA',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-month': 'DIC',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 2:30 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'BROOKLYN • NUEVA YORK',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'MISA',
      'program-mass-desc': 'NUESTRA SEÑORA DEL PERPETUO SOCORRO,<br />5926 5TH AVE, BROOKLYN, NY 11220',
      'program-reception-title': 'RECEPCIÓN &amp; FIESTA',
      'program-reception-desc': 'AZTECA HALL,<br />225 47TH ST, BROOKLYN, NY 11220',
      'program-end-title': 'FIN DEL EVENTO',
      'program-end-desc': 'DESPEDIDA &amp;<br />AGRADECIMIENTO',
      'tl-btn-location': 'UBICACIÓN',
      'court-title': 'PADRINOS DE HONOR',
      'padrinos-role': 'PADRINOS DE HONOR',
      'padrinos-subtext': '“Con profundo agradecimiento por su amor, guía y bendiciones”',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'FORMAL / ELEGANTE',
      'dresscode-ban-label': 'NO GORRAS NI TENIS',
      'dresscode-reserved-label': 'VESTIMENTA FORMAL',
      'dresscode-desc': 'Les pedimos amablemente a nuestros invitados asistir con vestimenta formal y elegante.<br /><strong>Por favor evitar gorras, tenis o ropa deportiva</strong>.',
      'registry-title': 'MESA DE REGALOS',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Su presencia y cariño son nuestro mejor regalo. Si desea tener un detalle con Genesis, una <strong>lluvia de sobres o tarjetas de regalo</strong> será profundamente apreciada.',
      'message-quote': 'Agradecida de dios por todo siempre bajo su bendición por aver llegado el día para compartir con ustedes. En medio de todo, recuerda que tu refugio es jesucristo. El es tu fortaleza, tu roca, tu escudo, tu padre que te ama con amor eterno.',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR ANTES DEL 26 DE NOVIEMBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Genesis',
      'modal-subtitle': 'Sábado, 26 de Diciembre de 2026 • Brooklyn, NY',
      'label-fullname': 'Nombre Completo de los Invitados *',
      'label-email': 'Teléfono o Correo Electrónico *',
      'label-attend': '¿Asistirá al Evento? *',
      'opt-select': 'Por favor seleccione...',
      'opt-yes': 'Sí, asistiré con mucho gusto',
      'opt-no': 'No podré asistir (los acompañaré en espíritu)',
      'label-party': 'Número Total de Personas',
      'label-notes': 'Mensaje de Felicitación o Canción para Genesis',
      'btn-submit': 'Enviar Confirmación',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su confirmación ha sido guardada con éxito. ¡Esperamos celebrar juntos este gran día!'
    },
    en: {
      'invite-quince': 'Quinceañera',
      'invite-parents': 'OLGA LÓPEZ &amp; GENARO POCTECO',
      'invite-preamble': 'CORDIALLY INVITE YOU TO CELEBRATE THE QUINCEAÑERA OF THEIR DAUGHTER',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-month': 'DEC',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 2:30 PM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'BROOKLYN • NEW YORK',
      'program-title': 'PROGRAM',
      'program-mass-title': 'MASS',
      'program-mass-desc': 'OUR LADY OF PERPETUAL HELP CHURCH,<br />5926 5TH AVE, BROOKLYN, NY 11220',
      'program-reception-title': 'RECEPTION &amp; PARTY',
      'program-reception-desc': 'AZTECA HALL,<br />225 47TH ST, BROOKLYN, NY 11220',
      'program-end-title': 'EVENT FINALE',
      'program-end-desc': 'FAREWELL &amp;<br />THANK YOU',
      'tl-btn-location': 'LOCATION',
      'court-title': 'GODPARENTS OF HONOR',
      'padrinos-role': 'GODPARENTS OF HONOR',
      'padrinos-subtext': '“With heartfelt gratitude for their love, guidance, and blessings”',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'FORMAL / ELEGANT',
      'dresscode-ban-label': 'NO HATS OR SNEAKERS',
      'dresscode-reserved-label': 'FORMAL ATTIRE',
      'dresscode-desc': 'We kindly ask our guests to attend in formal and elegant attire.<br /><strong>Please avoid baseball caps, sneakers, or sportswear</strong>.',
      'registry-title': 'GIFT REGISTRY',
      'registry-subtitle': 'CARD &amp; ENVELOPE SHOWER',
      'registry-desc': 'Your presence and love are our greatest gift. If you wish to honor Genesis with a gift, an <strong>envelope shower or gift cards</strong> will be deeply appreciated.',
      'message-quote': 'Grateful to God for everything, always under His blessing for having reached this day to share with you. In the midst of everything, remember that your refuge is Jesus Christ. He is your strength, your rock, your shield, your Father who loves you with everlasting love.',
      'rsvp-deadline': 'PLEASE CONFIRM BY NOVEMBER 26, 2026',
      'rsvp-btn': 'CONFIRM RSVP',
      'rsvp-instruction': 'CLICK THE BUTTON TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'RSVP for Genesis',
      'modal-subtitle': 'Saturday, December 26, 2026 • Brooklyn, NY',
      'label-fullname': 'Full Name(s) of Guests *',
      'label-email': 'Phone or Email Address *',
      'label-attend': 'Will You Be Attending? *',
      'opt-select': 'Please select...',
      'opt-yes': 'Yes, joyfully accept',
      'opt-no': 'No, regretfully decline',
      'label-party': 'Total Number of Guests Attending',
      'label-notes': 'Warm Wishes or Song Request for Genesis',
      'btn-submit': 'Submit RSVP',
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & SAKURA CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealTrigger = document.getElementById('wax-seal-trigger');
  let envelopeOpened = false;

  // Falling Petal Engine in Royal Blue, Lavender, Pastel Pink & Silver Palette
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
          'rgba(29, 78, 216, 0.88)',   // deep royal blue
          'rgba(59, 130, 246, 0.90)',  // royal sapphire blue
          'rgba(147, 197, 253, 0.92)', // light ice blue
          'rgba(255, 255, 255, 0.95)', // glistening platinum white
          'rgba(203, 213, 225, 0.85)', // silver shimmer
          'rgba(226, 232, 240, 0.88)'  // frosted slate silver
        ][Math.floor(Math.random() * 6)],
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
        this.ctx.shadowColor = 'rgba(59, 130, 246, 0.35)';
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
     4. COUNTDOWN TIMER ENGINE (SATURDAY, DEC 26, 2026 AT 2:30 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (11 = December)
  const TARGET_DATE = new Date(2026, 11, 26, 14, 30, 0).getTime();

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
        color: Math.random() > 0.5 ? '255, 255, 255' : '191, 219, 254'
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

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-fullname');
      const contactInput = document.getElementById('guest-email');
      const currentAttend = document.getElementById('guest-attend');
      const partySizeInput = document.getElementById('guest-party-size');
      const notesInput = document.getElementById('guest-notes');
      const btn = document.getElementById('btn-submit-rsvp');

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.focus();
        return;
      }
      if (!contactInput || !contactInput.value.trim()) {
        if (contactInput) contactInput.focus();
        return;
      }
      if (!currentAttend || !currentAttend.value) {
        if (currentAttend) currentAttend.focus();
        return;
      }

      const payload = {
        eventSlug: EVENT_SLUG,
        clientName: CLIENT_NAME,
        clientEmail: CLIENT_EMAIL,
        submittedAt: new Date().toISOString(),
        guestName: nameInput.value.trim(),
        contact: contactInput.value.trim(),
        attending: currentAttend.value === 'yes' ? 'Sí' : 'No',
        partySize: currentAttend.value === 'yes' ? (partySizeInput ? partySizeInput.value : '1') : '0',
        dietary: '',
        wishes: notesInput ? notesInput.value.trim() : ''
      };

      const originalBtnText = btn ? btn.textContent : 'Enviar Confirmación';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Guardando confirmación...';
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
          if (partyGroup) partyGroup.style.display = 'block';
        }
        if (btn) {
          btn.textContent = '¡Confirmado con Éxito! ✓';
        }
      } catch (err) {
        console.error('[RSVP Error]:', err);
        alert('Hubo un problema al guardar su confirmación. Por favor verifique su conexión e intente nuevamente.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      }
    });
  }

  function triggerConfetti() {
    const confettiColors = ['#1d4ed8', '#3b82f6', '#93c5fd', '#c084fc', '#f472b6', '#ffffff', '#cbd5e1'];
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
