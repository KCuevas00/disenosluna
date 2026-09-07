/**
 * ═════════════════════════════════════════════════════════════════════
 * DISEÑOS LUNA — BILINGUAL TRANSLATION ENGINE (EN / ES)
 * Provides seamless English <-> Spanish toggling across Landing & Order pages.
 * Persists selection in localStorage and updates all [data-i18n] nodes.
 * ═════════════════════════════════════════════════════════════════════
 */

(function () {
  const STORAGE_KEY = 'disenos_luna_lang';

  const translations = {
    en: {
      // Top Bar & Nav
      top_tagline: 'Digital invitations for your special day',
      nav_packages: 'Packages',
      nav_examples: 'Examples',
      nav_how_it_works: 'How It Works',
      nav_order_contact: 'Order / Contact',
      nav_faq: 'FAQ',
      nav_order_now: 'Order Now',
      nav_order_form: 'Order Form',

      // Hero Section
      hero_title: 'Digital invitations for your special day.',
      hero_subhead: 'Weddings, quinceañeras, birthdays & more.',
      hero_starting_at: 'Starting at',
      hero_btn_examples: 'View Live Examples',
      hero_btn_pricing: 'See Packages & Pricing',
      hero_bullet_1: 'No apps needed — opens in any phone browser',
      hero_bullet_2: 'Easy to share via text, WhatsApp & social media',

      // Pricing Section
      pricing_eyebrow: 'SIMPLE TRANSPARENT PRICING',
      pricing_title: 'Choose your invitation package.',
      pricing_desc: 'One flat fee. No subscriptions. Your website stays online through your event date.',
      pkg_basic_title: 'Basic',
      pkg_basic_desc: 'A complete digital invitation with everything your guests need.',
      pkg_basic_f1: 'Custom invitation website',
      pkg_basic_f2: 'Interactive 3D opening envelope',
      pkg_basic_f3: 'Custom wax seal / monogram',
      pkg_basic_f4: 'Photo centerpiece (celebrant or couple)',
      pkg_basic_f5: 'Event schedule & timeline',
      pkg_basic_f6: 'One-tap Google & Apple Maps',
      pkg_basic_f7: 'Online RSVP form for guests',
      pkg_basic_f8: 'Custom event colors',
      pkg_basic_f9: 'Text / WhatsApp link preview card',
      pkg_basic_btn: 'Order Basic ($55)',

      pkg_popular_tag: 'RECOMMENDED',
      pkg_premium_title: 'Premium',
      pkg_premium_desc: 'The full interactive experience.',
      pkg_premium_f0: 'Everything in Basic, plus:',
      pkg_premium_f1: 'Background music — song of choice',
      pkg_premium_f2: 'Live event countdown',
      pkg_premium_f3: 'Falling celebration petals / particles',
      pkg_premium_f4: 'Court of honor / party members section',
      pkg_premium_f5: 'Additional photo sections',
      pkg_premium_f6: 'More design customization',
      pkg_premium_btn: 'Order Premium ($70)',
      pricing_note_html: 'Bilingual support (EN/ES) included with Premium ($70). Custom requests? <a href="https://www.instagram.com/disenosluna815/" target="_blank" rel="noopener">Contact us on Instagram</a>.',

      // Examples Section
      examples_eyebrow: 'PORTFOLIO SAMPLES',
      examples_title: 'See real live examples.',
      examples_desc: 'Tap any example below to open and test the actual invitation website. Tap the wax seal to open the envelope and experience the music and animations.',
      ex1_tag: 'Mint Green & Silver',
      ex1_tier: 'Basic — $55',
      ex1_name: 'Mint & Silver Signature',
      ex1_meta: 'Quinceañera • Chicago, IL',
      ex1_btn: 'Open Live Demo ↗',
      ex2_tag: 'Blush Pink & Gold',
      ex2_tier: 'Premium — $70',
      ex2_name: 'Blush & Gold Signature',
      ex2_meta: 'Quinceañera & Sweet 16',
      ex2_btn: 'Open Live Demo ↗',

      // How It Works
      steps_eyebrow: 'SIMPLE PROCESS',
      steps_title: 'How it works.',
      steps_desc: 'From your message to your guests opening their invitation in 3 simple steps.',
      step1_h: 'Send your details',
      step1_p: 'Message us or submit our form with your event type, date, venue addresses, colors, photo, and song choice.',
      step2_h: 'We build your invitation',
      step2_p: 'We build your custom website and send you a private preview link to test the envelope and music.',
      step3_h: 'Share your link',
      step3_p: 'Once approved, send your personalized link to family and friends via text message, WhatsApp, or Instagram DMs.',

      // Order / Contact Section
      contact_eyebrow: 'GET STARTED',
      contact_title: 'Ready to create your invitation?',
      contact_desc: 'Choose the easiest option for you — submit via our intake form or message us directly.',
      opt1_badge: 'Option 1',
      opt1_title: 'Complete Online Order & Intake Form',
      opt1_sub: 'Fill out your celebration details, timeline, venues, and upload your cover photo directly.',
      opt1_btn: 'Open Online Order Form ↗',
      opt2_badge: 'Option 2',
      opt2_title: 'Or Just DM Me!',
      opt2_sub: 'Prefer to message directly? Send me a DM with all of the following:',
      opt2_summary: 'View list of what is required',
      req_item_1_html: '<strong>Event Type &amp; Date</strong> (Quinceañera, Wedding, Birthday, etc.)',
      req_item_2_html: '<strong>Celebrant or Couple Name(s)</strong>',
      req_item_3_html: '<strong>Venue Address(es) &amp; Timeline</strong> (Ceremony &amp; reception times)',
      req_item_4_html: '<strong>Theme Colors &amp; Package</strong> (Basic $55 or Premium $70)',
      req_item_5_html: '<strong>Song Choice &amp; Photo(s)</strong> (Cover photo &amp; background music link)',
      dm_ig_label: 'Message on Instagram (@disenosluna815)',
      dm_tt_label: 'Message on TikTok (@disenosluna)',
      dm_fb_label: 'Message on Facebook',

      // FAQ Section
      faq_eyebrow: 'COMMON QUESTIONS',
      faq_title: 'Frequently Asked Questions',
      faq_q1: 'How do my guests open the invitation?',
      faq_a1: 'You send your guests a direct web link (via text message, WhatsApp, or social media). They tap the link and it opens instantly in Safari, Chrome, or any mobile browser. They do not need to download an app or create an account.',
      faq_q2: 'How does the background music work?',
      faq_a2: 'You tell us what song you want (artist and title) or send us the audio file. We set it up so that when your guests tap to open the virtual envelope, the song begins playing seamlessly. Guests can pause or adjust the volume at any time with the on-screen button.',
      faq_q3: 'Can the invitation be in both English and Spanish?',
      faq_a3: 'Yes! Full bilingual toggle (English and Spanish) is included with the Premium package ($70). Your guests can switch between languages with a single tap on the screen.',
      faq_q4: 'How long does my invitation website stay active?',
      faq_a4: 'Your invitation website stays online and accessible throughout your event and for several weeks after your celebration.',
      faq_q5: 'How do I pay?',
      faq_a5: 'We accept Zelle, Cash App, Venmo, and card payments. You only finalize payment when we begin building your invitation.',

      // Footer
      footer_tagline: 'Custom digital event invitations for weddings, quinceañeras, birthdays & celebrations.',
      footer_rights: '© 2026 Diseños Luna. All rights reserved.',

      // Chat Bubble Menu (Landing Page)
      chat_header: 'Get in Touch',
      chat_ig: 'DM on Instagram',
      chat_fb: 'DM on Facebook',
      chat_sms: 'Text Us',
      chat_sms_sub: '(815) 242-7556',
      chat_close: 'Close Menu',
      chat_dismiss: 'Dismiss',

      // ── ORDER FORM STRINGS ──
      step_ind_1: 'Package & Basics',
      step_ind_2: 'Invitation Details',
      step_ind_3: 'Submit Order',
      order_hero_eyebrow: 'ONLINE INVITATION ORDER FORM',
      order_hero_title: 'Let’s create your digital invitation.',
      order_hero_sub: 'Fill out the details below. We will reach out via WhatsApp or email with your private preview link before finalizing payment.',

      step1_card1_title: 'Select Your Package',
      step1_card1_sub: 'One flat fee. No subscriptions or hidden costs.',
      step1_card2_title: 'Your Contact Information',
      step1_card2_sub: 'Where we will contact you regarding payment and send your private invitation preview link.',
      lbl_client_name: 'Your Full Name',
      lbl_client_phone: 'Phone / WhatsApp Number',
      lbl_client_email: 'Email Address',
      lbl_social_handle: 'Instagram or TikTok (Optional)',
      lbl_pref_contact: 'Preferred Contact Method',

      step1_card3_title: 'Basic Event Details',
      step1_card3_sub: 'Let us know who we are celebrating and the date of your celebration.',
      lbl_event_type: 'Celebration Type',
      lbl_celebrant_name: 'Celebrant or Couple Name(s)',
      lbl_event_date: 'Event Date',
      btn_continue_step2: 'Continue to Step 2: Event Details →',

      step2_back_btn: '← Edit Package / Basics',
      step2_badge_prefix: 'Selected Package:',
      step2_card1_title: 'Theme, Colors & Language',
      step2_card1_sub: 'We will match the invitation palette to your celebration colors.',
      lbl_theme_colors: 'Theme & Colors',
      lbl_theme_hint: 'Include main color, accent metal (gold, silver, rose gold), and floral vibe.',
      lbl_invitation_language: 'Invitation Language',
      hint_lang_basic: 'Basic ($55) includes single language (English or Spanish). Bilingual is included in Premium ($70).',
      hint_lang_premium: 'Includes full bilingual English & Spanish translation in your invitation.',

      step2_card2_title: 'Venues, Addresses & Schedule',
      step2_card2_sub: 'We configure 1-tap Google & Apple Maps directions for your guests.',
      lbl_church: 'Ceremony / Church Information (Optional)',
      lbl_reception: 'Reception / Banquet Hall Information',
      lbl_milestones: 'Event Timeline & Schedule Milestones',

      step2_card3_title: 'Dedication & Special Details',
      step2_card3_sub: 'Optional personal messages, dress code, and gift registry details for your guests.',
      lbl_dedication: 'Special Dedication Message (Optional)',
      lbl_dress_code: 'Dress Code & Attire (Optional)',
      lbl_registry: 'Gift Registry Link or Note (Optional)',

      step2_card4_title: 'Music, Countdown & Interactive Features',
      step2_card4_sub: 'Custom soundtrack and celebration countdown for your guests.',
      lbl_music: 'Background Song Choice',
      lbl_countdown: 'Live Event Countdown Clock',
      lbl_court: 'Court of Honor / Party Members (Optional)',

      step2_card5_title: 'Photos & Media Upload',
      step2_card5_sub: 'Upload your photos directly or paste a Google Photos / iCloud / Dropbox link.',
      lbl_cloud_link: 'Google Drive / Google Photos / iCloud Link (Recommended)',
      lbl_cover_photo: 'Main Cover Photo (Included in Basic & Premium)',
      lbl_court_photos: 'Court of Honor Photos (Premium)',
      lbl_gallery_photos: 'Celebrant Photo Gallery (Premium)',
      lbl_notes: 'Special Requests & Additional Notes (Optional)',

      btn_submit_order: 'Review & Submit Invitation Order',

      step3_title: 'Order Received!',
      step3_sub: 'Thank you for choosing Diseños Luna. We are excited to design your digital invitation.',
      order_ref_label: 'Your Order Reference:',
      next_steps_title: 'What happens next:',
      next_step_1: 'We will review your event details, venues, and photos.',
      next_step_2: 'We will contact you within 24 hours to confirm your design and details.',
      next_step_3: 'We will send you a private preview link to test your envelope, music, and maps.',
      btn_back_home: 'Back to Home'
    },

    es: {
      // Top Bar & Nav
      top_tagline: 'Invitaciones digitales para tu día especial',
      nav_packages: 'Paquetes',
      nav_examples: 'Ejemplos',
      nav_how_it_works: 'Cómo Funciona',
      nav_order_contact: 'Pedir / Contacto',
      nav_faq: 'Preguntas',
      nav_order_now: 'Ordenar Ahora',
      nav_order_form: 'Formulario',

      // Hero Section
      hero_title: 'Invitaciones digitales para tu día especial.',
      hero_subhead: 'Bodas, quinceañeras, cumpleaños y más.',
      hero_starting_at: 'Desde',
      hero_btn_examples: 'Ver Ejemplos en Vivo',
      hero_btn_pricing: 'Ver Paquetes y Precios',
      hero_bullet_1: 'Sin descargar aplicaciones — abre en cualquier celular',
      hero_bullet_2: 'Fácil de compartir por WhatsApp, mensajes y redes',

      // Pricing Section
      pricing_eyebrow: 'PRECIOS CLAROS Y TRANSPARENTES',
      pricing_title: 'Elige tu paquete de invitación.',
      pricing_desc: 'Un solo pago. Sin suscripciones. Tu página web permanece activa hasta después de tu evento.',
      pkg_basic_title: 'Básico',
      pkg_basic_desc: 'Una invitación digital completa con todo lo necesario para tus invitados.',
      pkg_basic_f1: 'Página web de invitación personalizada',
      pkg_basic_f2: 'Sobre 3D interactivo con apertura real',
      pkg_basic_f3: 'Sello de cera personalizado / monograma',
      pkg_basic_f4: 'Foto principal (quinceañera o festejados)',
      pkg_basic_f5: 'Itinerario y programa del evento',
      pkg_basic_f6: 'Dirección con 1 toque en Google y Apple Maps',
      pkg_basic_f7: 'Formulario de confirmación (RSVP) en línea',
      pkg_basic_f8: 'Colores personalizados de tu fiesta',
      pkg_basic_f9: 'Tarjeta de vista previa para WhatsApp y mensajes',
      pkg_basic_btn: 'Pedir Básico ($55)',

      pkg_popular_tag: 'RECOMENDADO',
      pkg_premium_title: 'Premium',
      pkg_premium_desc: 'La experiencia interactiva completa.',
      pkg_premium_f0: 'Todo lo del paquete Básico, más:',
      pkg_premium_f1: 'Música de fondo — la canción que tú elijas',
      pkg_premium_f2: 'Reloj de cuenta regresiva en vivo',
      pkg_premium_f3: 'Efecto de pétalos o partículas flotantes',
      pkg_premium_f4: 'Sección para corte de honor o damas y chambelanes',
      pkg_premium_f5: 'Galería de fotos adicionales',
      pkg_premium_f6: 'Mayor personalización de diseño',
      pkg_premium_btn: 'Pedir Premium ($70)',
      pricing_note_html: 'Opción bilingüe (Inglés y Español) incluida en Premium ($70). ¿Preguntas? <a href="https://www.instagram.com/disenosluna815/" target="_blank" rel="noopener">Escríbenos por Instagram</a>.',

      // Examples Section
      examples_eyebrow: 'MUESTRAS DE TRABAJO',
      examples_title: 'Mira ejemplos reales en vivo.',
      examples_desc: 'Toca cualquier ejemplo abajo para abrir y probar la invitación real. Presiona el sello de cera para abrir el sobre y disfrutar de la música y animaciones.',
      ex1_tag: 'Verde Menta y Plata',
      ex1_tier: 'Básico — $55',
      ex1_name: 'Verde Menta y Plata Signature',
      ex1_meta: 'Quinceañera • Chicago, IL',
      ex1_btn: 'Ver Demo en Vivo ↗',
      ex2_tag: 'Rosa Palo y Dorado',
      ex2_tier: 'Premium — $70',
      ex2_name: 'Rosa Palo y Oro Signature',
      ex2_meta: 'Quinceañera y Sweet 16',
      ex2_btn: 'Ver Demo en Vivo ↗',

      // How It Works
      steps_eyebrow: 'PROCESO SENCILLO',
      steps_title: 'Cómo funciona.',
      steps_desc: 'Desde tu pedido hasta que tus invitados reciban su invitación en 3 sencillos pasos.',
      step1_h: 'Envía tus datos',
      step1_p: 'Llena nuestro formulario o mándanos mensaje con tu tipo de evento, fecha, salones, colores, foto y música.',
      step2_h: 'Diseñamos tu invitación',
      step2_p: 'Creamos tu página web personalizada y te mandamos un enlace privado para que revises el sobre y la música.',
      step3_h: 'Comparte tu enlace',
      step3_p: 'Una vez aprobada, comparte tu enlace con familiares y amigos por WhatsApp, mensaje de texto o redes sociales.',

      // Order / Contact Section
      contact_eyebrow: 'COMENZAR',
      contact_title: '¿Lista para crear tu invitación?',
      contact_desc: 'Elige la opción más fácil para ti — completa el formulario en línea o mándanos mensaje directo.',
      opt1_badge: 'Opción 1',
      opt1_title: 'Llenar Formulario de Pedido en Línea',
      opt1_sub: 'Ingresa los datos de tu fiesta, horarios, salones y sube tu foto directamente.',
      opt1_btn: 'Abrir Formulario de Pedido ↗',
      opt2_badge: 'Opción 2',
      opt2_title: '¡O Mándame un Mensaje Directo!',
      opt2_sub: '¿Prefieres mensaje directo? Escríbeme con lo siguiente:',
      opt2_summary: 'Ver lista de datos requeridos',
      req_item_1_html: '<strong>Tipo de Evento y Fecha</strong> (Quinceañera, Boda, Cumpleaños, etc.)',
      req_item_2_html: '<strong>Nombre(s) de la Quinceañera o Festejados</strong>',
      req_item_3_html: '<strong>Dirección(es) de Iglesia y Salón</strong> (Horarios de misa y fiesta)',
      req_item_4_html: '<strong>Colores del Tema y Paquete</strong> (Básico $55 o Premium $70)',
      req_item_5_html: '<strong>Canción y Foto(s)</strong> (Foto de portada y enlace de música)',
      dm_ig_label: 'Mensaje por Instagram (@disenosluna815)',
      dm_tt_label: 'Mensaje por TikTok (@disenosluna)',
      dm_fb_label: 'Mensaje por Facebook',

      // FAQ Section
      faq_eyebrow: 'PREGUNTAS FRECUENTES',
      faq_title: 'Preguntas Frecuentes',
      faq_q1: '¿Cómo abren la invitación mis invitados?',
      faq_a1: 'Les envías un enlace directo (por WhatsApp, mensaje de texto o redes sociales). Al tocar el enlace se abre al instante en Safari, Chrome o cualquier navegador. No necesitan descargar aplicaciones ni crear cuentas.',
      faq_q2: '¿Cómo funciona la música de fondo?',
      faq_a2: 'Nos indicas la canción que deseas (artista y título) o nos mandas el archivo. La configuramos para que al tocar el sobre virtual, la música comience a sonar automáticamente. Tus invitados pueden pausar o controlar el volumen cuando quieran.',
      faq_q3: '¿La invitación puede ser en Inglés y Español?',
      faq_a3: '¡Sí! La opción bilingüe completa (Inglés y Español) está incluida con el paquete Premium ($70). Tus invitados pueden alternar entre ambos idiomas con un solo toque en la pantalla.',
      faq_q4: '¿Cuánto tiempo permanece activa mi página de invitación?',
      faq_a4: 'Tu página de invitación se mantiene activa en línea durante todo tu evento y varias semanas después de tu fiesta.',
      faq_q5: '¿Cuáles son las formas de pago?',
      faq_a5: 'Aceptamos Zelle, Cash App, Venmo y tarjetas. Realizas el pago al comenzar la creación de tu invitación.',

      // Footer
      footer_tagline: 'Invitaciones digitales personalizadas para bodas, quinceañeras, cumpleaños y celebraciones especiales.',
      footer_rights: '© 2026 Diseños Luna. Todos los derechos reservados.',

      // Chat Bubble Menu (Landing Page)
      chat_header: 'Platica con Nosotros',
      chat_ig: 'DM por Instagram',
      chat_fb: 'DM por Facebook',
      chat_sms: 'Mándanos un Texto',
      chat_sms_sub: '(815) 242-7556',
      chat_close: 'Cerrar Menú',
      chat_dismiss: 'Ocultar',

      // ── ORDER FORM STRINGS ──
      step_ind_1: 'Paquete y Datos',
      step_ind_2: 'Detalles del Evento',
      step_ind_3: 'Enviar Pedido',
      order_hero_eyebrow: 'FORMULARIO DE PEDIDO EN LÍNEA',
      order_hero_title: 'Creemos tu invitación digital.',
      order_hero_sub: 'Completa los datos a continuación. Nos comunicaremos contigo por WhatsApp o correo con tu vista previa privada antes de finalizar el pago.',

      step1_card1_title: 'Selecciona tu Paquete',
      step1_card1_sub: 'Un solo pago fijo. Sin suscripciones ni costos ocultos.',
      step1_card2_title: 'Tus Datos de Contacto',
      step1_card2_sub: 'Donde nos comunicaremos contigo para coordinar detalles y enviarte tu enlace de vista previa.',
      lbl_client_name: 'Tu Nombre Completo',
      lbl_client_phone: 'Teléfono / WhatsApp',
      lbl_client_email: 'Correo Electrónico',
      lbl_social_handle: 'Instagram o TikTok (Opcional)',
      lbl_pref_contact: 'Método de Contacto Preferido',

      step1_card3_title: 'Datos Básicos del Evento',
      step1_card3_sub: 'Cuéntanos a quién celebramos y la fecha de tu gran día.',
      lbl_event_type: 'Tipo de Celebración',
      lbl_celebrant_name: 'Nombre(s) del Festejado(a) o Pareja',
      lbl_event_date: 'Fecha del Evento',
      btn_continue_step2: 'Continuar al Paso 2: Detalles del Evento →',

      step2_back_btn: '← Modificar Paquete / Datos',
      step2_badge_prefix: 'Paquete Seleccionado:',
      step2_card1_title: 'Tema, Colores e Idioma',
      step2_card1_sub: 'Adaptaremos la paleta de colores de la invitación a tu fiesta.',
      lbl_theme_colors: 'Tema y Colores',
      lbl_theme_hint: 'Indica color principal, acento metálico (dorado, plata, oro rosa) y estilo floral.',
      lbl_invitation_language: 'Idioma de la Invitación',
      hint_lang_basic: 'El paquete Básico ($55) incluye un idioma (Inglés o Español). Bilingüe incluido en Premium ($70).',
      hint_lang_premium: 'Incluye traducción bilingüe completa (Inglés y Español) en tu invitación.',

      step2_card2_title: 'Salones, Direcciones y Horarios',
      step2_card2_sub: 'Configuramos navegación con 1 toque en Google y Apple Maps para tus invitados.',
      lbl_church: 'Datos de la Ceremonia / Iglesia (Opcional)',
      lbl_reception: 'Datos del Salón de Recepción / Banquete',
      lbl_milestones: 'Itinerario y Horarios del Evento',

      step2_card3_title: 'Dedicatoria y Detalles Especiales',
      step2_card3_sub: 'Mensajes personales, código de vestimenta e información de mesa de regalos.',
      lbl_dedication: 'Mensaje Especial de Dedicatoria (Opcional)',
      lbl_dress_code: 'Código de Vestimenta (Opcional)',
      lbl_registry: 'Mesa de Regalos o Nota (Opcional)',

      step2_card4_title: 'Música, Cuenta Regresiva y Animaciones',
      step2_card4_sub: 'Música personalizada y reloj de cuenta regresiva para tus invitados.',
      lbl_music: 'Canción de Fondo',
      lbl_countdown: 'Reloj de Cuenta Regresiva en Vivo',
      lbl_court: 'Corte de Honor / Damas y Chambelanes (Opcional)',

      step2_card5_title: 'Subir Fotos e Imágenes',
      step2_card5_sub: 'Sube tus fotos directamente o pega un enlace de Google Photos / iCloud / Drive.',
      lbl_cloud_link: 'Enlace de Google Drive / Google Photos / iCloud (Recomendado)',
      lbl_cover_photo: 'Foto Principal de Portada (Incluida en Básico y Premium)',
      lbl_court_photos: 'Fotos de Corte de Honor (Premium)',
      lbl_gallery_photos: 'Galería de Fotos de la Quinceañera (Premium)',
      lbl_notes: 'Peticiones Especiales o Notas Adicionales (Opcional)',

      btn_submit_order: 'Revisar y Enviar Pedido de Invitación',

      step3_title: '¡Pedido Recibido!',
      step3_sub: 'Gracias por elegir a Diseños Luna. Estamos emocionados de diseñar tu invitación digital.',
      order_ref_label: 'Referencia de tu Pedido:',
      next_steps_title: 'Lo que sucederá a continuación:',
      next_step_1: 'Revisaremos los detalles de tu evento, salones y fotos.',
      next_step_2: 'Te contactaremos dentro de 24 horas para confirmar el diseño y detalles.',
      next_step_3: 'Te mandaremos un enlace privado de prueba para que verifiques el sobre, música y mapas.',
      btn_back_home: 'Volver al Inicio'
    }
  };

  let currentLang = 'en';

  /**
   * Applies translations to all [data-i18n] nodes in the document
   */
  function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const dict = translations[lang] || translations.en;

    // Translate standard text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate HTML content nodes (nodes with markup like bold or links)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update Language Pill button states
    const btnEn = document.getElementById('lang-btn-en');
    const btnEs = document.getElementById('lang-btn-es');
    if (btnEn && btnEs) {
      if (lang === 'es') {
        btnEn.classList.remove('active');
        btnEs.classList.add('active');
      } else {
        btnEn.classList.add('active');
        btnEs.classList.remove('active');
      }
    }

    // Dispatch global event for other scripts to hook into
    window.dispatchEvent(new CustomEvent('dl_language_changed', { detail: { lang } }));
  }

  /**
   * Set and save active language
   */
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'en';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    applyTranslations(lang);
  }

  /**
   * Initialize floating pill event handlers and initial language
   */
  function initLanguageSwitcher() {
    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (e) {}

    const btnEn = document.getElementById('lang-btn-en');
    const btnEs = document.getElementById('lang-btn-es');
    const pill = document.getElementById('floating-lang-pill');

    if (btnEn) {
      btnEn.addEventListener('click', (e) => {
        e.stopPropagation();
        setLanguage('en');
      });
    }

    if (btnEs) {
      btnEs.addEventListener('click', (e) => {
        e.stopPropagation();
        setLanguage('es');
      });
    }

    if (pill) {
      pill.addEventListener('click', () => {
        // Toggle if user clicks between or on the pill container
        const nextLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(nextLang);
      });
    }

    // Apply saved or default language
    applyTranslations(savedLang);
  }

  // Export API to global window
  window.DlTranslations = {
    setLanguage,
    getLanguage: () => currentLang,
    getTranslation: (key) => (translations[currentLang] && translations[currentLang][key]) || (translations.en && translations.en[key]) || ''
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }
})();
