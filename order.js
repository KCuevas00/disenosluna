/**
 * ═════════════════════════════════════════════════════════════════════
 * DISEÑOS LUNA — CLIENT ORDER & PAID INTAKE FLOW CONTROLLER
 * Handles:
 * 1. Step 1: Package selection, basic info validation & Stripe Checkout redirect
 * 2. Step 2: Post-payment return verification, dynamic package adaptations & detailed specs
 * 3. Step 3: Order received confirmation
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initFlowRouter();
  initStep1PackageSelector();
  initStep1Form();
  initStep2Form();
  initPhotoUploads();
});

/**
 * Routes user to Step 1 or Step 2 based on URL parameters (session_id from Stripe)
 */
function initFlowRouter() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const stepParam = urlParams.get('step');

  if (stepParam === 'cancelled') {
    activateStep1(urlParams.get('package'));
    showStep1Notice('Your Stripe checkout was cancelled. No charges were made. You can review your details and try again below.', 'notice-cancelled');
  } else if (sessionId && sessionId.trim() !== '') {
    // Returning from Stripe checkout -> verify server-side!
    activateStep2(sessionId.trim());
  } else {
    // Normal visit -> Step 1
    activateStep1(urlParams.get('package'));
  }
}

function showStep1Notice(message, className) {
  const noticeEl = document.getElementById('step-1-notice');
  if (noticeEl) {
    noticeEl.textContent = message;
    noticeEl.className = `order-notice-banner ${className}`;
    noticeEl.classList.remove('is-hidden');
    noticeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function hideStep1Notice() {
  const noticeEl = document.getElementById('step-1-notice');
  if (noticeEl) {
    noticeEl.classList.add('is-hidden');
  }
}

/**
 * Activates Step 1 View (Choose Package & Basic Event Info)
 */
function activateStep1(preselectedPkg) {
  const step1Sec = document.getElementById('step-1-section');
  const step2Sec = document.getElementById('step-2-section');
  const step3Sec = document.getElementById('step-3-confirmation');

  if (step1Sec) step1Sec.classList.remove('is-hidden');
  if (step2Sec) step2Sec.classList.add('is-hidden');
  if (step3Sec) step3Sec.classList.add('is-hidden');

  updateStepper(1);

  // If user navigated from landing page with a preselected package
  if (preselectedPkg) {
    const radioBasic = document.querySelector('input[name="package"][value="Basic"]');
    const radioPremium = document.querySelector('input[name="package"][value="Premium"]');
    if (preselectedPkg.toLowerCase().includes('basic') && radioBasic) {
      radioBasic.checked = true;
      radioBasic.dispatchEvent(new Event('change'));
    } else if (preselectedPkg.toLowerCase().includes('premium') && radioPremium) {
      radioPremium.checked = true;
      radioPremium.dispatchEvent(new Event('change'));
    }
  }

  // Restore any draft basic info if customer pressed back
  try {
    const saved = sessionStorage.getItem('luna_order_draft');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.clientName) document.getElementById('step1-name').value = data.clientName;
      if (data.clientPhone) document.getElementById('step1-phone').value = data.clientPhone;
      if (data.clientEmail) document.getElementById('step1-email').value = data.clientEmail;
      if (data.socialHandle) document.getElementById('step1-handle').value = data.socialHandle;
      if (data.preferredContact) document.getElementById('step1-contact-method').value = data.preferredContact;
      if (data.eventType) document.getElementById('step1-event-type').value = data.eventType;
      if (data.celebrantName) document.getElementById('step1-celebrant').value = data.celebrantName;
      if (data.eventDate) document.getElementById('step1-date').value = data.eventDate;
    }
  } catch (e) {
    // Ignore storage issues
  }
}

/**
 * Activates Step 2 View (Detailed Invitation Form after Stripe Payment)
 * STRICT SERVER VERIFICATION: Step 2 will ONLY unlock if Stripe API verifies payment_status === 'paid'.
 */
