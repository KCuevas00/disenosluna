/* ═════════════════════════════════════════════════════════════════════
   ALEXA S. LACO DEHARO — AFTER PARTY INVITATION SCRIPT
   Diseños Luna Luxury Stationary
   ═════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────
     1. MAP PLATFORM DETECTION (APPLE MAPS FOR iOS / MACOS)
     ───────────────────────────────────────────────────────────── */
  const mapBtn = document.getElementById('map-link-btn');
  if (mapBtn) {
    const isAppleDevice = /Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const appleUrl = mapBtn.getAttribute('data-apple-url');
    if (isAppleDevice && appleUrl) {
      mapBtn.setAttribute('href', appleUrl);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. AMBIENT BOKEH & STARDUST CANVAS
     ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = window.innerWidth < 600 ? 28 : 45;

    for (let i = 0; i < count; i++) {
      const isStar = Math.random() > 0.60;
      let pColor;
      if (isStar) {
        // Champagne gold or diamond white
        pColor = Math.random() > 0.35 ? '224, 186, 102' : '255, 255, 255';
      } else {
        // Frosted ice blue, pearl white or sky cyan
        const r = Math.random();
        pColor = r > 0.55 ? '255, 255, 255' : (r > 0.3 ? '210, 242, 250' : '165, 228, 242');
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isStar ? (Math.random() * 8 + 4) : (Math.random() * 15 + 4),
        speedY: Math.random() * 0.18 + 0.05,
        speedX: (Math.random() - 0.5) * 0.18,
        baseAlpha: isStar ? (Math.random() * 0.35 + 0.25) : (Math.random() * 0.22 + 0.08),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        isStar: isStar,
        color: pColor
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y > height + 30) p.y = -30;
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        const dynamicAlpha = Math.max(0.08, Math.min(0.75, p.baseAlpha + Math.sin(p.twinklePhase) * 0.18));

        ctx.save();
        ctx.fillStyle = `rgba(${p.color}, ${dynamicAlpha})`;
        ctx.shadowBlur = p.isStar ? 14 : 8;
        ctx.shadowColor = `rgba(${p.color}, 0.7)`;

        if (p.isStar) {
          const size = Math.max(5.5, p.radius * 1.25);
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.quadraticCurveTo(0, 0, size, 0);
          ctx.quadraticCurveTo(0, 0, 0, size);
          ctx.quadraticCurveTo(0, 0, -size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  /* ─────────────────────────────────────────────────────────────
     3. AUDIO CONTROLLER & SONG PREVIEW TICKER ("Siesta Freestyle" — Lewis OfMan)
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioBar = document.getElementById('audio-control-bar');
  const audioContent = document.getElementById('audio-collapsible-content');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');
  const audioCollapseToggle = document.getElementById('audio-collapse-toggle');
  const songTicker = document.getElementById('song-title-ticker');

  let isAudioPlaying = false;
  let hasEverPlayed = false;
  let userManuallyPaused = false;
  let wasAudioPlayingBeforeHide = false;
  let fallbackAttempted = false;
  let lastToggleTime = 0;

  const SONG_TITLE = 'Siesta Freestyle \u2014 Lewis OfMan';

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    if (songTicker) {
      songTicker.textContent = SONG_TITLE;
    }
    if (playing) {
      hasEverPlayed = true;
      if (audioBar) audioBar.classList.add('is-playing');
      if (audioToggleBtn) {
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.setAttribute('aria-label', 'Pause music');
      }
      if (audioPlayIcon) audioPlayIcon.style.display = 'none';
      if (audioPauseIcon) audioPauseIcon.style.display = 'inline';
    } else {
      if (audioBar) audioBar.classList.remove('is-playing');
      if (audioToggleBtn) {
        audioToggleBtn.classList.remove('playing');
        audioToggleBtn.setAttribute('aria-label', 'Play music');
      }
      if (audioPlayIcon) audioPlayIcon.style.display = 'inline';
      if (audioPauseIcon) audioPauseIcon.style.display = 'none';
    }
    updateSongTickerOffset();
  }

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;

    // Direct synchronous play request
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
        })
        .catch((err) => {
          // Autoplay restricted until blessed user gesture
          updatePlayState(false);
        });
    }
  }

  function pauseAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    updatePlayState(false);
  }

  function toggleAudio() {
    if (!bgAudio) return;
    const now = Date.now();
    // Debounce to prevent rapid double-trigger glitches (touch + synthetic click)
    if (now - lastToggleTime < 350) return;
    lastToggleTime = now;

    // Always check actual paused state on the audio element
    if (!bgAudio.paused) {
      userManuallyPaused = true;
      wasAudioPlayingBeforeHide = false;
      pauseAudio();
    } else {
      userManuallyPaused = false;
      playAudio();
      removeUnlockListeners();
    }
  }

  // Audio element listeners
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

    // Codec failover: fallback to mp3 if m4a ever reports an error
    bgAudio.addEventListener('error', (e) => {
      console.warn('[Audio element error notice]:', bgAudio.error || e);
      if (!fallbackAttempted) {
        fallbackAttempted = true;
        bgAudio.src = 'music/song.mp3?v=8';
        bgAudio.load();
        if (!userManuallyPaused) {
          bgAudio.play().then(() => updatePlayState(true)).catch(() => {});
        }
      } else {
        updatePlayState(false);
      }
    });
  }

  // Clicking anywhere on the pill content toggles play/pause smoothly
  if (audioContent) {
    audioContent.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
    audioContent.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleAudio();
      }
    });
  }

  // Marquee Scroll Offset Calculation
  function updateSongTickerOffset() {
    const ticker = document.getElementById('song-title-ticker');
    const viewport = document.querySelector('.song-marquee-viewport');
    if (!ticker || !viewport) return;

    const overflow = ticker.scrollWidth - viewport.clientWidth;
    if (overflow > 1) {
      ticker.style.setProperty('--scroll-offset', `-${Math.ceil(overflow) + 8}px`);
    } else {
      ticker.style.setProperty('--scroll-offset', '0px');
    }
  }

  // Collapsible toggle handler
  function setBarCollapsed(collapsed) {
    if (!audioBar || !audioCollapseToggle) return;
    audioBar.classList.toggle('collapsed', collapsed);
    audioCollapseToggle.setAttribute('aria-expanded', String(!collapsed));
    audioCollapseToggle.setAttribute('aria-label', collapsed ? 'Show music player' : 'Hide music player');
    setTimeout(updateSongTickerOffset, 60);
    setTimeout(updateSongTickerOffset, 420);
  }

  if (audioCollapseToggle) {
    audioCollapseToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyCollapsed = audioBar.classList.contains('collapsed');
      setBarCollapsed(!isCurrentlyCollapsed);
    });
  }

  // Tapping collapsed bar re-expands it and starts audio if paused
  if (audioBar) {
    audioBar.addEventListener('click', () => {
      if (audioBar.classList.contains('collapsed')) {
        setBarCollapsed(false);
        if (!isAudioPlaying && !userManuallyPaused) {
          playAudio();
        }
      }
    });
  }

  // Immediate Autoplay & Universal First-Interaction Unlock
  function attemptDirectAutoplay() {
    if (!bgAudio || userManuallyPaused) return;
    playAudio();
  }

  // 1. Fire immediately
  attemptDirectAutoplay();

  // 2. Lifecycle triggers
  window.addEventListener('load', attemptDirectAutoplay);
  window.addEventListener('pageshow', attemptDirectAutoplay);
  document.addEventListener('DOMContentLoaded', attemptDirectAutoplay);

  // 3. Fallback gesture unlock for mobile browsers enforcing user activation
  const autoUnlockEvents = ['touchstart', 'touchend', 'click', 'scroll', 'touchmove', 'pointerdown'];

  function removeUnlockListeners() {
    autoUnlockEvents.forEach((evt) => {
      window.removeEventListener(evt, unlockAudio, { capture: true });
      document.removeEventListener(evt, unlockAudio, { capture: true });
    });
  }

  function unlockAudio(e) {
    if (!bgAudio || userManuallyPaused) return;
    // CRITICAL FIX: If user tapped on ANY part of the music player, let the dedicated toggle handler take care of it
    if (e.target && audioBar && audioBar.contains(e.target)) return;

    if (bgAudio.paused) {
      bgAudio.volume = 0.85;
      const p = bgAudio.play();
      if (p !== undefined) {
        p.then(() => {
          updatePlayState(true);
          removeUnlockListeners();
        }).catch(() => {});
      }
    } else {
      removeUnlockListeners();
    }
  }

  autoUnlockEvents.forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
    document.addEventListener(evt, unlockAudio, { capture: true, passive: true });
  });

  // Page visibility & app switching
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isAudioPlaying) {
        wasAudioPlayingBeforeHide = true;
        pauseAudio();
      }
    } else {
      if (wasAudioPlayingBeforeHide && !userManuallyPaused) {
        playAudio();
        wasAudioPlayingBeforeHide = false;
      }
    }
  });

  window.addEventListener('pagehide', () => {
    wasAudioPlayingBeforeHide = false;
    pauseAudio();
  });

  // Initial ticker state
  if (songTicker) {
    songTicker.textContent = SONG_TITLE;
  }
  updateSongTickerOffset();
  window.addEventListener('resize', updateSongTickerOffset);

  /* ─────────────────────────────────────────────────────────────
     4. RSVP MODAL & SUBMISSION SYSTEM (Same Google Sheet)
     ───────────────────────────────────────────────────────────── */
  const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
  const EVENT_SLUG = 'alexadeharo';
  const CLIENT_NAME = "Alexa S. Laco Deharo's Quinceañera (Maricarmen Deharo)";

  const openRsvpBtn = document.getElementById('open-rsvp-btn');
  const rsvpModal = document.getElementById('rsvp-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const btnModalDone = document.getElementById('btn-modal-done');
  const rsvpForm = document.getElementById('rsvp-form');
  const btnAccept = document.getElementById('btn-rsvp-accept');
  const btnDecline = document.getElementById('btn-rsvp-decline');
  const successAlert = document.getElementById('modal-success-alert');
  const successDesc = document.getElementById('modal-success-desc');

  function openRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.add('is-active');
    rsvpModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (successAlert) successAlert.hidden = true;
    if (rsvpForm) {
      const fieldGroups = rsvpForm.querySelectorAll('.form-group, .rsvp-action-buttons');
      fieldGroups.forEach(g => g.style.display = '');
    }
    const nameInput = document.getElementById('guest-fullname');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 150);
    }
  }

  function closeRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('is-active');
    rsvpModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (openRsvpBtn) openRsvpBtn.addEventListener('click', openRsvpModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeRsvpModal);
  if (btnModalDone) btnModalDone.addEventListener('click', closeRsvpModal);

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) closeRsvpModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal && rsvpModal.classList.contains('is-active')) {
      closeRsvpModal();
    }
  });

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
      submittedAt: new Date().toISOString(),
      fullname: nameVal,
      contact: phoneVal || 'Confirmed via Web',
      phone: phoneVal,
      email: '',
      attendance: isAttending ? 'Joyfully Accept (After Party)' : 'Regretfully Decline (After Party)',
      partySize: isAttending ? partyVal : '0',
      guests: isAttending ? partyVal : '0',
      notes: isAttending ? 'AFTER PARTY RSVP' : 'AFTER PARTY RSVP - Cannot attend',
      guestName: nameVal,
      name: nameVal,
      attendance_es: isAttending ? 'Sí, Asistirá (After Party)' : 'No Podrá Asistir (After Party)',
      attending: isAttending ? 'Yes (After Party)' : 'No (After Party)',
      eventType: 'After Party',
      wishes: '',
      song: '',
      message: ''
    };

    const targetBtn = isAttending ? btnAccept : btnDecline;
    const originalText = targetBtn ? targetBtn.innerHTML : '';

    if (btnAccept) btnAccept.disabled = true;
    if (btnDecline) btnDecline.disabled = true;

    if (targetBtn) {
      targetBtn.innerHTML = '<span>Saving...</span>';
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

      if (successAlert) {
        if (successDesc) {
          successDesc.textContent = isAttending
            ? `Thanks ${nameVal}! You're on the list with ${partyVal} guest${partyVal === '1' ? '' : 's'}. See you at the after party!`
            : `Thanks for letting us know, ${nameVal}. You will be missed!`;
        }
        if (rsvpForm) {
          const fieldGroups = rsvpForm.querySelectorAll('.form-group, .rsvp-action-buttons');
          fieldGroups.forEach(g => g.style.display = 'none');
        }
        successAlert.hidden = false;
        if (isAttending) {
          triggerRsvpConfetti();
        }
      }
    } catch (err) {
      console.error('[RSVP Error]:', err);
      if (successAlert) {
        if (rsvpForm) {
          const fieldGroups = rsvpForm.querySelectorAll('.form-group, .rsvp-action-buttons');
          fieldGroups.forEach(g => g.style.display = 'none');
        }
        successAlert.hidden = false;
      }
    } finally {
      if (btnAccept) btnAccept.disabled = false;
      if (btnDecline) btnDecline.disabled = false;
      if (targetBtn) targetBtn.innerHTML = originalText;
    }
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', (e) => {
      e.preventDefault();
      processRsvp(true);
    });
  }

  if (btnDecline) {
    btnDecline.addEventListener('click', (e) => {
      e.preventDefault();
      processRsvp(false);
    });
  }

  function triggerRsvpConfetti() {
    const confettiColors = ['#008eb7', '#00b0d8', '#c99f57', '#ffd700', '#fdf5e2', '#ffffff', '#b8dfea'];
    const count = window.innerWidth < 600 ? 50 : 75;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
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
      conf.style.boxShadow = '0 2px 8px rgba(0, 142, 183, 0.35)';

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
        vy += 0.4;
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

});
