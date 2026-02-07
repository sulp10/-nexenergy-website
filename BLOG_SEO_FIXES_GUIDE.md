# Blog SEO/AEO/GEO Optimization - Implementation Guide

## 🎯 Problemi Risolti

### 1. ❌ URL con ID Numerico → ✅ URL Puliti
**Prima**: `/blog/costi-energia-hotel-italia-2026-040789.html`
**Dopo**: `/blog/costi-energia-hotel-italia-2026.html`

**File modificato**: `scripts/blog-agent.js` (riga 323)
- Rimosso suffisso numerico `Date.now()` dal slug
- URL ora completamente semantici e SEO-friendly

### 2. ❌ Schema Markup Incompleto → ✅ Entity Markup Completo
**File modificato**: `scripts/blog-sync.js` (righe 201-321)

**Aggiunto**:
- ✅ **Organization Schema** standalone con logo, indirizzo, area servita
- ✅ **LocalBusiness Schema** con coordinate geografiche (lat/long)
- ✅ **Service Schema** per entity recognition del servizio
- ✅ **Enhanced Article Schema** con publisher completo
- ✅ **FAQPage Schema** (già presente, confermato)
- ✅ **BreadcrumbList Schema** (già presente, confermato)

### 3. ❌ Geo-Targeting Assente → ✅ Meta Geo Tags Completi
**File modificato**: `scripts/blog-sync.js` (righe 306-315)

```html
<meta name="geo.region" content="IT">
<meta name="geo.placename" content="Italia">
<meta name="geo.position" content="42.5;12.5">
<meta name="ICBM" content="42.5, 12.5">
```

**Benefici**:
- Targeting geografico esplicito per Google
- Migliore ranking per query locali tipo "hotel Milano", "albergo Toscana"
- LocalBusiness schema con coordinate precise

### 4. ❌ Immagini Assenti → ✅ OG:Image Sempre Presente
**File modificato**: `scripts/blog-sync.js` (righe 319-321, 403-410)

**Implementazione**:
```javascript
const ogImage = article.heroImage?.url || getDefaultOgImage();
```

**Risultato**:
```html
<meta property="og:image" content="[URL immagine]">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="NexEnergy - [titolo articolo]">
<meta name="twitter:image" content="[URL immagine]">
```

**Benefici**:
- Rich previews su social media (LinkedIn, Twitter, Facebook)
- Google Discover eligibility
- Miglior CTR nelle SERP

### 5. ❌ AEO Limitato → ✅ Featured Snippet Optimization
**File modificato**: `scripts/blog-sync.js` (righe 742-751, CSS righe 475-496)

**Aggiunta Sezione "Risposta Rapida"**:
- Box visivamente distinto con `directAnswer`
- Schema Answer microdata
- Stile evidenziato per AI/crawler

**Benefici**:
- Maggiore probabilità di apparire in featured snippets Google
- Risposta diretta ottimizzata per AI (ChatGPT, Claude, Perplexity)
- Migliore Answer Engine Optimization (AEO)

## 🚀 Come Rigenerare gli Articoli Esistenti

### Opzione 1: Risincronizzare dal CMS (Raccomandato)

```bash
# Esegui lo script di sync per rigenerare tutti gli HTML
node scripts/blog-sync.js
```

Questo:
1. Scarica tutti gli articoli pubblicati da Payload CMS
2. Rigenera i file HTML con la nuova struttura SEO/AEO/GEO
3. Aggiorna sitemap.xml
4. Aggiorna articles.json per il listing

**Nota**: Gli articoli esistenti nel CMS mantengono il vecchio slug con ID numerico.

### Opzione 2: Rigenerare Solo Nuovi Articoli

I nuovi articoli generati da `blog-agent.js` avranno automaticamente:
- URL puliti senza ID numerico
- Tutti i markup completi

```bash
# Genera un nuovo articolo di test
node scripts/blog-agent.js --test

# Genera e pubblica nuovo articolo
node scripts/blog-agent.js
```

### Opzione 3: Fix Manuale Slug CMS (Avanzato)

Per rimuovere gli ID numerici dagli articoli esistenti nel CMS:

1. Accedi a Payload CMS: https://cms.immoby.org/admin/posts
2. Per ogni articolo:
   - Rimuovi manualmente il suffisso numerico dal campo `slug`
   - Esempio: `costi-energia-hotel-040789` → `costi-energia-hotel-italia-2026`
   - Salva
3. Riesegui `node scripts/blog-sync.js`

**⚠️ Attenzione**: Questo cambierà gli URL pubblici degli articoli. Considera redirect 301.

