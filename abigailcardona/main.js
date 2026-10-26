/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCEAÑERA INVITATION — ABIGAIL CARDONA
 * Interactive Controller & RSVP (Bilingual EN/ES, Static Opened Invitation)
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'abigailcardona';
const CLIENT_NAME = "Abigail Cardona's Quinceañera (Marcos Cardona & Cristina Garcia)";
const CLIENT_EMAIL = 'andy040306@gmail.com';
const TARGET_DATE = new Date(2026, 10, 20, 15, 0, 0).getTime();
const AFTER_EVENT_MS = 6 * 60 * 60 * 1000;

function init() {
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
  if (new URLSearchParams(window.location.search).get('landing') === 'true') {
    document.documentElement.classList.add('site-entered');
    document.body.classList.add('site-entered');
    const ov = document.getElementById('entry-popup-overlay');
    if (ov) ov.style.display = 'none';
  }

  // Strictly block background scrolling/wheeling while envelope is unopened,
  // but allow touch/pointer interactions on the envelope overlay so taps are not cancelled by mobile browsers
  const blockScrollUntilEntered = (e) => {
    if (!document.body.classList.contains('site-entered')) {
      if (e.target && e.target.closest && e.target.closest('#entry-popup-overlay')) {
        return;
      }
      e.preventDefault();
      return false;
    }
  };

  const blockKeysUntilEntered = (e) => {
    if (!document.body.classList.contains('site-entered')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
        return;
      }
      const blockedKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
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
      'entry-invited': "You've Been Invited!",
      'entry-subtitle': 'ABIGAIL CARDONA • QUINCEAÑERA',
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'invite-quince': 'Quinceañera',
      'card-celebrant': 'ABIGAIL CARDONA',
      'invite-parents': 'MARCOS CARDONA & CRISTINA GARCIA',
      'invite-preamble': 'CORDIALLY INVITE YOU TO CELEBRATE THE',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'celebrant-name': 'Abigail Cardona',
      'invite-date-month': 'NOV',
      'invite-date-day': 'FRIDAY',
      'invite-date-time': 'AT 3:00 PM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Big Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'MCALLEN & PHARR • TEXAS',
      'program-title': 'PROGRAM',
      'program-mass-title': 'MASS',
      'program-mass-desc': 'IGLESIA DE DIOS GRACIA Y PAZ,<br />4900 LARK AVE, MCALLEN, TX 78504',
      'program-food-title': 'DINNER',
      'program-food-desc': 'REGENCY EVENT CENTER,<br />207 E FERGUSON AVE, PHARR, TX 78577',
      'program-entrance-title': 'ENTRANCE',
      'program-entrance-desc': 'GRAND CELEBRATORY ENTRANCE OF THE QUINCEAÑERA',
      'program-waltz-title': 'WALTZ',
      'program-waltz-desc': 'TRADITIONAL QUINCEAÑERA WALTZ',
      'program-party-title': 'PARTY',
      'program-party-desc': 'DANCE FLOOR OPENS & CELEBRATION',
      'program-surprise-title': 'SURPRISE DANCE',
      'program-surprise-desc': 'SPECIAL CHOREOGRAPHED DANCE',
      'program-dj-title': 'DJ',
      'program-dj-desc': 'LIVE DJ & CONTINUOUS CELEBRATION',
      'program-end-title': 'EVENT CONCLUSION',
      'program-end-desc': 'FAREWELL & SPECIAL THANKS',
      'badge-entrance': '✦ Grand Entrance',
      'badge-waltz': '✦ Waltz Melody',
      'badge-party': '✦ Party & Rhythm',
      'badge-surprise': '✦ Surprise Dance',
      'badge-dj': '✦ Live DJ',
      'badge-end': '✦ Farewell',
      'tl-btn-location': 'DIRECTIONS',
      'tl-btn-directions': 'DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'court-title': 'COURT OF HONOR & SPONSORS',
      'court-chambelan-title': 'CHAMBELÁN OF HONOR',
      'court-chambelanes-group-title': 'CHAMBELANES',
      'court-padrinos-honor-title': 'PADRINOS OF HONOR',
            'court-sponsors-title': 'SPONSORS',
      'dress-code-title': 'DRESS CODE',
      'dress-code-subtitle': 'NO ROYAL BLUE',
      'dress-code-desc': 'Guests are kindly requested <strong>NOT to wear royal blue</strong>, reserved exclusively for the Quinceañera.',
      'registry-title': 'GIFTS & WISHING WELL',
      'registry-subtitle': 'TOKENS OF LOVE',
      'registry-desc': 'Your presence on this special day is our greatest gift. If you wish to honor Abigail with a gift or token of affection, anything is greatly appreciated. Thank you for celebrating with us and creating memories to treasure forever.',
      'message-quote': '“To my family and friends, thank you for being part of my life and for celebrating this important day with me. I can’t wait to laugh, dance, and make memories with all of you!”',
      'message-signature': 'Abigail Cardona',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BY NOVEMBER 13, 2026',
      'rsvp-btn': 'CONFIRM ATTENDANCE',
      'rsvp-instruction': 'CLICK THE BUTTON ABOVE TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'Confirm Attendance for Abigail Cardona',
      'modal-subtitle': 'Friday, November 20, 2026 • McAllen & Pharr, TX',
      'label-fullname': 'Full Name or Family *',
      'label-phone': 'Phone Number (Optional)',
      'label-party': 'Number of Guests (Optional)',
      'opt-party-1': '1 Guest',
      'opt-party-2': '2 Guests',
      'opt-party-3': '3 Guests',
      'opt-party-4': '4 Guests',
      'opt-party-5': '5+ Guests (Family)',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">YES, ATTENDING</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">CANNOT ATTEND</span>',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your response has been saved successfully. We look forward to celebrating together!',
      'modal-decline-desc': 'Thank you for letting us know. Your response has been saved.',
      'footer-names': 'Abigail Cardona • Quinceañera',
      'footer-date': 'Friday, November 20, 2026 • McAllen & Pharr, Texas'
    },
    es: {
      'entry-invited': '¡Estás Invitada!',
      'entry-subtitle': 'ABIGAIL CARDONA • MIS XV AÑOS',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'invite-quince': 'XV Años',
      'card-celebrant': 'ABIGAIL CARDONA',
      'invite-parents': 'MARCOS CARDONA Y CRISTINA GARCIA',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A CELEBRAR LOS',
      'invite-daughter': 'DE SU HIJA',
      'celebrant-name': 'Abigail Cardona',
      'invite-date-month': 'NOV',
      'invite-date-day': 'VIERNES',
      'invite-date-time': 'A LAS 3:00 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'MCALLEN & PHARR • TEXAS',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'MISA',
      'program-mass-desc': 'IGLESIA DE DIOS GRACIA Y PAZ,<br />4900 LARK AVE, MCALLEN, TX 78504',
      'program-food-title': 'COMIDA',
      'program-food-desc': 'REGENCY EVENT CENTER,<br />207 E FERGUSON AVE, PHARR, TX 78577',
      'program-entrance-title': 'ENTRADA',
      'program-entrance-desc': 'GRAN ENTRADA TRIUNFAL DE LA QUINCEAÑERA',
      'program-waltz-title': 'VALS',
      'program-waltz-desc': 'TRADICIONAL VALS DE QUINCEAÑERA',
      'program-party-title': 'BAILE',
      'program-party-desc': 'APERTURA DE PISTA Y BAILE GENERAL',
      'program-surprise-title': 'BAILE SORPRESA',
      'program-surprise-desc': 'PRESENTACIÓN COREOGRÁFICA ESPECIAL',
      'program-dj-title': 'DJ',
      'program-dj-desc': 'MÚSICA EN VIVO Y CELEBRACIÓN CONTINUA',
      'program-end-title': 'FIN DEL EVENTO',
      'program-end-desc': 'AGRADECIMIENTOS Y DESPEDIDA',
      'badge-entrance': '✦ Entrada',
      'badge-waltz': '✦ Vals',
      'badge-party': '✦ Fiesta',
      'badge-surprise': '✦ Sorpresa',
      'badge-dj': '✦ DJ Show',
      'badge-end': '✦ Fin',
      'tl-btn-location': 'CÓMO LLEGAR',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'court-title': 'CORTE DE HONOR Y PADRINOS',
      'court-chambelan-title': 'CHAMBELÁN DE HONOR',
      'court-chambelanes-group-title': 'CHAMBELANES',
      'court-padrinos-honor-title': 'PADRINOS DE HONOR',
            'court-sponsors-title': 'PADRINOS Y PATROCINADORES',
      'dress-code-title': 'CÓDIGO DE VESTIMENTA',
      'dress-code-subtitle': 'NO VESTIR DE AZUL REY',
      'dress-code-desc': 'Se solicita amablemente a los invitados <strong>NO vestir de color azul rey</strong>, reservado exclusivamente para la Quinceañera.',
      'registry-title': 'MUESTRAS DE CARIÑO',
      'registry-subtitle': 'DETALLES Y BENDICIONES',
      'registry-desc': 'Tu presencia en este día tan especial es el regalo más hermoso. Si deseas tener un detalle u obsequio con Abigail, cualquier muestra de cariño es profundamente apreciada. ¡Gracias por acompañarnos y ser parte de recuerdos inolvidables!',
      'message-quote': '«A mi familia y amigos, gracias por ser parte de mi vida y por celebrar este día tan importante conmigo. ¡No puedo esperar para reír, bailar y crear recuerdos inolvidables con todos ustedes!»',
      'message-signature': 'Abigail Cardona',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR SU ASISTENCIA ANTES DEL 13 DE NOVIEMBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Abigail Cardona',
      'modal-subtitle': 'Viernes, 20 de Noviembre de 2026 • McAllen & Pharr, TX',
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
      'modal-decline-desc': 'Gracias por avisarnos. Su respuesta ha sido guardada.',
      'footer-names': 'Abigail Cardona • Mis XV Años',
      'footer-date': 'Viernes, 20 de Noviembre de 2026 • McAllen & Pharr, Texas'
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
        if (el instanceof SVGElement && typeof el.textContent !== 'undefined') {
          el.textContent = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
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

  // Default strictly to Spanish on startup (unless URL specifies ?lang=en)
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang === 'en') {
    userSelectedLang = true;
    applyLanguage('en');
  } else {
    applyLanguage('es');
  }

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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER (ME JALO - Fuerza Regida, Grupo Frontera)
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');

  let isAudioPlaying = false;
  let wasAudioPlayingBeforeHide = false;
  let audioUnlocked = false;

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

  // Synchronize state with native HTML5 audio events (e.g. stalled, paused by OS)
  if (bgAudio) {
    bgAudio.addEventListener('play', () => updatePlayState(true));
    bgAudio.addEventListener('playing', () => updatePlayState(true));
    bgAudio.addEventListener('pause', () => updatePlayState(false));
    bgAudio.addEventListener('ended', () => updatePlayState(false));
    bgAudio.addEventListener('error', (e) => {
      console.warn('[Audio element error]:', bgAudio.error || e);
      updatePlayState(false);
    });
  }

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioUnlocked = true;
          updatePlayState(true);
        })
        .catch((err) => {
          console.warn('[Audio autoplay notice]:', err);
          updatePlayState(false);
          // If browser rejected on initial tap, unlock on the very next user gesture anywhere
          if (!audioUnlocked) {
            const unlockOnNextTouch = () => {
              bgAudio.play().then(() => {
                audioUnlocked = true;
                updatePlayState(true);
              }).catch(() => {});
            };
            ['touchend', 'click'].forEach(evt => {
              window.addEventListener(evt, unlockOnNextTouch, { once: true, passive: true });
            });
          }
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
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & CONFETTI CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const innerSealBtn = document.querySelector('.wax-seal-btn');
  const envFlap = document.getElementById('env-flap');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Default to Spanish upon opening the invite unless English was explicitly chosen
    if (!userSelectedLang || currentLang !== 'en') {
      applyLanguage('es');
    }

    // Start background music automatically
    playAudio();

    // Trigger celebratory confetti burst radiating from wax seal / center AND top shower
    try {
      const sealTarget = document.getElementById('wax-seal-btn') || envelope;
      triggerConfetti(sealTarget);
      triggerTopConfettiRain();
    } catch (e) {
      console.warn('[Confetti notice]:', e);
    }

    // 1. Open envelope flap and glide up invitation card
    if (overlay) {
      overlay.classList.add('is-opened');
    }
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Smoothly fade out envelope overlay and unveil main site (1500ms)
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      startAmbientConfetti();
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#fbf8f3');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
    }, 1500);

    // 3. Final cleanup of overlay (2350ms)
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

  // Expose on window for inline HTML onclick handlers & console accessibility
  window.openEnvelope = openEnvelope;

  // Bind click & key triggers to interactive envelope elements (preserving native user gesture context for audio)
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (innerSealBtn && innerSealBtn !== waxSealBtn) {
    innerSealBtn.addEventListener('click', (e) => {
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

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        openEnvelope();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. COUNTDOWN TIMER ENGINE (SATURDAY, NOV 21, 2026 AT 5:00 PM)
     ───────────────────────────────────────────────────────────── */
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
     5. SCROLL REVEAL (ALL ELEMENTS VISIBLE IMMEDIATELY)
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => {
      el.classList.add('is-visible');
    });
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

  /* ─────────────────────────────────────────────────────────────
     CELEBRATION ENGINE CONFIGURATION
     Options: 'petals' (Option 1: Royal Blue Petals & Gold Leaf)
              'confetti' (Original party confetti)
              'embers' (Option 2: Warm Golden Hour Embers)
              'sparkles' (Option 3: Stardust Sparkles)
              'none' (No continuous animation)
     ───────────────────────────────────────────────────────────── */
  const CELEBRATION_MODE = 'petals';
  window.CELEBRATION_MODE = CELEBRATION_MODE;

  /* ─────────────────────────────────────────────────────────────
     BURST & RAIN EFFECTS (WAX SEAL OPENING & RSVP CELEBRATION)
     ───────────────────────────────────────────────────────────── */
  function triggerConfetti(originEl) {
    if (CELEBRATION_MODE === 'none') return;
    if (CELEBRATION_MODE === 'petals') {
      triggerPetalBurst(originEl);
    } else {
      triggerOriginalConfetti(originEl);
    }
  }

  function triggerTopConfettiRain() {
    if (CELEBRATION_MODE === 'none') return;
    if (CELEBRATION_MODE === 'petals') {
      triggerTopPetalShower();
    } else {
      triggerOriginalTopRain();
    }
  }

  // Option 1: Romantic Velvet Crimson Rose Petal & Gold Leaf Burst from Wax Seal
  function triggerPetalBurst(originEl) {
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) {
      const rect = originEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }

    const count = 42;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.style.position = 'fixed';
      petal.style.zIndex = '99999';
      petal.style.left = originX + 'px';
      petal.style.top = originY + 'px';
      petal.style.pointerEvents = 'none';

      const isGold = Math.random() < 0.22;
      const sizeW = isGold ? (7 + Math.random() * 6) : (11 + Math.random() * 9);
      const sizeH = isGold ? (8 + Math.random() * 8) : (14 + Math.random() * 11);
      petal.style.width = sizeW + 'px';
      petal.style.height = sizeH + 'px';

      if (isGold) {
        petal.style.background = 'radial-gradient(ellipse at 30% 30%, #fef3c7 0%, #d4af37 60%, #92400e 100%)';
        petal.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
        petal.style.boxShadow = '0 1px 4px rgba(212, 175, 55, 0.4)';
      } else {
        const isDarkWine = Math.random() < 0.35;
        if (isDarkWine) {
          petal.style.background = 'radial-gradient(ellipse at 35% 35%, #3b63d6 0%, #1e40af 65%, #0d2b5c 100%)';
        } else {
          petal.style.background = 'radial-gradient(ellipse at 35% 35%, #7fa2f5 0%, #4169E1 55%, #1a3a9a 100%)';
        }
        // Asymmetrical organic petal curvature
        petal.style.borderRadius = Math.random() < 0.5
          ? '65% 35% 60% 40% / 70% 35% 65% 30%'
          : '35% 65% 40% 60% / 35% 70% 30% 65%';
        petal.style.boxShadow = '0 2px 7px rgba(13, 43, 92, 0.28)';
      }

      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 11;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 2.5; // slight upward pop
      let rot = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 8;
      let tilt = Math.random() * Math.PI * 2;
      let tiltSpeed = 0.05 + Math.random() * 0.08;

      document.body.appendChild(petal);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx;
        posY += vy;
        vx *= 0.96; // air resistance
        vy += 0.22; // gentle petal gravity
        rot += rotSpeed;
        tilt += tiltSpeed;
        opacity -= 0.016;

        const flipX = Math.cos(tilt);
        petal.style.transform = `translate(${posX}px, ${posY}px) rotate(${rot}deg) scaleX(${flipX})`;
        petal.style.opacity = Math.max(0, opacity);

        if (opacity <= 0) {
          clearInterval(anim);
          petal.remove();
        }
      }, 16);
    }
  }

  // Option 1: Top Petal Shower Cascading Upon Envelope Open
  function triggerTopPetalShower() {
    const count = 38;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.style.position = 'fixed';
      petal.style.zIndex = '99999';
      petal.style.left = (Math.random() * window.innerWidth) + 'px';
      petal.style.top = (-25 - Math.random() * 80) + 'px';
      petal.style.pointerEvents = 'none';

      const isGold = Math.random() < 0.20;
      const sizeW = isGold ? (7 + Math.random() * 6) : (12 + Math.random() * 8);
      const sizeH = isGold ? (8 + Math.random() * 7) : (15 + Math.random() * 10);
      petal.style.width = sizeW + 'px';
      petal.style.height = sizeH + 'px';

      if (isGold) {
        petal.style.background = 'radial-gradient(ellipse at 30% 30%, #fef3c7 0%, #d4af37 60%, #92400e 100%)';
        petal.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
        petal.style.boxShadow = '0 1px 4px rgba(212, 175, 55, 0.35)';
      } else {
        const isDarkWine = Math.random() < 0.35;
        if (isDarkWine) {
          petal.style.background = 'radial-gradient(ellipse at 35% 35%, #3b63d6 0%, #1e40af 65%, #0d2b5c 100%)';
        } else {
          petal.style.background = 'radial-gradient(ellipse at 35% 35%, #7fa2f5 0%, #4169E1 55%, #1a3a9a 100%)';
        }
        petal.style.borderRadius = Math.random() < 0.5
          ? '65% 35% 60% 40% / 70% 35% 65% 30%'
          : '35% 65% 40% 60% / 35% 70% 30% 65%';
        petal.style.boxShadow = '0 2px 6px rgba(13, 43, 92, 0.22)';
      }

      let vx = (Math.random() - 0.5) * 2.0;
      let vy = 1.8 + Math.random() * 3.2; // graceful drifting fall
      let rot = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 5;
      let tilt = Math.random() * Math.PI * 2;
      let tiltSpeed = 0.035 + Math.random() * 0.05;
      let sway = Math.random() * Math.PI * 2;

      document.body.appendChild(petal);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const startDelay = Math.random() * 450;
      setTimeout(() => {
        const anim = setInterval(() => {
          sway += 0.04;
          posX += vx + Math.sin(sway) * 0.9;
          posY += vy;
          rot += rotSpeed;
          tilt += tiltSpeed;

          if (posY > window.innerHeight * 0.72) {
            opacity -= 0.02;
          }

          const flipX = Math.cos(tilt);
          petal.style.transform = `translate(${posX}px, ${posY}px) rotate(${rot}deg) scaleX(${flipX})`;
          petal.style.opacity = Math.max(0, opacity);

          if (opacity <= 0 || posY > window.innerHeight + 50) {
            clearInterval(anim);
            petal.remove();
          }
        }, 16);
      }, startDelay);
    }
  }

  // Backup Original Confetti Functions (Quickly accessible if user chooses to revert)
  function triggerOriginalConfetti(originEl) {
    const confettiColors = ['#1e40af', '#1e3a8a', '#2563eb', '#3b82f6', '#d4af37', '#e5c378', '#fff8ea', '#ffffff', '#c9a86a'];
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) {
      const rect = originEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }
    const count = 45;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = originX + 'px';
      conf.style.top = originY + 'px';
      conf.style.width = (6 + Math.random() * 7) + 'px';
      conf.style.height = (8 + Math.random() * 10) + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = '2px';
      conf.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 12;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx;
        posY += vy;
        vy += 0.4;
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

  function triggerOriginalTopRain() {
    const confettiColors = ['#d4af37', '#e5c378', '#f9e79f', '#c9a86a', '#1e40af', '#1e3a8a', '#2563eb', '#ffffff', '#fff8ea'];
    const count = 55;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = (Math.random() * window.innerWidth) + 'px';
      conf.style.top = (-20 - Math.random() * 60) + 'px';
      conf.style.width = (6 + Math.random() * 8) + 'px';
      conf.style.height = (8 + Math.random() * 12) + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() < 0.25 ? '50%' : '2px';
      conf.style.pointerEvents = 'none';

      let vx = (Math.random() - 0.5) * 3.0;
      let vy = 3.5 + Math.random() * 5.5;
      let rot = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 12;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const startDelay = Math.random() * 400;
      setTimeout(() => {
        const anim = setInterval(() => {
          posX += vx;
          posY += vy;
          rot += rotSpeed;
          vy += 0.12;
          if (posY > window.innerHeight * 0.75) {
            opacity -= 0.025;
          }

          conf.style.transform = `translate(${posX}px, ${posY}px) rotate(${rot}deg)`;
          conf.style.opacity = opacity;

          if (opacity <= 0 || posY > window.innerHeight + 50) {
            clearInterval(anim);
            conf.remove();
          }
        }, 16);
      }, startDelay);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     CONTINUOUS AMBIENT DRIFTING PETALS & GOLD LEAF ENGINE
     ───────────────────────────────────────────────────────────── */
  let ambientAnimationRunning = false;
  let ambientAnimationAnimId = null;

  function startAmbientConfetti() {
    if (CELEBRATION_MODE === 'none') return;
    if (ambientAnimationRunning) return;

    const canvas = document.getElementById('ambient-confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ambientAnimationRunning = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    // Elegant, tranquil density: ~34 on desktop, ~20 on mobile/reduced motion
    const particleCount = prefersReducedMotion ? 18 : (isMobile ? 22 : 36);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    function createPetal(initialY) {
      const rand = Math.random();
      const isGoldLeaf = rand < 0.18;
      const isTwinkleStar = !isGoldLeaf && rand < 0.28;
      const isBurgundy = !isGoldLeaf && !isTwinkleStar && rand < 0.65;
      const size = isGoldLeaf ? (7 + Math.random() * 6) : (10 + Math.random() * 8);

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : -20 - Math.random() * 40,
        size: size,
        isGoldLeaf: isGoldLeaf,
        isTwinkleStar: isTwinkleStar,
        isBurgundy: isBurgundy,
        vy: 0.55 + Math.random() * 0.75, // slow, peaceful descent
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.018,
        swayAmp: 0.65 + Math.random() * 0.85,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.018 + Math.random() * 0.032,
        opacity: 0.55 + Math.random() * 0.35,
        starPoints: 4,
        starInner: size * 0.28,
        starOuter: size * 0.85
      };
    }

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createPetal(Math.random() * height));
    }

    function drawStar(c, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    }

    function drawOrganicPetal(c, p) {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);

      // 3D tumble flip along horizontal axis
      const flipX = Math.cos(p.tilt);
      c.scale(flipX, 1);

      const s = p.size;
      c.beginPath();
      // Organic rose petal contour: narrow base, billowing soft rounded lobes, gentle tip
      c.moveTo(0, -s * 0.85);
      c.bezierCurveTo(s * 0.72, -s * 0.65, s * 0.88, s * 0.55, 0, s * 0.95);
      c.bezierCurveTo(-s * 0.88, s * 0.55, -s * 0.72, -s * 0.65, 0, -s * 0.85);
      c.closePath();

      // Velvety radial gradient with soft directional lighting
      const grad = c.createRadialGradient(-s * 0.15, -s * 0.25, s * 0.1, 0, 0, s);
      if (p.isGoldLeaf) {
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.45, '#d4af37');
        grad.addColorStop(0.85, '#b45309');
        grad.addColorStop(1, '#78350f');
      } else if (p.isBurgundy) {
        grad.addColorStop(0, '#3b63d6');
        grad.addColorStop(0.5, '#1e40af');
        grad.addColorStop(0.9, '#12307f');
        grad.addColorStop(1, '#0a1d52');
      } else {
        // Classic royal blue
        grad.addColorStop(0, '#7fa2f5');
        grad.addColorStop(0.4, '#4169E1');
        grad.addColorStop(0.8, '#2447b8');
        grad.addColorStop(1, '#12307f');
      }

      c.globalAlpha = p.opacity;
      c.fillStyle = grad;
      c.fill();

      // Subtle delicate center crease on larger petals
      if (!p.isGoldLeaf && s > 11) {
        c.beginPath();
        c.moveTo(0, -s * 0.7);
        c.quadraticCurveTo(s * 0.08, 0, 0, s * 0.75);
        c.strokeStyle = 'rgba(219, 234, 254, 0.22)';
        c.lineWidth = 1;
        c.stroke();
      }

      c.restore();
    }

    function render() {
      if (!ambientAnimationRunning) return;

      if (document.hidden) {
        ambientAnimationAnimId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.sway += p.swaySpeed;
        p.tilt += p.tiltSpeed;
        p.rotation += p.rotationSpeed;
        p.y += p.vy;
        p.x += Math.sin(p.sway) * p.swayAmp;

        // Reset particle when it floats past screen bottom
        if (p.y > height + 25) {
          particles[i] = createPetal(-20);
          continue;
        }
        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;

        if (p.isTwinkleStar) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          const twinkle = 0.4 + 0.6 * Math.sin(p.sway * 2.2);
          ctx.globalAlpha = p.opacity * twinkle;
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur = 6;
          drawStar(ctx, 0, 0, p.starPoints, p.starOuter * 0.65, p.starInner * 0.65);
          ctx.restore();
        } else {
          drawOrganicPetal(ctx, p);
        }
      }

      ambientAnimationAnimId = requestAnimationFrame(render);
    }

    ambientAnimationAnimId = requestAnimationFrame(render);
  }

  // Expose on window for manual triggers or inspection
  window.startAmbientConfetti = startAmbientConfetti;
  window.startAmbientPetals = startAmbientConfetti;

  /* ─────────────────────────────────────────────────────────────
     COPY VENUE ADDRESS FUNCTIONALITY
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address') || 'Regency Event Center, 207 E Ferguson Ave, Pharr, TX 78577';
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

  // Check if site is already entered (e.g., reloaded or bypassed)
  if (document.body.classList.contains('site-entered')) {
    startAmbientConfetti();
  }

}

// Execute immediately if DOM is already ready, otherwise on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
