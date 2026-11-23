---
name: table-card-qr
description: >-
  Generates elegant, print-ready QR code table cards and signage for Quinceañeras, Weddings,
  and special events. Automatically inherits celebrant typography (Alex Brush, Playfair Display,
  Cormorant Garamond, Montserrat), theme colors, floral corner sprays, and bilingual EN/ES copy
  from the event's invitation website. Formats for standard 4x6 and 5x7 table frames with 1-click
  browser print and PDF export.
---

# QR Table Card Generator Skill (`table-card-qr`)

This skill defines the standard procedure for creating bespoke, print-ready QR code table cards (standing table tent signs) for clients in the Diseños Luna repository.

---

## 1. Purpose & Business Context

Once a client's digital invitation is complete, table cards are the primary physical day-of add-on ($20–$30 upsell). Guests scan the QR code placed on venue dining tables to upload and view photos/videos in a shared cloud album (Google Photos, Dropbox, or event gallery) with zero app download friction.

---

## 2. Standard Specifications

| Property | Value |
| :--- | :--- |
| **Output File** | `table-card.html` inside the client folder (e.g. `alexadeharo/table-card.html`) |
| **Live Web URL** | `https://disenosluna.com/{client}/table-card.html` |
| **Card Dimensions** | 400px x 590px (exact 4" x 6" proportion at standard display DPI; scales cleanly to 5" x 7") |
| **Print Output** | Native `@media print` CSS formatted for 1-click `Ctrl + P` to save as clean PDF or print |
| **Target Framing** | Standard acrylic vertical 4x6 or 5x7 table frames, or thick cardstock stands |

---

## 3. Aesthetic Inheritance Rules

The table card must look like an authentic physical extension of the digital invitation:

1. **Celebrant Name Formatting**:
   - Check the client's `README.md` or `index.html` for exact spelling.
   - Use the family's preferred surname formatting (e.g., compound surnames like `Deharo` together).
   - Do NOT include formal subtext or full middle names unless explicitly requested. Keep the name large, prominent, and romantic.
2. **Typography**:
   - **Celebrant Name**: Use the primary script font from `style.css` (typically `--font-script: 'Alex Brush', cursive` at 52–56px).
   - **Event Title & Headers**: Use `--font-editorial-num` or `--font-serif` (`'Cormorant Garamond'`, `'Playfair Display'`).
   - **Headings & Body**: Use `'Playfair Display'` for English headline, `'Cormorant Garamond'` italic for Spanish subtitle, and `'Montserrat'` for body and callouts.
3. **Color Palette**:
   - Background: Pure crisp white (`#ffffff`) or ivory parchment.
   - Primary Text: Deep theme dark color (e.g. `--text-dark` or deep charcoal `#072a35`).
   - Accents / Border: Liquid gold (`#d4af37` / `#c99f57`) or theme metallic accent.
4. **Floral Spray Framing**:
   - Reuse the exact watercolor corner spray from the client's `photos/` directory (e.g., `photos/rose-corner-tr.png` or `photos/envelope-flowers-top.png`).
   - Position the spray at `top: -12px; right: -12px`.
   - **Diagonal Mirroring**: Reuse the SAME spray at `bottom: -12px; left: -12px` with `transform: rotate(180deg);` to create perfect floral symmetry and balance.
5. **Flourishes**:
   - Include the vector crown tiara (`photos/crown-flourish.svg`) above the name.
   - Include the gold filigree divider (`photos/divider-gold-filigree.svg`) between name and call to action.

---

## 4. Standard Bilingual Copy

Always format the card with concise bilingual English and Spanish instructions:

* **Header Tag**: `Mis XV Años` / `Quinceañera` / `Nuestra Boda`
* **Celebrant Name**: `[Celebrant Name]`
* **Headline EN**: `Capture The Moments`
* **Headline ES**: `Captura los Momentos`
* **Action Callout EN**: `Scan to share your photos & videos`
* **Action Callout ES**: `Escanea para compartir tus fotos y videos`
* **Footer Guarantee**: `No App Required • No Requiere Descargar Aplicación`

---

## 5. Live QR Code Generation

Generate high-contrast, camera-friendly QR codes using the public QRServer API:

```html
<img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data={ENCODED_ALBUM_URL}&margin=4" alt="QR Code Album">
```

> [!IMPORTANT]
> The QR code must use a solid white background with a thin gold accent border (`border: 1.5px solid #d4af37; border-radius: 6px; padding: 10px;`). Avoid placing transparent QR codes over floral foliage or text.

---

