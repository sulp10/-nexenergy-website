# Ralph - AI Coding Agent Instructions

You are Ralph, an autonomous AI coding agent working on the NexEnergy website.

## Your Mission

Complete all User Stories in `prd.json` by implementing them one at a time, following their acceptance criteria exactly.

### Current Phase: Newsletter & AI Blog Integration

The new User Stories (US-NX-010 to US-NX-013) require these integrations:

#### MailerLite Newsletter (US-NX-010)
- API Base: `https://connect.mailerlite.com/api`
- Endpoint: `POST /subscribers` with Bearer token auth
- Headers: `Authorization: Bearer {MAILERLITE_API_KEY}`, `Content-Type: application/json`
- Create popup with email + name fields, GDPR consent checkbox

#### AI Blog Agent (US-NX-012, US-NX-011)
- API Base: `https://openrouter.ai/api/v1`
- Endpoint: `POST /chat/completions` with Bearer token auth
- Headers: `HTTP-Referer: https://nexenergy.it`, `X-Title: NexEnergy Blog Agent`
- Model: `anthropic/claude-3.5-sonnet`
- Content: Human-style Italian, 800-1500 words, SEO optimized

#### Payload CMS (FR-029 to FR-031)
- Publish articles via API with title, slug, content, meta, images
- Auto-generate schema markup

#### Resend Notifications (US-NX-013)
- Send emails on API errors, low credits, article published
- From: notifiche@nexenergy.it

## Workflow (Critical - Follow Exactly)

1. **Read PRD**: Load `/mnt/project/prd.json`
2. **Find Next Task**: Select the User Story with the lowest `priority` number where `passes: false`
3. **Read Context**: Refer to `/mnt/project/CLAUDE.md` for project architecture and rules
4. **Implement**: Complete ALL acceptance criteria for that story
5. **Verify**: Run `npm run typecheck` (must pass)
6. **Update PRD**: Set `passes: true` and add completion notes to that specific User Story
7. **Log Progress**: Append summary to `progress.txt`
8. **Check Completion**: If ALL stories have `passes: true`, output: `<promise>COMPLETE</promise>`
9. **Repeat**: Continue to next story

## Critical Rules

- ✅ Work on ONE User Story at a time (sorted by priority number)
- ✅ Follow acceptance criteria EXACTLY - they are your requirements
- ✅ Run typecheck after code changes - it MUST pass
- ✅ Update ONLY the specific User Story you completed in prd.json
- ✅ Be autonomous - don't ask for permission
- ✅ If errors occur, debug and fix them yourself
- ✅ When updating prd.json, preserve all other data exactly
- ✅ Always log what you completed in progress.txt

## PRD Update Format

When you complete a User Story, update its entry in prd.json:

```json
{
  "id": "US-XXX",
  "title": "...",
  "description": "...",
  "acceptanceCriteria": [...],
  "priority": X,
  "passes": true,  // ← Set to true
  "notes": "Completed: [brief description of implementation]"  // ← Add notes
}
```

## Progress Logging Format

Append to `progress.txt`:

```
[2025-01-23 14:30] Completed US-XXX: Title Here
- Key implementation details
- Files created/modified
- Tests passed: yes

```
## Linee Guida per la Generazione del Sito NexEnergy

**Progetto:** NexEnergy - Retrofit Energetico Intelligente per Hospitality  
**Versione:** 1.0  
**Data:** Gennaio 2026

---

## 📋 Indice

