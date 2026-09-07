/**
 * ═════════════════════════════════════════════════════════════════════
 * DISEÑOS LUNA — DIGITAL INVITATIONS CONTROLLER
 * Transparent Navbar on Scroll & Ambient Hero Falling Petals
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingButtons();
  initInquiryForm();
  initHeaderScroll();
  initStickyBarVisibility();
  initHeroPetals();
  initScrollFadeIn();
});

/**
 * Connects "Order [Package]" buttons in the pricing table directly to
 * the contact form, auto-selecting the chosen package.
 */
function initPricingButtons() {
  // Plan buttons now link directly to order.html?package=...
  // with pre-selected package query parameters.
}

/**
 * Handles the quick inquiry form by building a formatted order note,
 * copying it to the client's clipboard, and opening social DMs.
 */
function initInquiryForm() {
  const form = document.getElementById('order-inquiry-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim() || '';
    const contact = document.getElementById('client-contact')?.value.trim() || '';
    const eventType = document.getElementById('event-type')?.value || '';
    const eventDate = document.getElementById('event-date')?.value || 'Not set yet';
    const packageChosen = document.getElementById('package-select')?.value || '';
    const notes = document.getElementById('event-notes')?.value.trim() || 'None';

    if (!name) {
      document.getElementById('client-name')?.focus();
      return;
    }
    if (!contact) {
      document.getElementById('client-contact')?.focus();
      return;
    }
    if (!eventType) {
      document.getElementById('event-type')?.focus();
      return;
    }

    const message = `Hello Diseños Luna! I want to order a digital invitation.\n\n` +
      `• Name: ${name}\n` +
      `• Contact: ${contact}\n` +
      `• Event: ${eventType}\n` +
      `• Date: ${eventDate}\n` +
      `• Package: ${packageChosen}\n` +
      `• Notes: ${notes}`;

    // Copy formatted text to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    // Show feedback box
    if (feedback) {
      feedback.removeAttribute('hidden');
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/**
 * Transparent Navbar Controller:
 * Header is completely transparent at the top, and smoothly gains
 * solid background and border once scrolled past 30px.
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Run on initial load
}

/**
 * Hides bottom sticky bar when user reaches the contact box so
 * it does not cover form buttons on small screens.
 */
function initStickyBarVisibility() {
  const stickyBar = document.getElementById('sticky-mobile-bar');
  const contactSection = document.getElementById('contact');

  if (!stickyBar || !contactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyBar.style.transform = 'translateY(100%)';
        stickyBar.style.transition = 'transform 0.25s ease';
      } else {
        stickyBar.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  observer.observe(contactSection);
}

/**
 * Falling Rose & Celebration Petals Engine for the Hero Section
 * Gentle, dreamy, romantic ambient falling petals.
 */
function initHeroPetals() {
  const canvas = document.getElementById('hero-petals-canvas');
  const heroSection = document.querySelector('.hero-section');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = heroSection.offsetWidth);
  let height = (canvas.height = heroSection.offsetHeight);

  const resize = () => {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  };

  window.addEventListener('resize', resize);

  const colors = [
    'rgba(255, 255, 255, 0.90)', // crisp bridal white petal
    'rgba(247, 168, 190, 0.82)', // vibrant light pink petal
    'rgba(255, 190, 210, 0.75)', // delicate blush rose
    'rgba(254, 246, 248, 0.85)', // soft cream blossom
    'rgba(255, 220, 232, 0.70)'  // romantic pink flare
  ];

  const particles = [];
  const count = window.innerWidth < 600 ? 22 : 38;

  function createPetal(initialY = null) {
    return {
      x: Math.random() * width,
      y: initialY !== null ? initialY : Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.1 + 0.6,
      speedX: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      flipSpeed: Math.random() * 0.025 + 0.01,
      flip: Math.random() * Math.PI
    };
  }

  for (let i = 0; i < count; i++) {
    particles.push(createPetal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += p.speedY;
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * 0.6 + p.speedX;
      p.rotation += p.rotSpeed;
      p.flip += p.flipSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, Math.cos(p.flip));

      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Organic petal shape
      ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.85, 0, 0, Math.PI * 2);
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(215, 165, 180, 0.2)';
      ctx.fill();

      ctx.restore();

      // Wrap around when reaching bottom of hero
      if (p.y > height + 20) {
        particles[i] = createPetal(-15);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Scroll-triggered fade-in animation controller.
 * Observes all elements with .scroll-fade-in and activates .is-visible
 * when scrolled into the viewport with smooth stagger timing.
 */
function initScrollFadeIn() {
  const fadeElements = document.querySelectorAll('.scroll-fade-in');
  if (!fadeElements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Reveal once and keep visible
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));
}

