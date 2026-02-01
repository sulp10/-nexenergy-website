# NexEnergy - Sito Web Retrofit Energetico Hotel

Sito web B2B per NexEnergy - Sistema di retrofit energetico intelligente per l'hospitality italiana.

## Project Overview

- **Project Name**: NexEnergy Website
- **Type**: Landing Page / Lead Generation Site
- **Stack**: HTML5 / CSS3 / Vanilla JavaScript (o Next.js se richiesto)
- **Target**: Hotel e strutture ricettive in Italia
- **Language**: Italiano
- **Features**: Hero section, Problem/Solution narrative, Two-phase methodology, Contact form, SEO optimization

## Branding

- **Name**: NexEnergy
- **Primary Color**: Da definire (suggerito: #0066CC o #10B981)
- **Email From**: info@nexenergy.it
- **Logo**: Not yet defined
- **Tone**: Competente, innovativo, pragmatico

## Content Sections

Il sito è strutturato come single-page con anchor navigation:

1. **Hero Section** (`#hero`)
2. **Problema** (`#problema`) - Il Paradosso dell'Eccellenza Italiana
3. **Soluzione** (`#soluzione`) - Non Ristrutturare. Evolvi.
4. **Metodo Tesla** (`#metodo`) - Hardware + AI
5. **Contatti/CTA** (`#contatti`) - Form di richiesta demo

## Hero Section

```
Headline: "L'Evoluzione Energetica dell'Ospitalità Italiana: Intelligente, Immediata, Invisibile."

Sub-headline: "Sfrutta la potenza dell'ingegneria energetica e dell'AI per abbattere i costi 
della tua struttura. Nessun cantiere, zero disagi, risparmio attivo dal giorno uno."

CTA Primario: "Richiedi una Demo"
CTA Secondario: "Scopri Come Funziona"

Trust Signals:
- Installazione in 24h per camera
- Zero opere murarie
- ROI medio in 18 mesi
```

## Key Business Messages

### Il Problema (Sistema a Tessera)

Il sistema a tessera tradizionale **non funziona** nella pratica:
- Gli ospiti richiedono una seconda tessera
- Una card rimane inserita h24
- Luci e clima attivi anche a camera vuota
- Il risparmio teorico viene neutralizzato

**Key phrase**: "Un'infrastruttura che dovrebbe far risparmiare, ma che di fatto viene neutralizzata dal comportamento naturale dell'ospite."

### La Soluzione (Retrofit)

NexEnergy è la prima tecnologia di **retrofit energetico nativo** per hospitality:
- Installazione su infrastrutture esistenti
- Nessuna opera muraria
- Camere operative durante installazione
- Progettato da ingegneri che conoscono le dinamiche alberghiere

**Key phrase**: "Non Ristrutturare. Evolvi."

### Il Metodo Tesla

Due fasi distinte:

**Fase 1 - Setup Immediato** (Giorno 1):
- Hardware completo e funzionale
- Gestione clima ed energia elettrica
- Risparmio netto "6.0" vs sistemi a tessera
- "Night Mode" per consumi notturni

**Fase 2 - Evoluzione Sartoriale** (dopo 2-3 mesi):
- Algoritmi ML e modelli LLM analizzano i dati
- Profilo energetico unico per ogni stanza
- Basato su esposizione, isolamento termico, uso reale
- Gestione comfort autonoma

**Key phrase**: "Non applichiamo regole generiche: l'AI crea un profilo energetico unico basato sull'esposizione, l'isolamento termico e l'uso reale di quella specifica stanza."

## Contact Form Fields

| Campo | Tipo | Required | Placeholder |
|-------|------|----------|-------------|
| nome | text | ✅ | Nome e Cognome |
| email | email | ✅ | Email aziendale |
| telefono | tel | ❌ | Telefono (opzionale) |
| nome_struttura | text | ✅ | Nome Hotel/Struttura |
| numero_camere | select | ✅ | 10-30 / 31-60 / 61-100 / 100+ |
| messaggio | textarea | ❌ | Raccontaci le tue esigenze... |

**Submit Button**: "Richiedi Consulenza Gratuita"

## SEO Requirements

### Meta Tags

```html
<title>NexEnergy | Retrofit Energetico Intelligente per Hotel Italia</title>
<meta name="description" content="Riduci i costi energetici del tuo hotel senza cantieri. 
Sistema retrofit con AI che impara dalla tua struttura. Risparmio attivo dal giorno uno. 
Richiedi demo.">
```

### Target Keywords

- **Primary**: retrofit energetico hotel
- **Secondary**: risparmio energetico hotel, smart energy hotel, efficienza energetica albergo
- **Long-tail**: sistema risparmio energia hotel senza ristrutturazione

### Heading Structure

```
H1: Retrofit Energetico Intelligente per l'Hospitality Italiana (1 solo)
  H2: Il Paradosso dell'Eccellenza Italiana
    H3: Il Fallimento del Sistema a Tessera
  H2: Non Ristrutturare. Evolvi.
    H3: Installazione Non Invasiva
    H3: Ecosistema Invisibile
    H3: Svecchiamento Senza Cantiere
  H2: Un Hardware pronto oggi, un'Intelligenza che impara domani
    H3: Fase 1: Setup Immediato
    H3: Fase 2: L'Evoluzione Sartoriale
  H2: Pronto a Trasformare i Costi in Margine?
```

### Schema.org Required

- Organization (NexEnergy)
- Service (Retrofit Energetico)
- FAQPage (5 domande)
- BreadcrumbList (pagine interne)

## Performance Targets

| Metric | Target | Minimum |
|--------|--------|---------|
| LCP | < 2.5s | < 4.0s |
| CLS | < 0.1 | < 0.25 |
| INP | < 200ms | < 500ms |
| Lighthouse Performance | 90+ | 85 |
| Lighthouse SEO | 100 | 95 |
| Lighthouse Accessibility | 95+ | 90 |

## Image Requirements

| Image | Filename | Alt Text | Size |
|-------|----------|----------|------|
| Hero | hotel-risparmio-energetico-nexenergy.webp | Sistema NexEnergy installato in camera d'hotel | 1920x1080, <200KB |
| Problema | sistema-tessera-hotel-problema.webp | Taschino porta tessera hotel che viene aggirato | 800x600, <100KB |
| Soluzione | installazione-retrofit-camera-hotel.webp | Tecnico NexEnergy durante installazione retrofit | 800x600, <100KB |
| Dashboard | dashboard-ai-energy-management-hotel.webp | Dashboard AI NexEnergy con analisi consumi | 1200x800, <150KB |
| OG Image | nexenergy-retrofit-energetico-hotel-og.webp | NexEnergy - Retrofit Energetico per Hotel | 1200x630, <300KB |

## Project Structure

```
/
├── index.html                    # Homepage (single-page)
├── robots.txt                    # Crawler directives
├── sitemap.xml                   # XML sitemap
├── favicon.ico
├── favicon.svg
│
├── /css/
│   ├── critical.css              # Inline in <head>
│   └── main.css                  # Deferred loading
│
├── /js/
│   ├── main.js                   # Main functionality
│   └── analytics.js              # GA4 tracking
│
├── /images/
│   ├── hero/
│   ├── sections/
│   └── icons/
│
└── /pages/                       # Se multi-page
    ├── soluzione-retrofit-energetico-hotel/index.html
    ├── tecnologia-ai-energy-management/index.html
    ├── vantaggi-risparmio-energetico-hotel/index.html
    └── contatti/index.html
```

## Analytics & Tracking

### Google Analytics 4

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});
```

### Events to Track

| Event Name | Trigger | Category |
|------------|---------|----------|
| form_submit_demo | Form submission | lead_generation |
| cta_click_hero | Hero CTA click | engagement |
| cta_click_secondary | Secondary CTA | engagement |
| section_view | Scroll to section | engagement |

### UTM Templates

```
Google Ads:    ?utm_source=google&utm_medium=cpc&utm_campaign={campaign}
LinkedIn Ads:  ?utm_source=linkedin&utm_medium=cpc&utm_campaign={campaign}
Email:         ?utm_source=newsletter&utm_medium=email&utm_campaign={campaign}
Social:        ?utm_source={platform}&utm_medium=social&utm_campaign=organic
```

## Quality Checks (Before Deploy)

1. **HTML Validation** - W3C Validator, 0 errors
2. **Schema Validation** - Google Rich Results Test, all valid
3. **Lighthouse SEO** - Score 100
4. **Lighthouse Performance** - Score 90+
5. **Mobile-Friendly Test** - Pass
6. **Core Web Vitals** - All green
7. **Form Submission** - Working correctly
8. **Analytics Events** - Firing properly

## Key Patterns

- Single H1 per page containing primary keyword
- H2/H3 hierarchy without skipping levels
- All images with descriptive alt text (10-125 chars)
- All images with width/height attributes
- Hero image: loading="eager"
- Below-fold images: loading="lazy"
- Critical CSS inlined in <head>
- All JavaScript deferred
- WebP format with JPG fallback
- font-display: swap on all fonts
- Canonical URL on every page
- Open Graph tags with 1200x630 image

## Content Rules

- **Lingua**: Italiano per tutti i testi user-facing
- **Tone**: Competente ma accessibile, mai aggressivo
- **Avoid**: "migliore", "numero 1", "garantito", "incredibile"
- **Use**: Dati concreti (ROI 18 mesi, 24h installazione, 6.0 risparmio)
- **Format**: Prose over bullet points where possible

## Form Backend Options

- Formspree (recommended for static)
- Netlify Forms (if deployed on Netlify)
- Custom API endpoint

## Newsletter & AI Blog Integrations

### MailerLite Newsletter

```
API Base URL: https://connect.mailerlite.com/api
Key Env: MAILERLITE_API_KEY
Rate Limit: 120 requests/minute

