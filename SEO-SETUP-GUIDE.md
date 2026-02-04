# Guida Setup SEO e Visibilità Brand - NexEnergy Hospitality

Questa guida ti accompagna nei passaggi per far indicizzare il sito su Google e aumentare la visibilità del brand sui motori di ricerca e AI search engines.

---

## FASE 1: Google Search Console Setup

### 1.1 Registrazione Proprietà

1. Vai su https://search.google.com/search-console
2. Clicca "Aggiungi proprietà"
3. Seleziona "Prefisso URL"
4. Inserisci: `https://nex-energy.it`

### 1.2 Verifica Proprietà (Metodo Consigliato: File HTML)

1. Google ti fornirà un file da scaricare (es. `google1234567890abcdef.html`)
2. Scarica il file
3. Caricalo nella root del sito: `c:\Users\edosu\Desktop\Nexenergy\`
4. Deploy su Netlify
5. Torna su Search Console e clicca "Verifica"

**Alternative di verifica:**
- DNS TXT record (richiede accesso DNS)
- Meta tag HTML (meno consigliato)
- Google Analytics (se già configurato)

### 1.3 Submit Sitemap

1. Nel menu laterale, vai su "Sitemap"
2. Nel campo "Aggiungi nuova Sitemap", inserisci: `sitemap.xml`
3. Clicca "Invia"
4. Verifica che lo stato sia "Riuscita"

### 1.4 Richiedere Indicizzazione

1. Vai su "Controllo URL" nel menu
2. Inserisci l'URL della homepage: `https://nex-energy.it/`
3. Clicca "Richiedi indicizzazione"
4. Ripeti per le pagine più importanti:
   - `https://nex-energy.it/blog/`
   - `https://nex-energy.it/blog/paradosso-tessera.html`
   - `https://nex-energy.it/blog/retrofit-wireless.html`
   - `https://nex-energy.it/blog/metodo-tesla.html`

**Nota:** Google può impiegare da 24h a 2 settimane per indicizzare le pagine.

### 1.5 Monitoraggio Post-Setup

Controlla settimanalmente:
- **Copertura**: Verifica errori di indicizzazione
- **Core Web Vitals**: Performance del sito
- **Rendimento**: Query che portano traffico
- **Esperienza sulle pagine**: Mobile-friendliness

---

## FASE 2: Google Analytics 4 Setup

### 2.1 Creare Account GA4

1. Vai su https://analytics.google.com
2. Clicca "Inizia a misurare"
3. Crea un nuovo account:
   - Nome account: `NexEnergy Hospitality`
   - Nome proprietà: `nex-energy.it`
   - Fuso orario: `Italia`
   - Valuta: `Euro`

### 2.2 Configurare Stream Web

1. Seleziona "Web" come piattaforma
2. URL sito: `https://nex-energy.it`
3. Nome stream: `NexEnergy Website`
4. Attiva "Enhanced measurement"

### 2.3 Ottenere Measurement ID

1. Vai su Amministrazione > Stream di dati > (seleziona stream)
2. Copia il "MEASUREMENT ID" (formato: `G-XXXXXXXXXX`)

### 2.4 Configurare nel Sito

1. Apri il file `js/analytics.js`
2. Sostituisci `G-XXXXXXXXXX` con il tuo Measurement ID:

```javascript
gtag('config', 'G-TUO_ID_QUI', {
    'anonymize_ip': true,
    // ...
});
```

3. Esegui `npm run build` per minificare
4. Deploy su Netlify

### 2.5 Verificare Installazione

1. Installa l'estensione "Google Tag Assistant" su Chrome
2. Visita il tuo sito
3. Verifica che il tag GA4 sia attivo
4. In GA4, vai su "Tempo reale" per vedere i dati live

---

## FASE 3: Link Building & Citazioni

### 3.1 Directory Business Italiane

Crea profili gratuiti su:

| Directory | URL | Priorità |
|-----------|-----|----------|
| Google Business Profile | business.google.com | Alta (se sede fisica) |
| Pagine Gialle | paginegiale.it | Media |
| Kompass Italia | it.kompass.com | Media |
| Europages | europages.it | Bassa |

### 3.2 Directory Hospitality

Contatta per inserimento/partnership:

- **Federalberghi**: federalberghi.it
- **Confindustria Alberghi**: confindustriaalberghi.it
- **QualityTravel**: qualitytravel.it
- **TTG Italia**: ttgitalia.com
- **Hospitality News**: hotelmag.it

### 3.3 Guest Post Strategy

**Target Publications:**
1. Ingenio-web.it (ingegneria/edilizia)
2. HotelDomani.it (hospitality)
3. TravelQuotidiano.com (turismo)
4. Albergatore.info (gestione alberghiera)

