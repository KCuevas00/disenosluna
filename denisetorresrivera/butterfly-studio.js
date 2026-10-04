/**
 * ═════════════════════════════════════════════════════════════════════
 * BUTTERFLY STUDIO — UNIVERSAL DRAG & DROP POSITIONING COMPONENT
 * ═════════════════════════════════════════════════════════════════════
 * A universal interactive editor tool for placing, dragging, scaling,
 * rotating, flipping, and exporting butterflies (or any decorative
 * floating motifs) across invitation & landing page canvases.
 *
 * Supports desktop mouse + mobile touch (Pointer Events with PointerCapture).
 * Compatible with vanilla browser <script>, CommonJS, and ES Modules.
 * ═════════════════════════════════════════════════════════════════════
 * 
 * ── HOW TO USE IN ANY TEMPLATE: ──
 * 
 * 1. HTML:
 *    Inside your relative page wrapper (e.g. <main class="invitation-wrapper">):
 *      <div id="butterflies-interactive-layer" class="butterflies-interactive-layer"></div>
 * 
 *    Right before </body>:
 *      Include the #butterfly-studio-dock markup (see BUTTERFLY_STUDIO_HTML below).
 * 
 * 2. CSS:
 *    Include the Butterfly Studio styles (see BUTTERFLY_STUDIO_CSS below).
 * 
 * 3. JS:
 *    Call initButterflyStudio() on DOMContentLoaded.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const mod = factory();
    root.ButterflyStudio = mod;
    root.initButterflyStudio = mod.initButterflyStudio;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const BUTTERFLY_STUDIO_HTML = `
<!-- Butterfly Studio Floating Dock -->
<div id="butterfly-studio-dock" class="butterfly-studio-dock collapsed" role="region" aria-label="Butterfly Studio">
  <!-- Collapsed Toggle Button -->
  <button type="button" id="studio-toggle-btn" class="studio-toggle-btn" aria-label="Open Butterfly Studio">
    <span>🦋</span>
    <span>Butterfly Studio</span>
  </button>

  <!-- Expanded Studio Panel -->
  <div class="studio-panel-content">
    <div class="studio-header">
      <span class="studio-title">🦋 Butterfly Studio</span>
      <button type="button" id="studio-close-btn" class="studio-close-btn" aria-label="Minimize Studio">✕</button>
    </div>

    <div class="studio-tip">
      Drag butterflies anywhere! Click to select one to scale, rotate, flip or delete.
    </div>

    <div class="studio-controls-row">
      <div class="studio-control-group">
        <label for="bf-scale-slider">Scale: <span id="bf-scale-val">0.50x</span></label>
        <input type="range" id="bf-scale-slider" min="0.25" max="1.20" step="0.02" value="0.50">
      </div>
      <div class="studio-control-group">
        <label for="bf-rotate-slider">Rotate: <span id="bf-rotate-val">0°</span></label>
        <input type="range" id="bf-rotate-slider" min="-180" max="180" step="2" value="0">
      </div>
      <div class="studio-toggle-group">
        <button type="button" id="bf-flip-btn" class="studio-mini-btn" title="Flip wings horizontally">⇄ Flip Wings</button>
        <button type="button" id="bf-delete-btn" class="studio-mini-btn btn-danger" title="Remove selected butterfly">✕ Remove</button>
      </div>
    </div>

    <div class="studio-actions-row">
      <button type="button" id="bf-add-btn" class="studio-action-btn btn-add">＋ Add Butterfly</button>
      <button type="button" id="bf-copy-btn" class="studio-action-btn btn-copy">📋 Copy Positions</button>
    </div>

    <textarea id="bf-output-box" class="studio-output-box" readonly placeholder="Click 'Copy Positions' to view & copy coordinate data..."></textarea>
  </div>
</div>
`;

  const BUTTERFLY_STUDIO_CSS = `
/* Interactive Butterfly Layer */
.butterflies-interactive-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 28;
}

.draggable-butterfly-item {
  position: absolute;
  width: 110px;
  height: 90px;
  pointer-events: auto;
  cursor: grab;
  user-select: none;
  touch-action: none;
  transform-origin: center center;
  transition: outline 0.2s ease, filter 0.2s ease;
  will-change: transform, top, left;
}

.draggable-butterfly-item:hover {
  filter: drop-shadow(0 0 8px rgba(85, 147, 201, 0.6));
}

.draggable-butterfly-item.is-selected {
  outline: 2px dashed #5593c9;
  outline-offset: 4px;
  border-radius: 14px;
  background: rgba(85, 147, 201, 0.08);
}

.draggable-butterfly-item.is-dragging {
  cursor: grabbing !important;
  z-index: 100 !important;
  filter: drop-shadow(0 8px 18px rgba(27, 56, 84, 0.45));
}

.butterfly-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #245785;
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.draggable-butterfly-item.is-selected .butterfly-badge {
  opacity: 1;
}

