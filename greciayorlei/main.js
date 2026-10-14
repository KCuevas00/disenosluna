/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCEAÑERA INVITATION — GRECIA YORLEI
 * Interactive Controller & RSVP (Bilingual EN/ES, Static Opened Invitation)
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'greciayorlei';
const CLIENT_NAME = "Grecia Yorlei's Quinceañera (Mosley Deyanira / Jose Dueñas)";
const CLIENT_EMAIL = 'mosleyduenas@gmail.com';
const TARGET_DATE = new Date(2026, 10, 21, 17, 0, 0).getTime();
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
      'entry-subtitle': 'GRECIA YORLEI • QUINCEAÑERA',
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'invite-quince': 'Quinceañera',
      'card-celebrant': 'GRECIA YORLEI',
      'invite-parents': 'NANSI & JOSE DUEÑAS',
      'invite-preamble': 'CORDIALLY INVITE YOU TO CELEBRATE THE',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'celebrant-name': 'Grecia Yorlei',
      'invite-date-month': 'NOV',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 5:00 PM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Big Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'GAINESVILLE • GEORGIA',
      'program-title': 'PROGRAM',
      'program-food-title': 'DINNER',
      'program-food-desc': 'GAINESVILLE BALLROOM<br />425 ATLANTA HWY, GAINESVILLE, GA 30501',
      'program-entrance-title': 'ENTRANCE WITH TAMBORAZO',
      'program-entrance-desc': 'GRAND CELEBRATORY ENTRANCE',
      'program-waltz-title': 'WALTZ',
      'program-waltz-desc': 'TRADITIONAL QUINCEAÑERA WALTZ',
      'program-toast-title': 'TOAST',
      'program-toast-desc': 'HONORARY TOAST',
      'program-surprise-title': 'SURPRISE DANCE',
      'program-surprise-desc': 'SPECIAL CHOREOGRAPHED DANCE',
      'program-party-title': 'PARTY STARTS',
      'program-party-desc': 'OPEN DANCE FLOOR & LIVE MUSIC',
      'tl-btn-location': 'DIRECTIONS',
      'tl-btn-directions': 'DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'court-title': 'COURT OF HONOR',
      'court-chambelan-title': 'CHAMBELÁN OF HONOR',
      'court-parejas-title': 'COUPLES OF HONOR',
      'registry-title': 'WISHING WELL',
      'registry-subtitle': 'RAIN OF ENVELOPES',
      'registry-desc': 'Your presence on this special day is the greatest gift. If you would like to honor me with an additional blessing, a wishing well (rain of envelopes) will be held during the reception. Thank you for being part of memories I will treasure forever.',
      'message-quote': '“She is clothed with strength and dignity, and she laughs without fear of the future. When she speaks, her words are wise, and she gives instructions with kindness.”<br /><br />— Proverbs 31:25-26 NLT',
      'message-signature': 'Nansi & Jose Dueñas',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BY NOVEMBER 1, 2026',
      'rsvp-btn': 'CONFIRM ATTENDANCE',
      'rsvp-instruction': 'CLICK THE BUTTON ABOVE TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'Confirm Attendance for Grecia Yorlei',
      'modal-subtitle': 'Saturday, November 21, 2026 • Gainesville, GA',
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
      'footer-names': 'Grecia Yorlei • Quinceañera',
      'footer-date': 'Saturday, November 21, 2026 • Gainesville, Georgia'
    },
    es: {
      'entry-invited': '¡Estás Invitada!',
      'entry-subtitle': 'GRECIA YORLEI • MIS XV AÑOS',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'invite-quince': 'XV Años',
      'card-celebrant': 'GRECIA YORLEI',
      'invite-parents': 'NANSI Y JOSÉ DUEÑAS',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A CELEBRAR',
      'invite-daughter': 'DE SU HIJA',
      'celebrant-name': 'Grecia Yorlei',
      'invite-date-month': 'NOV',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 5:00 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'GAINESVILLE • GEORGIA',
      'program-title': 'PROGRAMA',
      'program-food-title': 'COMIDA',
      'program-food-desc': 'GAINESVILLE BALLROOM<br />425 ATLANTA HWY, GAINESVILLE, GA 30501',
      'program-entrance-title': 'ENTRADA CON TAMBORAZO',
      'program-entrance-desc': 'GRAN ENTRADA TRIUNFAL',
      'program-waltz-title': 'VALS',
      'program-waltz-desc': 'TRADICIONAL VALS DE QUINCEAÑERA',
      'program-toast-title': 'BRINDIS',
      'program-toast-desc': 'BRINDIS DE HONOR',
      'program-surprise-title': 'BAILE SORPRESA',
      'program-surprise-desc': 'PRESENTACIÓN COREOGRÁFICA ESPECIAL',
      'program-party-title': 'INICIO DE LA FIESTA',
      'program-party-desc': 'PISTA DE BAILE ABIERTA Y MÚSICA',
      'tl-btn-location': 'CÓMO LLEGAR',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'court-title': 'CORTE DE HONOR',
      'court-chambelan-title': 'CHAMBELÁN DE HONOR',
      'court-parejas-title': 'PAREJAS DE HONOR',
      'registry-title': 'LLUVIA DE SOBRES',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'Tu presencia en este día tan especial es el regalo más hermoso. Si deseas obsequiarme un detalle adicional, habrá una lluvia de sobres durante la celebración. Gracias por acompañar y ser parte de un recuerdo que guardaré siempre en mi corazón.',
      'message-quote': '«Se reviste de fuerza y dignidad, y el futuro no le preocupa. Cuando habla, sus palabras son sabias, y da órdenes con bondad.»<br /><br />— Proverbios 31:25-26',
      'message-signature': 'Nansi y José Dueñas',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR SU ASISTENCIA ANTES DEL 1 DE NOVIEMBRE DE 2026',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Grecia Yorlei',
      'modal-subtitle': 'Sábado, 21 de Noviembre de 2026 • Gainesville, GA',
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
      'footer-names': 'Grecia Yorlei • Mis XV Años',
      'footer-date': 'Sábado, 21 de Noviembre de 2026 • Gainesville, Georgia'
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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER (MrQban - Desert Roads)
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

  function triggerConfetti(originEl) {
    const confettiColors = ['#a31d24', '#7d181c', '#d4af37', '#f3e5ab', '#ffffff', '#c9a86a', '#fdfbf7', '#e5c378'];
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) {
      const rect = originEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }
    const count = 50; // Reduced ~10% (from 56)
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = originX + 'px';
      conf.style.top = originY + 'px';
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

  function triggerTopConfettiRain() {
    const confettiColors = ['#d4af37', '#e5c378', '#f9e79f', '#c9a86a', '#a31d24', '#7d181c', '#c0392b', '#ffffff', '#fff8ea'];
    const count = 67; // Reduced ~10% (from 75)
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = (Math.random() * window.innerWidth) + 'px';
      conf.style.top = (-20 - Math.random() * 60) + 'px';
      const w = 6 + Math.random() * 9;
      const h = 8 + Math.random() * 14;
      conf.style.width = w + 'px';
      conf.style.height = h + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() < 0.25 ? '50%' : '2px';
      conf.style.pointerEvents = 'none';

      let vx = (Math.random() - 0.5) * 3.2;
      let vy = 3.5 + Math.random() * 6.0;
      let rot = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 12;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      // Random delay up to 400ms for natural cascading arrival
      const startDelay = Math.random() * 420;
      setTimeout(() => {
        const anim = setInterval(() => {
          posX += vx;
          posY += vy;
          rot += rotSpeed;
          vy += 0.12; // gentle gravity
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
     CONTINUOUS AMBIENT FALLING CONFETTI & TWINKLE SPARKLES ENGINE
     ───────────────────────────────────────────────────────────── */
  let ambientConfettiRunning = false;
  let ambientConfettiAnimId = null;

  function startAmbientConfetti() {
    if (ambientConfettiRunning) return;
    const canvas = document.getElementById('ambient-confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ambientConfettiRunning = true;

    // Respect reduced motion - particle counts reduced by 10%
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = prefersReducedMotion ? 29 : 72; // Reduced ~10% (from 32 / 80)

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    // Luxury Western Quince Palette: Rich Champagne Gold, Warm Amber, Velvet Crimson, Shimmer Ivory
    const palette = [
      '#d4af37', // metallic gold
      '#e5c378', // bright champagne gold
      '#f9e79f', // pale shimmer gold
      '#c9a86a', // antique gold
      '#b8860b', // dark goldenrod
      '#a31d24', // velvet crimson
      '#7d181c', // deep burgundy
      '#c0392b', // classic fiesta crimson
      '#ffffff', // diamond star sparkle
      '#fff8ea'  // warm ivory pearl
    ];

    function createParticle(initialY) {
      const isStar = Math.random() < 0.22;
      const isCircle = !isStar && Math.random() < 0.26;
      const size = 6 + Math.random() * 8;
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : -15 - Math.random() * 30,
        size: size,
        color: palette[Math.floor(Math.random() * palette.length)],
        isStar: isStar,
        isCircle: isCircle,
        vy: 0.75 + Math.random() * 1.25,
        vx: (Math.random() - 0.5) * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.018 + Math.random() * 0.025,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.025 + Math.random() * 0.045,
        opacity: 0.65 + Math.random() * 0.35,
        starPoints: 4,
        starInner: size * 0.32,
        starOuter: size * 0.88
      };
    }

    // Populate initial particles across the viewport so celebration is immediately visible
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
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

    function render() {
      if (!ambientConfettiRunning) return;

      // Pause rendering if tab is in the background to save CPU & battery
      if (document.hidden) {
        ambientConfettiAnimId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.wobble += p.wobbleSpeed;
        p.tilt += p.tiltSpeed;
        p.y += p.vy;
        p.x += Math.sin(p.wobble) * 0.75 + p.vx;

        // Reset particle when it glides past bottom
        if (p.y > height + 25) {
          particles[i] = createParticle(-15);
          continue;
        }
        if (p.x < -25) p.x = width + 25;
        else if (p.x > width + 25) p.x = -25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.wobble * 0.8);

        if (p.isStar) {
          const twinkle = 0.5 + 0.5 * Math.sin(p.wobble * 2.5);
          ctx.globalAlpha = p.opacity * twinkle;
          ctx.fillStyle = p.color;
          drawStar(ctx, 0, 0, p.starPoints, p.starOuter, p.starInner);
        } else if (p.isCircle) {
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.45, p.size * 0.35, p.tilt, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 3D fluttering foil flake
          const tiltWidth = Math.cos(p.tilt) * p.size;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.rect(-tiltWidth / 2, -p.size * 0.65, tiltWidth, p.size * 1.3);
          ctx.fill();
        }

        ctx.restore();
      }

      ambientConfettiAnimId = requestAnimationFrame(render);
    }

    ambientConfettiAnimId = requestAnimationFrame(render);
  }

  // Expose on window for manual triggers or inspection
  window.startAmbientConfetti = startAmbientConfetti;

  /* ─────────────────────────────────────────────────────────────
     COPY VENUE ADDRESS FUNCTIONALITY
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address') || 'Gainesville Ballroom, 425 Atlanta Hwy, Gainesville, GA 30501';
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