## 6. Template HTML/CSS Architecture

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tarjeta de Mesa / Table Card — {{CELEBRANT_NAME}}</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #08161c;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      font-family: 'Montserrat', sans-serif;
      color: {{TEXT_DARK}};
    }
    .toolbar {
      margin-bottom: 25px;
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .btn-print {
      background: linear-gradient(135deg, {{THEME_PRIMARY}} 0%, {{THEME_DARK}} 100%);
      color: #ffffff;
      font-weight: 500;
      padding: 12px 28px;
      border: 1px solid {{GOLD_ACCENT}};
      border-radius: 30px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .table-card {
      width: 400px;
      min-height: 590px;
      background: #ffffff;
      border-radius: 4px;
      padding: 40px 30px 34px 30px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      overflow: hidden;
      border: 1px solid #f0f0f0;
    }
    .flower-corner-tr {
      position: absolute;
      top: -12px;
      right: -12px;
      width: 145px;
      height: auto;
      pointer-events: none;
      z-index: 1;
      opacity: 0.95;
    }
    .flower-corner-bl {
      position: absolute;
      bottom: -12px;
      left: -12px;
      width: 145px;
      height: auto;
      pointer-events: none;
      z-index: 1;
      opacity: 0.95;
      transform: rotate(180deg);
    }
    .card-gold-border {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      bottom: 14px;
      border: 1px solid {{GOLD_ACCENT}};
      border-radius: 3px;
      pointer-events: none;
      z-index: 2;
    }
    .card-content {
      position: relative;
      z-index: 3;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .crown-tiara {
      width: 62px;
      height: auto;
      margin-bottom: 6px;
      filter: drop-shadow(0 2px 5px rgba(212, 175, 55, 0.35));
    }
    .header-quince {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13.5px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: {{GOLD_ACCENT}};
      margin-bottom: 2px;
    }
    .celebrant-name {
      font-family: 'Alex Brush', cursive;
      font-size: 54px;
      color: {{TEXT_DARK}};
      line-height: 1.05;
      margin-bottom: 10px;
    }
    .divider-filigree {
      width: 125px;
      height: auto;
      margin-bottom: 16px;
      opacity: 0.75;
    }
    .headline-en {
      font-family: 'Playfair Display', serif;
      font-size: 18.5px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: {{TEXT_DARK}};
      margin-bottom: 2px;
    }
    .headline-es {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15.5px;
      font-style: italic;
      color: {{THEME_PRIMARY}};
      margin-bottom: 16px;
    }
    .qr-container {
      background: #ffffff;
      padding: 10px;
      border: 1.5px solid {{GOLD_ACCENT}};
      border-radius: 6px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      margin-bottom: 16px;
    }
    .qr-container img {
      display: block;
      width: 172px;
      height: 172px;
    }
    .callout-en {
      font-size: 12.5px;
      font-weight: 600;
      color: {{TEXT_DARK}};
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .callout-es {
      font-size: 11.5px;
      font-style: italic;
      color: {{TEXT_MUTED}};
      margin-bottom: 14px;
    }
    .footer-note {
      font-size: 9.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #8c8c8c;
      font-family: 'Montserrat', sans-serif;
      margin-top: 4px;
    }
    @media print {
      body { background: transparent !important; padding: 0 !important; }
      .toolbar { display: none !important; }
      .table-card { box-shadow: none !important; border: none !important; page-break-inside: avoid; margin: auto; }
      .card-gold-border { border-color: {{GOLD_ACCENT}} !important; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ Print / Imprimir (Ctrl + P)</button>
  </div>
  <div class="table-card">
    <img src="photos/rose-corner-tr.png" alt="" class="flower-corner-tr">
    <img src="photos/rose-corner-tr.png" alt="" class="flower-corner-bl">
    <div class="card-gold-border"></div>
    <div class="card-content">
      <img src="photos/crown-flourish.svg" alt="" class="crown-tiara">
      <div class="header-quince">Mis XV Años</div>
      <div class="celebrant-name">{{CELEBRANT_NAME}}</div>
      <img src="photos/divider-gold-filigree.svg" alt="" class="divider-filigree">
      <div class="headline-en">Capture The Moments</div>
      <div class="headline-es">Captura los Momentos</div>
      <div class="qr-container">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data={{ENCODED_ALBUM_URL}}&margin=4" alt="QR Code Album">
      </div>
      <div class="callout-en">Scan to share your photos & videos</div>
      <div class="callout-es">Escanea para compartir tus fotos y videos</div>
      <div class="footer-note">No App Required • No Requiere Descargar Aplicación</div>
    </div>
  </div>
</body>
</html>
```

---

## 7. Execution Checklist for Agents

When requested to create or update a table card for any client:
1. **Identify Client Directory**: Open the client's folder (e.g. `E:\VSCode\DISENOSLUNA\quincelandingpage\{client}\`).
2. **Inspect Assets & Palette**: Read `style.css` and check `photos/` for the best corner flower spray and metallic accents.
3. **Verify Name**: Check `README.md` for exact spelling (ensure compound surnames like `Deharo` are kept together).
4. **Obtain / Embed Album Link**: Retrieve the shared album URL (Google Photos, Dropbox, etc.) and URL-encode it for the QR code API.
5. **Generate `table-card.html`**: Write the completed file directly into the client folder.
6. **Deploy / Commit**: Stage `table-card.html` with `git add {client}/table-card.html`, commit, and push so it is live at `https://disenosluna.com/{client}/table-card.html`.
