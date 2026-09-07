/**
 * ═════════════════════════════════════════════════════════════════════
 * DISEÑOS LUNA — INVITATION ORDER & INTAKE CONTROLLER
 * 
 * Clean 3-Step Non-Payment Order Flow:
 * 1. Step 1: Package selection & basic contact/event information
 * 2. Step 2: Full invitation details (theme, venues, schedule, music, photos)
 * 3. Step 3: Order received confirmation (Owner contacts customer directly for payment)
 * ═════════════════════════════════════════════════════════════════════
 */

let currentOrderRef = '';
let currentSelectedPackage = 'Premium ($85)';
let currentPackagePrice = '$85.00';

document.addEventListener('DOMContentLoaded', () => {
  initOrderReference();
  initPackageSelector();
  initStep1Form();
  initStep2Form();
  initPhotoUploads();
  initBackToStep1Button();
});

/**
 * Generates a clean local order reference (e.g. DL-2026-A8K4M)
 */
function initOrderReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomCode = '';
  for (let i = 0; i < 5; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentOrderRef = `DL-2026-${randomCode}`;

  const orderRefInput = document.getElementById('field-order-ref');
  if (orderRefInput) {
    orderRefInput.value = currentOrderRef;
  }
}

/**
 * Step 1: Package Selection UI toggle & price updates
 */
function initPackageSelector() {
  const radios = document.querySelectorAll('input[name="package"]');
  const summaryPkgName = document.getElementById('summary-pkg-name');
  const summaryPkgPrice = document.getElementById('summary-pkg-price');

  const updateSelection = () => {
    let pkgVal = 'Premium';
    radios.forEach(radio => {
      const parent = radio.closest('.package-option-label');
      if (radio.checked) {
        pkgVal = radio.value;
        if (parent) parent.classList.add('is-selected');
      } else {
        if (parent) parent.classList.remove('is-selected');
      }
    });

    const isBasic = pkgVal.toLowerCase().includes('basic');
    currentSelectedPackage = isBasic ? 'Basic ($70)' : 'Premium ($85)';
    currentPackagePrice = isBasic ? '$70.00' : '$85.00';

    if (summaryPkgName) summaryPkgName.textContent = currentSelectedPackage;
    if (summaryPkgPrice) summaryPkgPrice.textContent = currentPackagePrice;

    // Update Step 2 preview badge & hidden fields
    const step2Badge = document.getElementById('step2-pkg-badge');
    if (step2Badge) step2Badge.textContent = currentSelectedPackage;

    const fieldPkg = document.getElementById('field-selected-package');
    if (fieldPkg) fieldPkg.value = currentSelectedPackage;

    const fieldPrice = document.getElementById('field-package-price');
    if (fieldPrice) fieldPrice.value = currentPackagePrice;

    applyDynamicPackageRules(pkgVal);
  };

  radios.forEach(r => r.addEventListener('change', updateSelection));
  updateSelection();
}

/**
 * Step 1: Validation and Transition to Step 2
 */
function initStep1Form() {
  const form = document.getElementById('step-1-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('step1-name');
    const phoneInput = document.getElementById('step1-phone');
    const emailInput = document.getElementById('step1-email');
    const eventTypeInput = document.getElementById('step1-event-type');
    const celebrantInput = document.getElementById('step1-celebrant');
    const dateInput = document.getElementById('step1-date');

    const fieldsToValidate = [
      { input: nameInput, errId: 'err-step1-name', check: val => val.trim().length > 0 },
      { input: phoneInput, errId: 'err-step1-phone', check: val => val.trim().length >= 7 },
      { input: emailInput, errId: 'err-step1-email', check: val => /\S+@\S+\.\S+/.test(val) },
      { input: eventTypeInput, errId: 'err-step1-event-type', check: val => val && val.trim().length > 0 },
      { input: celebrantInput, errId: 'err-step1-celebrant', check: val => val.trim().length > 0 },
      { input: dateInput, errId: 'err-step1-date', check: val => val.trim().length > 0 },
    ];

    let hasErrors = false;
    let firstErrorField = null;

    fieldsToValidate.forEach(item => {
      const isValid = item.check(item.input ? item.input.value : '');
      const errEl = document.getElementById(item.errId);
      if (!isValid) {
        hasErrors = true;
        if (item.input) item.input.classList.add('has-error');
        if (errEl) errEl.classList.add('is-visible');
        if (!firstErrorField) firstErrorField = item.input;
      } else {
        if (item.input) item.input.classList.remove('has-error');
        if (errEl) errEl.classList.remove('is-visible');
      }
    });

    if (hasErrors) {
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }

    // Pre-fill Step 2 with verified Step 1 inputs
    const clientName = nameInput.value.trim();
    const clientPhone = phoneInput.value.trim();
    const clientEmail = emailInput.value.trim();
    const eventType = eventTypeInput.value.trim();
    const celebrantName = celebrantInput.value.trim();
    const eventDate = dateInput.value.trim();

    if (document.getElementById('det-name')) document.getElementById('det-name').value = clientName;
    if (document.getElementById('det-phone')) document.getElementById('det-phone').value = clientPhone;
    if (document.getElementById('det-email')) document.getElementById('det-email').value = clientEmail;
    if (document.getElementById('det-event-type')) document.getElementById('det-event-type').value = eventType;
    if (document.getElementById('det-celebrant')) document.getElementById('det-celebrant').value = celebrantName;
    if (document.getElementById('det-date')) document.getElementById('det-date').value = eventDate;

    // Activate Step 2
    activateStep2();
  });

  // Remove error indicators on input
  ['step1-name', 'step1-phone', 'step1-email', 'step1-event-type', 'step1-celebrant', 'step1-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('has-error');
        const errEl = document.getElementById(`err-${id}`);
        if (errEl) errEl.classList.remove('is-visible');
      });
    }
  });
}