.draggable-butterfly-item .inv-butterfly {
  transform: none !important;
  width: 100% !important;
  height: 100% !important;
}

.draggable-butterfly-item .butterfly-flight-wrap {
  width: 100%;
  height: 100%;
}

/* Floating Studio Dock */
.butterfly-studio-dock {
  position: fixed;
  bottom: 18px;
  right: 18px;
  z-index: 99999;
  font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

.butterfly-studio-dock.collapsed .studio-panel-content {
  display: none;
}

.butterfly-studio-dock:not(.collapsed) .studio-toggle-btn {
  display: none;
}

.studio-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: #ffffff;
  color: #245785;
  border: 1.5px solid #5593c9;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(36, 87, 133, 0.28);
  cursor: pointer;
  transition: all 0.2s ease;
}

.studio-toggle-btn:hover {
  background: #eef6fd;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(36, 87, 133, 0.38);
}

.studio-panel-content {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid #5593c9;
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(27, 56, 84, 0.32);
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;
  color: #1e293b;
}

.studio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.studio-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #173d63;
}

.studio-close-btn {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  padding: 2px 6px;
}

.studio-tip {
  font-size: 0.66rem;
  color: #64748b;
  line-height: 1.35;
  margin-bottom: 10px;
}

.studio-controls-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f4f9fd;
  border: 1px solid #d3e8f8;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
}

.studio-control-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.70rem;
  font-weight: 600;
  color: #245785;
}

.studio-control-group label {
  min-width: 90px;
}

.studio-control-group input[type="range"] {
  flex: 1;
  max-width: 140px;
  cursor: pointer;
}

.studio-toggle-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}

.studio-mini-btn {
  padding: 4px 10px;
  font-size: 0.66rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid #9ec5e8;
  background: #ffffff;
  color: #245785;
  cursor: pointer;
}

.studio-mini-btn:hover {
  background: #e1effa;
}

.studio-mini-btn.btn-danger {
  border-color: #fca5a5;
  color: #b91c1c;
}

.studio-mini-btn.btn-danger:hover {
  background: #fee2e2;
}

.studio-actions-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.studio-action-btn {
  flex: 1;
  padding: 8px 10px;
  font-size: 0.70rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.studio-action-btn.btn-add {
  background: #eef6fd;
  border: 1.5px solid #5593c9;
  color: #245785;
}

.studio-action-btn.btn-add:hover {
  background: #d8ecfb;
}

.studio-action-btn.btn-copy {
  background: linear-gradient(135deg, #245785 0%, #5593c9 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(36, 87, 133, 0.25);
}

.studio-action-btn.btn-copy:hover {
  background: linear-gradient(135deg, #1b3854 0%, #245785 100%);
}

.studio-output-box {
  width: 100%;
  height: 58px;
  font-family: monospace;
  font-size: 0.60rem;
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  resize: vertical;
}

.studio-toast {
  position: fixed;
  bottom: 80px;
  right: 18px;
  background: #1e293b;
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.72rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 100000;
  pointer-events: none;
  animation: studioToastFade 2.5s forwards;
}

@keyframes studioToastFade {
  0% { opacity: 0; transform: translateY(8px); }
  12%, 85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-8px); }
}
`;

  /**
   * Initialize the interactive Butterfly Studio
   * @param {Object} options Configuration object
   */
  function initButterflyStudio(options = {}) {
    const containerId = options.containerId || 'butterflies-interactive-layer';
    const wrapperSelector = options.wrapperSelector || '.invitation-wrapper';
    const srcButterflyId = options.srcButterflyId || 'env-rustic-butterfly';
    const dockId = options.dockId || 'butterfly-studio-dock';
    const storageKey = options.storageKey || 'quince_butterfly_positions_v1';
    const defaultButterflies = options.defaultButterflies || [
      { id: 1, top: 410, left: 82, scale: 0.52, rotate: 10, flip: false },
      { id: 2, top: 760, left: 10, scale: 0.42, rotate: -12, flip: false }
    ];

    const container = document.getElementById(containerId);
    const wrapper = document.querySelector(wrapperSelector);
    const srcButterfly = document.getElementById(srcButterflyId);
    const dock = document.getElementById(dockId);

    if (!container || !wrapper || !srcButterfly) {
      console.warn('[ButterflyStudio] Required DOM elements not found.');
      return;
    }

    let butterflies = [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          butterflies = parsed;
        }
      }
    } catch (e) {}

    if (butterflies.length === 0) {
      butterflies = JSON.parse(JSON.stringify(defaultButterflies));
    }

    let selectedId = butterflies[0] ? butterflies[0].id : null;

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
        localStorage.setItem(storageKey, JSON.stringify(butterflies));
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
        const copyPayload = `Saved Butterfly Locations (${butterflies.length} total):\n${jsonStr}`;

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

    renderAll();
  }

  return {
    BUTTERFLY_STUDIO_HTML,
    BUTTERFLY_STUDIO_CSS,
    initButterflyStudio
  };
});
