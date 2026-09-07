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
let currentSelectedPackage = 'Premium ($70)';
let currentPackagePrice = '$70.00';
let currentOrderSummary = '';

document.addEventListener('DOMContentLoaded', () => {
  initOrderReference();
  initPackageSelector();
  initStep1Form();
  initStep2Form();
  initPhotoUploads();
  initBackToStep1Button();
  initCopySummaryButton();
  initCloudLinkFeedback();
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
 * Step 1: Package Selection UI toggle, price updates, and URL query param check
 */
function initPackageSelector() {
  const radios = document.querySelectorAll('input[name="package"]');
  const summaryPkgName = document.getElementById('summary-pkg-name');
  const summaryPkgPrice = document.getElementById('summary-pkg-price');

  // Check URL query param (?package=Basic or ?package=Premium)
  const urlParams = new URLSearchParams(window.location.search);
  const pkgParam = urlParams.get('package');
  if (pkgParam) {
    const isBasicParam = pkgParam.toLowerCase() === 'basic';
    radios.forEach(radio => {
      const isThisBasic = radio.value.toLowerCase().includes('basic');
      radio.checked = isBasicParam ? isThisBasic : !isThisBasic;
    });
  }

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
    currentSelectedPackage = isBasic ? 'Basic ($55)' : 'Premium ($70)';
    currentPackagePrice = isBasic ? '$55.00' : '$70.00';

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
  window.addEventListener('dl_language_changed', updateSelection);
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
    const handleInput = document.getElementById('step1-handle');
    const contactMethodInput = document.getElementById('step1-contact-method');
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

    // Capture verified Step 1 inputs
    const clientName = nameInput.value.trim();
    const clientPhone = phoneInput.value.trim();
    const clientEmail = emailInput.value.trim();
    const socialHandle = handleInput ? handleInput.value.trim() : '';
    const preferredContact = contactMethodInput ? contactMethodInput.value : 'WhatsApp';
    const eventType = eventTypeInput.value.trim();
    const celebrantName = celebrantInput.value.trim();
    const eventDate = dateInput.value.trim();

    // Populate hidden inputs in Step 2 for FormSubmit
    const setHiddenVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    setHiddenVal('field-client-name', clientName);
    setHiddenVal('field-client-phone', clientPhone);
    setHiddenVal('field-client-email', clientEmail);
    setHiddenVal('field-social-handle', socialHandle || 'None provided');
    setHiddenVal('field-preferred-contact', preferredContact);
    setHiddenVal('field-event-type', eventType);
    setHiddenVal('field-celebrant-name', celebrantName);
    setHiddenVal('field-event-date', eventDate);
    setHiddenVal('fs-replyto', clientEmail);

    // Populate Read-Only Recap Card in Step 2
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText('recap-name', clientName);
    setText('recap-phone', clientPhone);
    setText('recap-email', clientEmail);
    setText('recap-contact-method', socialHandle ? `${preferredContact} (${socialHandle})` : preferredContact);
    setText('recap-celebrant', celebrantName);
    setText('recap-event-meta', `${eventType} • ${eventDate}`);

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
  const returnToStep1 = () => {
    const step1Sec = document.getElementById('step-1-section');
    const step2Sec = document.getElementById('step-2-section');
    const step3Sec = document.getElementById('step-3-confirmation');
    const step2Err = document.getElementById('step-2-error');

    if (step1Sec) step1Sec.classList.remove('is-hidden');
    if (step2Sec) step2Sec.classList.add('is-hidden');
    if (step3Sec) step3Sec.classList.add('is-hidden');
    if (step2Err) step2Err.classList.add('is-hidden');

    updateStepper(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const btnChangePkg = document.getElementById('btn-change-pkg');
  if (btnChangePkg) btnChangePkg.addEventListener('click', returnToStep1);

  const btnRecapEdit = document.getElementById('btn-recap-edit');
  if (btnRecapEdit) btnRecapEdit.addEventListener('click', returnToStep1);
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

  const selectLanguage = document.getElementById('det-language');
  const optBilingual = document.getElementById('opt-bilingual');
  const hintLanguage = document.getElementById('hint-language');
  const isSpanish = (document.documentElement.lang === 'es');

  if (isBasic) {
    if (badgeMusic) {
      badgeMusic.textContent = isSpanish ? 'Función Premium (No en Básico)' : 'Premium Feature (Not in Basic)';
      badgeMusic.className = 'feature-badge badge-locked';
    }
    if (inputSong) {
      inputSong.placeholder = isSpanish ? 'La música de fondo está incluida en el paquete Premium ($70)' : 'Background music is included in the Premium package ($70)';
      inputSong.disabled = true;
    }
    if (hintMusic) {
      hintMusic.textContent = isSpanish ? 'La reproducción de música es exclusiva de Premium. Puedes cambiar de paquete con nosotros.' : 'Music playback is exclusive to the Premium package. Leave blank or discuss upgrading with us.';
    }
    if (blockMusic) blockMusic.classList.add('is-locked');

    if (badgeCountdown) {
      badgeCountdown.textContent = isSpanish ? 'Función Premium (No en Básico)' : 'Premium Feature (Not in Basic)';
      badgeCountdown.className = 'feature-badge badge-locked';
    }
    if (selectCountdown) {
      selectCountdown.innerHTML = isSpanish
        ? '<option value="Not Included in Basic" selected>No incluido en Paquete Básico</option>'
        : '<option value="Not Included in Basic" selected>Not included in Basic Package</option>';
      selectCountdown.disabled = true;
    }
    if (blockCountdown) blockCountdown.classList.add('is-locked');

    if (badgeCourt) {
      badgeCourt.textContent = isSpanish ? 'Función Premium (No en Básico)' : 'Premium Feature (Not in Basic)';
      badgeCourt.className = 'feature-badge badge-locked';
    }
    if (textareaCourt) {
      textareaCourt.placeholder = isSpanish ? 'La sección de corte de honor está incluida en el paquete Premium ($70).' : 'Court of honor roster is included in the Premium package ($70).';
      textareaCourt.disabled = true;
    }
    if (blockCourt) blockCourt.classList.add('is-locked');

    if (badgeCourtPhotos) {
      badgeCourtPhotos.textContent = isSpanish ? 'Función Premium' : 'Premium Feature';
      badgeCourtPhotos.className = 'feature-badge badge-locked';
    }
    if (blockCourtPhotos) blockCourtPhotos.classList.add('is-locked');

    if (badgeGalleryPhotos) {
      badgeGalleryPhotos.textContent = isSpanish ? 'Función Premium' : 'Premium Feature';
      badgeGalleryPhotos.className = 'feature-badge badge-locked';
    }
    if (blockGalleryPhotos) blockGalleryPhotos.classList.add('is-locked');

    // Restrict Bilingual Language Selection for Basic
    if (selectLanguage) {
      if (selectLanguage.value.toLowerCase().includes('bilingual')) {
        selectLanguage.value = isSpanish ? 'Spanish Only' : 'English Only';
      }
    }
    if (optBilingual) {
      optBilingual.disabled = true;
      optBilingual.textContent = isSpanish
        ? 'Bilingüe (Solo en Paquete Premium)'
        : 'Bilingual (Premium Package Only)';
    }
    if (hintLanguage) {
      hintLanguage.textContent = isSpanish
        ? 'El paquete Básico ($55) incluye un solo idioma. Para versión bilingüe (Inglés y Español), selecciona Premium ($70).'
        : 'Basic package ($55) includes single language (English or Spanish). Bilingual is included in Premium ($70).';
      hintLanguage.className = 'field-hint hint-warning';
    }

  } else {
    // Premium ($70)
    if (badgeMusic) {
      badgeMusic.textContent = isSpanish ? 'Incluido con Premium ✓' : 'Included with Premium ✓';
      badgeMusic.className = 'feature-badge badge-included';
    }
    if (inputSong) {
      inputSong.placeholder = isSpanish ? 'Artista y Título de la Canción (o enlace de YouTube/Spotify)' : 'Artist and Song Title (or YouTube/Spotify link)';
      inputSong.disabled = false;
    }
    if (hintMusic) {
      hintMusic.textContent = isSpanish ? 'Suena automáticamente al abrir el sobre virtual (Incluido en Premium).' : 'Plays automatically when guests open the virtual envelope (Included in Premium).';
    }
    if (blockMusic) blockMusic.classList.remove('is-locked');

    if (badgeCountdown) {
      badgeCountdown.textContent = isSpanish ? 'Incluido con Premium ✓' : 'Included with Premium ✓';
      badgeCountdown.className = 'feature-badge badge-included';
    }
    if (selectCountdown) {
      selectCountdown.innerHTML = isSpanish ? `
        <option value="Yes, include live countdown">Sí, incluir reloj de cuenta regresiva en vivo</option>
        <option value="No, skip countdown">No se necesita cuenta regresiva</option>
      ` : `
        <option value="Yes, include live countdown">Yes, include live countdown clock</option>
        <option value="No, skip countdown">No countdown needed</option>
      `;
      selectCountdown.disabled = false;
    }
    if (blockCountdown) blockCountdown.classList.remove('is-locked');

    if (badgeCourt) {
      badgeCourt.textContent = isSpanish ? 'Incluido con Premium ✓' : 'Included with Premium ✓';
      badgeCourt.className = 'feature-badge badge-included';
    }
    if (textareaCourt) {
      textareaCourt.placeholder = isSpanish ? 'Escribe nombres y roles, ej:\nChambelán de Honor: Mateo Ramirez\nDamas: Camila, Valentina, Sofia\nPadrinos: Juan & Carmen Gomez' : 'List names and roles, e.g.:\nChambelán de Honor: Mateo Ramirez\nDamas: Camila, Valentina, Sofia\nPadrinos: Juan & Carmen Gomez';
      textareaCourt.disabled = false;
    }
    if (blockCourt) blockCourt.classList.remove('is-locked');

    if (badgeCourtPhotos) {
      badgeCourtPhotos.textContent = isSpanish ? 'Incluido con Premium ✓' : 'Included with Premium ✓';
      badgeCourtPhotos.className = 'feature-badge badge-included';
    }
    if (blockCourtPhotos) blockCourtPhotos.classList.remove('is-locked');

    if (badgeGalleryPhotos) {
      badgeGalleryPhotos.textContent = isSpanish ? 'Incluido con Premium ✓' : 'Included with Premium ✓';
      badgeGalleryPhotos.className = 'feature-badge badge-included';
    }
    if (blockGalleryPhotos) blockGalleryPhotos.classList.remove('is-locked');

    // Unlock Bilingual Language Selection for Premium
    if (optBilingual) {
      optBilingual.disabled = false;
      optBilingual.textContent = isSpanish
        ? 'Bilingüe (Inglés y Español) ✓ Incluido'
        : 'Bilingual (English & Spanish) ✓ Included';
    }
    if (hintLanguage) {
      hintLanguage.textContent = isSpanish
        ? 'Incluye traducción bilingüe completa (Inglés y Español) en tu invitación.'
        : 'Includes full bilingual English & Spanish translation in your invitation.';
      hintLanguage.className = 'field-hint hint-success';
    }
  }
}

/**
 * Calculates total size of all selected image files across dropzones
 */
function getTotalUploadedFileSize() {
  const inputs = ['cover-photo-input', 'court-photo-input', 'gallery-photo-input'];
  let totalBytes = 0;
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input && input.files) {
      Array.from(input.files).forEach(f => {
        totalBytes += f.size;
      });
    }
  });
  return totalBytes;
}

/**
 * Displays dynamic warning if photo attachments approach FormSubmit's 25MB ceiling
 */
function checkTotalFileSize() {
  const total = getTotalUploadedFileSize();
  const noticeBox = document.querySelector('.photo-limit-notice');
  if (!noticeBox) return;

  const totalMB = (total / (1024 * 1024)).toFixed(1);
  if (total > 20 * 1024 * 1024) {
    noticeBox.style.borderColor = '#c43b3b';
    noticeBox.style.background = '#fff4f4';
    noticeBox.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#c43b3b" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span style="color: #991b1b;">
        <strong>Attachment Size Warning (${totalMB} MB):</strong> FormSubmit limits total submission size to ~25MB. Your attachments are close to or exceeding this limit. Please remove some photos and paste a <strong>Cloud Album Link</strong> below instead so your order submits reliably!
      </span>
    `;
  } else {
    noticeBox.style.borderColor = '';
    noticeBox.style.background = '';
    const statusText = total === 0 ? 'No files attached yet (~25MB total limit)' : `Current attachments: <strong>${totalMB} MB</strong>`;
    noticeBox.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span><strong>Photo Upload Note:</strong> ${statusText}. Direct photo upload is optional. If you have large batches of high-resolution photos, you can upload your cover photo here or paste a shared <strong>Cloud Album Link</strong> (Google Photos, Drive, Dropbox, iCloud) below so no photos get compressed or omitted.</span>
    `;
  }
}

/**
 * Live feedback and link recognition for Cloud Album Link input
 */
function initCloudLinkFeedback() {
  const input = document.getElementById('det-cloud-link');
  const feedback = document.getElementById('cloud-link-feedback');
  if (!input || !feedback) return;

  const checkLink = () => {
    const rawVal = input.value.trim();
    feedback.className = 'cloud-link-feedback';
    
    if (!rawVal) {
      feedback.classList.add('is-hidden');
      feedback.textContent = '';
      return;
    }

    const val = rawVal.toLowerCase();
    const hasValidUrlShape = /^https?:\/\//i.test(val) || /[a-z0-9-]+\.[a-z]{2,}/i.test(val);

    if (!hasValidUrlShape) {
      feedback.classList.add('is-hint');
      feedback.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:-2px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Please enter a share link (e.g. drive.google.com, icloud.com, or dropbox.com)</span>
      `;
      feedback.classList.remove('is-hidden');
      return;
    }

    let service = '';
    if (val.includes('google.com') || val.includes('photos.app.goo.gl')) {
      service = 'Google Drive / Google Photos';
    } else if (val.includes('icloud.com')) {
      service = 'iCloud Shared Album';
    } else if (val.includes('dropbox.com')) {
      service = 'Dropbox album';
    } else if (val.includes('onedrive') || val.includes('1drv.ms') || val.includes('live.com')) {
      service = 'OneDrive album';
    }

    if (service) {
      feedback.classList.add('is-valid');
      feedback.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:-2px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${service} recognized &bull; We will retrieve your photos directly!</span>
      `;
    } else {
      feedback.classList.add('is-neutral');
      feedback.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:-2px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Link saved &bull; We will access your shared photos directly.</span>
      `;
    }
    feedback.classList.remove('is-hidden');
  };

  input.addEventListener('input', checkLink);
  input.addEventListener('change', checkLink);
  input.addEventListener('blur', () => {
    let val = input.value.trim();
    if (val && !/^https?:\/\//i.test(val) && !val.startsWith('//') && /[a-z0-9-]+\.[a-z]{2,}/i.test(val)) {
      input.value = 'https://' + val;
      checkLink();
    }
  });
}

/**
 * Step 2: Final Details Form Submission via FormSubmit
 */
function initStep2Form() {
  const form = document.getElementById('step-2-details-form');
  const submitBtn = document.getElementById('submit-final-details-btn');
  const errorBanner = document.getElementById('step-2-error');
  if (!form) return;

  // Real-time error clearing
  ['det-theme-colors', 'det-reception'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('has-error');
        const errEl = document.getElementById(`err-${id}`);
        if (errEl) errEl.classList.remove('is-visible');
        if (errorBanner) errorBanner.classList.add('is-hidden');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorBanner) errorBanner.classList.add('is-hidden');

    const themeColorsInput = document.getElementById('det-theme-colors');
    const receptionInput = document.getElementById('det-reception');

    let hasErrors = false;
    let firstError = null;

    if (!themeColorsInput || !themeColorsInput.value.trim()) {
      hasErrors = true;
      if (themeColorsInput) themeColorsInput.classList.add('has-error');
      const errEl = document.getElementById('err-det-theme-colors');
      if (errEl) errEl.classList.add('is-visible');
      if (!firstError) firstError = themeColorsInput;
    } else {
      if (themeColorsInput) themeColorsInput.classList.remove('has-error');
      const errEl = document.getElementById('err-det-theme-colors');
      if (errEl) errEl.classList.remove('is-visible');
    }

    if (!receptionInput || !receptionInput.value.trim()) {
      hasErrors = true;
      if (receptionInput) receptionInput.classList.add('has-error');
      const errEl = document.getElementById('err-det-reception');
      if (errEl) errEl.classList.add('is-visible');
      if (!firstError) firstError = receptionInput;
    } else {
      if (receptionInput) receptionInput.classList.remove('has-error');
      const errEl = document.getElementById('err-det-reception');
      if (errEl) errEl.classList.remove('is-visible');
    }

    if (hasErrors) {
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Protect against FormSubmit total payload ceiling
    const totalBytes = getTotalUploadedFileSize();
    if (totalBytes > 24 * 1024 * 1024) {
      if (errorBanner) {
        errorBanner.textContent = 'Your photo attachments exceed 24MB. Please remove some direct photo uploads and provide a Cloud Album Link (Google Photos, Drive, etc.) below instead so your order submits successfully.';
        errorBanner.classList.remove('is-hidden');
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const clientName = document.getElementById('field-client-name')?.value.trim() || 'Customer';
    const clientPhone = document.getElementById('field-client-phone')?.value.trim() || '';
    const clientEmail = document.getElementById('field-client-email')?.value.trim() || '';
    const socialHandle = document.getElementById('field-social-handle')?.value.trim() || 'None provided';
    const preferredContact = document.getElementById('field-preferred-contact')?.value.trim() || 'WhatsApp';
    const eventType = document.getElementById('field-event-type')?.value.trim() || '';
    const celebrantName = document.getElementById('field-celebrant-name')?.value.trim() || 'Celebrant';
    const eventDate = document.getElementById('field-event-date')?.value.trim() || '';
    const themeColors = themeColorsInput?.value.trim() || '';
    const rawLanguage = document.getElementById('det-language')?.value || 'English Only';
    const isBasicOrder = currentSelectedPackage.toLowerCase().includes('basic');
    const language = (isBasicOrder && rawLanguage.toLowerCase().includes('bilingual'))
      ? (document.documentElement.lang === 'es' ? 'Spanish Only' : 'English Only')
      : rawLanguage;
    const church = document.getElementById('det-church')?.value.trim() || 'N/A';
    const reception = receptionInput?.value.trim() || '';
    const milestones = document.getElementById('det-milestones')?.value.trim() || 'N/A';
    const song = document.getElementById('det-song')?.value.trim() || 'None';
    const notes = document.getElementById('det-notes')?.value.trim() || 'None';

    // Normalize Cloud Album Link (auto-prepend https:// if omitted)
    let rawCloudLink = document.getElementById('det-cloud-link')?.value.trim() || '';
    if (rawCloudLink && !/^https?:\/\//i.test(rawCloudLink) && !rawCloudLink.startsWith('//')) {
      rawCloudLink = 'https://' + rawCloudLink;
    }
    const cloudLink = rawCloudLink || 'None provided';

    // Set FormSubmit Email Subject
    const fsSubject = document.getElementById('fs-subject');
    if (fsSubject) {
      fsSubject.value = `NEW ORDER — ${currentSelectedPackage.toUpperCase()} — ${currentOrderRef} — ${clientName}`;
    }

    // Build structured text summary for receipt and clipboard
    currentOrderSummary = `══════════════════════════════════════\n` +
      `DISEÑOS LUNA — INVITATION ORDER\n` +
      `══════════════════════════════════════\n\n` +
      `• Order Reference: ${currentOrderRef}\n` +
      `• Selected Package: ${currentSelectedPackage}\n` +
      `• Package Price: ${currentPackagePrice}\n` +
      `• Payment Status: Pending arrangement with customer\n\n` +
      `• Client Name: ${clientName}\n` +
      `• Phone/WhatsApp: ${clientPhone}\n` +
      `• Email: ${clientEmail}\n` +
      `• Preferred Contact: ${preferredContact}\n` +
      `• Social Handle: ${socialHandle}\n` +
      `• Event Type: ${eventType}\n` +
      `• Celebrant(s): ${celebrantName}\n` +
      `• Event Date: ${eventDate}\n` +
      `• Theme & Colors: ${themeColors}\n` +
      `• Language Preference: ${language}\n` +
      `• Ceremony: ${church}\n` +
      `• Reception: ${reception}\n` +
      `• Schedule Milestones: ${milestones}\n` +
      `• Song Request: ${song}\n` +
      `• Cloud Album Link: ${cloudLink}\n` +
      `• Special Notes: ${notes}\n`;

    // Show loading state on submit button
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Submitting Order...</span>`;
      submitBtn.disabled = true;
    }

    const formData = new FormData(form);

    // FormSubmit AJAX endpoint requires /ajax/
    const ajaxEndpoint = form.action.includes('/ajax/') 
      ? form.action 
      : form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    fetch(ajaxEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(() => {
      activateStep3(clientName, celebrantName, currentSelectedPackage, currentOrderRef, cloudLink);
    }).catch(err => {
      console.warn('FormSubmit async notification:', err);
      // Still show Step 3 confirmation so customer is never blocked
      activateStep3(clientName, celebrantName, currentSelectedPackage, currentOrderRef, cloudLink);
    });
  });
}

/**
 * Activates Step 3 Confirmation View ("Order received!")
 */
function activateStep3(clientName, celebrantName, packageType, orderRef, cloudLink) {
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

  const confCloudRow = document.getElementById('conf-cloud-row');
  const confCloudLink = document.getElementById('conf-cloud-link');
  if (confCloudRow && confCloudLink) {
    if (cloudLink && cloudLink !== 'None provided') {
      confCloudRow.classList.remove('is-hidden');
      confCloudLink.innerHTML = `<a href="${cloudLink}" target="_blank" rel="noopener" style="color:#b83258; text-decoration:underline;">${cloudLink}</a>`;
    } else {
      confCloudRow.classList.add('is-hidden');
    }
  }

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
 * Photo dropzone upload previews with synced DataTransfer file removal
 */
function initPhotoUploads() {
  const setupDropzone = (dropzoneId, inputId, previewId, isMultiple = false) => {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!dropzone || !input || !preview) return;

    let dt = new DataTransfer();

    const renderPreviews = () => {
      preview.innerHTML = '';
      Array.from(dt.files).forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';

        const img = document.createElement('img');
        img.className = 'preview-img';
        img.alt = file.name || 'Uploaded photo';

        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'preview-remove';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          // Remove from DataTransfer and sync input.files
          const newDt = new DataTransfer();
          Array.from(dt.files).forEach((f, i) => {
            if (i !== index) newDt.items.add(f);
          });
          dt = newDt;
          input.files = dt.files;
          renderPreviews();
          checkTotalFileSize();
        });

        item.appendChild(img);
        item.appendChild(removeBtn);
        preview.appendChild(item);
      });
      checkTotalFileSize();
    };

    const addFiles = (fileList) => {
      if (!isMultiple) {
        dt = new DataTransfer();
      }
      Array.from(fileList).forEach(file => {
        const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|heic|heif|bmp|svg)$/i.test(file.name);
        if (!isImage) return;
        const isDuplicate = Array.from(dt.files).some(existing => 
          existing.name === file.name && existing.size === file.size
        );
        if (!isDuplicate) {
          dt.items.add(file);
        }
      });
      input.files = dt.files;
      renderPreviews();
    };

    input.addEventListener('change', (e) => {
      addFiles(e.target.files);
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
      if (e.dataTransfer && e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
      }
    });
  };

  setupDropzone('cover-dropzone', 'cover-photo-input', 'cover-preview', false);
  setupDropzone('court-dropzone', 'court-photo-input', 'court-preview', true);
  setupDropzone('gallery-dropzone', 'gallery-photo-input', 'gallery-preview', true);
}

/**
 * Step 3: Friendly Copy Order Details Button with visual feedback
 */
function initCopySummaryButton() {
  const btn = document.getElementById('btn-copy-order-summary');
  const textSpan = document.getElementById('copy-summary-text');
  if (!btn || !textSpan) return;

  btn.addEventListener('click', () => {
    if (!currentOrderSummary) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentOrderSummary).then(() => {
        textSpan.textContent = 'Order Details Copied! ✓';
        btn.classList.add('is-copied');
        setTimeout(() => {
          textSpan.textContent = 'Copy Order Details';
          btn.classList.remove('is-copied');
        }, 3000);
      }).catch(err => {
        console.warn('Clipboard write failed:', err);
      });
    }
  });
}

// Re-evaluate dynamic package rules when user toggles language
window.addEventListener('dl_language_changed', () => {
  if (typeof applyDynamicPackageRules === 'function' && currentSelectedPackage) {
    applyDynamicPackageRules(currentSelectedPackage);
  }
});
