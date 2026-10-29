/**
 * ═════════════════════════════════════════════════════════════════════
 * 18TH BIRTHDAY INVITATION — VIANNEY TOSTADO
 * Interactive Controller & RSVP (English Only, Basic Package)
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'vianneytostado';
const CLIENT_NAME = "Vianney Tostado's 18th Birthday (Diana Macias)";
const CLIENT_EMAIL = 'dmacias845@gmail.com';
const TARGET_DATE = new Date(2026, 11, 5, 17, 0, 0).getTime();

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
     2. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & CONFETTI CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const innerSealBtn = document.querySelector('.wax-seal-btn');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Trigger celebratory confetti burst radiating from wax seal AND top shower
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

    // 2. Smoothly fade out envelope overlay and unveil main site (1100ms)
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#1e45aa');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);

      // Instantly trigger viewport recalculation so Safari undocks bottom address bar without delay
      void document.body.offsetHeight;
      window.dispatchEvent(new Event('resize'));
    }, 1100);

    // 3. Final cleanup of overlay (1500ms)
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
    }, 1500);

    triggerScrollReveals();
  }

  // Expose on window for inline HTML onclick handlers & console accessibility
  window.openEnvelope = openEnvelope;

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
     3. SCROLL REVEAL (ALL ELEMENTS VISIBLE IMMEDIATELY)
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  triggerScrollReveals();

  /* ─────────────────────────────────────────────────────────────
     4. COPY ADDRESS TO CLIPBOARD
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    let copyTimeout = null;
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address') || 'Ruby Event Center, 3142 S Mingo Rd, Tulsa, OK 74146';
      const tooltip = copyBtn.querySelector('.copy-tooltip');
      const textSpan = copyBtn.querySelector('.copy-btn-text');

      const showSuccess = () => {
        copyBtn.classList.add('copied');
        if (tooltip) tooltip.textContent = 'Copied! ✓';
        if (textSpan) textSpan.textContent = 'COPIED! ✓';
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (tooltip) tooltip.textContent = 'Copied!';
          if (textSpan) textSpan.textContent = 'COPY ADDRESS';
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(showSuccess).catch(() => {
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

  /* ─────────────────────────────────────────────────────────────
     5. RSVP MODAL & SUBMISSION SYSTEM
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

      // Confetti celebration if attending
      if (isAttending) {
        triggerConfetti();
      }

      // Tailored feedback display
      if (successAlert) {
        const descP = successAlert.querySelector('p');
        if (descP) {
          descP.textContent = isAttending
            ? 'Your response has been saved successfully. We look forward to celebrating together!'
            : 'Thank you for letting us know. Your response has been saved.';
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
        targetBtn.innerHTML = '<span>✓ Saved!</span>';
      }
    } catch (err) {
      console.error('[RSVP Error]:', err);
      alert('There was an issue saving your response. Please check your connection and try again.');
      if (btnAccept) {
        btnAccept.disabled = false;
        if (!isAttending && originalText) btnAccept.innerHTML = '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">YES, ATTENDING</span>';
      }
      if (btnDecline) {
        btnDecline.disabled = false;
        if (isAttending && originalText) btnDecline.innerHTML = '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">CANNOT ATTEND</span>';
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
     5. CELEBRATORY OPENING CONFETTI (WAX SEAL BURST & TOP RAIN)
     ───────────────────────────────────────────────────────────── */
  const confettiColors = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#d4af37', '#e5c378', '#fff8ea', '#ffffff', '#cbd5e1'];

  function triggerConfetti(originEl) {
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) {
      const rect = originEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }
    const count = 48;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.left = originX + 'px';
      conf.style.top = originY + 'px';
      conf.style.width = (6 + Math.random() * 8) + 'px';
      conf.style.height = (8 + Math.random() * 11) + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.borderRadius = Math.random() < 0.3 ? '50%' : '2px';
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
        vy += 0.38;
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

  window.triggerConfetti = triggerConfetti;
  window.triggerTopConfettiRain = triggerTopConfettiRain;
}

// Execute immediately if DOM is already ready, otherwise on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