/**
 * Activates Step 2 (Detailed Invitation Form)
 */
function activateStep2() {
  const step1Sec = document.getElementById('step-1-section');
  const step2Sec = document.getElementById('step-2-section');
  const step3Sec = document.getElementById('step-3-confirmation');

  if (step1Sec) step1Sec.classList.add('is-hidden');
  if (step2Sec) step2Sec.classList.remove('is-hidden');
  if (step3Sec) step3Sec.classList.add('is-hidden');

  updateStepper(2);

  // Sync badge & dynamic feature blocks
  const step2Badge = document.getElementById('step2-pkg-badge');
  if (step2Badge) step2Badge.textContent = currentSelectedPackage;

  applyDynamicPackageRules(currentSelectedPackage);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Returns user from Step 2 back to Step 1 to change package or basic details
 */
function initBackToStep1Button() {
  const btn = document.getElementById('btn-change-pkg');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const step1Sec = document.getElementById('step-1-section');
    const step2Sec = document.getElementById('step-2-section');
    const step3Sec = document.getElementById('step-3-confirmation');

    if (step1Sec) step1Sec.classList.remove('is-hidden');
    if (step2Sec) step2Sec.classList.add('is-hidden');
    if (step3Sec) step3Sec.classList.add('is-hidden');

    updateStepper(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Adapts feature inputs based on selected package (Basic vs Premium)
 */
function applyDynamicPackageRules(packageType) {
  const isBasic = packageType.toLowerCase().includes('basic');

  const blockMusic = document.getElementById('block-music');
  const badgeMusic = document.getElementById('badge-music');
  const inputSong = document.getElementById('det-song');
  const hintMusic = document.getElementById('hint-music');

  const blockCountdown = document.getElementById('block-countdown');
  const badgeCountdown = document.getElementById('badge-countdown');
  const selectCountdown = document.getElementById('det-countdown');

  const blockCourt = document.getElementById('block-court');
  const badgeCourt = document.getElementById('badge-court');
  const textareaCourt = document.getElementById('det-court');

  const blockCourtPhotos = document.getElementById('block-court-photos');
  const badgeCourtPhotos = document.getElementById('badge-court-photos');

  const blockGalleryPhotos = document.getElementById('block-gallery-photos');
  const badgeGalleryPhotos = document.getElementById('badge-gallery-photos');

  if (isBasic) {
    if (badgeMusic) {
      badgeMusic.textContent = 'Premium Feature (Not in Basic)';
      badgeMusic.className = 'feature-badge badge-locked';
    }
    if (inputSong) {
      inputSong.placeholder = 'Background music is included in the Premium package ($85)';
      inputSong.disabled = true;
    }
    if (hintMusic) {
      hintMusic.textContent = 'Music playback is exclusive to the Premium package. Leave blank or discuss upgrading with us.';
    }
    if (blockMusic) blockMusic.classList.add('is-locked');

    if (badgeCountdown) {
      badgeCountdown.textContent = 'Premium Feature (Not in Basic)';
      badgeCountdown.className = 'feature-badge badge-locked';
    }
    if (selectCountdown) {
      selectCountdown.innerHTML = '<option value="Not Included in Basic" selected>Not included in Basic Package</option>';
      selectCountdown.disabled = true;
    }
    if (blockCountdown) blockCountdown.classList.add('is-locked');

    if (badgeCourt) {
      badgeCourt.textContent = 'Premium Feature (Not in Basic)';
      badgeCourt.className = 'feature-badge badge-locked';
    }
    if (textareaCourt) {
      textareaCourt.placeholder = 'Court of honor roster is included in the Premium package ($85).';
      textareaCourt.disabled = true;
    }
    if (blockCourt) blockCourt.classList.add('is-locked');

    if (badgeCourtPhotos) {
      badgeCourtPhotos.textContent = 'Premium Feature';
      badgeCourtPhotos.className = 'feature-badge badge-locked';
    }
    if (blockCourtPhotos) blockCourtPhotos.classList.add('is-locked');

    if (badgeGalleryPhotos) {
      badgeGalleryPhotos.textContent = 'Premium Feature';
      badgeGalleryPhotos.className = 'feature-badge badge-locked';
    }
    if (blockGalleryPhotos) blockGalleryPhotos.classList.add('is-locked');

  } else {
    // Premium ($85)
    if (badgeMusic) {
      badgeMusic.textContent = 'Included with Premium ✓';
      badgeMusic.className = 'feature-badge badge-included';
    }
    if (inputSong) {
      inputSong.placeholder = 'Artist and Song Title (or YouTube/Spotify link)';
      inputSong.disabled = false;
    }
    if (hintMusic) {
      hintMusic.textContent = 'Plays automatically when guests open the virtual envelope (Included in Premium).';
    }
    if (blockMusic) blockMusic.classList.remove('is-locked');

    if (badgeCountdown) {
      badgeCountdown.textContent = 'Included with Premium ✓';
      badgeCountdown.className = 'feature-badge badge-included';
    }
    if (selectCountdown) {
      selectCountdown.innerHTML = `
        <option value="Yes, include live countdown">Yes, include live countdown clock</option>
        <option value="No, skip countdown">No countdown needed</option>
      `;
      selectCountdown.disabled = false;
    }
    if (blockCountdown) blockCountdown.classList.remove('is-locked');

    if (badgeCourt) {
      badgeCourt.textContent = 'Included with Premium ✓';
      badgeCourt.className = 'feature-badge badge-included';
    }
    if (textareaCourt) {
      textareaCourt.placeholder = 'List names and roles, e.g.:\nChambelán de Honor: Mateo Ramirez\nDamas: Camila, Valentina, Sofia\nPadrinos: Juan & Carmen Gomez';
      textareaCourt.disabled = false;
    }
    if (blockCourt) blockCourt.classList.remove('is-locked');

    if (badgeCourtPhotos) {
      badgeCourtPhotos.textContent = 'Included with Premium ✓';
      badgeCourtPhotos.className = 'feature-badge badge-included';
    }
    if (blockCourtPhotos) blockCourtPhotos.classList.remove('is-locked');

    if (badgeGalleryPhotos) {
      badgeGalleryPhotos.textContent = 'Included with Premium ✓';
      badgeGalleryPhotos.className = 'feature-badge badge-included';
    }
    if (blockGalleryPhotos) blockGalleryPhotos.classList.remove('is-locked');
  }
}

/**
 * Step 2: Final Details Form Submission via FormSubmit
 */
function initStep2Form() {
  const form = document.getElementById('step-2-details-form');
  const submitBtn = document.getElementById('submit-final-details-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      return; // Standard browser validation
    }

    const clientName = document.getElementById('det-name')?.value.trim() || 'Customer';
    const clientPhone = document.getElementById('det-phone')?.value.trim() || '';
    const clientEmail = document.getElementById('det-email')?.value.trim() || '';
    const celebrantName = document.getElementById('det-celebrant')?.value.trim() || 'Celebrant';
    const eventType = document.getElementById('det-event-type')?.value.trim() || '';
    const eventDate = document.getElementById('det-date')?.value.trim() || '';
    const themeColors = document.getElementById('det-theme-colors')?.value.trim() || '';
    const language = document.getElementById('det-language')?.value || 'English Only';
    const church = document.getElementById('det-church')?.value.trim() || 'N/A';
    const reception = document.getElementById('det-reception')?.value.trim() || '';
    const milestones = document.getElementById('det-milestones')?.value.trim() || 'N/A';
    const song = document.getElementById('det-song')?.value.trim() || 'None';
    const notes = document.getElementById('det-notes')?.value.trim() || 'None';

    // Clear FormSubmit Email Subject: NEW ORDER — [Package] — [Order Reference] — [Client Name]
    const fsSubject = document.getElementById('fs-subject');
    if (fsSubject) {
      fsSubject.value = `NEW ORDER — ${currentSelectedPackage.toUpperCase()} — ${currentOrderRef} — ${clientName}`;
    }

    // Show loading state on submit button
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Submitting Order...</span>`;
      submitBtn.disabled = true;
    }

    // Build text summary for customer clipboard
    const orderSummary = `══════════════════════════════════════\n` +
      `DISEÑOS LUNA — INVITATION ORDER\n` +
      `══════════════════════════════════════\n\n` +
      `• Order Reference: ${currentOrderRef}\n` +
      `• Selected Package: ${currentSelectedPackage}\n` +
      `• Package Price: ${currentPackagePrice}\n` +
      `• Payment Status: Pending arrangement with customer\n\n` +
      `• Client Name: ${clientName}\n` +
      `• Phone/WhatsApp: ${clientPhone}\n` +
      `• Email: ${clientEmail}\n` +
      `• Event Type: ${eventType}\n` +
      `• Celebrant(s): ${celebrantName}\n` +
      `• Event Date: ${eventDate}\n` +
      `• Theme & Colors: ${themeColors}\n` +
      `• Language: ${language}\n` +
      `• Ceremony: ${church}\n` +
      `• Reception: ${reception}\n` +
      `• Milestones: ${milestones}\n` +
      `• Song Request: ${song}\n` +
      `• Special Notes: ${notes}\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(orderSummary).catch(() => {});
    }

    // Submit form asynchronously to FormSubmit
    e.preventDefault();
    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(() => {
      activateStep3(clientName, celebrantName, currentSelectedPackage, currentOrderRef);
    }).catch(err => {
      console.warn('FormSubmit async notification:', err);
      // Still show Step 3 confirmation so customer is not blocked
      activateStep3(clientName, celebrantName, currentSelectedPackage, currentOrderRef);
    });
  });
}

