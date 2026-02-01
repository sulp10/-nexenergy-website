# ✅ Checklist Pre-Lancio Sito Web
## Ottimizzazione SEO, GEO, AEO - Versione Completa

**Versione:** 2.0  
**Data:** Febbraio 2026  
**Compatibilità:** Google Search, Bing, Generative Engines, Answer Engines

---

## 📋 Indice Rapido

1. [🎯 Analisi Preliminare](#1--analisi-preliminare)
2. [🔗 Struttura URL](#2--struttura-url)
3. [🏷️ Meta Tag](#3-️-meta-tag)
4. [📝 Contenuti e Gerarchia](#4--contenuti-e-gerarchia)
5. [🖼️ Immagini e Media](#5-️-immagini-e-media)
6. [🔍 Schema.org e Dati Strutturati](#6--schemaorg-e-dati-strutturati)
7. [⚡ Performance e Core Web Vitals](#7--performance-e-core-web-vitals)
8. [📊 Tracking e Analytics](#8--tracking-e-analytics)
9. [🔒 Sicurezza e Privacy](#9--sicurezza-e-privacy)
10. [📱 Mobile e Accessibilità](#10--mobile-e-accessibilità)
11. [🌐 Internazionalizzazione](#11--internazionalizzazione)
12. [🛠️ File Tecnici](#12-️-file-tecnici)
13. [✨ Quality Gates](#13--quality-gates)
14. [🚫 Anti-Pattern da Verificare](#14--anti-pattern-da-verificare)

---

## 1. 🎯 Analisi Preliminare

### Business Analysis
- [ ] **Business type** identificato correttamente
  - Local business / E-commerce / Service / Hospitality / SaaS / Blog / Portfolio
- [ ] **Primary service/product** chiaramente definito
- [ ] **Target location** mappata
  - Città / Regione / Paese / Globale
- [ ] **Target audience** analizzato
  - Demographics
  - Pain points
  - Search intent (transactional/informational/navigational)
- [ ] **Urgency level** determinato (immediate/considered/research)

### Competitor Analysis
- [ ] Analisi competitor completata
- [ ] Keywords competitor mappate
- [ ] Gap analysis effettuata
- [ ] Unique Selling Points (USP) definiti (max 5)

### Content Strategy
- [ ] Primary keywords identificate
- [ ] Secondary keywords identificate
- [ ] Long-tail keywords mappate
- [ ] Content calendar definito (se blog/news)

---

## 2. 🔗 Struttura URL

### URL Format Rules
- [ ] ✅ **Solo lettere minuscole** (NO MAIUSCOLE)
- [ ] ✅ **Parole separate da trattini** (NO underscore `_`)
- [ ] ✅ **Nessun carattere speciale** (eccetto trattini)
- [ ] ✅ **Lunghezza URL < 75 caratteri**
- [ ] ✅ **Max 5-6 parole chiave per URL**
- [ ] ✅ **Nessun parametro query string** (se evitabile)

### URL Pattern Validation
- [ ] Homepage: `/`
- [ ] Service pages: `/{servizio}-{oggetto}-{località}` ✅
  - Esempio: `/riparazione-schermo-iphone-15-milano`
- [ ] Category pages: `/{categoria}/`
- [ ] Product pages: `/{prodotto-nome}-{categoria}`
- [ ] Blog posts: `/blog/{slug}/`
- [ ] Static pages:
  - [ ] `/contatti/`
  - [ ] `/chi-siamo/`
  - [ ] `/prezzi/`
  - [ ] `/privacy-policy/`
  - [ ] `/cookie-policy/`

### URL Anti-Patterns Check (MUST BE ABSENT)
- [ ] ❌ `/page?id=123` (parametri non semantici)
- [ ] ❌ `/UPPERCASE-URL` (maiuscole)
- [ ] ❌ `/under_score_url` (underscore)
- [ ] ❌ `/keyword-keyword-keyword-keyword-keyword` (keyword stuffing)
- [ ] ❌ `/2024/01/15/post-title` (date tranne blog)
- [ ] ❌ `/index.php?page=services` (estensioni e parametri)

### URL Hierarchy
- [ ] Gerarchia logica rispettata
- [ ] Profondità massima: 3 livelli (salvo eccezioni)
- [ ] Breadcrumb navigation allineata a URL structure

---

## 3. 🏷️ Meta Tag

### Meta Title (CRITICO)

#### Validation
- [ ] **Lunghezza: 30-60 caratteri** ✅
- [ ] **Formula applicata**: `[COSA] + [PER CHI] + [HOOK] | [BRAND]`
- [ ] **Primary keyword** presente nella prima metà
- [ ] **Brand name** alla fine (dopo `|`)
- [ ] **Differenziatore** incluso (location O USP)
- [ ] **Unico per ogni pagina**

#### Content Checks
- [ ] ❌ NO parole tutte maiuscole (ALL CAPS)
- [ ] ❌ NO punteggiatura eccessiva (`!!!`)
- [ ] ❌ NO spam words:
  - "migliore", "numero 1", "garantito al 100%"
  - "incredibile", "straordinario", "imperdibile"

#### Esempi di Riferimento per Tipo Business
```
Servizio Locale:
"Riparazione Schermo iPhone 15 Milano | Pronto in 20 Min | TecnoFix"

E-commerce:
"Cavo USB-C Certificato MFi 2m | Ricarica Rapida 100W | BrandName"

Hospitality:
"Hotel 4 Stelle Centro Firenze | Vista Duomo | Colazione Inclusa"

Professional Service:
"Consulente Fiscale Partita IVA Roma | Prima Consulenza Gratuita"
```

### Meta Description

#### Validation
- [ ] **Lunghezza: 120-160 caratteri** ✅
- [ ] **Formula applicata**: `[VERBO] + [BENEFICIO] + [KEYWORD] + [TRUST] + [CTA]`
- [ ] **Inizia con action verb**:
  - Scopri / Prenota / Richiedi / Trova / Ottieni / Confronta / Scegli
- [ ] **Primary keyword** presente
- [ ] **Beneficio chiaro** espresso
- [ ] **Call to Action** inclusa
- [ ] **Unica per ogni pagina**

#### Content Checks
- [ ] ❌ NO contenuto duplicato dal Meta Title
- [ ] ❌ NO frasi generiche ("Benvenuti nel nostro sito")
- [ ] ❌ NO solo prezzi senza contesto

### Open Graph Tags (Social Sharing)

#### Required Tags
- [ ] `og:title` presente e compilato
- [ ] `og:description` presente e compilato
- [ ] `og:image` presente e valido
- [ ] `og:url` con canonical URL
- [ ] `og:type` corretto (website/article/product)
- [ ] `og:locale` impostato (es. `it_IT`)

#### OG Image Validation
- [ ] Dimensioni minime: **1200x630 px**
- [ ] Formato: JPG, PNG o WebP
- [ ] Dimensione file: **< 300 KB**
- [ ] Testo leggibile nell'immagine (se presente)
- [ ] Brand/logo visibile

#### Twitter Cards
- [ ] `twitter:card` = `summary_large_image`
- [ ] `twitter:title` compilato
- [ ] `twitter:description` compilato
- [ ] `twitter:image` presente

### Technical Meta Tags

- [ ] **Viewport** obbligatorio:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- [ ] **Charset** UTF-8:
  ```html
  <meta charset="UTF-8">
  ```
- [ ] **Robots** configurato:
  ```html
  <meta name="robots" content="index, follow">
  ```
- [ ] **Canonical URL** presente su OGNI pagina:
  ```html
  <link rel="canonical" href="{url_canonico}">
  ```

---

## 4. 📝 Contenuti e Gerarchia

### Heading Structure (H-Tags)

#### REGOLA ASSOLUTA
- [ ] **UN SOLO H1 PER PAGINA** ⚠️

#### H1 Tag
- [ ] H1 presente sulla pagina
- [ ] H1 contiene **primary keyword**
- [ ] H1 è **complementare** al Meta Title (non identico)
- [ ] H1 conferma all'utente che è nel posto giusto

#### H2-H6 Hierarchy
- [ ] Gerarchia rispettata (no H1 → H3 senza H2)
- [ ] H2 usati per **sezioni principali**
- [ ] H3 usati per **sottosezioni** (figli di H2)
- [ ] H4-H6 usati raramente e solo se necessario
- [ ] Heading usati per semantica, NON per styling

### Content Quality

#### Word Count
- [ ] **Homepage**: min 300 parole
- [ ] **Service/Product pages**: min 300 parole
- [ ] **Blog posts**: min 800 parole
- [ ] **About/Contact**: min 150 parole

#### Keyword Optimization
- [ ] **Primary keyword nel primo paragrafo** ✅
- [ ] **Keyword density < 3%** (NO keyword stuffing)
- [ ] **LSI keywords** (Latent Semantic Indexing) incluse
- [ ] **Natural language** (non forzato)

#### Content Structure
- [ ] Introduzione: risponde SUBITO alla query (2-3 frasi)
- [ ] Sezioni logiche con H2
- [ ] Paragrafi brevi (3-5 righe max)
- [ ] Liste puntate/numerate dove appropriate
- [ ] Contenuto **unico** (no duplicati interni o esterni)

#### Readability
- [ ] Target: **Grade 8** (leggibilità media)
- [ ] Frasi brevi e chiare
- [ ] Evitato gergo tecnico eccessivo
- [ ] Spazi bianchi tra paragrafi

### Call to Action (CTA)

- [ ] CTA chiara e visibile
- [ ] CTA ripetuta strategicamente
- [ ] CTA con beneficio esplicito
- [ ] Bottoni CTA con colori contrastanti
- [ ] CTA tracciata in analytics

---

## 5. 🖼️ Immagini e Media

### File Naming
- [ ] **Nomi descrittivi** (NO `IMG_1234.jpg`)
- [ ] **Keyword nel filename** quando rilevante
  - Esempio: `riparazione-iphone-schermo-rotto.jpg`
- [ ] **Lowercase e trattini** (NO spazi, NO underscore)
- [ ] **Formato corretto nel nome** (`.webp`, `.jpg`, `.png`)

### Alt Text (OBBLIGATORIO)

#### Formula Alt Text
```
[SOGGETTO] + [AZIONE] + [CONTESTO]
```

#### Validation
- [ ] **TUTTE le immagini** hanno alt text
- [ ] **Lunghezza alt text: 10-125 caratteri**
- [ ] Alt text **descrittivo e specifico**
- [ ] Alt text **contiene keyword** (quando naturale)
- [ ] ❌ NO "immagine di", "foto di" (ridondante)
- [ ] ❌ NO keyword stuffing nell'alt

#### Esempi
```html
✅ <img alt="tecnico ripara schermo iPhone 15 in laboratorio Milano">
✅ <img alt="camera doppia hotel con vista Duomo Firenze">
❌ <img alt="immagine">
❌ <img alt="riparazione iPhone riparazione smartphone riparazione Milano">
```

### Image Optimization

#### Format & Compression
- [ ] **Formato WebP** preferito con fallback JPG/PNG
- [ ] **Compressione applicata**:
  - Foto: < 200 KB (target 100 KB)
  - Hero images: < 300 KB
  - Thumbnail: < 50 KB
- [ ] **Quality setting**: 80-85% (bilanciamento qualità/peso)

#### Responsive Images
- [ ] `<picture>` element per art direction
- [ ] `srcset` per immagini responsive
- [ ] `sizes` attribute specificato
- [ ] Breakpoint allineati a CSS

#### Technical Attributes
- [ ] **Width e Height** specificati per OGNI immagine
  ```html
  <img src="image.webp" width="800" height="600" alt="...">
  ```
- [ ] **Lazy loading** implementato (eccetto above-the-fold):
  ```html
  <img loading="lazy" src="image.webp" alt="...">
  ```
- [ ] **Fetchpriority** per hero image:
  ```html
  <img fetchpriority="high" src="hero.webp" alt="...">
  ```

### Image Dimensions by Use Case
- [ ] Hero/Banner: 1920x1080 (min)
- [ ] OG Image: 1200x630
- [ ] Product images: 800x800 (square) o 800x1000 (portrait)
- [ ] Thumbnail: 300x300 o 400x300
- [ ] Logo: SVG preferito, o PNG trasparente

### Favicon Package
- [ ] `favicon.ico` (32x32)
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png` (180x180)
- [ ] `android-chrome-192x192.png`
- [ ] `android-chrome-512x512.png`

---

## 6. 🔍 Schema.org e Dati Strutturati

### JSON-LD Implementation

#### Base Requirements
- [ ] **JSON-LD** format (non Microdata)
- [ ] Script nel `<head>` o fine `<body>`
- [ ] Sintassi JSON valida (no trailing commas)
- [ ] `@context` e `@type` presenti

### Schema Types by Page Type

#### Homepage / Organization
- [ ] **Schema Type**: `Organization` o `LocalBusiness`
- [ ] Campi obbligatori:
  - [ ] `name`
  - [ ] `url`
  - [ ] `logo`
  - [ ] `contactPoint` (telefono, email)
  - [ ] `address` (se local business)
  - [ ] `sameAs` (social profiles)
  - [ ] `priceRange` (se applicabile, es. "€€")

#### LocalBusiness (per attività locali)
- [ ] **Schema Type**: `LocalBusiness` (o sottotipo specifico)
  - Restaurant, Hotel, Store, Dentist, etc.
- [ ] Campi aggiuntivi:
  - [ ] `geo` (coordinates)
  - [ ] `openingHoursSpecification`
  - [ ] `telephone`
  - [ ] `image`
  - [ ] `areaServed`

#### Product Page
- [ ] **Schema Type**: `Product`
- [ ] Campi obbligatori:
  - [ ] `name`
  - [ ] `image`
  - [ ] `description`
  - [ ] `sku` o `gtin` o `mpn`
  - [ ] `brand`
  - [ ] `offers` (price, availability, currency)
  - [ ] `aggregateRating` (se recensioni)
  - [ ] `review` (se recensioni)

#### Service Page
- [ ] **Schema Type**: `Service`
- [ ] Campi:
  - [ ] `name`
  - [ ] `provider` (Organization)
  - [ ] `areaServed`
  - [ ] `description`
  - [ ] `offers` (se pricing)

#### Article/BlogPost
- [ ] **Schema Type**: `Article` o `BlogPosting`
- [ ] Campi:
  - [ ] `headline`
  - [ ] `author`
  - [ ] `datePublished`
  - [ ] `dateModified`
  - [ ] `image`
  - [ ] `publisher` (Organization con logo)

#### FAQ Page
- [ ] **Schema Type**: `FAQPage`
- [ ] Ogni Q&A con:
  - [ ] `@type: Question`
  - [ ] `name` (domanda)
  - [ ] `acceptedAnswer` (risposta in `text`)

#### Breadcrumb
- [ ] **Schema Type**: `BreadcrumbList`
- [ ] `itemListElement` array con:
  - [ ] `@type: ListItem`
  - [ ] `position`
  - [ ] `name`
  - [ ] `item` (URL)

### Reviews & Ratings (ATTENZIONE)

#### Se Presenti Recensioni
- [ ] **AggregateRating** incluso in Product/Service/Organization
- [ ] Campi:
  - [ ] `ratingValue`
  - [ ] `bestRating` (default: 5)
  - [ ] `worstRating` (default: 1)
  - [ ] `ratingCount`
  - [ ] `reviewCount`

#### Anti-Pattern CRITICI (VIETATI)
- [ ] ❌ **NO self-review** (azienda recensisce se stessa)
- [ ] ❌ **NO fake ratings** (rating senza recensioni reali)
- [ ] ❌ **NO rating inflazionati** (solo 5 stelle)
- [ ] ❌ Solo recensioni verificate da terze parti (Google, Trustpilot, etc.)

### Schema Validation

- [ ] **Google Rich Results Test** passato
  - URL: https://search.google.com/test/rich-results
- [ ] **Schema.org Validator** passato
  - URL: https://validator.schema.org/
- [ ] Nessun errore critico
- [ ] Warning opzionali valutati

---

## 7. ⚡ Performance e Core Web Vitals

### Core Web Vitals Targets

#### LCP - Largest Contentful Paint
- [ ] **Target: < 2.5s** ✅
- [ ] Acceptable: < 4.0s
- [ ] Metrica: tempo di rendering del contenuto principale
- [ ] Ottimizzazioni applicate:
  - [ ] Preload hero image/font
  - [ ] Ottimizzazione server response time
  - [ ] Critical CSS inline

#### FID - First Input Delay (deprecated) / INP - Interaction to Next Paint
- [ ] **INP Target: < 200ms** ✅
- [ ] INP Acceptable: < 500ms
- [ ] Ottimizzazioni:
  - [ ] JavaScript differito
  - [ ] No long tasks (> 50ms)
  - [ ] Event handler ottimizzati

#### CLS - Cumulative Layout Shift
- [ ] **Target: < 0.1** ✅
- [ ] Acceptable: < 0.25
- [ ] Ottimizzazioni:
  - [ ] Width/Height su TUTTE le immagini
  - [ ] Font loading ottimizzato (`font-display: swap`)
  - [ ] Nessun contenuto iniettato dinamicamente sopra il fold
  - [ ] Skeleton loaders per contenuto dinamico

### Lighthouse Scores

- [ ] **Performance: ≥ 90** (mobile)
- [ ] **Performance: ≥ 95** (desktop)
- [ ] **Accessibility: ≥ 95**
- [ ] **Best Practices: ≥ 95**
- [ ] **SEO: = 100** ✅

### CSS Optimization

- [ ] **Critical CSS inline** nel `<head>`
- [ ] **Non-critical CSS** differito:
  ```html
  <link rel="stylesheet" href="main.css" media="print" onload="this.media='all'">
  ```
- [ ] CSS minificato
- [ ] CSS purged (rimossi stili non usati)
- [ ] Nessun `@import` inline (usa `<link>`)

### JavaScript Optimization

- [ ] **Defer** per script non critici:
  ```html
  <script src="script.js" defer></script>
  ```
- [ ] **Async** per script indipendenti (analytics):
  ```html
  <script src="analytics.js" async></script>
  ```
- [ ] ❌ **NO JavaScript render-blocking** above the fold
- [ ] JavaScript minificato
- [ ] Code splitting applicato (se SPA/bundle grande)

### Font Optimization

- [ ] **Max 3 font variations** (regular, bold, italic)
- [ ] **Font-display: swap**:
  ```css
  @font-face {
    font-family: 'MyFont';
    font-display: swap;
  }
  ```
- [ ] **Preload font critici**:
  ```html
  <link rel="preload" as="font" href="font.woff2" type="font/woff2" crossorigin>
  ```
- [ ] **WOFF2 format** (compression superiore)
- [ ] **Subset font** (solo caratteri usati)
- [ ] Fallback font specificato:
  ```css
  font-family: 'MyFont', Arial, sans-serif;
  ```

### Resource Hints

- [ ] **DNS Prefetch** per domini esterni:
  ```html
  <link rel="dns-prefetch" href="//analytics.google.com">
  ```
- [ ] **Preconnect** per risorse critiche:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  ```
- [ ] **Preload** per asset critici:
  ```html
  <link rel="preload" as="image" href="hero.webp">
  <link rel="preload" as="style" href="critical.css">
  ```

### Compression & Caching

- [ ] **Gzip** abilitato
- [ ] **Brotli** abilitato (preferito)
- [ ] **Browser cache** configurato:
  - Static assets: 1 anno
  - HTML: no-cache o 5 minuti
- [ ] **CDN** configurato (raccomandato)
- [ ] **HTTP/2** o **HTTP/3** abilitato

### Server Response

- [ ] **TTFB (Time to First Byte) < 600ms**
- [ ] Server response ottimizzato
- [ ] Database query ottimizzate (se dinamico)
- [ ] Object caching (Redis/Memcached se applicabile)

---

## 8. 📊 Tracking e Analytics

### Google Analytics 4 (GA4)

#### Setup Base
- [ ] **GA4 Property** creata
- [ ] **Measurement ID** configurato (G-XXXXXXXXXX)
- [ ] Script GA4 implementato:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  ```
- [ ] `gtag()` configurato con:
  - [ ] `anonymize_ip: true` (privacy)
  - [ ] `cookie_flags: 'SameSite=None;Secure'`

#### Enhanced Measurement
- [ ] Page views tracking
- [ ] Scroll tracking abilitato
- [ ] Outbound clicks tracking
- [ ] Site search tracking (se presente)
- [ ] Video engagement (se video presenti)
- [ ] File downloads tracking

### Conversion Goals

#### Goals Configurati
- [ ] **Form submission**
- [ ] **Phone call click** (mobile)
- [ ] **Email click**
- [ ] **Purchase complete** (e-commerce)
- [ ] **Add to cart** (e-commerce)
- [ ] **Newsletter signup**
- [ ] Custom events specifici business

#### Event Tracking Setup
```javascript
// Esempio tracciamento CTA
- [ ] CTA clicks tracciati
- [ ] Button clicks tracciati con category/label
- [ ] Custom events implementati
```

### Google Search Console

- [ ] **Property aggiunta** (www e non-www)
- [ ] **Sitemap.xml submitted**
- [ ] **Ownership verificata** (DNS, file HTML, Google Analytics, o Tag Manager)
- [ ] **Mobile usability** verificata
- [ ] **Core Web Vitals** report monitorato
- [ ] **Coverage** report pulito (no errori critici)

### Google Tag Manager (Opzionale ma Raccomandato)

- [ ] Container GTM creato
- [ ] GTM snippet installato (sostituisce GA4 diretto)
- [ ] GA4 tag configurato in GTM
- [ ] Triggers configurati
- [ ] Variables configurate
- [ ] Preview & Debug testato

### UTM Parameters Strategy

#### Template UTM Documentato
- [ ] **utm_source**: sorgente traffico
  - Esempi: `google`, `facebook`, `newsletter`, `instagram`
  - Formato: `lowercase_underscore`

- [ ] **utm_medium**: mezzo/canale
  - Standard: `organic`, `cpc`, `email`, `social`, `referral`, `display`

- [ ] **utm_campaign**: nome campagna
  - Esempi: `black_friday_2026`, `lancio_prodotto`, `newsletter_gennaio`
  - Formato: `lowercase_underscore`

- [ ] **utm_term**: keyword (solo paid search)

- [ ] **utm_content**: variante A/B test
  - Esempi: `banner_rosso`, `cta_verde`, `video_hero`

#### UTM Implementation
- [ ] URL builder template creato
- [ ] Naming convention documentata
- [ ] Team formato su uso UTM
- [ ] Tracking sheet creato (Google Sheets/Excel)

### Other Tracking Pixels (se applicabili)

- [ ] Facebook Pixel
- [ ] LinkedIn Insight Tag
- [ ] Google Ads Conversion Tracking
- [ ] Microsoft Advertising UET Tag
- [ ] TikTok Pixel
- [ ] Pinterest Tag

---

## 9. 🔒 Sicurezza e Privacy

### SSL/HTTPS

- [ ] **Certificato SSL** installato e valido
- [ ] **HTTPS everywhere** (tutte le pagine)
- [ ] **HTTP → HTTPS redirect** configurato (301)
- [ ] **HSTS header** configurato:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```
- [ ] ❌ **NO mixed content** (HTTP su HTTPS)
- [ ] Certificato non in scadenza (> 30 giorni)

### Privacy Compliance (GDPR/ePrivacy)

#### Cookie Consent
- [ ] **Cookie banner** presente
- [ ] **Opt-in richiesto** prima di tracciamento non essenziale
- [ ] Cookie categorizzati:
  - [ ] Essenziali (sempre attivi)
  - [ ] Analytics (opt-in)
  - [ ] Marketing (opt-in)
- [ ] **Cookie policy** page presente e linkata
- [ ] Gestione consenso salvata (Cookie Consent Platform)

#### Privacy Policy
- [ ] **Privacy Policy page** presente
- [ ] Link in footer
- [ ] Aggiornata con:
  - [ ] Dati raccolti
  - [ ] Finalità raccolta
  - [ ] Cookie utilizzati
  - [ ] Diritti utente (accesso, cancellazione, portabilità)
  - [ ] Contatti DPO/Titolare trattamento
  - [ ] Terze parti (GA, GTM, pixel)

#### Data Protection
- [ ] **IP anonymization** abilitata in GA4
- [ ] Form con **checkbox privacy** (non pre-checked)
- [ ] **SSL** per form submission
- [ ] Dati personali NON in URL (GET parameters)
- [ ] Email/password NON in analytics

### Security Headers

- [ ] **Content-Security-Policy** (CSP)
- [ ] **X-Frame-Options**: `SAMEORIGIN`
- [ ] **X-Content-Type-Options**: `nosniff`
- [ ] **Referrer-Policy**: `strict-origin-when-cross-origin`
- [ ] **Permissions-Policy** configurata

---

## 10. 📱 Mobile e Accessibilità

### Mobile Responsiveness

- [ ] **Design responsive** (no versione mobile separata)
- [ ] **Viewport meta tag** presente
- [ ] **Touch targets ≥ 48x48px** (44x44px minimo iOS)
- [ ] **Font size leggibile** (min 16px base)
- [ ] **No horizontal scroll**
- [ ] **Mobile navigation** funzionante (hamburger menu)
- [ ] **Forms ottimizzati** per mobile:
  - [ ] Input types corretti (`tel`, `email`, `url`)
  - [ ] Autocomplete attributes
  - [ ] Label associati a input

### Mobile Testing

- [ ] **Google Mobile-Friendly Test** passato
  - URL: https://search.google.com/test/mobile-friendly
- [ ] Test su dispositivi reali:
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Tablet
- [ ] Test su Chrome DevTools (varie risoluzioni)

### Accessibility (WCAG 2.1 Level AA)

#### Contrast & Colors
- [ ] **Contrasto testo/sfondo ≥ 4.5:1** (testo normale)
- [ ] **Contrasto testo/sfondo ≥ 3:1** (testo large ≥ 18pt)
- [ ] Informazioni NON veicolate solo da colore

#### Keyboard Navigation
- [ ] **Navigazione completa da tastiera** (Tab, Shift+Tab, Enter, Esc)
- [ ] **Focus visibile** su elementi interattivi
- [ ] **Skip to content** link presente
- [ ] **Tab order logico**

#### Screen Reader Support
- [ ] **Alt text** su tutte le immagini
- [ ] **ARIA labels** dove necessario
- [ ] **ARIA landmarks** (`role="navigation"`, `role="main"`, etc.)
- [ ] **Form labels** associati a input (`<label for="...">`)
- [ ] **Link descrittivi** (no "clicca qui")

#### Semantic HTML
- [ ] **HTML5 semantic tags** usati:
  - `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- [ ] **Heading hierarchy** corretta (H1 → H2 → H3)
- [ ] **Lists** per contenuto a lista (`<ul>`, `<ol>`)
- [ ] **Tables** con `<thead>`, `<tbody>`, `<th scope="...">`

#### Testing Tools
- [ ] **WAVE** (Web Accessibility Evaluation Tool) - 0 errori
- [ ] **axe DevTools** - 0 errori critici
- [ ] **Lighthouse Accessibility** ≥ 95
- [ ] Screen reader test (NVDA, JAWS, VoiceOver)

---

## 11. 🌐 Internazionalizzazione

### Se Sito Multilingua

#### Hreflang Implementation
- [ ] **Hreflang tags** presenti su OGNI pagina
  ```html
  <link rel="alternate" hreflang="it" href="https://example.com/it/">
  <link rel="alternate" hreflang="en" href="https://example.com/en/">
  <link rel="alternate" hreflang="x-default" href="https://example.com/">
  ```
- [ ] **X-default** specificato (fallback)
- [ ] **Reciprocità** garantita (ogni pagina linka tutte le varianti)
- [ ] **Self-referencing** hreflang presente

#### Language Structure
- [ ] **Struttura URL** per lingue:
  - Subdomain: `it.example.com`, `en.example.com`
  - Subdirectory: `example.com/it/`, `example.com/en/`
  - ccTLD: `example.it`, `example.com`
- [ ] **HTML lang attribute** corretto per pagina:
  ```html
  <html lang="it">
  ```
- [ ] **Language switcher** presente e visibile

#### Content Localization
- [ ] Contenuto tradotto (no Google Translate automatico)
- [ ] Meta tags tradotti (title, description)
- [ ] Alt text tradotti
- [ ] Schema.org con `inLanguage` specificato
- [ ] Date/numeri formattati per locale
- [ ] Currency localizzata (€, $, £, etc.)

---

## 12. 🛠️ File Tecnici

### robots.txt

- [ ] **File robots.txt** presente nella root (`/robots.txt`)
- [ ] Sintassi corretta
- [ ] **Sitemap.xml** referenziato:
  ```
  Sitemap: https://example.com/sitemap.xml
  ```
- [ ] Disallow configurato per:
  - Admin area: `Disallow: /admin/`
  - Private folders: `Disallow: /private/`
  - Duplicate content
- [ ] User-agent specifici se necessario

#### Esempio robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /*?*  # Query parameters

Sitemap: https://example.com/sitemap.xml
```

### sitemap.xml

- [ ] **Sitemap.xml** generato e presente (`/sitemap.xml`)
- [ ] Sintassi XML valida
- [ ] **Tutte le pagine indicizzabili** incluse
- [ ] `<loc>` (URL completo con https://)
- [ ] `<lastmod>` data ultima modifica (ISO 8601)
- [ ] `<changefreq>` indicativo (daily, weekly, monthly)
- [ ] `<priority>` impostata (0.0-1.0):
  - Homepage: 1.0
  - Main pages: 0.8
  - Secondary: 0.5-0.6
- [ ] **Max 50.000 URL** per sitemap
- [ ] **Max 50 MB** uncompressed
- [ ] Sitemap Index se > 50k URL

#### Validazione Sitemap
- [ ] XML valido (no errori sintassi)
- [ ] Test: `curl -s https://example.com/sitemap.xml | xmllint --noout -`
- [ ] Submitted in Google Search Console

### Additional Sitemaps (se applicabili)
- [ ] **Image sitemap** (per siti con molte immagini)
- [ ] **Video sitemap** (per video)
- [ ] **News sitemap** (per siti news)

### humans.txt (Opzionale)

- [ ] File `/humans.txt` presente con credits
- [ ] Team, tecnologie, ringraziamenti

### manifest.json (PWA - Opzionale)

- [ ] `manifest.json` per Progressive Web App
- [ ] Icons varie dimensioni (192x192, 512x512)
- [ ] `name`, `short_name`, `theme_color`, `background_color`
- [ ] `start_url`, `display: standalone`

### .htaccess o Server Config

#### Redirects
- [ ] **301 redirects** per URL vecchi/cambiati
- [ ] **Redirect www → non-www** (o viceversa)
- [ ] **Redirect HTTP → HTTPS**
- [ ] **Trailing slash** policy (with or without)

#### Server Settings
- [ ] Gzip/Brotli compression
- [ ] Browser caching headers
- [ ] Security headers
- [ ] Custom error pages (404, 500)

### Custom 404 Page

- [ ] **404.html** personalizzata
- [ ] Design coerente con sito
- [ ] Link navigazione (home, ricerca, sitemap)
- [ ] Search box presente
- [ ] Messaggio friendly
- [ ] HTTP status code = 404 (non 200!)

---

## 13. ✨ Quality Gates

### Mandatory Validation Tools

#### HTML Validation
- [ ] **W3C HTML Validator** - 0 errori
  - URL: https://validator.w3.org/
  - Tool: `npx html-validate ./dist/**/*.html`

#### Schema.org Validation
- [ ] **Google Rich Results Test** - tutti item valid
  - URL: https://search.google.com/test/rich-results
- [ ] **Schema.org Validator** - no errori critici
  - URL: https://validator.schema.org/

#### Performance Audits
- [ ] **Google PageSpeed Insights** (Mobile):
  - Performance: ≥ 90
  - Accessibility: ≥ 95
  - Best Practices: ≥ 95
  - SEO: 100
  - URL: https://pagespeed.web.dev/

- [ ] **Lighthouse** (via Chrome DevTools):
  ```bash
  npx lighthouse https://example.com --output html --output-path ./report.html
  ```

#### Mobile Testing
- [ ] **Google Mobile-Friendly Test** - Pass
  - URL: https://search.google.com/test/mobile-friendly

#### Link Checking
- [ ] **Broken Link Checker** - 0 broken links
  ```bash
  npx broken-link-checker https://example.com --recursive
  ```

#### Security Testing
- [ ] **Mozilla Observatory** - A+ rating
  - URL: https://observatory.mozilla.org/
- [ ] **SSL Labs Test** - A rating
  - URL: https://www.ssllabs.com/ssltest/

### Pre-Launch Testing Checklist

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### Device Testing
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Laptop (1440x900)
- [ ] Tablet landscape (1024x768)
- [ ] Tablet portrait (768x1024)
- [ ] Mobile large (414x896 - iPhone 11 Pro Max)
- [ ] Mobile medium (375x667 - iPhone SE)
- [ ] Mobile small (360x640 - Android)

#### Functional Testing
- [ ] Tutti i form funzionanti
- [ ] Form validation funzionante
- [ ] Email inviate correttamente
- [ ] Link interni funzionanti
- [ ] Link esterni funzionanti (target="_blank" + rel="noopener")
- [ ] CTA buttons funzionanti
- [ ] Navigation menu (desktop + mobile)
- [ ] Search funzionante (se presente)
- [ ] Filtri/sorting funzionanti (se e-commerce)

---

## 14. 🚫 Anti-Pattern da Verificare

### URL Anti-Patterns (MUST BE ABSENT)

- [ ] ❌ `/page?id=123` - Parametri non semantici
- [ ] ❌ `/UPPERCASE-URL` - Maiuscole negli URL
- [ ] ❌ `/under_score_url` - Underscore invece trattini
- [ ] ❌ `/keyword-keyword-keyword-keyword-keyword-keyword` - Keyword stuffing
- [ ] ❌ `/2024/01/15/post-title` - Date nell'URL (eccetto blog)
- [ ] ❌ `/index.php?page=services` - Estensioni e parametri

### Content Anti-Patterns (MUST BE ABSENT)

- [ ] ❌ Multiple H1 tags
- [ ] ❌ H1 → H3 (skipping H2) - Gerarchia interrotta
- [ ] ❌ Keyword density > 3% - Keyword stuffing
- [ ] ❌ Hidden text (`display: none` con contenuto)
- [ ] ❌ Thin content (< 100 parole su pagine main)
- [ ] ❌ Duplicate content tra pagine
- [ ] ❌ Testo invisibile (white text on white background)
- [ ] ❌ Doorway pages

### Technical Anti-Patterns (MUST BE ABSENT)

- [ ] ❌ Render-blocking JavaScript above the fold
- [ ] ❌ Images without width/height (causa CLS)
- [ ] ❌ Uncompressed images > 500KB
- [ ] ❌ Missing alt attributes
- [ ] ❌ No canonical URL
- [ ] ❌ Mixed content (HTTP resources on HTTPS page)
- [ ] ❌ JavaScript navigation (links as `<div onclick>` invece `<a href>`)
- [ ] ❌ Flash o plugin obsoleti
- [ ] ❌ Popup invasivi (interstiziali)

### Schema.org Anti-Patterns (MUST BE ABSENT)

- [ ] ❌ Self-reviews (azienda recensisce se stessa)
- [ ] ❌ Fake ratings senza recensioni reali
- [ ] ❌ Schema non corrispondente al contenuto
- [ ] ❌ Nested schema non valido
- [ ] ❌ Rating inflazionati (solo 5 stelle)

### SEO Black Hat (MUST BE ABSENT)

- [ ] ❌ Cloaking (contenuto diverso per bot/utenti)
- [ ] ❌ Link schemes / Link farms
- [ ] ❌ Keyword stuffing
- [ ] ❌ Article spinning / contenuto auto-generato bassa qualità
- [ ] ❌ Negative SEO verso competitor
- [ ] ❌ Pagine "doorway"

---

## 🎯 Launch Readiness Score

### Calcola il tuo punteggio:

```
CRITICAL ITEMS (obbligatori):
- [ ] Meta Title unici (60 char max)
- [ ] Meta Description uniche (160 char max)
- [ ] H1 unico per pagina
- [ ] Alt text su tutte le immagini
- [ ] Schema.org valido
- [ ] Canonical URL su tutte le pagine
- [ ] robots.txt + sitemap.xml
- [ ] SSL/HTTPS attivo
- [ ] Mobile responsive
- [ ] Lighthouse SEO = 100

PERFORMANCE ITEMS (fortemente raccomandati):
- [ ] Core Web Vitals pass (LCP, CLS, INP)
- [ ] PageSpeed ≥ 90 mobile
- [ ] Lazy loading immagini
- [ ] WebP images
- [ ] Critical CSS inline

TRACKING ITEMS (obbligatori):
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Conversion goals configurati
- [ ] UTM strategy documentata

PRIVACY ITEMS (obbligatori se EU):
- [ ] Cookie consent banner
- [ ] Privacy Policy
- [ ] GDPR compliance
```

### ✅ Ready to Launch se:
- Tutti CRITICAL items = ✅
- Almeno 80% PERFORMANCE items = ✅
- Tutti TRACKING items = ✅
- Tutti PRIVACY items = ✅ (se applicabile)

---

## 📚 Tool & Resources Reference

### Validation Tools
- W3C HTML Validator: https://validator.w3.org/
- Schema.org Validator: https://validator.schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results
- Google Mobile-Friendly: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/
- SSL Labs: https://www.ssllabs.com/ssltest/
- Mozilla Observatory: https://observatory.mozilla.org/

### SEO Tools
- Google Search Console: https://search.google.com/search-console
- Google Analytics 4: https://analytics.google.com/
- Screaming Frog: https://www.screamingfrog.co.uk/
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/

### Accessibility
- WAVE: https://wave.webaim.org/
- axe DevTools: https://www.deque.com/axe/
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/

### Image Optimization
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/

### Command Line Tools
```bash
# HTML Validation
npx html-validate ./dist/**/*.html

# Schema Testing
npx structured-data-testing-tool --url https://example.com

# Lighthouse Audit
npx lighthouse https://example.com --output html --output-path ./report.html

# Broken Links
npx broken-link-checker https://example.com --recursive

# Sitemap Validation
curl -s https://example.com/sitemap.xml | xmllint --noout -
```

---

## 📝 Note Finali

### Priorità di Implementazione

1. **FASE 1 - FOUNDATION** (Obbligatorio prima del lancio)
   - Struttura URL
   - Meta tags (Title, Description)
   - H1 unico
   - Schema.org base
   - SSL/HTTPS

2. **FASE 2 - OPTIMIZATION** (Entro 1 settimana dal lancio)
   - Immagini ottimizzate
   - Core Web Vitals
   - Google Search Console setup
   - Analytics configurato

3. **FASE 3 - ENHANCEMENT** (Entro 1 mese)
   - Schema avanzati (FAQ, Product, Review)
   - Content expansion
   - Link building strategy
   - Advanced tracking

### Manutenzione Post-Lancio

- [ ] **Settimanale**: Google Search Console review
- [ ] **Mensile**: Content updates, nuove pagine
- [ ] **Trimestrale**: SEO audit completo
- [ ] **Annuale**: Redesign valutazione

---

**Documento mantenuto da:** IMMOBY Digital Strategy  
**Versione:** 2.0  
**Ultimo aggiornamento:** Febbraio 2026  
**Compatibilità:** SEO, GEO (Generative Engine Optimization), AEO (Answer Engine Optimization)

