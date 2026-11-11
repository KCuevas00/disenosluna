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

  const SONG_TITLE = 'Siesta Freestyle \u2014 Lewis OfMan';
  const PROMPT_TITLE = '\u25B6 Tap to Play Music \u266A';

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    if (playing) {
      hasEverPlayed = true;
      if (audioBar) audioBar.classList.add('is-playing');
      if (audioToggleBtn) {
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.setAttribute('aria-label', 'Pause music');
      }
      if (audioPlayIcon) audioPlayIcon.style.display = 'none';
      if (audioPauseIcon) audioPauseIcon.style.display = 'inline';
      if (songTicker) {
        songTicker.textContent = SONG_TITLE;
      }
    } else {
      if (audioBar) audioBar.classList.remove('is-playing');
      if (audioToggleBtn) {
        audioToggleBtn.classList.remove('playing');
        audioToggleBtn.setAttribute('aria-label', 'Play music');
      }
      if (audioPlayIcon) audioPlayIcon.style.display = 'inline';
      if (audioPauseIcon) audioPauseIcon.style.display = 'none';
      if (songTicker) {
        songTicker.textContent = hasEverPlayed ? SONG_TITLE : PROMPT_TITLE;
      }
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
    if (isAudioPlaying) {
      userManuallyPaused = true;
      wasAudioPlayingBeforeHide = false;
      pauseAudio();
    } else {
      userManuallyPaused = false;
      playAudio();
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
        bgAudio.src = 'music/song.mp3?v=3';
        bgAudio.load();
        if (!userManuallyPaused) {
          bgAudio.play().then(() => updatePlayState(true)).catch(() => {});
        }
      } else {
        updatePlayState(false);
      }
    });
  }

  // Clicking anywhere on the pill content toggles play/pause
  if (audioContent) {
    audioContent.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
    audioContent.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAudio();
      }
    });
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
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

  // 1. Attempt initial autoplay immediately
  playAudio();

  // 2. Gesture unlock listener: iOS Safari requires touchstart / touchend / click
  const blessedEvents = ['touchstart', 'touchend', 'click'];
  function unlockOnUserGesture(e) {
    if (!bgAudio || userManuallyPaused) return;

    // If user clicked the collapse toggle, let that handle collapse
    if (e.target && audioCollapseToggle && audioCollapseToggle.contains(e.target)) {
      return;
    }

    if (bgAudio.paused) {
      const p = bgAudio.play();
      if (p !== undefined) {
        p.then(() => {
          updatePlayState(true);
          // Remove listener once successfully playing
          blessedEvents.forEach((evt) => {
            document.removeEventListener(evt, unlockOnUserGesture, true);
          });
        }).catch(() => {
          // Keep listening on subsequent gestures
        });
      }
    } else {
      blessedEvents.forEach((evt) => {
        document.removeEventListener(evt, unlockOnUserGesture, true);
      });
    }
  }

  blessedEvents.forEach((evt) => {
    document.addEventListener(evt, unlockOnUserGesture, { capture: true, passive: true });
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
    songTicker.textContent = PROMPT_TITLE;
  }
  updateSongTickerOffset();
  window.addEventListener('resize', updateSongTickerOffset);

});
