/**
 * ═════════════════════════════════════════════════════════════════════
 * SWEET 16 INVITATION — DENISE TORRES RIVERA
 * Interactive Controller, Falling Petals Engine, Audio & RSVP
 * ═════════════════════════════════════════════════════════════════════
 */

/* ═════════════════════════════════════════════════════════════════════
 * 1. GOOGLE SHEETS RSVP ENDPOINT CONFIGURATION
 * ═════════════════════════════════════════════════════════════════════
 */
const GOOGLE_SHEETS_RSVP_URL = 'https://script.google.com/macros/s/AKfycbw-sijLfCAhh7jIMivx0ru1eMGB5on5PS6N1NCoOfSbM4tnGo-ESCpsQJ4uaK8pNIPL/exec';
const EVENT_SLUG = 'denisetorresrivera';
const CLIENT_NAME = "Denise Torres Rivera's Sweet 16 (Whitney Jackson)";
const CLIENT_EMAIL = 'marcsmom09@gmail.com';

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


  /* ══════════════════════════════════════════════════════════════
     INTERACTIVE BUTTERFLY STUDIO ENGINE
     Allows dragging, scaling, rotating, adding, deleting, and
     copying coordinate data to clipboard.
     ══════════════════════════════════════════════════════════════ */
  (function initButterflyStudio() {
    const container = document.getElementById('butterflies-interactive-layer');
    const wrapper = document.querySelector('.invitation-wrapper');
    const srcButterfly = document.getElementById('env-rustic-butterfly');
    const dock = document.getElementById('butterfly-studio-dock');

    if (!container || !wrapper || !srcButterfly) return;

    const STORAGE_KEY = 'denise_butterfly_positions_v2';
    const DEFAULT_BUTTERFLIES = [
      {
        id: 1,
        top: 133,
        left: 84.5,
        scale: 0.52,
        rotate: 40,
        flip: false,
        note: "Hero Portrait Top-Right"
      },
      {
        id: 2,
        top: 590,
        left: 15,
        scale: 0.49,
        rotate: -12,
        flip: false,
        note: "Countdown Left"
      },
      {
        id: 3,
        top: 4292,
        left: 80.5,
        scale: 0.44,
        rotate: 14,
        flip: true,
        note: "Program Header Right"
      },
      {
        id: 4,
        top: 2165,
        left: 77.7,
        scale: 0.44,
        rotate: 38,
        flip: false,
        note: "Court of Honor Left"
      },
      {
        id: 5,
        top: 4969,
        left: 63.4,
        scale: 0.45,
        rotate: 2,
        flip: false,
        note: "Wishing Well Right"
      },
      {
        id: 6,
        top: 2942,
        left: 74.2,
        scale: 0.46,
        rotate: 0,
        flip: true,
        note: "Dedication Quote Right"
      },
      {
        id: 7,
        top: 3668,
        left: 16.3,
        scale: 0.45,
        rotate: -15,
        flip: false,
        note: "RSVP Stage Left"
      }
    ];

    let butterflies = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          butterflies = parsed;
        }
      }
    } catch (e) {}

    if (butterflies.length === 0) {
      butterflies = JSON.parse(JSON.stringify(DEFAULT_BUTTERFLIES));
    }

    let selectedId = butterflies[0] ? butterflies[0].id : null;

    // Controls DOM elements
    const toggleBtn = document.getElementById('studio-toggle-btn');
    const closeBtn = document.getElementById('studio-close-btn');
    const scaleSlider = document.getElementById('bf-scale-slider');
    const scaleVal = document.getElementById('bf-scale-val');
    const rotateSlider = document.getElementById('bf-rotate-slider');
    const rotateVal = document.getElementById('bf-rotate-val');
    const flipBtn = document.getElementById('bf-flip-btn');
    const deleteBtn = document.getElementById('bf-delete-btn');
    const addBtn = document.getElementById('bf-add-btn');
    const copyBtn = document.getElementById('bf-copy-btn');
    const outputBox = document.getElementById('bf-output-box');

    function getTransform(b) {
      return `translate(-50%, -50%) scale(${b.scale}) rotate(${b.rotate}deg) scaleX(${b.flip ? -1 : 1})`;
    }

    function saveButterflies() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(butterflies));
      } catch (e) {}
    }

    function showToast(msg) {
      const existing = document.querySelector('.studio-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'studio-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 2600);
    }

    function getSelectedButterfly() {
      return butterflies.find(b => b.id === selectedId) || null;
    }

    function updateItemVisual(b) {
      const el = container.querySelector(`[data-id="${b.id}"]`);
      if (el) {
        el.style.transform = getTransform(b);
      }
    }

    function selectButterfly(id) {
      selectedId = id;
      container.querySelectorAll('.draggable-butterfly-item').forEach((item) => {
        if (item.dataset.id === String(id)) {
          item.classList.add('is-selected');
        } else {
          item.classList.remove('is-selected');
        }
      });
      syncDockControls();
    }

    function syncDockControls() {
      const b = getSelectedButterfly();
      if (!b) {
        if (scaleSlider) scaleSlider.disabled = true;
        if (rotateSlider) rotateSlider.disabled = true;
        if (flipBtn) flipBtn.disabled = true;
        if (deleteBtn) deleteBtn.disabled = true;
        return;
      }
      if (scaleSlider) {
        scaleSlider.disabled = false;
        scaleSlider.value = b.scale;
        if (scaleVal) scaleVal.textContent = b.scale.toFixed(2) + 'x';
      }
      if (rotateSlider) {
        rotateSlider.disabled = false;
        rotateSlider.value = b.rotate;
        if (rotateVal) rotateVal.textContent = b.rotate + '°';
      }
      if (flipBtn) {
        flipBtn.disabled = false;
        flipBtn.style.background = b.flip ? '#d8ecfb' : '#ffffff';
        flipBtn.style.borderColor = b.flip ? '#5593c9' : '#9ec5e8';
      }
      if (deleteBtn) {
        deleteBtn.disabled = false;
      }
    }

    function attachDragEvents(el, b) {
      let isPointerDown = false;
      let hasMoved = false;
      let startX = 0;
      let startY = 0;
      let startTop = 0;
      let startLeftPct = 0;

      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.stopPropagation();

        isPointerDown = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        startTop = b.top;
        startLeftPct = b.left;

        try {
          el.setPointerCapture(e.pointerId);
        } catch (err) {}

        selectButterfly(b.id);
      });

      el.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!hasMoved && Math.hypot(dx, dy) > 3) {
          hasMoved = true;
          el.classList.add('is-dragging');
        }

        if (hasMoved) {
          const wrapperWidth = wrapper.offsetWidth || 400;
          const wrapperHeight = wrapper.offsetHeight || 3800;

          let newTop = startTop + dy;
          let newLeft = startLeftPct + (dx / wrapperWidth) * 100;

          newTop = Math.max(10, Math.min(wrapperHeight - 20, newTop));
          newLeft = Math.max(2, Math.min(98, newLeft));

          b.top = Math.round(newTop);
          b.left = parseFloat(newLeft.toFixed(1));

          el.style.top = b.top + 'px';
          el.style.left = b.left + '%';
        }
      });

      const onPointerUp = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        try {
          el.releasePointerCapture(e.pointerId);
        } catch (err) {}
        el.classList.remove('is-dragging');
        if (hasMoved) {
          saveButterflies();
          if (outputBox && outputBox.value) {
            outputBox.value = JSON.stringify(butterflies, null, 2);
          }
        }
      };

      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectButterfly(b.id);
      });
    }

    function renderButterfly(b) {
      const itemEl = document.createElement('div');
      itemEl.className = 'draggable-butterfly-item' + (b.id === selectedId ? ' is-selected' : '');
      itemEl.dataset.id = String(b.id);
      itemEl.style.top = b.top + 'px';
      itemEl.style.left = b.left + '%';
      itemEl.style.transform = getTransform(b);
      itemEl.setAttribute('role', 'button');
      itemEl.setAttribute('tabindex', '0');
      itemEl.setAttribute('aria-label', `Butterfly ${b.id}`);

      const badge = document.createElement('span');
      badge.className = 'butterfly-badge';
      badge.textContent = `🦋 #${b.id}`;

      const holder = document.createElement('div');
      holder.className = 'inv-butterfly';
      holder.innerHTML = srcButterfly.innerHTML
        .replace(/(rusticWingGrad|goldVeinGrad)(Left|Right)/g, '$1$2_studio_' + b.id)
        .replace(/<div class="butterfly-ground-shadow"><\/div>/, '');

      itemEl.appendChild(badge);
      itemEl.appendChild(holder);
      container.appendChild(itemEl);

      attachDragEvents(itemEl, b);
    }

    function renderAll() {
      container.innerHTML = '';
      butterflies.forEach(renderButterfly);
      syncDockControls();
    }

    // Slider Listeners
    if (scaleSlider) {
      scaleSlider.addEventListener('input', (e) => {
        const b = getSelectedButterfly();
        if (!b) return;
        b.scale = parseFloat(e.target.value);
        if (scaleVal) scaleVal.textContent = b.scale.toFixed(2) + 'x';
        updateItemVisual(b);
        saveButterflies();
      });
    }

    if (rotateSlider) {
      rotateSlider.addEventListener('input', (e) => {
        const b = getSelectedButterfly();
        if (!b) return;
        b.rotate = parseInt(e.target.value, 10);
        if (rotateVal) rotateVal.textContent = b.rotate + '°';
        updateItemVisual(b);
        saveButterflies();
      });
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', () => {
        const b = getSelectedButterfly();
        if (!b) return;
        b.flip = !b.flip;
        syncDockControls();
        updateItemVisual(b);
        saveButterflies();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const b = getSelectedButterfly();
        if (!b) return;
        const idx = butterflies.findIndex(item => item.id === b.id);
        if (idx !== -1) {
          const removedId = b.id;
          butterflies.splice(idx, 1);
          const el = container.querySelector(`[data-id="${removedId}"]`);
          if (el) el.remove();
          selectedId = butterflies[0] ? butterflies[0].id : null;
          selectButterfly(selectedId);
          saveButterflies();
          showToast(`Butterfly #${removedId} removed`);
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const maxId = butterflies.reduce((max, item) => Math.max(max, item.id), 0);
        const nextId = maxId + 1;

        // Add near middle of current viewport scroll
        const wrapperRect = wrapper.getBoundingClientRect();
        const viewportCenterY = window.innerHeight / 2;
        const rawTop = viewportCenterY - wrapperRect.top;
        const wrapperHeight = wrapper.offsetHeight || 3800;
        const topPx = Math.round(Math.max(60, Math.min(wrapperHeight - 60, rawTop)));

        const newBf = {
          id: nextId,
          top: topPx,
          left: 50,
          scale: 0.48,
          rotate: 0,
          flip: false
        };

        butterflies.push(newBf);
        renderButterfly(newBf);
        selectButterfly(nextId);
        saveButterflies();
        showToast(`Added Butterfly #${nextId}!`);
      });
    }

    function fallbackCopyText(text, cb) {
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

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const jsonStr = JSON.stringify(butterflies, null, 2);
        const copyPayload = 
`Denise Torres Rivera - Saved Butterfly Locations (${butterflies.length} total):
${jsonStr}`;

        if (outputBox) {
          outputBox.value = jsonStr;
          outputBox.focus();
          outputBox.select();
        }

        const onCopied = () => {
          showToast(`✓ ${butterflies.length} Butterfly Positions Copied to Clipboard!`);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyPayload).then(onCopied).catch(() => {
            fallbackCopyText(copyPayload, onCopied);
          });
        } else {
          fallbackCopyText(copyPayload, onCopied);
        }
      });
    }

    if (toggleBtn && dock) {
      toggleBtn.addEventListener('click', () => {
        dock.classList.remove('collapsed');
      });
    }

    if (closeBtn && dock) {
      closeBtn.addEventListener('click', () => {
        dock.classList.add('collapsed');
      });
    }

    // Initial render
    renderAll();
  })();

  /* ─────────────────────────────────────────────────────────────
     1. BILINGUAL TRANSLATION DICTIONARY (EN / ES)
     ───────────────────────────────────────────────────────────── */
  const translations = {
    en: {
      'entry-invited': "You've Been Invited!",
      'entry-subtitle': 'DENISE TORRES RIVERA • SWEET 16',
      'seal-hint-desktop': '✦ CLICK TO OPEN ✦',
      'seal-hint-mobile': '✦ TAP TO OPEN ✦',
      'invite-quince': 'Sweet 16',
      'invite-parents': 'WHITNEY JACKSON',
      'invite-preamble': 'WARMLY INVITES YOU TO CELEBRATE THE',
      'invite-daughter': 'OF HER DAUGHTER',
      'invite-date-month': 'SEP',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 5:00 PM',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'countdown-today': '🎉 Today Is the Day! 🎉',
      'countdown-thankyou': 'Thank you for celebrating with us! 🎊',
      'cd-days': 'Days',
      'cd-hours': 'Hours',
      'cd-mins': 'Minutes',
      'cd-secs': 'Seconds',
      'invite-venue': 'OKLAHOMA CITY • OKLAHOMA',
      'program-title': 'PROGRAM',
      'program-arrival-title': 'GUEST ARRIVAL &amp; CHECK-IN',
      'program-arrival-desc': 'LA BELLA EVENT CENTER<br />6701 W WILSHIRE BLVD, OKLAHOMA CITY, OK 73132',
      'program-photos-title': 'PHOTOS &amp; GUEST MINGLING',
      'program-photos-desc': 'WELCOME RECEPTION &amp; KEEPSAKE PHOTOS',
      'program-entrance-title': 'GRAND ENTRANCE',
      'program-entrance-desc': 'GRAND ENTRANCE OF DENISE TORRES RIVERA',
      'program-court-intro-title': 'SWEET 16 COURT INTRODUCTION',
      'program-court-intro-desc': 'PRESENTATION OF THE COURT OF HONOR:<br />SASHA, CHLOE, NATALIE &amp; AVERY',
      'program-parent-dance-title': 'BIRTHDAY GIRL &amp; PARENT DANCE',
      'program-parent-dance-desc': 'SPECIAL DANCE WITH WHITNEY JACKSON &amp; FAMILY',
      'program-court-dance-title': 'COURT DANCE',
      'program-court-dance-desc': 'SPECIAL PERFORMANCE WITH THE COURT OF HONOR',
      'program-dinner-title': 'DINNER / BUFFET OPENS',
      'program-dinner-desc': 'DELICIOUS BANQUET IN HONOR OF DENISE',
      'program-cake-title': 'CAKE CUTTING &amp; BIRTHDAY SONG',
      'program-cake-desc': 'CELEBRATION, TOAST &amp; BIRTHDAY WISHES',
      'program-speeches-title': 'SPEECHES &amp; SPECIAL MESSAGES',
      'program-speeches-desc': 'WORDS OF LOVE &amp; BLESSINGS FROM FAMILY &amp; FRIENDS',
      'program-dance-floor-title': 'OPEN DANCE FLOOR',
      'program-dance-floor-desc': 'MUSIC, DANCING &amp; CELEBRATION',
      'program-games-title': 'PARTY GAMES &amp; SPECIAL ACTIVITY',
      'program-games-desc': 'FUN CELEBRATION GAMES WITH GUESTS',
      'program-final-dance-title': 'FINAL DANCE SET',
      'program-final-dance-desc': 'HIGH ENERGY CELEBRATION &amp; MUSIC',
      'program-final-photos-title': 'FINAL PHOTOS',
      'program-final-photos-desc': 'LAST CHANCE FOR COMMEMORATIVE PHOTOS',
      'program-cinderella-title': 'LAST DANCE / CINDERELLA MOMENT',
      'program-cinderella-desc': 'THE ENCHANTED CINDERELLA MOMENT',
      'program-departure-title': 'GUEST DEPARTURE',
      'program-departure-desc': 'FAREWELL &amp; THANK YOU FOR JOINING US!',
      'tl-btn-location': 'DIRECTIONS',
      'tl-btn-directions': 'DIRECTIONS',
      'tl-btn-copy': 'COPY ADDRESS',
      'dresscode-title': 'DRESS CODE &amp; THEME',
      'dresscode-subtitle': 'POWDER BLUE, WHITE &amp; GOLD ACCENTS',
      'dresscode-desc': 'We kindly request our guests wear formal or cocktail attire complementing our celebration palette of powder blue, white, and gold accents.',
      'court-title': 'COURT OF HONOR',
      'court-damas-title': 'DAMAS',
      'court-subtitle': 'HONORING OUR SPECIAL DAMAS',
      'court-desc': 'Sasha • Chloe • Natalie • Avery',
      'registry-title': 'WISHING WELL',
      'registry-subtitle': 'CASH / LLUVIA DE SOBRES',
      'registry-desc': 'Your love and presence on our special day is the greatest gift of all. If you wish to honor Denise with a gift, a cash wishing well box will be warmly provided.',
      'message-quote': 'Like the stars that illuminate the night sky, every moment leading to this day has filled my heart with wonder. As I celebrate my Sweet 16, I begin a beautiful new chapter surrounded by the people I love most. Having you celebrate with me will make this night truly unforgettable.',
      'rsvp-deadline': 'PLEASE CONFIRM YOUR ATTENDANCE BY AUGUST 15, 2027',
      'rsvp-btn': 'CONFIRM RSVP',
      'rsvp-instruction': 'CLICK THE BUTTON ABOVE TO<br />CONFIRM YOUR ATTENDANCE',
      'rsvp-thankyou': 'Thank You So Much!',
      'modal-title': 'RSVP for Denise Torres Rivera',
      'modal-subtitle': 'Saturday, September 4, 2027 • Oklahoma City, OK',
      'label-fullname': 'Full Name or Family Name *',
      'label-phone': 'Phone Number (Optional)',
      'label-party': 'Number of Attendees (Optional)',
      'opt-party-1': '1 Person',
      'opt-party-2': '2 People',
      'opt-party-3': '3 People',
      'opt-party-4': '4 People',
      'opt-party-5': '5+ People (Family)',
      'btn-accept': '<span class="btn-rsvp-icon">✓</span> <span class="btn-rsvp-text">YES, ATTENDING</span>',
      'btn-decline': '<span class="btn-rsvp-icon">✕</span> <span class="btn-rsvp-text">CANNOT ATTEND</span>',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate together!',
      'modal-decline-desc': 'Thank you for letting us know! Your response has been saved.'
    },
    es: {
      'entry-invited': '¡Estás Invitado!',
      'entry-subtitle': 'DENISE TORRES RIVERA • DULCES 16',
      'seal-hint-desktop': '✦ CLIC PARA ABRIR ✦',
      'seal-hint-mobile': '✦ TOCA PARA ABRIR ✦',
      'invite-quince': 'Dulces 16',
      'invite-parents': 'WHITNEY JACKSON',
      'invite-preamble': 'TIENE EL HONOR DE INVITARLE A CELEBRAR LOS',
      'invite-daughter': 'DE SU HIJA',
      'invite-date-month': 'SEP',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 5:00 PM',
      'countdown-title': 'CONTANDO LOS DÍAS PARA EL GRAN DÍA',
      'countdown-today': '🎉 ¡Hoy Es el Gran Día! 🎉',
      'countdown-thankyou': '¡Gracias por celebrar con nosotros! 🎊',
      'cd-days': 'Días',
      'cd-hours': 'Horas',
      'cd-mins': 'Minutos',
      'cd-secs': 'Segundos',
      'invite-venue': 'OKLAHOMA CITY • OKLAHOMA',
      'program-title': 'PROGRAMA',
      'program-arrival-title': 'LLEGADA DE INVITADOS Y REGISTRO',
      'program-arrival-desc': 'LA BELLA EVENT CENTER<br />6701 W WILSHIRE BLVD, OKLAHOMA CITY, OK 73132',
      'program-photos-title': 'FOTOGRAFÍAS Y CONVIVENCIA',
      'program-photos-desc': 'RECEPCIÓN DE BIENVENIDA Y FOTOS DE RECUERDO',
      'program-entrance-title': 'ENTRADA TRIUNFAL',
      'program-entrance-desc': 'ENTRADA TRIUNFAL DE DENISE TORRES RIVERA',
      'program-court-intro-title': 'PRESENTACIÓN DE LA CORTE DE HONOR',
      'program-court-intro-desc': 'PRESENTACIÓN DE LA CORTE DE HONOR:<br />SASHA, CHLOE, NATALIE Y AVERY',
      'program-parent-dance-title': 'BAILE CON LOS PADRES',
      'program-parent-dance-desc': 'BAILE ESPECIAL CON WHITNEY JACKSON Y FAMILIA',
      'program-court-dance-title': 'BAILE DE LA CORTE',
      'program-court-dance-desc': 'PRESENTACIÓN COREOGRÁFICA DE LA CORTE DE HONOR',
      'program-dinner-title': 'CENA / APERTURA DE BUFFET',
      'program-dinner-desc': 'DELICIOSO BANQUETE EN HONOR A DENISE',
      'program-cake-title': 'CORTE DE PASTEL Y MAÑANITAS',
      'program-cake-desc': 'CELEBRACIÓN, BRINDIS Y CANTO DE CUMPLEAÑOS',
      'program-speeches-title': 'BRINDIS Y PALABRAS DE DEDICATORIA',
      'program-speeches-desc': 'PALABRAS DE AMOR Y BENDICIONES DE FAMILIARES Y AMIGOS',
      'program-dance-floor-title': 'PISTA DE BAILE ABIERTA',
      'program-dance-floor-desc': 'MÚSICA, BAILE Y FIESTA',
      'program-games-title': 'JUEGOS Y ACTIVIDAD ESPECIAL',
      'program-games-desc': 'DINÁMICAS DIVERTIDAS CON LOS INVITADOS',
      'program-final-dance-title': 'ÚLTIMA TANDA DE BAILE',
      'program-final-dance-desc': 'MÚSICA Y DIVERSIÓN EN SU MÁXIMO ESPLENDOR',
      'program-final-photos-title': 'FOTOGRAFÍAS FINALES',
      'program-final-photos-desc': 'ÚLTIMA OPORTUNIDAD PARA FOTOS DE RECUERDO',
      'program-cinderella-title': 'ÚLTIMO BAILE / MOMENTO CENICIENTA',
      'program-cinderella-desc': 'EL MÁGICO MOMENTO CENICIENTA',
      'program-departure-title': 'DESPEDIDA DE INVITADOS',
      'program-departure-desc': '¡AGRADECIMIENTO Y DESPEDIDA A NUESTROS INVITADOS!',
      'tl-btn-location': 'CÓMO LLEGAR',
      'tl-btn-directions': 'CÓMO LLEGAR',
      'tl-btn-copy': 'COPIAR DIRECCIÓN',
      'dresscode-title': 'CÓDIGO DE VESTIR Y COLORES',
      'dresscode-subtitle': 'AZUL PASTEL, BLANCO Y DETALLES EN ORO',
      'dresscode-desc': 'Agradecemos a nuestros invitados vestir atuendo formal o de cóctel en tonos que complementen nuestra paleta de azul pastel, blanco y detalles dorados.',
      'court-title': 'CORTE DE HONOR',
      'court-damas-title': 'DAMAS',
      'court-subtitle': 'NUESTRAS DAMAS DE HONOR',
      'court-desc': 'Sasha • Chloe • Natalie • Avery',
      'registry-title': 'LLUVIA DE SOBRES',
      'registry-subtitle': 'LLUVIA DE SOBRES',
      'registry-desc': 'El mejor regalo es contar con su valiosa presencia. Si desea tener un detalle con Denise, nuestra lluvia de sobres estará disponible con mucho cariño.',
      'message-quote': 'Como las estrellas que iluminan el cielo nocturno, cada momento que me ha traído hasta aquí ha llenado mi corazón de dicha. Al celebrar mis Dulces 16, comienzo un hermoso nuevo capítulo rodeada de las personas que más quiero. Compartir esta noche mágica contigo será inolvidable.',
      'rsvp-deadline': 'FAVOR DE CONFIRMAR SU ASISTENCIA ANTES DEL 15 DE AGOSTO DE 2027',
      'rsvp-btn': 'CONFIRMAR ASISTENCIA',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN PARA<br />CONFIRMAR SU ASISTENCIA',
      'rsvp-thankyou': '¡Muchas Gracias!',
      'modal-title': 'Confirmar Asistencia para Denise Torres Rivera',
      'modal-subtitle': 'Sábado, 4 de Septiembre de 2027 • Oklahoma City, OK',
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
      'modal-decline-desc': 'Gracias por avisarnos. Su respuesta ha sido guardada.'
    }
  };

  let currentLang = 'en';

  function applyLanguage(lang) {
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
  if (btnEs) btnEs.addEventListener('click', () => applyLanguage('es'));
  if (btnEn) btnEn.addEventListener('click', () => applyLanguage('en'));

  // Language picker under the envelope (before the invitation is opened)
  document.querySelectorAll('.entry-lang-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage(b.dataset.lang);
    });
  });

  // Default to English on startup
  applyLanguage('en');

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
     2. AUDIO CONTROLLER & SONG PREVIEW TICKER
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
     3. BESPOKE LUXURY ENVELOPE ENTRY CONTROLLER & PETALS CASCADE
     ───────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  let envelopeOpened = false;

  // Falling Petal Engine in Powder Blue, White, Frost & Gold Sparkles
  class PowderBluePetalEngine {
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
          'rgba(85, 147, 201, 0.95)',  // celestial powder blue
          'rgba(158, 197, 232, 0.92)', // soft powder blue
          'rgba(123, 181, 226, 0.90)', // baby blue
          'rgba(220, 238, 251, 0.95)', // pale ice blue
          'rgba(201, 155, 66, 0.92)',  // sparkling gold leaf
          'rgba(254, 240, 138, 0.90)', // shimmering light gold
          'rgba(255, 255, 255, 0.98)', // crystalline white pearl
          'rgba(240, 247, 252, 0.96)'  // soft white-blue frost
        ][Math.floor(Math.random() * 8)],
        bend: Math.random() * 0.5 + 0.5
      };
    }

    triggerCelebratoryBurst() {
      if (this.hasTriggeredBurst) return;
      this.hasTriggeredBurst = true;
      const burstCount = window.innerWidth < 600 ? 44 : 68;

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
      const ringCount = window.innerWidth < 600 ? 20 : 32;

      for (let j = 0; j < ringCount; j++) {
        const p = this.createPetal(originY);
        p.x = originX + (Math.random() - 0.5) * 80;
        p.y = originY + (Math.random() - 0.5) * 60;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.2 + 1.2;
        p.speedX = Math.cos(angle) * speed;
        p.speedY = Math.abs(Math.sin(angle)) * speed + 0.8;
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
        this.ctx.shadowColor = 'rgba(85, 147, 201, 0.35)';
        this.ctx.fill();
        this.ctx.restore();

        if (p.y > this.height + 25) {
          this.particles[i] = this.createPetal(-25);
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const petalEngine = new PowderBluePetalEngine('entry-canvas');

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

    // 2. Trigger falling petals burst
    petalEngine.start();

    // 3. Start audio soundtrack
    playAudio();

    // 4. Smoothly fade out envelope overlay and unveil main site (1500ms matching denisetorresrivera)
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
      }
      document.body.classList.add('site-entered');
      document.documentElement.classList.add('site-entered');
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#dceefb');
      window.removeEventListener('wheel', blockScrollUntilEntered);
      window.removeEventListener('touchmove', blockScrollUntilEntered);
      window.removeEventListener('keydown', blockKeysUntilEntered);
    }, 1500);

    // 5. Final cleanup of overlay (2350ms matching denisetorresrivera)
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
    waxSealBtn.addEventListener('click', (e) => {
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
     4. COUNTDOWN TIMER ENGINE (SATURDAY, SEP 4, 2027 AT 5:00 PM)
     ───────────────────────────────────────────────────────────── */
  // JavaScript Date: Month is 0-indexed (8 = September)
  const TARGET_DATE = new Date(2027, 8, 4, 17, 0, 0).getTime();
  const AFTER_EVENT_MS = 6 * 60 * 60 * 1000;

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
        color: Math.random() > 0.4 ? '255, 255, 255' : (Math.random() > 0.6 ? '85, 147, 201' : (Math.random() > 0.5 ? '201, 155, 66' : '158, 197, 232'))
      });
    }

    function renderBokeh() {
      ambCtx.clearRect(0, 0, ambWidth, ambHeight);

      for (let i = 0; i < bokehs.length; i++) {
        const b = bokehs[i];
        b.y += b.speedY;
        b.x += b.speedX;

        if (b.y > ambHeight + 30) b.y = -30;
        if (b.x > ambWidth + 30) b.x = -30;
        if (b.x < -30) b.x = ambWidth + 30;

        ambCtx.save();
        ambCtx.beginPath();
        ambCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ambCtx.fillStyle = `rgba(${b.color}, ${b.alpha})`;
        ambCtx.shadowBlur = 12;
        ambCtx.shadowColor = `rgba(${b.color}, 0.5)`;
        ambCtx.fill();
        ambCtx.restore();
      }

      requestAnimationFrame(renderBokeh);
    }

    renderBokeh();
  }



  /* ─────────────────────────────────────────────────────────────
     6. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  function triggerScrollReveals() {
    const reveals = document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
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

  function triggerConfetti() {
    const confettiColors = ['#5593c9', '#9ec5e8', '#245785', '#c99b42', '#fef08a', '#ffffff', '#7bb5e2', '#dceefb'];
    for (let i = 0; i < 48; i++) {
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

  /* ─────────────────────────────────────────────────────────────
     COPY VENUE ADDRESS FUNCTIONALITY
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address') || 'La Bella Event Center, 6701 W Wilshire Blvd, Oklahoma City, OK 73132';
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
