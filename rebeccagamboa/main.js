/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCEAÑERA INVITATION — REBECCA GAMBOA CANTÚ
 * Interactive Controller & RSVP (English Only Edition, Basic Package)
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'rebeccagamboa';
const CLIENT_NAME = "Rebecca Gamboa Cantú's Quinceañera (Alexandra A Gamboa)";
const CLIENT_EMAIL = 'aleky1982@gmail.com';

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

  // Strictly block any scrolling or wheeling while envelope is unopened
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
     2. AMBIENT BACKGROUND CANVAS (SUBTLE TWILIGHT GLIMMER)
     ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const count = Math.min(30, Math.floor(width / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.35 + 0.15,
        dx: (Math.random() - 0.5) * 0.25
      });
    }

    let animFrame = null;
    function renderAmbient() {
      if (document.body.classList.contains('site-entered')) {
        if (animFrame) cancelAnimationFrame(animFrame);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();

        p.y -= p.speed;
        p.x += p.dx;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
      }
      animFrame = requestAnimationFrame(renderAmbient);
    }
    renderAmbient();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const innerSealBtn = document.querySelector('.wax-seal-btn');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // 1. Open envelope flap and glide up invitation card
    if (overlay) {
      overlay.classList.add('is-opened');
    }
    if (envelope) {
      envelope.classList.add('is-opened');
    }

    // 2. Smoothly fade out envelope overlay and unveil main site
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#fcfdfc');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);

      window.dispatchEvent(new Event('resize'));
    }, 1100);

    // 3. Final cleanup of overlay
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 50);
    }, 1500);

    triggerScrollReveals();
  }

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
     4. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    const revealElements = document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }

  triggerScrollReveals();

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
      attending: isAttending ? 'Yes' : 'No'
    };

    const actionBtn = isAttending ? btnAccept : btnDecline;
    const originalText = actionBtn ? actionBtn.innerHTML : '';
    if (actionBtn) {
      actionBtn.disabled = true;
      actionBtn.innerHTML = '<span>Saving...</span>';
    }

    try {
      await fetch(GOOGLE_SHEETS_RSVP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Network notice during RSVP submission:', err);
    }

    if (actionBtn) {
      actionBtn.disabled = false;
      actionBtn.innerHTML = originalText;
    }

    if (successAlert) {
      successAlert.hidden = false;
      successAlert.classList.add('show-alert');
    }

    setTimeout(() => {
      closeRsvpModal();
      if (rsvpForm) rsvpForm.reset();
      if (successAlert) {
        successAlert.hidden = true;
        successAlert.classList.remove('show-alert');
      }
    }, 2800);
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', () => processRsvp(true));
  }
  if (btnDecline) {
    btnDecline.addEventListener('click', () => processRsvp(false));
  }
});
