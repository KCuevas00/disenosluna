/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCEAÑERA INVITATION — VICTORIA ROSALES
 * Interactive Controller & RSVP
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'victoriarosales';
const CLIENT_NAME = "Victoria Rosales's Quinceañera (Maria Contreras)";
const CLIENT_EMAIL = 'pochitoca@msn.com';

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
      'entry-subtitle': "VICTORIA ROSALES'S QUINCEAÑERA",
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'card-quince': 'XV Años',
      'invite-parents': 'THE CONTRERAS &amp; ROSALES FAMILY',
      'invite-preamble': 'CORDIALLY INVITES YOU TO CELEBRATE THE',
      'invite-quince': 'Quinceañera',
      'invite-daughter': 'OF THEIR BELOVED DAUGHTER',
      'invite-celebrant': 'Victoria<br>Rosales',
      'invite-date-month': 'JUL',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 3:00 PM',
      'countdown-title': 'COUNTING DOWN TO THE QUINCEAÑERA',
      'countdown-today': '🎉 Today Is the Big Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'JARDÍN ALMA • JIUTEPEC, MORELOS, MEXICO',
      'venue-section-title': 'CEREMONY &amp; RECEPTION',
      'badge-ceremony': 'Ceremony &amp; Mass',
      'badge-ceremony-reception': 'Ceremony &amp; Reception',
      'ceremony-time-desc': 'Ceremony: 3:00 PM (Mass at 4:00 PM)',
      'badge-reception': 'Reception Venue',
      'reception-time-desc': 'Reception: 4:00 PM – 2:30 AM',
      'venue-btn-open-maps': 'OPEN IN MAPS',
      'program-title': 'SCHEDULE OF EVENTS',
      'itin-mass': 'Religious Mass',
      'itin-mass-desc': 'Jardín Alma • Begonias 10, Atlacomulco, Jiutepec, Mor.',
      'itin-entrance': 'Grand Entrance',
      'itin-entrance-desc': 'Welcoming the Quinceañera Victoria',
      'itin-dinner': 'Dinner',
      'itin-dinner-desc': 'Delicious banquet dinner shared together',
      'itin-waltz': 'Traditional Waltzes',
      'itin-waltz-desc': 'Victoria’s honorary dances with father &amp; chambelanes',
      'itin-party': 'Party &amp; Open Dance Floor',
      'itin-party-desc': 'Music, celebration &amp; dancing',
      'itin-banda': 'Live Banda',
      'itin-banda-desc': 'Live regional banda music celebration',
      'itin-end': 'End of Celebration',
      'itin-end-desc': 'Thank you for celebrating this unforgettable night!',
      'tl-btn-location': 'DIRECTIONS',
      'tl-btn-directions': 'DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'court-title': 'COURT OF HONOR',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'DRESS CODE',
      'dresscode-subtitle': 'FORMAL ATTIRE',
      'dresscode-script': 'Dress Code',
      'dresscode-desc': 'We invite our guests to wear formal attire for Victoria’s special celebration. Please note: kindly <strong>avoid wearing forest green</strong>.',
      'dinner-title': 'DINNER &amp; BANQUET',
      'dinner-subtitle': 'RECEPTION BANQUET',
      'dinner-script': 'Dinner &amp; Banquet',
      'dinner-desc': 'Reception begins at 4:00 PM followed by dinner at 6:10 PM, traditional waltzes, party, and live banda.',
      'contact-title': 'QUESTIONS &amp; INFORMATION',
      'contact-subtitle': 'CONTACT',
      'contact-script': 'Questions &amp; Info',
      'contact-desc': 'For any questions or more information regarding the celebration, please contact:<br /><strong style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-dark); display: block; margin-top: 0.35rem;">Maria Contreras: (626) 824-5098</strong>',
      'photos-title': 'PHOTOS &amp; MEMORIES',
      'photos-subtitle': 'CAPTURE THE NIGHT',
      'photos-script': 'Photos &amp; Memories',
      'photos-desc': 'We invite you to take photos throughout the evening and share your favorite moments with Victoria!',
      'registry-title': 'A NOTE ON GIFTS',
      'registry-subtitle': 'YOUR PRESENCE IS OUR GIFT',
      'registry-script': 'A Note on Gifts',
      'registry-desc': 'Your presence is the greatest gift I could ask for. However, if you wish to honor me with a gift, a monetary contribution would be greatly appreciated as I begin this new chapter of my life. Thank you for being part of my special day!',
      'message-quote': 'With great joy and gratitude, I invite you to celebrate one of the most special moments of my life, my Quinceañera. As I begin this new chapter, I would love to share this unforgettable day surrounded by the people who mean the most to me. Your presence would make this celebration even more meaningful. I hope to celebrate this special day with you!',
      'message-signature': 'Victoria Rosales',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BEFORE JUNE 5, 2027',
      'rsvp-btn': 'CONFIRM ATTENDANCE',
      'rsvp-instruction': 'CLICK THE BUTTON BELOW TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You!',
      'btn-accept': 'Joyfully Accept',
      'btn-decline': 'Regretfully Decline',
      'label-fullname': 'Full Name',
      'label-party': 'Total Guests (including you)',
      'label-phone': 'Phone / WhatsApp',
      'opt-party-1': '1 Guest',
      'opt-party-2': '2 Guests',
      'opt-party-3': '3 Guests',
      'opt-party-4': '4 Guests',
      'opt-party-5': '5 Guests',
      'modal-title': 'RSVP',
      'modal-subtitle': 'Saturday, July 3, 2027 • Jiutepec, Morelos, Mexico',
      'modal-success-title': 'RSVP Received!',
      'modal-success-desc': 'Thank you for confirming your attendance. We look forward to celebrating with you!',
      'footer-date': 'Saturday, July 3, 2027 • Jiutepec, Morelos, Mexico'
    },
    es: {
      'entry-invited': '¡Estás Invitado!',
      'entry-subtitle': 'XV AÑOS DE VICTORIA ROSALES',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'card-quince': 'XV Años',
      'invite-parents': 'LA FAMILIA CONTRERAS Y ROSALES',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A LA CELEBRACIÓN DE LOS',
      'invite-quince': 'XV Años',
      'invite-daughter': 'DE SU QUERIDA HIJA',
      'invite-celebrant': 'Victoria<br>Rosales',
      'invite-date-month': 'JUL',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 3:00 PM',
      'countdown-title': 'CUENTA REGRESIVA PARA LOS XV AÑOS',
      'countdown-today': '🎉 ¡Hoy es el gran día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'JARDÍN ALMA • JIUTEPEC, MORELOS, MÉXICO',
      'venue-section-title': 'CEREMONIA Y RECEPCIÓN',
      'badge-ceremony': 'Ceremonia y Misa',
      'badge-ceremony-reception': 'Ceremonia y Recepción',
      'ceremony-time-desc': 'Ceremonia: 3:00 PM (Misa a las 4:00 PM)',
      'badge-reception': 'Salón de Recepción',
      'reception-time-desc': 'Recepción: 4:00 PM – 2:30 AM',
      'venue-btn-open-maps': 'ABRIR EN MAPAS',
      'program-title': 'ITINERARIO DEL EVENTO',
      'itin-mass': 'Misa Religiosa',
      'itin-mass-desc': 'Jardín Alma • Begonias 10, Atlacomulco, Jiutepec, Mor.',
      'itin-entrance': 'Entrada Triunfal',
      'itin-entrance-desc': 'Bienvenida a Victoria en sus XV Años',
      'itin-dinner': 'Cena de Gala',
      'itin-dinner-desc': 'Delicioso banquete para compartir juntos',
      'itin-waltz': 'Valses Tradicionales',
      'itin-waltz-desc': 'Los emotivos valses de honor con su padre y chambelanes',
      'itin-party': 'Fiesta y Pista Abierta',
      'itin-party-desc': 'Música, alegría y baile para todos',
      'itin-banda': 'Música de Banda en Vivo',
      'itin-banda-desc': 'Gran celebración con música de banda sinaloense en vivo',
      'itin-end': 'Fin de la Celebración',
      'itin-end-desc': '¡Gracias por celebrar esta noche inolvidable con nosotros!',
      'tl-btn-location': 'DIRECCIÓN',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'court-title': 'CORTE DE HONOR',
      'court-chambelanes-title': 'CHAMBELANES',
      'dresscode-title': 'CÓDIGO DE VESTIMENTA',
      'dresscode-subtitle': 'VESTIMENTA FORMAL',
      'dresscode-script': 'Código de Vestimenta',
      'dresscode-desc': 'Invitamos cordialmente a nuestros invitados a vestir atuendo formal para la celebración de Victoria. Nota importante: les pedimos amablemente <strong>evitar vestir en color verde bosque</strong>.',
      'dinner-title': 'CENA Y BANQUETE',
      'dinner-subtitle': 'BANQUETE DE RECEPCIÓN',
      'dinner-script': 'Cena y Banquete',
      'dinner-desc': 'La recepción comienza a las 4:00 PM seguida de la cena a las 6:10 PM, valses de honor, fiesta y música de banda en vivo.',
      'contact-title': 'PREGUNTAS E INFORMACIÓN',
      'contact-subtitle': 'CONTACTO',
      'contact-script': 'Preguntas e Información',
      'contact-desc': 'Para cualquier pregunta o mayor información sobre la celebración, por favor contacte a:<br /><strong style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-dark); display: block; margin-top: 0.35rem;">Maria Contreras: (626) 824-5098</strong>',
      'photos-title': 'FOTOS Y RECUERDOS',
      'photos-subtitle': 'CAPTURA LA NOCHE',
      'photos-script': 'Fotos y Recuerdos',
      'photos-desc': '¡Te invitamos a tomar fotos durante toda la noche y compartir tus momentos favoritos con Victoria!',
      'registry-title': 'NOTA SOBRE REGALOS',
      'registry-subtitle': 'SU PRESENCIA ES NUESTRO MEJOR REGALO',
      'registry-script': 'Nota sobre Regalos',
      'registry-desc': 'Su presencia es el mayor regalo que podría pedir. Sin embargo, si desean honrarme con un detalle, una contribución monetaria será muy apreciada al iniciar este nuevo capítulo de mi vida. ¡Gracias por ser parte de mi día especial!',
      'message-quote': 'Con gran alegría y gratitud, los invito a celebrar uno de los momentos más especiales de mi vida, mis XV Años. Al comenzar este nuevo capítulo, me encantaría compartir este día inolvidable rodeada de las personas que más significan para mí. Su presencia hará que esta celebración sea aún más significativa. ¡Espero celebrar este día tan especial con ustedes!',
      'message-signature': 'Victoria Rosales',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR SU ASISTENCIA ANTES DEL 5 DE JUNIO DE 2027',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'btn-accept': 'Acepto con gusto',
      'btn-decline': 'Declino con pesar',
      'label-fullname': 'Nombre Completo',
      'label-party': 'Número de Personas (incluyéndote)',
      'label-phone': 'Teléfono / WhatsApp',
      'opt-party-1': '1 Persona',
      'opt-party-2': '2 Personas',
      'opt-party-3': '3 Personas',
      'opt-party-4': '4 Personas',
      'opt-party-5': '5 Personas',
      'modal-title': 'CONFIRMAR ASISTENCIA',
      'modal-subtitle': 'Sábado, 3 de Julio de 2027 • Jiutepec, Morelos, México',
      'modal-success-title': '¡Confirmación Recibida!',
      'modal-success-desc': '¡Gracias por confirmar su asistencia! Esperamos celebrar este día tan especial con usted.',
      'footer-date': 'Sábado, 3 de Julio de 2027 • Jiutepec, Morelos, México'
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
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlParams.has('og_preview')) {
    document.body.classList.add('og-preview-mode');
  }
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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER (Madonna - Vogue)
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

  if (bgAudio) {
    bgAudio.addEventListener('play', () => updatePlayState(true));
    bgAudio.addEventListener('playing', () => updatePlayState(true));
    bgAudio.addEventListener('pause', () => updatePlayState(false));
    bgAudio.addEventListener('ended', () => {
      try {
        bgAudio.currentTime = 0;
        bgAudio.play().catch(() => {});
      } catch (e) {}
      updatePlayState(false);
    });

    bgAudio.addEventListener('error', (e) => {
      console.warn('[Audio element error]:', bgAudio.error || e);
      updatePlayState(false);
    });
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

  // Canvas Petal & Multi-Shape Confetti Engine (Royal Sage Theme)
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
        'rgba(212, 175, 55, 0.95)',  // Shimmering royal gold leaf
        'rgba(201, 159, 87, 0.95)',  // Antique rich gold
        'rgba(226, 190, 103, 0.95)', // Radiant bright champagne gold
        'rgba(245, 228, 189, 0.96)', // Warm champagne gold
        'rgba(255, 255, 255, 0.98)', // Pure translucent white silk
        'rgba(237, 216, 155, 0.95)', // Soft warm honey gold
        'rgba(250, 243, 225, 0.95)', // Warm ivory
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
      const themeMeta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', '#ffffff');
      }
      document.documentElement.classList.add('site-entered');
      if (expandAudioBarFn) {
        expandAudioBarFn();
      }
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
      triggerScrollReveals();
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
    const handleSealOpen = (e) => {
      e.stopPropagation();
      openEnvelope();
    };
    waxSealBtn.addEventListener('click', handleSealOpen);
    waxSealBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleSealOpen(e);
    }, { passive: false });
  }

  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('touchend', (e) => {
      if (!envelopeOpened) {
        openEnvelope();
      }
    }, { passive: true });
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. COUNTDOWN TIMER ENGINE (SATURDAY, JAN 30, 2027 AT 11:30 AM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (0 = January)
  const TARGET_DATE = new Date(2027, 6, 3, 15, 0, 0).getTime();
  const AFTER_EVENT_MS = 10 * 60 * 60 * 1000;

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
     5. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  let scrollObserver = null;
  function triggerScrollReveals() {
    if (scrollObserver) {
      scrollObserver.disconnect();
    }
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => {
      scrollObserver.observe(el);
    });
  }

  if (document.body.classList.contains('site-entered')) {
    triggerScrollReveals();
  }

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
    const count = window.innerWidth < 600 ? 24 : 40;

    for (let i = 0; i < count; i++) {
      const isStarSparkle = Math.random() > 0.60;
      let particleColor;
      if (isStarSparkle) {
        // Celestial stars: warm champagne gold or brilliant diamond white
        particleColor = Math.random() > 0.35 ? '224, 186, 102' : '255, 255, 255';
      } else {
        // Soft cloudy bokeh orbs: luminous pearl white, warm champagne, or liquid gold (ZERO BLUE)
        const r = Math.random();
        particleColor = r > 0.55 ? '255, 255, 255' : (r > 0.28 ? '245, 230, 190' : '224, 186, 102');
      }

      bokehs.push({
        x: Math.random() * ambWidth,
        y: Math.random() * ambHeight,
        radius: isStarSparkle ? (Math.random() * 8 + 4) : (Math.random() * 16 + 5),
        speedY: (Math.random() * 0.20 + 0.05),
        speedX: (Math.random() - 0.5) * 0.08,
        baseAlpha: isStarSparkle ? (Math.random() * 0.35 + 0.25) : (Math.random() * 0.22 + 0.08),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        isStar: isStarSparkle,
        color: particleColor
      });
    }

    function renderBokeh() {
      if (!ambCanvas.isConnected) return;
      ambCtx.clearRect(0, 0, ambWidth, ambHeight);

      for (let i = 0; i < bokehs.length; i++) {
        const b = bokehs[i];
        b.y += b.speedY;
        b.x += b.speedX;
        b.twinklePhase += b.twinkleSpeed;

        if (b.y > ambHeight + 30) b.y = -30;
        if (b.x > ambWidth + 30) b.x = -30;
        if (b.x < -30) b.x = ambWidth + 30;

        const dynamicAlpha = Math.max(0.08, Math.min(0.75, b.baseAlpha + Math.sin(b.twinklePhase) * 0.18));

        ambCtx.save();
        ambCtx.fillStyle = `rgba(${b.color}, ${dynamicAlpha})`;
        ambCtx.shadowBlur = b.isStar ? 14 : 8;
        ambCtx.shadowColor = `rgba(${b.color}, 0.7)`;

        if (b.isStar) {
          // Render delicate 4-point star sparkle
          const size = Math.max(5.5, b.radius * 1.25);
          ambCtx.translate(b.x, b.y);
          ambCtx.beginPath();
          ambCtx.moveTo(0, -size);
          ambCtx.quadraticCurveTo(0, 0, size, 0);
          ambCtx.quadraticCurveTo(0, 0, 0, size);
          ambCtx.quadraticCurveTo(0, 0, -size, 0);
          ambCtx.quadraticCurveTo(0, 0, 0, -size);
          ambCtx.fill();
        } else {
          // Render soft bokeh sphere
          ambCtx.beginPath();
          ambCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ambCtx.fill();
        }
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
      const address = copyBtn.getAttribute('data-address') || '3905 Club Rancho Dr, Palmdale, CA 93551';
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
