/**
 * ═════════════════════════════════════════════════════════════════════
 * INVITACIÓN DE XV AÑOS — AIDA TAILY GONZALEZ
 * Tema: Navy Blue, Plata & Bajo las Estrellas (Solo Español)
 * Controlador Interactivo, Estrella/Confeti, Audio & RSVP
 * ═════════════════════════════════════════════════════════════════════
 */

const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'aidagonzalez';
const CLIENT_NAME = 'XV Años de Aida Taily Gonzalez';
const CLIENT_EMAIL = 'arandaaida58@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
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

  // Bloquear desplazamiento hasta abrir el sobre
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
     1. DICCIONARIO EN ESPAÑOL (INVITACIÓN SOLO EN ESPAÑOL)
     ───────────────────────────────────────────────────────────── */
  const esMessages = {
    'countdown-today': '🎉 ¡Hoy es el gran día! 🎉',
    'countdown-thankyou': '¡Gracias por celebrar conmigo bajo las estrellas! ✨',
    'btn-accept': '<span class="btn-rsvp-icon">✓</span><span class="btn-rsvp-text">SÍ, ASISTIRÉ</span>',
    'btn-decline': '<span class="btn-rsvp-icon">✕</span><span class="btn-rsvp-text">NO PODRÉ ASISTIR</span>',
    'modal-success-desc': 'Su respuesta ha sido guardada con éxito.',
    'modal-decline-desc': 'Gracias por avisarnos. ¡Te extrañaremos en esta noche especial!'
  };

  document.documentElement.lang = 'es';
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('og_preview')) {
    document.body.classList.add('og-preview-mode');
  }

  // Barra colapsable de música
  let expandAudioBarFn = null;
  function initControlToggles() {
    const audioBar = document.getElementById('audio-control-bar');
    const audioToggle = document.getElementById('audio-collapse-toggle');

    function setCollapsed(bar, btn, collapsed, hiddenLabel, shownLabel) {
      if (!bar || !btn) return;
      bar.classList.toggle('collapsed', collapsed);
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.setAttribute('aria-label', collapsed ? shownLabel : hiddenLabel);
    }

    expandAudioBarFn = () => {
      setCollapsed(audioBar, audioToggle, false, 'Ocultar reproductor de música', 'Mostrar reproductor de música');
      setTimeout(updateSongTickerOffset, 60);
      setTimeout(updateSongTickerOffset, 420);
    };

    if (audioBar && audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        audioBar.dataset.userToggled = 'true';
        setCollapsed(
          audioBar,
          audioToggle,
          !audioBar.classList.contains('collapsed'),
          'Ocultar reproductor de música',
          'Mostrar reproductor de música'
        );
        setTimeout(updateSongTickerOffset, 60);
        setTimeout(updateSongTickerOffset, 420);
      });

      if (audioBar.dataset.userToggled !== 'true') {
        setCollapsed(audioBar, audioToggle, true, 'Ocultar reproductor de música', 'Mostrar reproductor de música');
      }
    }
  }

  initControlToggles();

  /* ─────────────────────────────────────────────────────────────
     2. REPRODUCTOR DE AUDIO (Chayanne, Danna - Veo en ti la luz)
     ───────────────────────────────────────────────────────────── */
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');

  // Start right when Danna begins singing ("Tanto tiempo..." at ~10.0s)
  const AUDIO_START_OFFSET = 9.7;
  let hasSetInitialStartTime = false;
  let lastAudioTime = 0;

  let isAudioPlaying = false;
  let wasAudioPlayingBeforeHide = false;

  function ensureAudioStartTime() {
    if (!bgAudio) return;
    try {
      if (bgAudio.readyState >= 1) {
        if (bgAudio.currentTime < AUDIO_START_OFFSET) {
          bgAudio.currentTime = AUDIO_START_OFFSET;
        }
        hasSetInitialStartTime = true;
      }
    } catch (e) {}
  }

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    if (audioToggleBtn) {
      if (playing) {
        audioToggleBtn.classList.add('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'none';
        if (audioPauseIcon) audioPauseIcon.style.display = 'inline';
        audioToggleBtn.setAttribute('aria-label', 'Pausar música');
      } else {
        audioToggleBtn.classList.remove('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'inline';
        if (audioPauseIcon) audioPauseIcon.style.display = 'none';
        audioToggleBtn.setAttribute('aria-label', 'Reproducir música');
      }
    }
  }

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;
    ensureAudioStartTime();
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          ensureAudioStartTime();
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
    bgAudio.addEventListener('loadedmetadata', ensureAudioStartTime);
    bgAudio.addEventListener('canplay', ensureAudioStartTime);
    bgAudio.addEventListener('play', () => updatePlayState(true));
    bgAudio.addEventListener('playing', () => updatePlayState(true));
    bgAudio.addEventListener('pause', () => updatePlayState(false));
    bgAudio.addEventListener('ended', () => {
      try {
        bgAudio.currentTime = AUDIO_START_OFFSET;
        bgAudio.play().catch(() => {});
      } catch (e) {}
      updatePlayState(false);
    });
    bgAudio.addEventListener('timeupdate', () => {
      if (!hasSetInitialStartTime && bgAudio.currentTime < AUDIO_START_OFFSET) {
        try {
          bgAudio.currentTime = AUDIO_START_OFFSET;
          hasSetInitialStartTime = true;
        } catch (e) {}
      } else if (hasSetInitialStartTime && lastAudioTime > (AUDIO_START_OFFSET + 10) && bgAudio.currentTime < 2) {
        try {
          bgAudio.currentTime = AUDIO_START_OFFSET;
        } catch (e) {}
      }
      lastAudioTime = bgAudio.currentTime;
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
    } else if (wasAudioPlayingBeforeHide) {
      playAudio();
      wasAudioPlayingBeforeHide = false;
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
     3. SOBRE 3D & MOTOR DE ESTRELLAS / CONFETI NAVY & PLATA
     ───────────────────────────────────────────────────────────── */
  class StarlightConfettiEngine {
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
      const shapes = ['star', 'star', 'glitter', 'sequin', 'ribbon'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      const colors = [
        'rgba(255, 255, 255, 0.96)',  // Brillo estelar blanco
        'rgba(226, 232, 240, 0.95)',  // Plata perlada
        'rgba(148, 163, 184, 0.92)',  // Plata metálica
        'rgba(147, 197, 253, 0.90)',  // Destello azul cielo nocturno
        'rgba(30, 58, 138, 0.90)',    // Azul marino real
        'rgba(15, 35, 75, 0.88)',     // Azul noche profundo
      ];

      return {
        x: Math.random() * this.width,
        y: initialY,
        shape,
        size: isMobile ? (Math.random() * 7 + 6) : (Math.random() * 9 + 7),
        aspectRatio: Math.random() * 1.4 + 1.2,
        speedY: Math.random() * 1.45 + 0.85,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.95,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.2,
        swaySpeed: Math.random() * 0.025 + 0.012,
        swayAmplitude: Math.random() * 28 + 14,
        time: Math.random() * 100,
        opacity: Math.random() * 0.35 + 0.62,
        color: colors[Math.floor(Math.random() * colors.length)],
        bend: Math.random() * 0.5 + 0.5
      };
    }

    triggerCelebratoryBurst() {
      if (this.hasTriggeredBurst) return;
      this.hasTriggeredBurst = true;
      const isMobile = this.width < 600;

      const topCount = isMobile ? 52 : 80;
      for (let i = 0; i < topCount; i++) {
        const startY = (Math.random() * -0.65 * this.height) - 10;
        const p = this.createParticle(startY);
        p.speedY = Math.random() * 3.0 + 1.6;
        p.speedX = (Math.random() - 0.5) * 2.8;
        p.rotationSpeed = (Math.random() - 0.5) * 4.2;
        this.particles.push(p);
      }

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

      const ringCount = isMobile ? 32 : 48;
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
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = 'rgba(226, 232, 240, 0.6)';

        if (p.shape === 'ribbon') {
          this.ctx.scale(Math.cos(p.time * 1.5), Math.sin(p.time * 0.8));
          this.ctx.beginPath();
          const w = p.size;
          const h = p.size * p.aspectRatio;
          this.ctx.rect(-w / 2, -h / 2, w, h);
          this.ctx.fill();
        } else if (p.shape === 'star') {
          this.ctx.scale(Math.cos(p.time * 1.2), Math.cos(p.time * 1.2));
          this.ctx.beginPath();
          const s = p.size * 0.85;
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
          this.ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
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

        if (p.y > this.height + 30 || p.x < -40 || p.x > this.width + 40) {
          const targetContinuousCount = isMobile ? 30 : 50;
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

  const confettiPetalEngine = new StarlightConfettiEngine('entry-canvas');

  function triggerSealConfetti() {
    const confettiColors = [
      '#0f172a', '#1e3a8a', '#3b82f6', '#93c5fd',
      '#e2e8f0', '#cbd5e1', '#94a3b8', '#ffffff'
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
      const width = 5 + Math.random() * 8;
      const height = 7 + Math.random() * 12;
      conf.style.width = width + 'px';
      conf.style.height = height + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() > 0.4 ? '2px' : '50%';
      conf.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.35)';
      conf.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 18;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 2.8;
      let rotation = Math.random() * 360;
      const rotSpeed = (Math.random() - 0.5) * 16;

      document.body.appendChild(conf);

      let posX = 0;
      let posY = 0;
      let opacity = 1;

      const startTime = performance.now();
      function stepAnim(now) {
        const elapsed = (now - startTime) / 1000;
        posX += vx * 0.98;
        posY += vy;
        vy += 0.4;
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

    if (overlay) overlay.classList.add('is-opened');
    if (envelope) envelope.classList.add('is-opened');

    try {
      if (confettiPetalEngine && typeof confettiPetalEngine.start === 'function') {
        confettiPetalEngine.start();
      }
      triggerSealConfetti();
    } catch (err) {
      console.warn('[Confetti notice]:', err);
    }

    try {
      playAudio();
      if (expandAudioBarFn) expandAudioBarFn();
    } catch (err) {}

    setTimeout(() => {
      if (overlay) overlay.classList.add('fade-out');
      document.body.classList.add('site-entered');
      const themeMeta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', '#09132c');
      }
      document.documentElement.classList.add('site-entered');
      if (expandAudioBarFn) expandAudioBarFn();
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
      triggerScrollReveals();
    }, 1500);

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
    envelope.addEventListener('touchend', () => {
      if (!envelopeOpened) openEnvelope();
    }, { passive: true });
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (urlParams.has('opened')) {
    if (overlay) overlay.style.display = 'none';
    document.body.classList.add('site-entered');
    document.documentElement.classList.add('site-entered');
    envelopeOpened = true;
    window.removeEventListener('wheel', blockScrollUntilEntered);
    window.removeEventListener('touchmove', blockScrollUntilEntered);
    window.removeEventListener('keydown', blockKeysUntilEntered);
    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => el.classList.add('is-visible'));
    setTimeout(triggerScrollReveals, 100);
  }

  /* ─────────────────────────────────────────────────────────────
     4. CUENTA REGRESIVA (JUEVES, 31 DE DICIEMBRE DE 2026 · 2:00 PM)
     ───────────────────────────────────────────────────────────── */
  const TARGET_DATE = new Date(2026, 11, 31, 14, 0, 0).getTime();
  const AFTER_EVENT_MS = 12 * 60 * 60 * 1000;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  const numbersRow = document.querySelector('.pt-numbers-row');

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
    cdMsgEl.textContent = esMessages[key] || '';
    cdMsgEl.style.display = '';
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = TARGET_DATE - now;
    const days = diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;

    if (diff > 0 && (days > 0 || diff > 0)) {
      showNumbers();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      if (elDays) elDays.textContent = String(days).padStart(2, '0');
      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins) elMins.textContent = String(mins).padStart(2, '0');
      if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
    } else if (-diff < AFTER_EVENT_MS) {
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
    if (scrollObserver) scrollObserver.disconnect();
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
     6. CANVAS AMBIENTAL DE ESTRELLAS PLATEADAS (BAJO LAS ESTRELLAS)
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
    const count = window.innerWidth < 600 ? 32 : 52;

    for (let i = 0; i < count; i++) {
      const isStarSparkle = Math.random() > 0.35;
      const r = Math.random();
      const particleColor = r > 0.55
        ? '255, 255, 255'
        : (r > 0.25 ? '226, 232, 240' : '147, 197, 253');

      bokehs.push({
        x: Math.random() * ambWidth,
        y: Math.random() * ambHeight,
        radius: isStarSparkle ? (Math.random() * 6 + 3.5) : (Math.random() * 14 + 4),
        speedY: Math.random() * 0.16 + 0.04,
        speedX: (Math.random() - 0.5) * 0.06,
        baseAlpha: isStarSparkle ? (Math.random() * 0.45 + 0.30) : (Math.random() * 0.18 + 0.06),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.028 + 0.01,
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

        const dynamicAlpha = Math.max(0.08, Math.min(0.85, b.baseAlpha + Math.sin(b.twinklePhase) * 0.22));

        ambCtx.save();
        ambCtx.fillStyle = `rgba(${b.color}, ${dynamicAlpha})`;
        ambCtx.shadowBlur = b.isStar ? 14 : 10;
        ambCtx.shadowColor = `rgba(${b.color}, 0.85)`;

        if (b.isStar) {
          const size = Math.max(4.5, b.radius * 1.2);
          ambCtx.translate(b.x, b.y);
          ambCtx.beginPath();
          ambCtx.moveTo(0, -size);
          ambCtx.quadraticCurveTo(0, 0, size, 0);
          ambCtx.quadraticCurveTo(0, 0, 0, size);
          ambCtx.quadraticCurveTo(0, 0, -size, 0);
          ambCtx.quadraticCurveTo(0, 0, 0, -size);
          ambCtx.fill();
        } else {
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
     7. MODAL Y ENVÍO DE CONFIRMACIÓN (RSVP)
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
    if (btnAccept) {
      btnAccept.disabled = false;
      btnAccept.innerHTML = esMessages['btn-accept'];
    }
    if (btnDecline) {
      btnDecline.disabled = false;
      btnDecline.innerHTML = esMessages['btn-decline'];
    }
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
      contact: phoneVal || 'Confirmado vía Web',
      phone: phoneVal,
      email: '',
      attendance: isAttending ? 'Joyfully Accept' : 'Regretfully Decline',
      partySize: isAttending ? partyVal : '0',
      guests: isAttending ? partyVal : '0',
      notes: isAttending ? '' : 'No podrá asistir',
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
      targetBtn.innerHTML = '<span>Guardando...</span>';
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

      if (isAttending) {
        triggerRsvpConfetti();
      }

      if (successAlert) {
        const descP = successAlert.querySelector('p');
        if (descP) {
          descP.textContent = isAttending ? esMessages['modal-success-desc'] : esMessages['modal-decline-desc'];
        }
        successAlert.classList.toggle('is-decline', !isAttending);
        successAlert.hidden = false;
        if (rsvpForm) rsvpForm.reset();
      }

      if (targetBtn) {
        targetBtn.innerHTML = '<span>✓ ¡Guardado!</span>';
      }
    } catch (err) {
      console.error('[RSVP Error]:', err);
      alert('Hubo un problema al guardar su respuesta. Por favor verifique su conexión e intente nuevamente.');
      if (btnAccept) {
        btnAccept.disabled = false;
        if (!isAttending && originalText) btnAccept.innerHTML = esMessages['btn-accept'];
      }
      if (btnDecline) {
        btnDecline.disabled = false;
        if (isAttending && originalText) btnDecline.innerHTML = esMessages['btn-decline'];
      }
      if (targetBtn && originalText) {
        targetBtn.innerHTML = originalText;
      }
    }
  }

  if (btnAccept) btnAccept.addEventListener('click', () => processRsvp(true));
  if (btnDecline) btnDecline.addEventListener('click', () => processRsvp(false));

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processRsvp(true);
    });
  }

  function triggerRsvpConfetti() {
    const confettiColors = [
      '#0f172a', '#1e3a8a', '#3b82f6', '#93c5fd',
      '#e2e8f0', '#cbd5e1', '#94a3b8', '#ffffff'
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
      conf.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.35)';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 16;
      const vx = Math.cos(angle) * velocity;
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
