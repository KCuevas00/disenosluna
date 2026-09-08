/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCE INVITATION — MERELIN NUNEZ
 * Interactive Controller, Petals Cascade Engine, Audio & Translations
 * ═════════════════════════════════════════════════════════════════════
/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 * Master Webhook URL automatically syncs RSVP entries into Merelin's
 * dedicated private Google Sheet.
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'merelin-2026';
const CLIENT_NAME = "Merelin Nunez's Quinceañera";
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

  // Keep pinned to top while envelope has not opened
  const pinToTopBeforeEnter = () => {
    if (!document.body.classList.contains('site-entered')) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };
  window.addEventListener('scroll', pinToTopBeforeEnter, { passive: true });

  /* ─────────────────────────────────────────────────────────────
     1. BILINGUAL TRANSLATION DICTIONARY (56 KEYS EN / ES)
     ───────────────────────────────────────────────────────────── */
  const translations = {
    en: {
      'invite-quince': 'Quinceañera',
      'invite-parents': 'JORGE & MARIBEL',
      'invite-preamble': 'WARMLY INVITE YOU TO CELEBRATE THE',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-month': 'NOV',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 11:45 AM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'SANTA ANA & ANAHEIM • CALIFORNIA',
      'program-title': 'PROGRAM',
      'program-mass-title': 'MASS',
      'program-mass-desc': 'OUR LADY OF GUADALUPE CHURCH,<br />1322 E THIRD ST, SANTA ANA, CA 92701',
      'program-entrance-title': 'ENTRANCE',
      'program-entrance-desc': 'EL BEKAL SHRINE,<br />1320 S SANDERSON AVE, ANAHEIM, CA 92806',
      'program-dinner-title': 'DINNER',
      'program-dinner-desc': 'GOURMET CELEBRATORY<br />DINNER SERVED',
      'program-waltz-title': 'WALTZ',
      'program-waltz-desc': 'FIRST DANCE &<br />FATHER-DAUGHTER WALTZ',
      'program-dj-title': 'DJ & FIESTA',
      'program-dj-desc': 'LIVE DJ, DANCING &<br />CELEBRATION',
      'program-end-title': 'FINISH',
      'program-end-desc': 'FAREWELL &<br />GOODNIGHT',
      'tl-btn-location': 'LOCATION',
      'court-title': 'COURT OF HONOR',
      'padrinos-role': 'PADRINOS DE HONOR',
      'padrinos-subtext': 'With heartfelt gratitude for their love, guidance, and blessings',
      'court-role-chambelan': 'MAIN CHAMBELÁN',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'FORMAL ATTIRE',
      'dresscode-desc': 'We kindly ask our guests to avoid any shades of pink, rose gold, or beige.<br /><strong>Specifically no pale pink</strong>, as it is exclusively reserved for our Quinceañera.',
      'registry-title': 'GIFT REGISTRY',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Your love and presence are the greatest gifts of all. Should you wish to honor Merelin with a gift, <strong>cash or gift cards</strong> are warmly appreciated.',
      'message-quote': "To my family and friends — thank you from the bottom of my heart for your love, guidance, and for celebrating this milestone with me. I can't wait to dance, laugh, and make lifelong memories with all of you!",
      'rsvp-deadline': 'BY OCTOBER 7, 2026',
      'nav-rsvp': 'RSVP',
      'rsvp-instruction': 'CLICK THE RSVP BUTTON AND<br />LET US KNOW IF YOU CAN MAKE IT',
      'rsvp-thankyou': 'Thank You',
      'modal-title': "RSVP to Merelin's Quinceañera",
      'modal-subtitle': 'Saturday, November 7, 2026 • Santa Ana & Anaheim, CA',
      'label-fullname': 'Your Full Name(s) *',
      'label-email': 'Phone or Email *',
      'label-attend': 'Will You Be Attending? *',
      'opt-select': 'Please select...',
      'opt-yes': 'Joyfully Accept (I will be there!)',
      'opt-no': 'Regretfully Decline (Celebrating in spirit)',
      'label-party': 'Total Number of Guests Attending',
      'label-notes': 'Warm Wishes / Song Request for Merelin',
      'btn-submit': 'Confirm RSVP',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate with you!'
    },
    es: {
      'invite-quince': 'Quinceañera',
      'invite-parents': 'JORGE Y MARIBEL',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A LA',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-month': 'NOV',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 11:45 AM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'SANTA ANA Y ANAHEIM • CALIFORNIA',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'MISA',
      'program-mass-desc': 'IGLESIA NUESTRA SEÑORA DE GUADALUPE,<br />1322 E THIRD ST, SANTA ANA, CA 92701',
      'program-entrance-title': 'ENTRADA',
      'program-entrance-desc': 'EL BEKAL SHRINE,<br />1320 S SANDERSON AVE, ANAHEIM, CA 92806',
      'program-dinner-title': 'CENA',
      'program-dinner-desc': 'CENA DE GALA Y<br />BRINDIS DE HONOR',
      'program-waltz-title': 'VALS',
      'program-waltz-desc': 'PRIMER BAILE Y<br />VALS FAMILIAR',
      'program-dj-title': 'DJ Y FIESTA',
      'program-dj-desc': 'MÚSICA EN VIVO,<br />BAILE Y CELEBRACIÓN',
      'program-end-title': 'FIN DE FIESTA',
      'program-end-desc': 'DESPEDIDA Y<br />AGRADECIMIENTO',
      'tl-btn-location': 'UBICACIÓN',
      'court-title': 'CORTE DE HONOR',
      'padrinos-role': 'PADRINOS DE HONOR',
      'padrinos-subtext': 'Con profundo agradecimiento por su amor, guía y bendiciones',
      'court-role-chambelan': 'CHAMBELÁN DE HONOR',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'TRAJE FORMAL',
      'dresscode-desc': 'Les pedimos amablemente a nuestros invitados evitar cualquier tono de rosa, rose gold o beige.<br /><strong>Específicamente no rosa pálido</strong>, ya que está reservado exclusivamente para la Quinceañera.',
      'registry-title': 'MESA DE REGALOS',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Su presencia y cariño son nuestro mejor regalo. Si desea tener un detalle con Merelin, una <strong>lluvia de sobres o tarjetas de regalo</strong> será profundamente apreciada.',
      'message-quote': 'A mi querida familia y amigos: gracias de todo corazón por su amor, cariño y por acompañarme en este día tan especial. ¡No puedo esperar para bailar, reír y celebrar juntos momentos inolvidables!',
      'rsvp-deadline': 'ANTES DEL 7 DE OCTUBRE, 2026',
      'nav-rsvp': 'CONFIRMAR',
      'rsvp-instruction': 'POR FAVOR HAGA CLIC EN EL BOTÓN Y<br />CONFIRME SU ASISTENCIA',
      'rsvp-thankyou': 'Muchas Gracias',
      'modal-title': 'Confirmar Asistencia - Merelin',
      'modal-subtitle': 'Sábado, 7 de Noviembre, 2026 • Santa Ana y Anaheim, CA',
      'label-fullname': 'Nombre(s) Completo(s) *',
      'label-email': 'Teléfono o Correo *',
      'label-attend': '¿Asistirás al Evento? *',
      'opt-select': 'Seleccione una opción...',
      'opt-yes': 'Sí, asistiré con alegría',
      'opt-no': 'No podré asistir (los acompañaré en espíritu)',
      'label-party': 'Número Total de Personas',
      'label-notes': 'Mensaje de Felicitación o Canción Deseada',
      'btn-submit': 'Enviar Confirmación',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su confirmación ha sido guardada. ¡Esperamos celebrar juntos este gran día!'
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

    const btnEn = document.getElementById('btn-lang-en');
    const btnEs = document.getElementById('btn-lang-es');
    if (btnEn && btnEs) {
      btnEn.classList.toggle('active', lang === 'en');
      btnEs.classList.toggle('active', lang === 'es');
    }
  }

  const btnEn = document.getElementById('btn-lang-en');
  const btnEs = document.getElementById('btn-lang-es');
  if (btnEn) btnEn.addEventListener('click', () => applyLanguage('en'));
  if (btnEs) btnEs.addEventListener('click', () => applyLanguage('es'));

  // Default to Spanish on startup
  applyLanguage('es');

  // Collapsible utility tabs (Matching quincetemplate: both collapsed by default)
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

    // Ensure both start collapsed by default so they never collide or block screen
    if (langBar && langToggle && langBar.dataset.userToggled !== 'true') {
      setCollapsed(langBar, langToggle, true, 'Hide language selector', 'Show language selector');
    }
    if (audioBar && audioToggle && audioBar.dataset.userToggled !== 'true') {
      setCollapsed(audioBar, audioToggle, true, 'Hide music player', 'Show music player');
    }
  }

  initControlToggles();

  /* ─────────────────────────────────────────────────────────────
     2. AUDIO CONTROLLER (Exact quincetemplate Implementation)
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');
  const audioMuteBtn = document.getElementById('audio-mute-btn');
  const audioVolumeSlider = document.getElementById('audio-volume-slider');
  const volIcon = document.getElementById('vol-icon');

  let isAudioPlaying = false;
  let lastNonZeroVolume = 0.8;
  if (bgAudio) bgAudio.volume = 0.8;

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

  function updateVolumeUI() {
    if (!bgAudio) return;
    const isMuted = bgAudio.muted || bgAudio.volume === 0;
    if (volIcon) {
      if (isMuted) {
        volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.05 4.05L7 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
      } else if (bgAudio.volume <= 0.5) {
        volIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
      } else {
        volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
      }
    }
    if (audioVolumeSlider) {
      audioVolumeSlider.value = isMuted ? 0 : bgAudio.volume;
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
    isAudioPlaying = false;
    if (audioToggleBtn) audioToggleBtn.classList.remove('is-playing');
    if (audioPlayIcon) audioPlayIcon.style.display = 'inline';
    if (audioPauseIcon) audioPauseIcon.style.display = 'none';
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

  if (audioVolumeSlider && bgAudio) {
    audioVolumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      bgAudio.volume = vol;
      bgAudio.muted = (vol === 0);
    });
  }

  if (audioMuteBtn && bgAudio && audioVolumeSlider) {
    audioMuteBtn.addEventListener('click', () => {
      bgAudio.muted = !bgAudio.muted;
      if (bgAudio.muted) {
        audioVolumeSlider.value = 0;
      } else {
        audioVolumeSlider.value = bgAudio.volume || 0.8;
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & SAKURA CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealTrigger = document.getElementById('wax-seal-trigger');

  // Falling Cherry Blossom Petal Engine (Strictly inactive until invitation opens)
  // Falling Cherry Blossom & Rose Petal Engine
  class SakuraCascadeEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.active = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createPetal(initialY = -25) {
      return {
        x: Math.random() * this.width,
        y: initialY,
        size: Math.random() * 9 + 8, // 8px to 17px visible lush rose petals
        speedY: Math.random() * 1.6 + 0.9,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.03 + 0.015,
        color: [
          'rgba(238, 150, 175, 0.92)', // deep romantic rose
          'rgba(245, 170, 192, 0.90)', // blush pink
          'rgba(228, 135, 162, 0.88)', // vibrant petal rose
          'rgba(250, 185, 205, 0.92)', // delicate soft pink
          'rgba(255, 208, 224, 0.95)'  // glowing pale rose highlight
        ][Math.floor(Math.random() * 5)],
        flipSpeed: Math.random() * 0.03 + 0.015,
        flip: Math.random() * Math.PI
      };
    }

    // Called strictly the moment the guest taps the wax seal to open the envelope
    start() {
      if (this.active) return;
      this.active = true;

      // Lush celebratory shower of petals cascading down from the top of the screen upon opening
      const topCount = window.innerWidth < 600 ? 55 : 85;
      for (let i = 0; i < topCount; i++) {
        // Stagger from above the screen and top edge so an immediate rich rain cascades downward
        const startY = Math.random() * -this.height * 0.85 + Math.random() * (this.height * 0.25) - 30;
        const p = this.createPetal(startY);
        p.speedY = Math.random() * 2.0 + 1.2;
        this.particles.push(p);
      }

      this.animate();
    }

    // Celebratory burst radiating outward from the broken wax seal
    burst(count = 65) {
      const originX = this.width / 2;
      const originY = this.height * 0.45;

      for (let i = 0; i < count; i++) {
        const p = this.createPetal(originY);
        p.x = originX;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 3;
        p.speedX = Math.cos(angle) * speed;
        // Strictly positive downward velocity so NO petals ever float upwards
        p.speedY = Math.abs(Math.sin(angle)) * speed + 1.2;
        this.particles.push(p);
      }
    }

    animate() {
      if (!this.active) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        // Ensure vertical velocity stays strictly downward (falling)
        if (p.speedY < 0.9) {
          p.speedY = 0.9 + Math.random() * 0.5;
        }
        // Decelerate initial burst velocity toward graceful fall speed
        if (p.speedY > 2.4) {
          p.speedY *= 0.985;
        }
        p.speedX *= 0.985;

        p.y += p.speedY;
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.95 + p.speedX;
        p.rotation += p.rotSpeed;
        p.flip += p.flipSpeed;

        // Keep horizontal drift within screen
        if (p.x < -35) p.x = this.width + 20;
        else if (p.x > this.width + 35) p.x = -20;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.scale(1, Math.cos(p.flip));

        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.85, 0, 0, Math.PI * 2);
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(235, 160, 180, 0.45)';
        this.ctx.fill();

        this.ctx.restore();

        // Reset once off-screen: 20% ongoing trickle while reading the invitation (10 mobile, 16 desktop)
        if (p.y > this.height + 25) {
          const maxOngoing = this.width < 600 ? 10 : 16;
          if (this.particles.length > maxOngoing) {
            this.particles.splice(i, 1);
          } else {
            this.particles[i] = this.createPetal(-25);
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const sakuraCascade = new SakuraCascadeEngine('entry-canvas');

  // Action: Open the Envelope
  let isEnvelopeOpen = false;

  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    // Force page to the top immediately with zero delay
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 1. Trigger Envelope 3D Fold & Card Rise
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Start petals strictly on opening with celebratory burst
    sakuraCascade.start();
    sakuraCascade.burst(65);

    // 3. Start audio
    playAudio();

    // 4. Give the card time to rise into place and be read before dismissing (2.2s)
    setTimeout(() => {
      enterWebsite();
    }, 2200);
  }

  function enterWebsite() {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.body.classList.add('site-entered');
    document.documentElement.classList.add('site-entered');
    if (overlay) {
      overlay.classList.add('fade-out');
    }

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
     4. COUNTDOWN TIMER ENGINE (NOV 7, 2026 AT 11:45 AM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (10 = November)
  const TARGET_DATE = new Date(2026, 10, 7, 11, 45, 0).getTime();

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
        alpha: Math.random() * 0.3 + 0.08,
        color: Math.random() > 0.5 ? '255, 255, 255' : '250, 215, 225'
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
     7. SCROLL REVEAL OBSERVER
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
     8. INTERACTIVE RSVP MODAL & CONFETTI CELEBRATION
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

      const isAttending = currentAttend.value === 'yes';
      const payload = {
        eventSlug: EVENT_SLUG,
        clientName: CLIENT_NAME,
        clientEmail: CLIENT_EMAIL,
        fullname: nameInput.value.trim(),
        contact: contactInput.value.trim(),
        attendance: isAttending ? 'Joyfully Accept' : 'Regretfully Decline',
        partySize: isAttending ? (partySizeInput ? partySizeInput.value : '1') : '0',
        notes: notesInput ? notesInput.value.trim() : ''
      };

      const originalBtnText = btn ? btn.textContent : (currentLang === 'es' ? 'Enviar Confirmación' : 'Confirm RSVP');
      if (btn) {
        btn.disabled = true;
        btn.textContent = currentLang === 'es' ? 'Guardando en lista...' : 'Saving RSVP...';
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
          btn.textContent = currentLang === 'es' ? '¡Confirmado con Éxito! ✓' : 'Confirmed! ✓';
        }
      } catch (err) {
        console.error('[RSVP Error]:', err);
        alert(currentLang === 'es'
          ? 'Hubo un problema al guardar su confirmación. Por favor verifique su conexión e intente nuevamente.'
          : 'There was an issue saving your RSVP. Please check your connection and try again.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      }
    });
  }

  function triggerConfetti() {
    const confettiColors = ['#e8a5b8', '#f8d5de', '#fdeef2', '#d4aa63', '#f5e4bd', '#ffffff'];
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
