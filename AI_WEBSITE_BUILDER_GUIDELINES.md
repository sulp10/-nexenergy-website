# 🤖 AI Website Builder Guidelines

## Linee Guida per Sistemi Autonomi di Generazione Siti Web

**Versione:** 2.0  
**Ultima modifica:** Gennaio 2026  
**Compatibilità:** GEO/AEO Ready (Generative Engine Optimization / Answer Engine Optimization)

---

## 📋 Indice

1. [Principi Fondamentali](#1-principi-fondamentali)
2. [Struttura URL](#2-struttura-url)
3. [Meta Tag](#3-meta-tag)
4. [Gerarchia Contenuti](#4-gerarchia-contenuti)
5. [Ottimizzazione Immagini](#5-ottimizzazione-immagini)
6. [Schema.org e Dati Strutturati](#6-schemaorg-e-dati-strutturati)
7. [Performance e Core Web Vitals](#7-performance-e-core-web-vitals)
8. [Tracking e Analytics](#8-tracking-e-analytics)
9. [Checklist di Validazione](#9-checklist-di-validazione)
10. [Anti-Pattern da Evitare](#10-anti-pattern-da-evitare)

---

## 1. Principi Fondamentali

### 1.1 La Regola d'Oro: ESSERE ESPLICITI

```
⚠️ CRITICAL RULE
I motori di ricerca e le AI NON capiscono:
- Metafore
- Codici criptici
- Abbreviazioni non standard
- Contenuti impliciti

DEVI essere esplicito, chiaro, semanticamente corretto.
```

### 1.2 Gerarchia delle Priorità

Quando generi un sito, segui questa priorità:

| Priorità | Elemento | Impatto SEO | Impatto UX |
|----------|----------|-------------|------------|
| 1 | URL Structure | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 2 | Meta Title | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 3 | H1 Tag | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 4 | Schema.org | ⭐⭐⭐⭐ | ⭐ |
| 5 | Meta Description | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 6 | Content Structure | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 7 | Image Optimization | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 8 | Page Speed | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 1.3 Target Audience Detection

Prima di generare qualsiasi contenuto, l'AI DEVE determinare:

```json
{
  "audience_analysis": {
    "business_type": "local|national|international",
    "service_type": "product|service|information|e-commerce",
    "target_location": "city|region|country|global",
    "primary_intent": "transactional|informational|navigational",
    "urgency_level": "immediate|considered|research"
  }
}
```

---

## 2. Struttura URL

### 2.1 Pattern URL Obbligatori

#### ❌ VIETATO
```
/servizi/p=123
/page?id=456&ref=abc
/2024/01/15/post-title
/index.php?page=services
```

#### ✅ OBBLIGATORIO
```
/[servizio]-[oggetto]-[località]
/riparazione-schermo-iphone-15-milano
/consulenza-fiscale-partita-iva-roma
/hotel-centro-storico-firenze
```

### 2.2 Regole di Composizione URL

```python
def generate_url(service, target, location=None):
    """
    RULES:
    1. Solo lettere minuscole
    2. Parole separate da trattini (-)
    3. No underscore, no spazi, no caratteri speciali
    4. Max 5-6 parole chiave
    5. Nessun parametro query string se evitabile
    6. Località SEMPRE inclusa per business locali
    """
    components = [
        sanitize(service),      # es: "riparazione-schermo"
        sanitize(target),       # es: "iphone-15"
    ]
    if location and is_local_business:
        components.append(sanitize(location))  # es: "milano"
    
    return "/" + "-".join(components)
```

### 2.3 URL Hierarchy per Siti Multi-Pagina

```
/                                    # Homepage
├── /servizi/                        # Categoria servizi
│   ├── /riparazione-smartphone-milano/
│   ├── /sostituzione-batteria-iphone-milano/
│   └── /riparazione-schermo-samsung-milano/
├── /prezzi/                         # Listino
├── /chi-siamo/                      # About
├── /contatti/                       # Contact
└── /blog/                           # Content hub
    ├── /blog/guida-riparazione-iphone/
    └── /blog/come-sostituire-batteria-smartphone/
```

---

## 3. Meta Tag

### 3.1 Meta Title

#### Formula Obbligatoria
```
[COSA] + [PER CHI/COSA] + [HOOK/DIFFERENZIATORE] | [BRAND]
```

#### Constraints
```yaml
meta_title:
  min_length: 30
  max_length: 60
  must_contain:
    - primary_keyword
    - differentiator OR location
  must_not_contain:
    - all_caps_words
    - excessive_punctuation: "!!!"
    - spam_words: ["migliore", "numero 1", "garantito"]
  position:
    primary_keyword: "first_half"
    brand: "end"
```

#### Esempi per Tipo di Business

```yaml
# Servizio Locale
title: "Riparazione Schermo iPhone 15 Milano | Pronto in 20 Min | TecnoFix"

# E-commerce Prodotto
title: "Cavo USB-C Certificato MFi 2m | Ricarica Rapida 100W | BrandName"

# Servizio Professionale
title: "Consulente Fiscale Partita IVA Roma | Prima Consulenza Gratuita"

# Hospitality
title: "Hotel 4 Stelle Centro Firenze | Vista Duomo | Colazione Inclusa"
```

### 3.2 Meta Description

#### Formula Obbligatoria
```
[VERBO_AZIONE] + [BENEFICIO] + [KEYWORD] + [SOCIAL_PROOF/URGENCY] + [CTA]
```

#### Constraints
```yaml
meta_description:
  min_length: 120
  max_length: 160
  must_start_with: "action_verb"  # Scopri, Prenota, Richiedi, Trova
  must_contain:
    - primary_keyword
    - benefit_statement
    - call_to_action
  must_not_contain:
    - duplicate_title_content
    - price_only
    - generic_statements: ["benvenuti nel nostro sito"]
```

### 3.3 Open Graph Tags (Social Sharing)

```html
<!-- OBBLIGATORI per ogni pagina -->
<meta property="og:title" content="{page_title}">
<meta property="og:description" content="{page_description}">
<meta property="og:image" content="{image_url_1200x630}">
<meta property="og:url" content="{canonical_url}">
<meta property="og:type" content="website|article|product">
<meta property="og:locale" content="it_IT">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page_title}">
<meta name="twitter:description" content="{page_description}">
<meta name="twitter:image" content="{image_url}">
```

### 3.4 Technical Meta Tags

```html
<!-- Viewport (OBBLIGATORIO) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Charset (OBBLIGATORIO) -->
<meta charset="UTF-8">

<!-- Robots -->
<meta name="robots" content="index, follow">

<!-- Canonical (OBBLIGATORIO per evitare duplicati) -->
<link rel="canonical" href="{canonical_url}">

<!-- Hreflang (per siti multilingua) -->
<link rel="alternate" hreflang="it" href="{it_url}">
<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="x-default" href="{default_url}">
```

---

## 4. Gerarchia Contenuti

### 4.1 Struttura H-Tags

```
⚠️ REGOLA ASSOLUTA: UN SOLO H1 PER PAGINA
```

#### Pattern Obbligatorio

```html
<h1>{Keyword Principale + Contesto}</h1>           <!-- 1 solo -->

  <h2>{Sezione Principale 1}</h2>                   <!-- N multipli -->
    <h3>{Sottosezione 1.1}</h3>                     <!-- Figli di H2 -->
    <h3>{Sottosezione 1.2}</h3>
    
  <h2>{Sezione Principale 2}</h2>
    <h3>{Sottosezione 2.1}</h3>
      <h4>{Dettaglio 2.1.1}</h4>                    <!-- Raramente necessario -->
```

### 4.2 Relazione Meta Title vs H1

```yaml
meta_title_vs_h1:
  relationship: "complementary_not_identical"
  
  meta_title:
    purpose: "Attirare click nei risultati di ricerca"
    location: "SERP (pagina risultati Google)"
    include: "hook, differenziatore, brand"
    
  h1:
    purpose: "Confermare all'utente che è nel posto giusto"
    location: "Dentro la pagina"
    include: "keyword principale, contesto specifico"

# ESEMPIO
meta_title: "Riparazione iPhone Milano | Pronto in 20 Min | TecnoFix"
h1: "Riparazione Professionale iPhone a Milano"
```

### 4.3 Content Structure Template

```markdown
# H1: {Primary Keyword + Context}

Introduzione: 2-3 frasi che rispondono SUBITO alla query dell'utente.
Include la keyword principale nel primo paragrafo.

## H2: {Benefit/Solution 1}

Paragrafo esplicativo. Niente filler, solo valore.

### H3: {Specific Detail 1.1}

Contenuto specifico con esempi concreti.

### H3: {Specific Detail 1.2}

Altro contenuto specifico.

## H2: {Benefit/Solution 2}

Continua con struttura parallela...

## H2: {Social Proof / Trust Signals}

Recensioni, certificazioni, numeri.

## H2: {Call to Action Section}

CTA chiara con beneficio ribadito.
```

---

## 5. Ottimizzazione Immagini

### 5.1 Naming Convention

```python
def generate_image_filename(subject, action, context, location=None):
    """
    VIETATO: IMG_9923.jpg, foto1.png, image.webp
    
    PATTERN: {azione}-{soggetto}-{contesto}-{località}.{ext}
    """
    components = []
    
    if action:
        components.append(sanitize(action))      # "sostituzione"
    components.append(sanitize(subject))          # "batteria"
    components.append(sanitize(context))          # "samsung-s22"
    if location:
        components.append(sanitize(location))     # "milano"
    
    return "-".join(components) + ".webp"

# Output: sostituzione-batteria-samsung-s22-milano.webp
```

### 5.2 Alt Text Requirements

```yaml
alt_text:
  structure: "[Soggetto] + [Azione] + [Contesto]"
  min_length: 10
  max_length: 125
  
  must_contain:
    - descriptive_subject
    - relevant_keyword (naturally)
    
  must_not_contain:
    - "immagine di"
    - "foto di"  
    - keyword_stuffing
    
  examples:
    bad: "foto telefono"
    bad: "riparazione riparazione riparazione iphone"
    good: "Tecnico specializzato durante sostituzione batteria Samsung S22"
    good: "Camera matrimoniale con vista Duomo di Firenze"
```

### 5.3 Technical Image Requirements

```yaml
image_optimization:
  formats:
    preferred: "webp"
    fallback: "jpg"
    graphics: "svg"
    
  dimensions:
    max_width: 1920
    responsive_breakpoints: [320, 640, 768, 1024, 1280, 1920]
    
  file_size:
    hero_images: "< 200KB"
    content_images: "< 100KB"
    thumbnails: "< 50KB"
    
  loading:
    above_fold: "eager"
    below_fold: "lazy"
    
  required_attributes:
    - src
    - alt
    - width
    - height
    - loading
```

### 5.4 Image Srcset Pattern

```html
<img 
  src="image-800.webp"
  srcset="
    image-320.webp 320w,
    image-640.webp 640w,
    image-800.webp 800w,
    image-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, 800px"
  alt="Descrizione semantica dell'immagine"
  width="800"
  height="600"
  loading="lazy"
>
```

---

## 6. Schema.org e Dati Strutturati

### 6.1 Schema Obbligatori per Tipo

```yaml
schema_requirements:
  local_business:
    required: ["LocalBusiness", "PostalAddress", "OpeningHoursSpecification"]
    recommended: ["Review", "AggregateRating", "Service"]
    
  e_commerce:
    required: ["Product", "Offer", "Brand"]
    recommended: ["Review", "AggregateRating", "BreadcrumbList"]
    
  service_business:
    required: ["Service", "Organization", "ContactPoint"]
    recommended: ["FAQ", "HowTo", "Review"]
    
  hospitality:
    required: ["Hotel", "PostalAddress", "Review"]
    recommended: ["Offer", "AggregateRating", "amenityFeature"]
    
  blog_content:
    required: ["Article", "Person", "Organization"]
    recommended: ["BreadcrumbList", "FAQ"]
    
  all_pages:
    required: ["WebSite", "WebPage"]
    recommended: ["BreadcrumbList", "Organization"]
```

### 6.2 LocalBusiness Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "{site_url}/#organization",
  "name": "{business_name}",
  "description": "{business_description}",
  "url": "{site_url}",
  "logo": "{logo_url}",
  "image": ["{image_1}", "{image_2}"],
  "telephone": "{phone}",
  "email": "{email}",
  "priceRange": "{price_range}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{street}",
    "addressLocality": "{city}",
    "addressRegion": "{region}",
    "postalCode": "{zip}",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{lat}",
    "longitude": "{lng}"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{rating}",
    "reviewCount": "{review_count}"
  },
  "sameAs": [
    "{facebook_url}",
    "{instagram_url}",
    "{linkedin_url}"
  ]
}
```

### 6.3 Product Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{product_name}",
  "description": "{product_description}",
  "image": ["{image_urls}"],
  "sku": "{sku}",
  "brand": {
    "@type": "Brand",
    "name": "{brand_name}"
  },
  "offers": {
    "@type": "Offer",
    "url": "{product_url}",
    "priceCurrency": "EUR",
    "price": "{price}",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "{seller_name}"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{rating}",
    "reviewCount": "{count}"
  }
}
```

### 6.4 FAQ Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question_1}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer_1}"
      }
    },
    {
      "@type": "Question", 
      "name": "{question_2}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer_2}"
      }
    }
  ]
}
```

### 6.5 BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{site_url}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{category_name}",
      "item": "{category_url}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{page_name}",
      "item": "{page_url}"
    }
  ]
}
```

---

## 7. Performance e Core Web Vitals

### 7.1 Target Metrics

```yaml
core_web_vitals:
  LCP:  # Largest Contentful Paint
    good: "< 2.5s"
    needs_improvement: "2.5s - 4.0s"
    poor: "> 4.0s"
    
  FID:  # First Input Delay
    good: "< 100ms"
    needs_improvement: "100ms - 300ms"
    poor: "> 300ms"
    
  CLS:  # Cumulative Layout Shift
    good: "< 0.1"
    needs_improvement: "0.1 - 0.25"
    poor: "> 0.25"
    
  INP:  # Interaction to Next Paint (sostituisce FID)
    good: "< 200ms"
    needs_improvement: "200ms - 500ms"
    poor: "> 500ms"
```

### 7.2 Performance Checklist

```yaml
performance_requirements:
  critical_css:
    - inline above-fold CSS
    - defer non-critical CSS
    
  javascript:
    - defer all non-critical JS
    - async where possible
    - no render-blocking scripts
    
  fonts:
    - font-display: swap
    - preload critical fonts
    - limit font variations
    
  images:
    - lazy loading below fold
    - proper sizing (width/height attributes)
    - modern formats (webp, avif)
    - responsive images with srcset
    
  server:
    - enable compression (gzip/brotli)
    - leverage browser caching
    - use CDN for static assets
```

### 7.3 HTML Boilerplate Ottimizzato

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <!-- Critical: Charset & Viewport -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Preconnect to critical domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload critical assets -->
  <link rel="preload" as="style" href="/css/critical.css">
  <link rel="preload" as="font" type="font/woff2" href="/fonts/main.woff2" crossorigin>
  
  <!-- Critical CSS inline -->
  <style>{critical_css_here}</style>
  
  <!-- Non-critical CSS deferred -->
  <link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'">
  
  <!-- Meta Tags -->
  <title>{meta_title}</title>
  <meta name="description" content="{meta_description}">
  <link rel="canonical" href="{canonical_url}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="{og_title}">
  <meta property="og:description" content="{og_description}">
  <meta property="og:image" content="{og_image}">
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">{schema_json}</script>
</head>
<body>
  <!-- Content -->
  
  <!-- Deferred JavaScript -->
  <script src="/js/main.js" defer></script>
</body>
</html>
```

---

## 8. Tracking e Analytics

### 8.1 UTM Parameter Standard

```yaml
utm_parameters:
  utm_source:
    description: "Identifica la sorgente del traffico"
    examples: ["google", "facebook", "newsletter", "instagram"]
    format: "lowercase_underscore"
    
  utm_medium:
    description: "Identifica il mezzo/canale"
    standard_values:
      - "organic"      # Traffico organico
      - "cpc"          # Pay-per-click
      - "email"        # Email marketing
      - "social"       # Social organico
      - "referral"     # Link da altri siti
      - "display"      # Banner advertising
      
  utm_campaign:
    description: "Nome della campagna specifica"
    examples: ["black_friday_2026", "lancio_prodotto", "newsletter_gennaio"]
    format: "lowercase_underscore"
    
  utm_term:
    description: "Keyword (per ads)"
    usage: "Solo per campagne paid search"
    
  utm_content:
    description: "Differenzia varianti (A/B test)"
    examples: ["banner_rosso", "cta_verde", "video_hero"]
```

### 8.2 Link Builder Pattern

```python
def build_tracked_url(base_url, source, medium, campaign, term=None, content=None):
    """
    Genera URL con parametri UTM per tracking completo
    """
    params = {
        "utm_source": sanitize_utm(source),
        "utm_medium": sanitize_utm(medium),
        "utm_campaign": sanitize_utm(campaign),
    }
    
    if term:
        params["utm_term"] = sanitize_utm(term)
    if content:
        params["utm_content"] = sanitize_utm(content)
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return f"{base_url}?{query_string}"

# Esempio output:
# https://example.com/prodotto?utm_source=newsletter&utm_medium=email&utm_campaign=black_friday_2026
```

### 8.3 Analytics Implementation

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>

<!-- Event Tracking Example -->
<script>
  // Track CTA clicks
  document.querySelectorAll('[data-track-cta]').forEach(el => {
    el.addEventListener('click', () => {
      gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': el.dataset.trackCta
      });
    });
  });
</script>
```

---

## 9. Checklist di Validazione

### 9.1 Pre-Launch Checklist

```yaml
seo_checklist:
  urls:
    - [ ] Tutti gli URL sono parlanti e contengono keyword
    - [ ] Nessun parametro query string non necessario
    - [ ] Redirect 301 configurati per vecchi URL
    - [ ] Sitemap.xml generata e valida
    - [ ] robots.txt configurato correttamente
    
  meta_tags:
    - [ ] Ogni pagina ha un Meta Title unico < 60 char
    - [ ] Ogni pagina ha una Meta Description unica < 160 char
    - [ ] Canonical URL impostato su tutte le pagine
    - [ ] Open Graph tags presenti
    - [ ] Hreflang (se multilingua)
    
  content:
    - [ ] Un solo H1 per pagina
    - [ ] Gerarchia H2/H3 corretta
    - [ ] Keyword nel primo paragrafo
    - [ ] Contenuto unico (no duplicati)
    - [ ] Minimo 300 parole per pagina principale
    
  images:
    - [ ] Tutte le immagini hanno alt text
    - [ ] File names descrittivi
    - [ ] Formato WebP con fallback
    - [ ] Lazy loading implementato
    - [ ] Width/Height specificati
    
  schema:
    - [ ] Schema.org appropriato per tipo pagina
    - [ ] Validato con Google Rich Results Test
    - [ ] LocalBusiness per attività locali
    - [ ] BreadcrumbList per navigazione
    
  performance:
    - [ ] LCP < 2.5s
    - [ ] CLS < 0.1
    - [ ] INP < 200ms
    - [ ] PageSpeed Score > 90 mobile
    
  tracking:
    - [ ] Google Analytics configurato
    - [ ] Google Search Console collegato
    - [ ] UTM template documentato
    - [ ] Conversion goals definiti
```

### 9.2 Validation Commands

```bash
# Validate HTML
npx html-validate ./dist/**/*.html

# Check Schema.org
npx structured-data-testing-tool --url https://example.com

# Lighthouse audit
npx lighthouse https://example.com --output html --output-path ./report.html

# Check broken links
npx broken-link-checker https://example.com --recursive

# Validate sitemap
curl -s https://example.com/sitemap.xml | xmllint --noout -
```

---

## 10. Anti-Pattern da Evitare

### 10.1 URL Anti-Patterns

```yaml
url_antipatterns:
  - pattern: "/page?id=123"
    reason: "Non semantico, non indicizzabile"
    
  - pattern: "/servizi/RIPARAZIONE-IPHONE"
    reason: "Maiuscole negli URL"
    
  - pattern: "/servizi_riparazione_iphone"
    reason: "Underscore invece di trattini"
    
  - pattern: "/riparazione-iphone-milano-economica-veloce-professionale"
    reason: "Keyword stuffing nell'URL"
    
  - pattern: "/2024/01/15/riparazione-iphone"
    reason: "Date nell'URL (tranne blog/news)"
```

### 10.2 Content Anti-Patterns

```yaml
content_antipatterns:
  - pattern: "Multiple H1 tags"
    reason: "Confonde i crawler sulla gerarchia"
    
  - pattern: "H1 → H3 (skip H2)"
    reason: "Gerarchia interrotta"
    
  - pattern: "Keyword density > 3%"
    reason: "Keyword stuffing penalizzato"
    
  - pattern: "Hidden text (display:none with content)"
    reason: "Considerato spam"
    
  - pattern: "Thin content (< 100 words)"
    reason: "Valore insufficiente per indicizzazione"
    
  - pattern: "Duplicate content across pages"
    reason: "Cannibalizzazione keyword"
```

### 10.3 Technical Anti-Patterns

```yaml
technical_antipatterns:
  - pattern: "Render-blocking JavaScript"
    reason: "Aumenta LCP, penalizza Core Web Vitals"
    
  - pattern: "Images without dimensions"
    reason: "Causa CLS (layout shift)"
    
  - pattern: "Non-compressed images > 500KB"
    reason: "Rallenta caricamento"
    
  - pattern: "Missing alt attributes"
    reason: "Accessibilità e SEO compromessi"
    
  - pattern: "No canonical URL"
    reason: "Rischio contenuto duplicato"
    
  - pattern: "Mixed content (HTTP on HTTPS)"
    reason: "Security warning, trust issues"
```

### 10.4 Schema Anti-Patterns

```yaml
schema_antipatterns:
  - pattern: "Self-review (azienda recensisce se stessa)"
    reason: "Viola linee guida Google"
    
  - pattern: "Rating senza recensioni reali"
    reason: "Spam, rischio penalizzazione"
    
  - pattern: "Schema non corrispondente al contenuto"
    reason: "Misleading, penalizzato"
    
  - pattern: "Nested schema non valido"
    reason: "Non parsato correttamente"
```

---

## 📚 Appendice: Quick Reference

### Meta Title Formula
```
[COSA] + [PER CHI] + [HOOK] | [BRAND]
Max 60 caratteri
```

### Meta Description Formula
```
[VERBO] + [BENEFICIO] + [KEYWORD] + [TRUST] + [CTA]
120-160 caratteri
```

### Alt Text Formula
```
[SOGGETTO] + [AZIONE] + [CONTESTO]
10-125 caratteri
```

### URL Formula
```
/[servizio]-[target]-[località]
Solo minuscole, trattini, no parametri
```

---

**Document Version:** 2.0  
**Maintained by:** IMMOBY Digital Strategy  
**Last Updated:** January 2026