**Template Email Pitch:**
```
Oggetto: Proposta articolo: Come l'AI sta rivoluzionando l'efficienza energetica degli hotel

Buongiorno [Nome],

Mi chiamo [TuoNome] e rappresento NexEnergy Hospitality, startup italiana
specializzata in retrofit energetico per hotel.

Abbiamo sviluppato una tecnologia che permette agli hotel di ridurre i
costi energetici del 30% senza interventi murari, risolvendo il noto
problema del "bypass della tessera".

Propongo un articolo di 1000 parole con:
- Dati reali sui consumi alberghieri in Italia
- Il paradosso del sistema a tessera
- Come l'AI adattiva sta cambiando il settore

Sarebbe interessato/a a pubblicarlo su [Nome Testata]?

Cordiali saluti,
[TuoNome]
NexEnergy Hospitality
```

### 3.4 Social Media Presence

**LinkedIn (Priorità Alta):**
1. Crea Company Page: linkedin.com/company/setup
2. Compila tutti i campi (descrizione, settore, dimensione)
3. Aggiungi logo e banner
4. Pubblica 2-3 articoli del blog a settimana
5. Interagisci con gruppi: "Hospitality Professionals Italia", "Sostenibilità nel Turismo"

**Altri canali:**
- YouTube: Video esplicativi (transcript = contenuto SEO)
- Medium: Repubblicazione articoli blog
- Quora: Risposte a domande su "risparmio energetico hotel"

---

## FASE 4: AEO - Answer Engine Optimization

Per apparire su Perplexity, ChatGPT, Gemini:

### 4.1 Creare Contenuti "Citable"

Gli AI citano fonti con:
- **Dati originali**: "Il 73% degli hotel italiani..."
- **Statistiche uniche**: "Studio NexEnergy 2026: consumi medi per camera..."
- **Case study**: Risultati reali con numeri

**Azioni:**
1. Pubblica un whitepaper/report con dati originali
2. Crea infografiche citabili
3. Aggiungi sezione "Ricerca" sul sito con studi proprietari

### 4.2 Struttura Q&A nei Contenuti

Ogni articolo dovrebbe rispondere a domande dirette:
- "Come funziona il retrofit energetico hotel?"
- "Quanto costa efficientare un hotel?"
- "Come risparmiare energia senza ristrutturare?"

### 4.3 FAQ Schema Esteso

Ogni articolo ha già FAQPage schema. Verifica che le domande:
- Siano formulate come vere domande
- Abbiano risposte complete e autocontenute
- Includano keyword rilevanti

### 4.4 Piattaforme Indicizzate da AI

Gli AI crawlano frequentemente:
- **Wikipedia**: Se puoi citare NexEnergy come fonte in articoli esistenti
- **LinkedIn**: Articoli pubblicati
- **Medium**: Contenuti long-form
- **Reddit**: Discussioni genuine (no spam)
- **Quora**: Risposte autorevoli
- **YouTube**: Transcript dei video

---

## FASE 5: Monitoraggio e Iterazione

### 5.1 Checklist Settimanale

- [ ] Controllare Search Console per errori
- [ ] Verificare nuove pagine indicizzate
- [ ] Monitorare posizioni per keyword target
- [ ] Pubblicare nuovo contenuto blog
- [ ] Interagire su LinkedIn

### 5.2 Checklist Mensile

- [ ] Analizzare traffico GA4
- [ ] Verificare backlinks acquisiti (usa Ahrefs/Moz free)
- [ ] Testare ricerche su Perplexity/ChatGPT
- [ ] Aggiornare sitemap se nuove pagine
- [ ] Review Core Web Vitals

### 5.3 Tool Gratuiti Consigliati

| Tool | URL | Uso |
|------|-----|-----|
| Google Search Console | search.google.com/search-console | Indicizzazione |
| Google Analytics | analytics.google.com | Traffico |
| Ahrefs Free Backlink Checker | ahrefs.com/backlink-checker | Backlinks |
| PageSpeed Insights | pagespeed.web.dev | Performance |
| Schema Markup Validator | validator.schema.org | Schema.org |
| Rich Results Test | search.google.com/test/rich-results | Rich snippets |

---

## Keyword Target

### Primary Keywords
- `retrofit energetico hotel` (search volume medio, competition media)
- `risparmio energetico hotel` (search volume alto, competition alta)
- `NexEnergy Hospitality` (brand - da costruire)

### Secondary Keywords
- `efficienza energetica albergo`
- `sistema risparmio energia hotel`
- `smart energy management hotel`
- `IoT hotel Italia`

### Long-tail Keywords
- `come risparmiare energia hotel senza ristrutturare`
- `alternativa sistema tessera hotel`
- `retrofit wireless camere albergo`
- `AI gestione energia hotel`

---

## Contatti e Supporto

Per domande tecniche sul setup:
- Email: info@nex-energy.it
- Documentazione: Vedi file CLAUDE.md nel repository

---

*Ultimo aggiornamento: 2026-02-02*