Endpoints:
- POST /subscribers - Create/Update subscriber (upsert)
- GET /groups - List subscriber groups
- POST /subscribers/:id/forget - GDPR forget

Headers:
- Authorization: Bearer {MAILERLITE_API_KEY}
- Content-Type: application/json
- Accept: application/json
```

### OpenRouter AI Blog Agent

```
API Base URL: https://openrouter.ai/api/v1
Key Env: OPENROUTER_API_KEY
Model: anthropic/claude-3.5-sonnet

Endpoints:
- POST /chat/completions - Generate blog content
- GET /credits - Check remaining credits
- GET /models - List available models

Headers:
- Authorization: Bearer {OPENROUTER_API_KEY}
- Content-Type: application/json
- HTTP-Referer: https://nexenergy.it
- X-Title: NexEnergy Blog Agent
```

### Payload CMS Integration

```
Base URL: Defined in prd.json
Key Env: PAYLOAD_API_KEY
POST /api/posts - Create blog post
POST /api/media - Upload images
```

### Resend Email Notifications

```
Key Env: RESEND_API_KEY
From: notifiche@nexenergy.it
Admin: ADMIN_EMAIL env

Templates:
- article_published - New article notification
- api_error - API error alerts
- credits_warning - Low credits warning
```

### Blog Section

```
URL: /blog.html
Article Pattern: /blog/{slug}.html
Articles Per Page: 6
Fetch Source: /blog/articles.json
```

## Required Environment Variables

| Variable | Purpose |
|----------|---------|
| MAILERLITE_API_KEY | Newsletter subscription API |
| OPENROUTER_API_KEY | AI blog content generation |
| PAYLOAD_API_KEY | CMS article publishing |
| RESEND_API_KEY | Email notifications |
| ADMIN_EMAIL | Admin notification recipient |

## Open Questions

- [ ] Domain finale per canonical URLs?
- [ ] Brand assets (logo, colori definitivi, font)?
- [ ] GA4 Measurement ID?
- [ ] Form submission endpoint?
- [ ] Cookie consent banner richiesto?
- [ ] Hosting platform (Vercel, Netlify, altro)?