/**
 * Activates Step 3 Confirmation View ("Order received!")
 */
function activateStep3(clientName, celebrantName, packageType, orderRef) {
  const step1Sec = document.getElementById('step-1-section');
  const step2Sec = document.getElementById('step-2-section');
  const step3Sec = document.getElementById('step-3-confirmation');

  if (step1Sec) step1Sec.classList.add('is-hidden');
  if (step2Sec) step2Sec.classList.add('is-hidden');
  if (step3Sec) step3Sec.classList.remove('is-hidden');

  updateStepper(3);

  const confClient = document.getElementById('conf-client-name');
  if (confClient) confClient.textContent = clientName || 'Customer';

  const confCel = document.getElementById('conf-celebrant');
  if (confCel) confCel.textContent = celebrantName || 'Celebrant';

  const confPkg = document.getElementById('conf-package');
  if (confPkg) confPkg.textContent = packageType;

  const confOrder = document.getElementById('conf-order-id');
  if (confOrder) confOrder.textContent = orderRef || currentOrderRef;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Updates Stepper visual dots & labels
 */
function updateStepper(activeStepNumber) {
  const s1 = document.getElementById('step-indicator-1');
  const s2 = document.getElementById('step-indicator-2');
  const s3 = document.getElementById('step-indicator-3');

  [s1, s2, s3].forEach(s => {
    if (s) s.classList.remove('is-active', 'is-completed');
  });

  if (activeStepNumber === 1) {
    if (s1) s1.classList.add('is-active');
  } else if (activeStepNumber === 2) {
    if (s1) s1.classList.add('is-completed');
    if (s2) s2.classList.add('is-active');
  } else if (activeStepNumber === 3) {
    if (s1) s1.classList.add('is-completed');
    if (s2) s2.classList.add('is-completed');
    if (s3) s3.classList.add('is-active');
  }
}

/**
 * Photo dropzone upload previews
 */
function initPhotoUploads() {
  const setupDropzone = (dropzoneId, inputId, previewId, isMultiple = false) => {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!dropzone || !input || !preview) return;

    const handleFiles = (files) => {
      if (!isMultiple) {
        preview.innerHTML = '';
      }
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const item = document.createElement('div');
          item.className = 'preview-item';
          item.innerHTML = `
            <img src="${e.target.result}" alt="Uploaded photo" class="preview-img" />
            <button type="button" class="preview-remove" aria-label="Remove photo">&times;</button>
          `;
          item.querySelector('.preview-remove').addEventListener('click', (ev) => {
            ev.stopPropagation();
            item.remove();
          });
          preview.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    };

    input.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    ['dragleave', 'dragend'].forEach(ev => {
      dropzone.addEventListener(ev, () => {
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        handleFiles(e.dataTransfer.files);
      }
    });
  };

  setupDropzone('cover-dropzone', 'cover-photo-input', 'cover-preview', false);
  setupDropzone('court-dropzone', 'court-photo-input', 'court-preview', true);
  setupDropzone('gallery-dropzone', 'gallery-photo-input', 'gallery-preview', true);
}
