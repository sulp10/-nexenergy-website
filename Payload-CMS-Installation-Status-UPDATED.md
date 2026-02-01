# Payload CMS - Stato Installazione e Configurazione VPS

**Data:** 1 Febbraio 2026  
**VPS:** Contabo - 173.212.231.227 (vmi2969435.contaboserver.net)  
**Dominio:** cms.immoby.org  
**Versione Payload:** 3.72.0  
**Versione Next.js:** 15.4.10

---

## 📊 STATO ATTUALE

✅ **Payload CMS installato e funzionante in modalità PRODUZIONE con campi SEO/GEO/AEO**

- **Status:** ONLINE
- **Process Manager:** PM2
- **Porta:** 3005
- **SSL:** Attivo (Let's Encrypt)
- **Database:** PostgreSQL 16
- **Auto-start:** Configurato (riavvio automatico al boot del server)
- **API Keys:** Abilitate
- **Campi SEO/GEO/AEO:** Configurati e funzionanti
- **Creazione Post via API:** ✅ TESTATA E FUNZIONANTE

---

## 🎯 CONFIGURAZIONE SEO/GEO/AEO

### Campi SEO implementati nella collection Posts:

**Campi Base:**
- `title` - Meta Title (30-60 caratteri)
- `h1` - H1 Tag (diverso dal Meta Title)
- `slug` - URL slug
- `content` - Contenuto principale
- `heroImage` - Immagine principale

**Campi SEO:**
- `focusKeyword` - Keyword principale
- `keywordDensity` - Densità keyword (1-3%)
- `secondaryKeywords` - Array keywords secondarie (max 5)
- `lsiKeywords` - LSI Keywords (termini correlati)
- `wordCount` - Conteggio parole
- `readabilityScore` - Score di leggibilità
- `seoScore` - Score SEO (0-100)
- `contentQuality` - Qualità contenuto (low/medium/high/excellent)

**Campi GEO (Generative Engine Optimization):**
- `targetLocation` - Località target
- `searchIntent` - Intento di ricerca (informational/transactional/navigational/commercial)
- `entityOptimization` - Entità principali menzionate

**Campi AEO (Answer Engine Optimization):**
- `directAnswer` - Risposta diretta per featured snippet (max 160 char)
- `faqSchema` - Array FAQ per rich snippet (domande e risposte)

**Campi Meta Tags:**
- `meta.title` - Meta title SEO
- `meta.description` - Meta description SEO
- `meta.image` - Meta image per social
- `meta.ogTitle` - Open Graph title
- `meta.ogDescription` - Open Graph description
- `meta.ogImage` - Open Graph image
- `meta.twitterCard` - Twitter card type
- `meta.schemaType` - Schema.org type (BlogPosting/Article/NewsArticle/HowTo/Review)
- `meta.articleSection` - Sezione articolo
- `meta.timeToRead` - Tempo di lettura stimato
- `meta.canonicalUrl` - URL canonico

---

## 🔐 API KEYS - CONFIGURAZIONE

### Come generare API Key:

1. Vai su **https://cms.immoby.org/admin**
2. Accedi con il tuo utente
3. Vai al profilo utente
4. Sezione "API Key" → Clicca "Generate API Key"
5. Copia la chiave generata

### Configurazione nel codice:

```typescript
// File: src/collections/Users/index.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true, // API Keys abilitate
  },
}
```

### Access Control Posts:

```typescript
// File: src/collections/Posts/index.ts
access: {
  create: () => true, // Permetti creazione con API Key
  delete: authenticated,
  read: authenticatedOrPublished,
  update: () => true, // Permetti update con API Key
},
```

---

## 🧪 TEST API - ESEMPI cURL

### 1. Test Base - Verifica Payload risponde
```bash
curl -I https://cms.immoby.org/admin
# Risposta attesa: HTTP/1.1 200 OK
```

### 2. Test Lettura Posts (pubblico)
```bash
curl https://cms.immoby.org/api/posts
```

### 3. Test Creazione Post con tutti i campi SEO/GEO/AEO

⚠️ **Sostituisci YOUR-API-KEY con la tua chiave reale!**

```bash
curl -X POST http://localhost:3005/api/posts \
  -H "Authorization: users API-Key YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Guida SEO 2026: Strategie Vincenti per il Tuo Business",
    "h1": "Scopri le Migliori Strategie SEO per Dominare Google nel 2026",
    "slug": "guida-seo-2026-strategie",
    "focusKeyword": "seo 2026",
    "searchIntent": "informational",
    "targetLocation": "Italia",
    "lsiKeywords": "ottimizzazione motori ricerca, posizionamento google, strategia seo, marketing digitale",
    "directAnswer": "La SEO nel 2026 richiede focus su AI, contenuti di qualità e esperienza utente per ottenere visibilità su Google.",
    "secondaryKeywords": [
      {"keyword": "ottimizzazione seo"},
      {"keyword": "posizionamento google"},
      {"keyword": "strategie marketing digitale"}
    ],
    "faqSchema": [
      {
        "question": "Cos'\''è la SEO nel 2026?",
        "answer": "La SEO nel 2026 è l'\''insieme di tecniche per ottimizzare il posizionamento sui motori di ricerca, con particolare focus su AI e user experience."
      },
      {
        "question": "Quanto costa fare SEO?",
        "answer": "I costi SEO variano da 500€ a 5000€ al mese a seconda della competitività del settore e degli obiettivi."
      }
    ],
    "_status": "published",
    "content": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "text": "Nel 2026, la SEO ha subito una trasformazione radicale grazie all'\''intelligenza artificiale e ai nuovi algoritmi di Google."
              }
            ]
          }
        ]
      }
    }
  }'
```

### 4. Verifica Post Salvato
```bash
# Nel database
sudo -u postgres psql -d payloadcms -p 5434 -c "SELECT id, title, slug, _status, focus_keyword FROM posts;"

# Via API
curl https://cms.immoby.org/api/posts
```

---

## 🗄️ DATABASE POSTGRESQL

### Configurazione
- **Versione:** PostgreSQL 16.11
- **Porta:** 5434 (non standard)
- **Host:** localhost
- **Database:** payloadcms
- **User:** payloaduser
- **Password:** PayloadSecure2026!

### Tabelle Posts
- `posts` - Tabella principale
- `posts_secondary_keywords` - Keywords secondarie
- `posts_faq_schema` - FAQ Schema
- `posts_populated_authors` - Autori
- `posts_rels` - Relazioni (categories, related posts)

### Tabelle Versioning
- `_posts_v` - Versioni posts
- `_posts_v_version_secondary_keywords`
- `_posts_v_version_faq_schema`
- `_posts_v_version_populated_authors`
- `_posts_v_rels`

### Comandi Utili Database
```bash
# Connessione
sudo -u postgres psql -d payloadcms -p 5434

# Verifica struttura tabella
\d posts

# Lista posts
SELECT id, title, slug, _status FROM posts;

# Verifica permessi
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO payloaduser;
```

---

## 📋 INTEGRAZIONE N8N

### Configurazione HTTP Request Node

```
Method: POST
URL: http://localhost:3005/api/posts

Headers:
  Authorization: users API-Key YOUR-API-KEY-HERE
  Content-Type: application/json

Body (JSON):
{
  "title": "{{ $json.aiGeneratedTitle }}",
  "h1": "{{ $json.aiGeneratedH1 }}",
  "slug": "{{ $json.slug }}",
  "focusKeyword": "{{ $json.keyword }}",
  "searchIntent": "informational",
  "targetLocation": "{{ $json.location }}",
  "lsiKeywords": "{{ $json.lsiKeywords }}",
  "directAnswer": "{{ $json.directAnswer }}",
  "secondaryKeywords": {{ $json.secondaryKeywordsArray }},
  "faqSchema": {{ $json.faqArray }},
  "_status": "published",
  "content": {{ $json.contentJSON }}
}
```

### Workflow Example

```
1. Schedule Trigger (ogni giorno 9:00)
   ↓
2. Get Topic (Airtable/Google Sheets)
   ↓
3. Claude API / ChatGPT (genera contenuto SEO)
   ↓
4. Transform Data (formatta per Payload)
   ↓
5. HTTP Request → Payload CMS (crea post)
   ↓
6. Notification (Telegram/Slack)
```

---

## 🌐 INTEGRAZIONE FRONTEND

### Fetch Posts
```javascript
// Tutti i posts
fetch('https://cms.immoby.org/api/posts?limit=100')
  .then(res => res.json())
  .then(data => console.log(data.docs));

// Post per slug
fetch('https://cms.immoby.org/api/posts?where[slug][equals]=guida-seo-2026')
  .then(res => res.json())
  .then(data => console.log(data.docs[0]));
```

### Render con SEO
```jsx
<Head>
  <title>{post.meta.title || post.title}</title>
  <meta name="description" content={post.meta.description} />
  
  {/* Open Graph */}
  <meta property="og:title" content={post.meta.ogTitle} />
  <meta property="og:description" content={post.meta.ogDescription} />
  
  {/* Schema.org */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": post.meta.schemaType,
      "headline": post.title,
      "description": post.meta.description
    })}
  </script>
  
  {/* FAQ Schema */}
  {post.faqSchema?.length > 0 && (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqSchema.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      })}
    </script>
  )}
</Head>
```

---

## ⚙️ GESTIONE PM2

```bash
# Stato
pm2 status

# Log in tempo reale
pm2 logs payload-cms

# Riavvio
pm2 restart payload-cms

# Stop
pm2 stop payload-cms

# Start
pm2 start payload-cms
```

---

## 🔧 TROUBLESHOOTING

### Verifiche Base
```bash
# Payload risponde?
curl -I http://localhost:3005/admin

# Porta in uso?
sudo ss -tulpn | grep 3005

# Log errori
pm2 logs payload-cms --lines 100

# Database online?
pg_lsclusters
```

### Fix Permessi Database
```bash
sudo -u postgres psql -d payloadcms -p 5434 << 'EOF'
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO payloaduser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO payloaduser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO payloaduser;
EOF
```

### Rebuild dopo modifiche
```bash
cd ~/payload-cms/cms
npm run build
pm2 restart payload-cms
```

---

## 📄 BACKUP

```bash
# Database
sudo -u postgres pg_dump -d payloadcms -p 5434 > backup_$(date +%Y%m%d).sql

# File completi
tar -czf payload-backup-$(date +%Y%m%d).tar.gz /root/payload-cms/cms

# Restore
psql -U payloaduser -d payloadcms -h localhost -p 5434 < backup.sql
```

---

## 🌐 URL PRINCIPALI

- **Admin Panel:** https://cms.immoby.org/admin
- **API Posts:** https://cms.immoby.org/api/posts
- **API Media:** https://cms.immoby.org/api/media
- **GraphQL:** https://cms.immoby.org/api/graphql

### URL Interni (n8n)
- **API Base:** http://localhost:3005/api
- **Posts:** http://localhost:3005/api/posts

---

## 📝 CONFIGURAZIONE FILE

### .env
```
DATABASE_URL=postgresql://payloaduser:PayloadSecure2026%21@localhost:5434/payloadcms
PAYLOAD_SECRET=4a27895855506cbeb736a76d
NEXT_PUBLIC_SERVER_URL=https://cms.immoby.org
PORT=3005
```

### PM2 Ecosystem
```javascript
module.exports = {
  apps: [{
    name: 'payload-cms',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/root/payload-cms/cms',
    env: {
      PORT: 3005,
      NODE_ENV: 'production'
    }
  }]
}
```

---

## ✅ CHECKLIST FINALE

- [x] Payload CMS 3.72.0 installato
- [x] PostgreSQL 16 configurato
- [x] Campi SEO/GEO/AEO implementati
- [x] Tabelle versioning corrette
- [x] API Keys abilitate
- [x] Creazione post via API testata ✅
- [x] Post salvati nel database ✅
- [x] Post visibili pubblicamente ✅
- [x] PM2 in produzione
- [x] SSL/HTTPS attivo
- [x] Pronto per n8n ✅

---

## 🎉 STATO FINALE

**✅ SISTEMA COMPLETAMENTE OPERATIVO**

- Payload CMS in produzione
- API funzionanti al 100%
- Database configurato correttamente
- Tutti i campi SEO/GEO/AEO disponibili
- Pronto per ricevere contenuti da AI Bot
- Integrazione n8n pronta

---

**Documento aggiornato:** 1 Febbraio 2026 17:10 CET  
**Status:** ✅ OPERATIVO - PRONTO PER PRODUZIONE  
**Versione:** 2.0