1. [Overview del Progetto](#1-overview-del-progetto)
2. [Brand Voice e Tone](#2-brand-voice-e-tone)
3. [Struttura delle Pagine](#3-struttura-delle-pagine)
4. [Contenuti Sezione per Sezione](#4-contenuti-sezione-per-sezione)
5. [Implementazione SEO](#5-implementazione-seo)
6. [Schema.org Markup](#6-schemaorg-markup)
7. [Specifiche Immagini](#7-specifiche-immagini)
8. [Performance Requirements](#8-performance-requirements)
9. [Tracking e Analytics](#9-tracking-e-analytics)
10. [Checklist Pre-Launch](#10-checklist-pre-launch)

---

## 1. Overview del Progetto

### 1.1 Il Business

**NexEnergy** è un sistema di retrofit energetico intelligente progettato specificamente per il settore hospitality italiano. Il prodotto risolve il problema dei sistemi a tessera (energy switch) che vengono facilmente aggirati dagli ospiti, causando sprechi energetici.

### 1.2 Target Audience

| Segmento | Descrizione | Pain Points |
|----------|-------------|-------------|
| **Primario** | Proprietari e direttori hotel Italia | Costi energetici elevati, sistemi obsoleti |
| **Secondario** | Property managers, catene alberghiere | Scalabilità, ROI misurabile |
| **Terziario** | Investitori hospitality | Valorizzazione asset, ESG compliance |

### 1.3 Unique Selling Propositions (USP)

```
✅ Retrofit SENZA opere murarie
✅ Installazione SENZA fermare operatività camere
✅ ROI rapido e MISURABILE
✅ AI che IMPARA e si adatta alla singola stanza
✅ Aggiornamenti software CONTINUI (modello Tesla)
```

### 1.4 Competitor Positioning

NexEnergy si differenzia da:
- **Sistemi a tessera tradizionali**: Facilmente aggirati, risparmio teorico
- **BMS (Building Management Systems)**: Costosi, richiedono ristrutturazioni
- **Soluzioni HVAC generiche**: Non pensate per hospitality

---

## 2. Brand Voice e Tone

### 2.1 Personalità del Brand

| Attributo | Descrizione | Esempio |
|-----------|-------------|---------|
| **Competente** | Ingegneri energetici esperti | "Progettato da ingegneri che conoscono le dinamiche alberghiere" |
| **Innovativo** | Tecnologia AI/ML all'avanguardia | "Il Metodo Tesla applicato all'hospitality" |
| **Pragmatico** | Focus su risultati concreti | "Risparmio attivo dal giorno uno" |
| **Rispettoso** | Mai aggressivo o invadente | "Ecosistema invisibile che lavora in background" |

### 2.2 Tone of Voice

```
✅ DO:
- Usa linguaggio tecnico ma accessibile
- Enfatizza benefici concreti e misurabili
- Parla dei problemi reali (tessere aggirate)
- Usa metafore efficaci (Tesla, sartoriale)

❌ DON'T:
- Non usare gergo troppo tecnico senza spiegazione
- Non fare promesse vaghe ("il migliore", "incredibile")
- Non criticare direttamente competitor
- Non usare urgenza artificiale ("solo oggi!")
```

### 2.3 Keyword Vocabulary

| Termine Preferito | Evitare |
|-------------------|---------|
| Retrofit | Ristrutturazione |
| Evolvi | Cambia |
| Intelligente | Smart (abusato) |
| Sartoriale | Personalizzato |
| Ecosistema | Sistema |
| Margine operativo | Guadagno |

---

## 3. Struttura delle Pagine

### 3.1 Sitemap

```
/                                    → Homepage (single-page con sezioni)
├── #hero                            → Hero Section
├── #problema                        → Il Paradosso / Problema Tessere
├── #soluzione                       → La Soluzione Retrofit
├── #metodo                          → Metodo Tesla (Fase 1 + Fase 2)
├── #contatti                        → Form di Contatto
│
/soluzione-retrofit-energetico-hotel → Landing approfondimento soluzione
/tecnologia-ai-energy-management     → Landing tecnologia AI
/vantaggi-risparmio-energetico-hotel → Landing vantaggi/benefici
/contatti                            → Pagina contatti dedicata
```

### 3.2 Homepage Structure (Single-Page)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (Logo + Nav + CTA)                                   │
├─────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                │
│ - Headline principale                                       │
│ - Sub-headline                                              │
│ - CTA primario + secondario                                 │
│ - Trust signals                                             │
├─────────────────────────────────────────────────────────────┤
│ PROBLEMA SECTION                                            │
│ - Il Paradosso dell'Eccellenza Italiana                     │
│ - Il fallimento del sistema a tessera                       │
├─────────────────────────────────────────────────────────────┤
│ SOLUZIONE SECTION                                           │
│ - Non Ristrutturare. Evolvi.                                │
│ - 3 benefit cards con icone                                 │
├─────────────────────────────────────────────────────────────┤
│ METODO SECTION                                              │
│ - Il Metodo Tesla                                           │
│ - Fase 1: Setup Immediato                                   │
│ - Fase 2: Evoluzione Sartoriale                             │
├─────────────────────────────────────────────────────────────┤
│ CTA / CONTACT SECTION                                       │
│ - Form di contatto                                          │
│ - Trust elements                                            │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
│ - Links, Legal, Social                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Contenuti Sezione per Sezione

### 4.1 Hero Section

```html
<!-- MARKUP STRUCTURE -->
<section id="hero">
  <h1>Retrofit Energetico Intelligente per l'Hospitality Italiana</h1>
  
  <p class="headline">
    L'Evoluzione Energetica dell'Ospitalità Italiana: 
    Intelligente, Immediata, Invisibile.
  </p>
  
  <p class="subheadline">
    Sfrutta la potenza dell'ingegneria energetica e dell'AI per abbattere 
    i costi della tua struttura. Nessun cantiere, zero disagi, risparmio 
    attivo dal giorno uno.
  </p>
  
  <div class="cta-group">
    <a href="#contatti" class="btn-primary">Richiedi una Demo</a>
    <a href="#soluzione" class="btn-secondary">Scopri Come Funziona</a>
  </div>
  
  <div class="trust-signals">
    <span>✓ Installazione in 24h per camera</span>
    <span>✓ Zero opere murarie</span>
    <span>✓ ROI medio in 18 mesi</span>
  </div>
</section>
```

**Regole Hero:**
- H1 contiene keyword "Retrofit Energetico" + "Hospitality Italiana"
- Headline e subheadline sono testo, NON parte dell'H1
- CTA primario è sempre visibile above the fold
- Trust signals usano checkmark (✓) non emoji

### 4.2 Problema Section

```markdown
## Il Paradosso dell'Eccellenza Italiana
### (e l'illusione del risparmio)

L'Italia vanta un patrimonio ricettivo unico, ma le infrastrutture 
energetiche sono spesso ferme a decenni fa. Chi gestisce un hotel oggi 
si trova davanti a un bivio: affrontare ristrutturazioni invasive e 
costose, o affidarsi a soluzioni palliative ormai obsolete.

### Il Fallimento del Sistema a Tessera

Molte strutture si affidano ai classici taschini per l'attivazione 
della luce, convinte di risparmiare. La realtà operativa, però, è diversa.

**Il problema concreto:** Basta che un ospite richieda una seconda 
tessera (per il partner o per comodità) per aggirare l'intero sistema: 
una card rimane inserita h24, mantenendo luci e clima attivi anche a 
camera vuota.

**Il risultato?** Un'infrastruttura che dovrebbe far risparmiare, ma che 
di fatto viene neutralizzata dal comportamento naturale dell'ospite.

> NexEnergy nasce per risolvere esattamente questo cortocircuito 
> tra teoria e realtà.
```

**Regole Problema:**
- Usare H2 per titolo principale, H3 per sottosezioni
- Evidenziare il pain point specifico (doppia tessera)
- Concludere con bridge verso la soluzione
- Tono empatico, non accusatorio

### 4.3 Soluzione Section

```markdown
## Non Ristrutturare. Evolvi.

Abbiamo creato la prima tecnologia di retrofit energetico nativo per 
l'hospitality. A differenza dei sistemi generalisti, NexEnergy è 
progettato da ingegneri energetici che conoscono le dinamiche alberghiere.

### I Tre Pilastri del Retrofit NexEnergy

| Pilastro | Beneficio |
|----------|-----------|
| 🔧 Installazione Non Invasiva | Hardware su infrastrutture esistenti, nessuna opera muraria |
| 👁️ Ecosistema Invisibile | Lavora in background, ROI rapido |
| 🔄 Svecchiamento Senza Cantiere | Evolvi l'impianto senza ristrutturazione |
```

**Regole Soluzione:**
- Headline memorabile ("Non Ristrutturare. Evolvi.")
- Tre benefit cards con icone consistenti
- Enfasi su "nativo per hospitality"
- Credenziale: "ingegneri energetici"

### 4.4 Metodo Tesla Section

```markdown
## Un Hardware pronto oggi, un'Intelligenza che impara domani
### Il Metodo Tesla applicato all'Hospitality

Adottiamo un modello di business ispirato all'automotive più avanzato.

---

### Fase 1: Setup Immediato
**Timeline: Attivo dal Giorno 1**

Installiamo un hardware completo e funzionale fin dal primo giorno.

**Cosa ottieni subito:**
- ✓ Gestione clima ed energia elettrica automatizzata
- ✓ Risparmio netto "6.0" rispetto ai sistemi a tessera
- ✓ Funzionalità "Night Mode" per consumi notturni
- ✓ Zero disturbo al sonno dell'ospite

---

### Fase 2: L'Evoluzione Sartoriale
**Timeline: Attivo dopo 2-3 mesi di apprendimento**

Mentre il sistema lavora, acquisisce dati. I nostri algoritmi di 
Machine Learning e modelli LLM rilasciano aggiornamenti customizzati.

**Cosa ottieni dopo l'apprendimento:**
- ✓ Profilo energetico UNICO per ogni stanza
- ✓ Analisi esposizione e isolamento termico reale
- ✓ Gestione comfort AUTONOMA (ospite non tocca termostato)
- ✓ Massimizzazione margine operativo

> Non applichiamo regole generiche: l'AI crea un profilo energetico 
> unico basato sull'esposizione, l'isolamento termico e l'uso reale 
> di quella specifica stanza.
```

**Regole Metodo:**
- Dividere chiaramente Fase 1 e Fase 2
- Timeline esplicita per ogni fase
- Bullet points con checkmark per features
- Quote box per key message finale
- Menzione esplicita di ML e LLM per credibilità tech

### 4.5 Contact/CTA Section

```html
<section id="contatti">
  <h2>Pronto a Trasformare i Costi in Margine?</h2>
  <p>Richiedi un'analisi gratuita dei consumi della tua struttura.</p>
  
  <form id="contact-form" data-track="form_submit_demo">
    <input type="text" name="nome" placeholder="Nome e Cognome" required>
    <input type="email" name="email" placeholder="Email aziendale" required>
    <input type="tel" name="telefono" placeholder="Telefono (opzionale)">
    <input type="text" name="nome_struttura" placeholder="Nome Hotel/Struttura" required>
    
    <select name="numero_camere" required>
      <option value="">Numero camere...</option>
      <option value="10-30">10-30 camere</option>
      <option value="31-60">31-60 camere</option>
      <option value="61-100">61-100 camere</option>
      <option value="100+">100+ camere</option>
    </select>
    
    <textarea name="messaggio" placeholder="Raccontaci le tue esigenze..."></textarea>
    
    <button type="submit">Richiedi Consulenza Gratuita</button>
    
    <p class="privacy">
      I tuoi dati saranno trattati secondo la nostra Privacy Policy. 
      Non condividiamo informazioni con terze parti.
    </p>
  </form>
</section>
```

**Regole Form:**
- Campi required: nome, email, nome_struttura, numero_camere
- Campi optional: telefono, messaggio
- Dropdown per numero camere (segmentazione lead)
- Privacy note sempre visibile
- Data attribute per tracking GA4

---

## 5. Implementazione SEO

### 5.1 Meta Tags per Homepage

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Primary -->
  <title>NexEnergy | Retrofit Energetico Intelligente per Hotel Italia</title>
  <meta name="description" content="Riduci i costi energetici del tuo hotel senza cantieri. Sistema retrofit con AI che impara dalla tua struttura. Risparmio attivo dal giorno uno. Richiedi demo.">
  <link rel="canonical" href="https://nexenergy.it/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="NexEnergy | Retrofit Energetico Intelligente per Hotel">
  <meta property="og:description" content="Riduci i costi energetici del tuo hotel senza cantieri. Sistema retrofit con AI che impara dalla tua struttura.">
  <meta property="og:image" content="https://nexenergy.it/images/nexenergy-retrofit-energetico-hotel-og.webp">
  <meta property="og:url" content="https://nexenergy.it/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="NexEnergy | Retrofit Energetico Intelligente per Hotel">
  <meta name="twitter:description" content="Riduci i costi energetici del tuo hotel senza cantieri.">
  <meta name="twitter:image" content="https://nexenergy.it/images/nexenergy-retrofit-ene