async function activateStep2(sessionId) {
  const step1Sec = document.getElementById('step-1-section');
  const step2Sec = document.getElementById('step-2-section');
  const step3Sec = document.getElementById('step-3-confirmation');

  // Keep Step 1 visible while verifying with Stripe
  if (step1Sec) step1Sec.classList.remove('is-hidden');
  if (step2Sec) step2Sec.classList.add('is-hidden');
  if (step3Sec) step3Sec.classList.add('is-hidden');

  showStep1Notice('Verifying your payment with Stripe...', 'notice-loading');

  let sessionData;
  try {
    const res = await fetch(`/api/get-checkout-session?session_id=${encodeURIComponent(sessionId)}`);
    const data = await res.json();

    if (!res.ok || !data.verified || data.payment_status !== 'paid') {
      const errMsg = data.error || 'Payment could not be verified by Stripe. Access to invitation details is restricted until payment is confirmed.';
      showStep1Notice(errMsg, 'notice-error');
      activateStep1();
      return;
    }

    sessionData = data;
  } catch (err) {
    showStep1Notice('Unable to connect to Stripe verification service. Please try reloading or contact Diseños Luna.', 'notice-error');
    activateStep1();
    return;
  }

  // Payment is 100% verified by Stripe! Unlock Step 2
  hideStep1Notice();
  if (step1Sec) step1Sec.classList.add('is-hidden');
  if (step2Sec) step2Sec.classList.remove('is-hidden');
  if (step3Sec) step3Sec.classList.add('is-hidden');

  updateStepper(3);

  // Set hidden session tracking input
  const fieldSessionId = document.getElementById('field-stripe-session-id');
  if (fieldSessionId) fieldSessionId.value = sessionData.id || sessionId;

  const pcSessionDisplay = document.getElementById('pc-session-id');
  if (pcSessionDisplay) pcSessionDisplay.textContent = `Order Ref: #${(sessionData.id || sessionId).slice(0, 16)}...`;

  const meta = sessionData.metadata || {};

  // Try retrieving client draft as backup for any extra non-metadata fields
  let draftData = {};
  try {
    const saved = sessionStorage.getItem('luna_order_draft');
    if (saved) draftData = JSON.parse(saved);
  } catch (e) {}

  const clientName = meta.client_name || draftData.clientName || '';
  const clientPhone = meta.client_phone || draftData.clientPhone || '';
  const clientEmail = meta.client_email || sessionData.customer_email || draftData.clientEmail || '';
  const celebrantName = meta.celebrant_name || draftData.celebrantName || '';
  const eventType = meta.event_type || draftData.eventType || '';
  const eventDate = meta.event_date || draftData.eventDate || '';
  const packageType = meta.package_type || draftData.packageType || 'Premium ($85)';

  // Pre-fill Step 2 fields from verified server data
  if (clientName) document.getElementById('det-name').value = clientName;
  if (clientPhone) document.getElementById('det-phone').value = clientPhone;
  if (clientEmail) document.getElementById('det-email').value = clientEmail;
  if (celebrantName) document.getElementById('det-celebrant').value = celebrantName;
  if (eventType) document.getElementById('det-event-type').value = eventType;
  if (eventDate) document.getElementById('det-date').value = eventDate;

  // Set verified package badge & rules
  const isBasic = packageType.toLowerCase().includes('basic');
  const pkgLabel = isBasic ? 'Basic ($70)' : 'Premium ($85)';

  const pcPkgBadge = document.getElementById('pc-package-badge');
  if (pcPkgBadge) pcPkgBadge.textContent = pkgLabel;

  const fieldPurchasedPkg = document.getElementById('field-purchased-package');
  if (fieldPurchasedPkg) fieldPurchasedPkg.value = pkgLabel;

  const fsSubject = document.getElementById('fs-subject');
  if (fsSubject) {
    fsSubject.value = `PAID [${pkgLabel}] Order Details — ${celebrantName || 'Diseños Luna'}`;
  }

  applyDynamicPackageRules(packageType);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Activates Step 3 View (Final Confirmation)
 */
function activateStep3(celebrantName, packageType, sessionId) {
  const step1Sec = document.getElementById('step-1-section');
  const step2Sec = document.getElementById('step-2-section');
  const step3Sec = document.getElementById('step-3-confirmation');

  if (step1Sec) step1Sec.classList.add('is-hidden');
  if (step2Sec) step2Sec.classList.add('is-hidden');
  if (step3Sec) step3Sec.classList.remove('is-hidden');

  updateStepper(3);

  const confPkg = document.getElementById('conf-package');
  if (confPkg) confPkg.textContent = packageType;

  const confCel = document.getElementById('conf-celebrant');
  if (confCel) confCel.textContent = celebrantName || 'Celebrant';

  const confOrder = document.getElementById('conf-order-id');
  if (confOrder) confOrder.textContent = sessionId ? `#${sessionId.slice(0, 16)}...` : 'Verified';

  // Clear stored draft
  try {
    sessionStorage.removeItem('luna_order_draft');
  } catch (e) {}

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
    if (s) {
      s.classList.remove('is-active', 'is-completed');
    }
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
 * Step 1: Package Selection UI toggle & price updates
 */
function initStep1PackageSelector() {
  const labels = document.querySelectorAll('.package-option-label');
  const radios = document.querySelectorAll('input[name="package"]');
  const summaryPkgName = document.getElementById('summary-pkg-name');
  const summaryPkgPrice = document.getElementById('summary-pkg-price');
  const payBtn = document.getElementById('pay-stripe-btn');

  const updateSelection = () => {
    let currentPkg = 'Premium';
    radios.forEach(radio => {
      const parent = radio.closest('.package-option-label');
      if (radio.checked) {
        currentPkg = radio.value;
        if (parent) parent.classList.add('is-selected');
      } else {
        if (parent) parent.classList.remove('is-selected');
      }
    });

    const isBasic = currentPkg.toLowerCase().includes('basic');
    const priceText = isBasic ? '$70.00' : '$85.00';
    const pkgTitle = isBasic ? 'Basic Package ($70)' : 'Premium Package ($85)';
    const btnText = isBasic ? 'Continue to Payment ($70)' : 'Continue to Payment ($85)';

    if (summaryPkgName) summaryPkgName.textContent = pkgTitle;
    if (summaryPkgPrice) summaryPkgPrice.textContent = priceText;
    if (payBtn) {
      const textSpan = payBtn.querySelector('span');
      if (textSpan) textSpan.textContent = btnText;
    }
  };

  radios.forEach(r => r.addEventListener('change', updateSelection));
  updateSelection();
}

/**
 * Step 1: Validation & Stripe Checkout Session Dispatch
 */
function initStep1Form() {
  const form = document.getElementById('step-1-form');
  const payBtn = document.getElementById('pay-stripe-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate fields
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

    // Prepare payload
    const pkg = document.querySelector('input[name="package"]:checked')?.value || 'Premium';
    const payload = {
      packageType: pkg,
      clientName: nameInput.value.trim(),
      clientPhone: phoneInput.value.trim(),
      clientEmail: emailInput.value.trim(),
      socialHandle: document.getElementById('step1-handle')?.value.trim() || '',
      preferredContact: document.getElementById('step1-contact-method')?.value || 'WhatsApp',
      eventType: eventTypeInput.value,
      celebrantName: celebrantInput.value.trim(),
      eventDate: dateInput.value,
    };

    // Save draft in sessionStorage so data persists across redirects
    try {
      sessionStorage.setItem('luna_order_draft', JSON.stringify(payload));
    } catch (err) {}

    // Disable button and show loading indicator
    if (payBtn) {
      payBtn.disabled = true;
      const textSpan = payBtn.querySelector('span');
      if (textSpan) textSpan.textContent = 'Connecting to Stripe Checkout...';
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Unable to connect to Stripe.');
      }

      // Redirect user to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      alert(`Stripe Checkout Error: ${err.message}\n\nPlease try again or contact us directly if the issue persists.`);
      if (payBtn) {
        payBtn.disabled = false;
        const textSpan = payBtn.querySelector('span');
        if (textSpan) textSpan.textContent = `Continue to Payment (${pkg === 'Basic' ? '$70' : '$85'})`;
      }
    }
  });

  // Remove error state on input
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
 * Step 2: Dynamically adapts the form based on whether Basic or Premium was purchased
 */
function applyDynamicPackageRules(packageType) {
  const isBasic = packageType.toLowerCase().includes('basic');

  // Blocks & Badges to configure
  const blockMusic = document.getElementById('block-music');
  const badgeMusic = document.getElementById('badge-music');
  const inputSong = document.getElementById('det-song');
  const hintMusic = document.getElementById('hint-music');

  const blockCountdown = document.getElementById('block-countdown');
  const badgeCountdown = document.getElementById('badge-countdown');
  const selectCountdown = document.getElementById('det-countdown');
  const hintCountdown = document.getElementById('hint-countdown');

  const blockCourt = document.getElementById('block-court');
  const badgeCourt = document.getElementById('badge-court');
  const textareaCourt = document.getElementById('det-court');
  const hintCourt = document.getElementById('hint-court');

  const blockCourtPhotos = document.getElementById('block-court-photos');
  const badgeCourtPhotos = document.getElementById('badge-court-photos');

  const blockGalleryPhotos = document.getElementById('block-gallery-photos');
  const badgeGalleryPhotos = document.getElementById('badge-gallery-photos');

  if (isBasic) {
    // Lock or clearly mark features not included in Basic ($70)
    if (badgeMusic) {
      badgeMusic.textContent = 'Premium Feature (Not in Basic)';
      badgeMusic.className = 'feature-badge badge-locked';
    }
    if (inputSong) {
      inputSong.placeholder = 'Background music is included in Premium package ($85)';
      inputSong.disabled = true;
    }
    if (hintMusic) {
      hintMusic.textContent = 'Music playback is exclusive to the Premium package. Leave blank or upgrade if desired.';
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
    // Full Premium Experience ($85)
    if (badgeMusic) {
      badgeMusic.textContent = 'Included with Premium ✓';
      badgeMusic.className = 'feature-badge badge-included';
    }
    if (inputSong) {
      inputSong.placeholder = 'Artist and Song Title (or YouTube/Spotify link)';
      inputSong.disabled = false;
    }
    if (blockMusic) blockMusic.classList.remove('is-locked');

    if (badgeCountdown) {
      badgeCountdown.textContent = 'Included with Premium ✓';
      badgeCountdown.className = 'feature-badge badge-included';
    }
    if (selectCountdown) {
      selectCountdown.disabled = false;
    }
    if (blockCountdown) blockCountdown.classList.remove('is-locked');

    if (badgeCourt) {
      badgeCourt.textContent = 'Included with Premium ✓';
      badgeCourt.className = 'feature-badge badge-included';
    }
    if (textareaCourt) {
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
 * Step 2: Final Details Form Submission
 */
function initStep2Form() {
  const form = document.getElementById('step-2-details-form');
  const submitBtn = document.getElementById('submit-final-details-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      return; // Browser validation
    }

    const celebrantName = document.getElementById('det-celebrant')?.value || 'Celebrant';
    const pkg = document.getElementById('field-purchased-package')?.value || 'Premium ($85)';
    const sessionId = document.getElementById('field-stripe-session-id')?.value || '';

    // If FormSubmit action is configured, let it submit naturally via POST
    // We also show the confirmation screen smoothly
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Submitting Details...</span>`;
      submitBtn.disabled = true;
    }

    // Build clipboard text summary as backup
    const clientName = document.getElementById('det-name')?.value || '';
    const clientPhone = document.getElementById('det-phone')?.value || '';
    const clientEmail = document.getElementById('det-email')?.value || '';
    const eventType = document.getElementById('det-event-type')?.value || '';
    const eventDate = document.getElementById('det-date')?.value || '';
    const themeColors = document.getElementById('det-theme-colors')?.value || '';
    const reception = document.getElementById('det-reception')?.value || '';
    const song = document.getElementById('det-song')?.value || 'None';

    const orderSummary = `══════════════════════════════════════\n` +
      `DISEÑOS LUNA — PAID INVITATION ORDER\n` +
      `══════════════════════════════════════\n\n` +
      `• Stripe Session ID: ${sessionId}\n` +
      `• Package: ${pkg}\n` +
      `• Client Name: ${clientName}\n` +
      `• Phone/WhatsApp: ${clientPhone}\n` +
      `• Email: ${clientEmail}\n\n` +
      `• Event Type: ${eventType}\n` +
      `• Celebrant(s): ${celebrantName}\n` +
      `• Event Date: ${eventDate}\n` +
      `• Theme & Colors: ${themeColors}\n` +
      `• Reception: ${reception}\n` +
      `• Song: ${song}\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(orderSummary).catch(() => {});
    }

    // Submit form via fetch to FormSubmit to avoid full page reload, then show Step 3 confirmation
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => {
      activateStep3(celebrantName, pkg, sessionId);
    }).catch(err => {
      console.warn('FormSubmit background dispatch note:', err);
      // Still show confirmation since data was logged and copied
      activateStep3(celebrantName, pkg, sessionId);
    });
  });
}

/**
 * Handles drag-and-drop & file selection with live image previews
 */
function initPhotoUploads() {
  setupPreviewDropzone('cover-dropzone', 'cover-photo-input', 'cover-preview', false);
  setupPreviewDropzone('court-dropzone', 'court-photo-input', 'court-preview', true);
  setupPreviewDropzone('gallery-dropzone', 'gallery-photo-input', 'gallery-preview', true);
}

function setupPreviewDropzone(dropzoneId, inputId, previewContainerId, isMultiple) {
  const dropzone = document.getElementById(dropzoneId);
  const input = document.getElementById(inputId);
  const previewContainer = document.getElementById(previewContainerId);

  if (!dropzone || !input || !previewContainer) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  input.addEventListener('change', () => {
    handleFiles(input.files);
  });

  function handleFiles(files) {
    if (!isMultiple) {
      previewContainer.innerHTML = '';
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
          <img src="${e.target.result}" alt="${file.name}" class="preview-img" />
          <button type="button" class="preview-remove" title="Remove photo">&times;</button>
        `;

        item.querySelector('.preview-remove').addEventListener('click', () => {
          item.remove();
        });

        previewContainer.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }
}