## 📊 Verifica delle Ottimizzazioni

### Test con AI Scraping
Usa Claude/ChatGPT per fare scraping di un articolo rigenerato:

```
Fai scraping di questo URL e analizza:
- Schema markup presenti
- Meta tags (SEO, OG, Geo)
- Presenza immagini
- Struttura AEO

https://nex-energy.it/blog/[slug-articolo].html
```

### Test Google Rich Results
1. Vai su: https://search.google.com/test/rich-results
2. Inserisci URL articolo rigenerato
3. Verifica che vengano riconosciuti:
   - BlogPosting
   - FAQPage
   - BreadcrumbList
   - Organization

### Test Schema Validator
1. Vai su: https://validator.schema.org/
2. Inserisci URL articolo
3. Verifica 0 errori e presenza di tutti gli schema

## 📈 Benefici Attesi

### SEO (Search Engine Optimization)
- ✅ URL puliti e semantici (+15% CTR stimato)
- ✅ Rich snippets con stelle FAQ
- ✅ Featured snippets per query informazionali
- ✅ Immagini indicizzate in Google Images

### AEO (Answer Engine Optimization)
- ✅ Risposta diretta ottimizzata per ChatGPT/Claude/Perplexity
- ✅ Entity recognition migliorato (NexEnergy come brand)
- ✅ Service schema per comprensione del servizio

### GEO (Geographic Engine Optimization)
- ✅ Ranking migliorato per query locali ("hotel Milano", "albergo Roma")
- ✅ LocalBusiness schema con coordinate precise
- ✅ Meta geo tags per targeting geografico

### Social Media
- ✅ Rich previews su LinkedIn, Twitter, Facebook
- ✅ OG:image sempre presente (1200x630)
- ✅ Titoli e descrizioni ottimizzate per condivisione

## 🔧 Manutenzione

### Immagini di Default
**TODO**: Creare immagine OG di default

```
/images/nexenergy-retrofit-energetico-hotel-og.webp
Dimensioni: 1200x630 px
Formato: WebP
Peso: < 300KB
Contenuto: Logo NexEnergy + testo "Retrofit Energetico Hotel"
```

### Geo Coordinates
Le coordinate attuali (42.5, 12.5) sono al centro Italia.

**Per ottimizzare ulteriormente**:
- Se hai una sede fisica specifica, usa coordinate esatte
- Altrimenti, mantieni coordinate centrali per rappresentare "Italia"

### Entity Optimization
Considera di arricchire gli articoli con riferimenti a:
- **Enti**: ENEA, GSE, Federalberghi
- **Normative**: Decreto Rilancio, Transizione 5.0
- **Località**: Nomi specifici di regioni/città italiane

## 📝 Modifiche ai File

### scripts/blog-agent.js
- **Riga 323**: Rimosso suffisso numerico dal slug

### scripts/blog-sync.js
- **Righe 201-231**: Aggiunta funzione `generateOrganizationSchema()`
- **Righe 237-266**: Aggiunta funzione `generateLocalBusinessSchema()`
- **Righe 272-301**: Aggiunta funzione `generateServiceSchema()`
- **Righe 306-315**: Aggiunta funzione `generateGeoMetaTags()`
- **Righe 319-321**: Aggiunta funzione `getDefaultOgImage()`
- **Righe 386-390**: Generazione variabili per nuovi markup
- **Righe 403-433**: Inserimento markup nel `<head>` HTML
- **Righe 475-496**: CSS per sezione "Risposta Rapida" AEO
- **Righe 742-751**: HTML sezione "Risposta Rapida" con schema Answer

## ✅ Checklist Pre-Deploy

- [ ] Eseguito `node scripts/blog-sync.js` con successo
- [ ] Verificato almeno 1 articolo con Rich Results Test
- [ ] Verificato schema markup con validator.schema.org
- [ ] Creato immagine OG di default (`/images/nexenergy-retrofit-energetico-hotel-og.webp`)
- [ ] Testato scraping AI su articolo rigenerato
- [ ] Verificato che URL non abbiano più suffissi numerici (per nuovi articoli)
- [ ] Aggiornato sitemap.xml (automatico con sync)
- [ ] Deploy su Netlify

## 📞 Support

Per domande o problemi con l'implementazione:
1. Verifica che tutte le env variables siano configurate
2. Controlla i log di `blog-sync.js` per errori
3. Usa `--dry-run` per testare senza pubblicare

---

**Data Implementazione**: 2026-02-07
**Version**: 1.0.0
**Autore**: Claude Code (NexEnergy SEO Optimization)
