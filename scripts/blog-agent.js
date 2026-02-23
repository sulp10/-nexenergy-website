/**
 * NexEnergy AI Blog Agent
 * Generates SEO-optimized blog articles using OpenRouter AI
 * Publishes to Payload CMS and sends notifications via Resend
 *
 * Usage: node scripts/blog-agent.js [--test] [--dry-run]
 *
 * Environment Variables Required:
 * - OPENROUTER_API_KEY: OpenRouter API key
 * - PAYLOAD_API_KEY: Payload CMS API key
 * - RESEND_API_KEY: Resend email API key
 * - ADMIN_EMAIL: Admin notification email
 */

require('dotenv').config();
const fetch = require('node-fetch');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const PAYLOAD_CMS_URL = 'https://cms.immoby.org/api';
const RESEND_API_URL = 'https://api.resend.com/emails';

// Configuration
const CONFIG = {
  model: process.env.ARTICLE_MODEL || 'google/gemini-2.0-flash-001',
  minWords: 800,
  maxWords: 1500,
  language: 'it',
  siteUrl: process.env.SITE_URL || 'https://nex-energy.it',
  siteName: process.env.SITE_NAME || 'NexEnergy'
};

// 50 Topics pool - Energia, Incentivi, Hotel, Building Automation
const TOPICS = [
  // INCENTIVI E BANDI NAZIONALI
  { focus: 'bonus alberghi 2025 fri-tur', title: 'Bonus Alberghi FRI-Tur: Come Accedere agli Incentivi PNRR', angle: 'Guida pratica al credito d\'imposta fino all\'80% per efficienza energetica hotel' },
  { focus: 'transizione 5.0 hotel credito imposta', title: 'Transizione 5.0 per Hotel: Credito d\'Imposta fino al 45%', angle: 'Requisiti e scadenze per accedere ai fondi efficientamento energetico' },
  { focus: 'zes unica mezzogiorno hotel incentivi', title: 'ZES Unica Mezzogiorno: Incentivi per Strutture Ricettive del Sud', angle: 'Credito d\'imposta 15-60% per investimenti in efficienza energetica' },
  { focus: 'conto termico 3.0 hotel 2025', title: 'Conto Termico 3.0: Contributi a Fondo Perduto per Hotel', angle: 'Come ottenere fino al 65% per impianti termici e solari' },
  { focus: 'ecobonus hotel detrazioni fiscali', title: 'Ecobonus per Strutture Ricettive: Guida alle Detrazioni', angle: 'Interventi ammissibili e percentuali di detrazione 2025-2027' },
  { focus: 'pnrr turismo riqualificazione energetica', title: 'PNRR Turismo: Fondi per la Riqualificazione Energetica', angle: 'Panoramica completa degli incentivi Missione 1 Componente 3' },
  { focus: 'fondo turismo sostenibile hotel', title: 'Fondo Turismo Sostenibile: 25 Milioni per la Transizione Green', angle: 'Contributi a fondo perduto per certificazioni e sostenibilità' },
  { focus: 'invitalia finanziamenti hotel energia', title: 'Finanziamenti Invitalia per Hotel: Guida Completa', angle: 'Accesso ai fondi agevolati per efficientamento strutture ricettive' },

  // BANDI REGIONALI
  { focus: 'bandi regionali turismo sicilia 2025', title: 'Sicilia: 135 Milioni per Ammodernamento Strutture Turistiche', angle: 'Come accedere ai fondi regionali per efficienza energetica' },
  { focus: 'incentivi hotel calabria sostenibilità', title: 'Calabria: Bandi per Turismo di Qualità e Sostenibilità', angle: 'Requisiti minimi 3 stelle e interventi ammissibili' },
  { focus: 'contributi hotel veneto rigenerazione', title: 'Veneto: Rigenerazione Imprese Turistico-Ricettive', angle: 'Opportunità di finanziamento per modernizzazione energetica' },
  { focus: 'bandi turismo campania eco-sociale', title: 'Campania: Turismo Eco-Sociale e Destinazioni Sostenibili', angle: 'Fondi per accessibilità e transizione ecologica' },

  // BUILDING AUTOMATION E BMS
  { focus: 'building management system hotel', title: 'BMS per Hotel: Gestione Intelligente degli Impianti', angle: 'Come un Building Management System riduce i costi del 35%' },
  { focus: 'automazione hvac hotel risparmio', title: 'Automazione HVAC: Il Cuore del Risparmio Energetico in Hotel', angle: 'Sistemi intelligenti per climatizzazione e ventilazione' },
  { focus: 'sensori presenza camera occupazione', title: 'Sensori di Presenza: Oltre la Tessera Tradizionale', angle: 'Tecnologia che riconosce l\'occupazione reale delle camere' },
  { focus: 'termostati smart hotel gestione centralizzata', title: 'Termostati Smart per Hotel: Controllo Centralizzato del Clima', angle: 'Bilanciare comfort ospite e risparmio energetico' },
  { focus: 'domotica alberghiera retrofit', title: 'Domotica Alberghiera: Retrofit Senza Opere Murarie', angle: 'Soluzioni wireless per modernizzare strutture esistenti' },
  { focus: 'integrazione pms hvac hotel', title: 'Integrazione PMS-HVAC: Climatizzazione Basata sulle Prenotazioni', angle: 'Pre-condizionamento camere e ottimizzazione check-in/check-out' },

  // EFFICIENZA ENERGETICA OPERATIVA
  { focus: 'risparmio energetico hotel estate', title: 'Risparmiare Energia in Hotel d\'Estate: Strategie Concrete', angle: 'Ottimizzare i consumi HVAC nei mesi di picco' },
  { focus: 'efficienza energetica hotel inverno', title: 'Efficienza Energetica Invernale: Riscaldamento Intelligente', angle: 'Ridurre i costi di riscaldamento senza sacrificare il comfort' },
  { focus: 'consumo energetico camera hotel media', title: 'Quanto Consuma una Camera d\'Hotel? Analisi dei Costi Reali', angle: 'Benchmark di settore e strategie di ottimizzazione' },
  { focus: 'sprechi energetici hotel camere vuote', title: 'Lo Spreco delle Camere Vuote: Quantificare il Problema', angle: 'Dati reali su quanto costa climatizzare stanze inoccupate' },
  { focus: 'night mode hvac hotel risparmio', title: 'Night Mode HVAC: Risparmiare Energia Durante la Notte', angle: 'Algoritmi per comfort notturno e riduzione consumi' },
  { focus: 'pre-cooling arrivo ospiti hotel', title: 'Pre-Cooling Intelligente: Camera Fresca all\'Arrivo dell\'Ospite', angle: 'Ottimizzare il comfort senza sprecare energia' },
  { focus: 'finestre aperte climatizzazione spreco', title: 'Finestre Aperte e Clima Acceso: Un Problema da 15.000€/Anno', angle: 'Sensori e automazioni per eliminare questo spreco' },
  { focus: 'cascata termica stanze hotel', title: 'Cascata Termica: Come le Camere Si Influenzano a Vicenda', angle: 'Effetto domino del clima e strategie di mitigazione' },

  // TECNOLOGIE SPECIFICHE
  { focus: 'pompe di calore hotel efficienza', title: 'Pompe di Calore per Hotel: Efficienza e Risparmio', angle: 'Quando conviene sostituire caldaie tradizionali' },
  { focus: 'fotovoltaico hotel autoconsumo', title: 'Fotovoltaico per Hotel: Autoconsumo e Indipendenza Energetica', angle: 'ROI e dimensionamento per strutture ricettive' },
  { focus: 'led illuminazione hotel risparmio', title: 'Illuminazione LED in Hotel: Risparmio e Qualità della Luce', angle: 'Retrofitting e domotica per illuminazione intelligente' },
  { focus: 'sistemi vrf hotel climatizzazione', title: 'Sistemi VRF per Hotel: Climatizzazione Zona per Zona', angle: 'Vantaggi dei Variable Refrigerant Flow per l\'hospitality' },
  { focus: 'coibentazione hotel interventi', title: 'Coibentazione Hotel: Interventi Prioritari per Isolare', angle: 'Tetti, pareti e infissi - dove investire prima' },

  // ROI E BUSINESS CASE
  { focus: 'roi efficienza energetica hotel', title: 'ROI dell\'Efficienza Energetica: Quando Si Ripaga l\'Investimento?', angle: 'Calcoli reali per strutture da 30 a 200 camere' },
  { focus: 'costo energia hotel italia 2026', title: 'Costo Energia Hotel Italia 2026: Scenari e Previsioni', angle: 'Andamento prezzi e strategie di mitigazione' },
  { focus: 'audit energetico hotel diagnosi', title: 'Audit Energetico per Hotel: Prima di Investire, Diagnostica', angle: 'Cosa aspettarsi da una diagnosi energetica professionale' },
  { focus: 'certificazione energetica hotel classe', title: 'Certificazione Energetica: Cosa Significa Passare di Classe', angle: 'Impatto su valore immobiliare e costi operativi' },
  { focus: 'esco hotel efficienza contratto', title: 'Contratti ESCo per Hotel: Efficienza Senza Investimento Iniziale', angle: 'Come funzionano e quando convengono' },

  // SOSTENIBILITÀ E MARKETING
  { focus: 'hotel green certificazioni sostenibilità', title: 'Certificazioni Green per Hotel: Quali Scegliere?', angle: 'LEED, BREEAM, Green Key - confronto e vantaggi' },
  { focus: 'ospiti eco-consapevoli hotel', title: 'Ospiti Eco-Consapevoli: Un Mercato in Crescita del 30%', angle: 'Come l\'efficienza energetica attrae clienti premium' },
  { focus: 'comunicare sostenibilità hotel no greenwashing', title: 'Comunicare la Sostenibilità: Evitare il Greenwashing', angle: 'Strategie autentiche per valorizzare gli investimenti green' },
  { focus: 'carbon footprint hotel riduzione', title: 'Carbon Footprint per Hotel: Misurare e Ridurre le Emissioni', angle: 'Dalla diagnosi all\'offset - percorso completo' },

  // CASI SPECIFICI
  { focus: 'hotel stagionale efficienza energetica', title: 'Hotel Stagionali: Efficienza Energetica con Apertura Limitata', angle: 'Strategie per strutture che operano 6-8 mesi l\'anno' },
  { focus: 'agriturismo risparmio energetico', title: 'Agriturismi e Risparmio Energetico: Opportunità Specifiche', angle: 'Bandi e tecnologie per strutture rurali' },
  { focus: 'b&b efficienza energetica piccole strutture', title: 'B&B ed Efficienza Energetica: Soluzioni per Piccole Strutture', angle: 'Investimenti proporzionati e ROI per under 10 camere' },
  { focus: 'resort spa consumi energetici', title: 'Resort con SPA: Gestire i Consumi delle Aree Benessere', angle: 'Piscine, saune e jacuzzi - ottimizzazione energetica' },
  { focus: 'hotel montagna riscaldamento efficiente', title: 'Hotel di Montagna: Riscaldamento Efficiente ad Alta Quota', angle: 'Sfide climatiche e soluzioni per località alpine' },

  // TENDENZE E FUTURO
  { focus: 'intelligenza artificiale hotel energia', title: 'AI per l\'Energia in Hotel: Oltre l\'Automazione Base', angle: 'Machine learning predittivo per ottimizzazione consumi' },
  { focus: 'iot hotel building automation', title: 'IoT in Hotel: Sensori Connessi per Edifici Intelligenti', angle: 'L\'Internet of Things applicato all\'hospitality' },
  { focus: 'digital twin hotel simulazione energetica', title: 'Digital Twin per Hotel: Simulare Prima di Investire', angle: 'Gemelli digitali per testare strategie di efficientamento' },
  { focus: 'normative efficienza energetica hotel 2025', title: 'Normative Energetiche 2025: Cosa Cambia per gli Hotel', angle: 'Nuovi obblighi e scadenze per le strutture ricettive' },
  { focus: 'hotel net zero carbon neutral', title: 'Hotel Net Zero: È Realmente Raggiungibile?', angle: 'Percorso verso la neutralità carbonica nell\'hospitality' }
];

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const isTest = args.includes('--test');
  const isDryRun = args.includes('--dry-run');

  console.log('='.repeat(60));
  console.log('NexEnergy AI Blog Agent');
  console.log('='.repeat(60));
  console.log(`Mode: ${isTest ? 'TEST' : 'PRODUCTION'}${isDryRun ? ' (DRY RUN)' : ''}`);
  console.log(`Model: ${CONFIG.model}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  try {
    // Step 1: Check API connectivity
    console.log('\n[1/4] Checking API connectivity...');
    await checkAPIConnectivity();

    // Step 2: Select topic
    console.log('\n[2/4] Selecting topic...');
    const topic = selectTopic();
    console.log(`   Topic: ${topic.focus}`);
    console.log(`   Title: ${topic.title}`);

    // Step 3: Generate article content
    console.log('\n[3/4] Generating article content...');
    const article = await generateArticle(topic);
    console.log(`   Words: ${countWords(article.content)}`);
    console.log(`   FAQs: ${article.faq?.length || 0}`);

    // Step 4: Publish to CMS
    if (!isDryRun) {
      console.log('\n[4/4] Publishing to Payload CMS...');
      const published = await publishToCMS(article);
      console.log(`   Status: Published`);
      console.log(`   Slug: ${published.slug}`);

      // Send notification
      await sendNotification('success', {
        title: article.title,
        slug: published.slug,
        words: countWords(article.content)
      });
      console.log('   Email sent to admin');
    } else {
      console.log('\n[4/4] Skipping CMS publish (dry run)');
      console.log('\n' + '='.repeat(60));
      console.log('GENERATED ARTICLE (DRY RUN)');
      console.log('='.repeat(60));
      console.log(`\nTitle: ${article.title}`);
      console.log(`H1: ${article.h1}`);
      console.log(`Meta: ${article.metaDescription}`);
      console.log(`\nDirect Answer:\n${article.directAnswer}`);
      console.log(`\nContent Preview:\n${article.content.substring(0, 800)}...`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('Blog Agent completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n[ERROR]', error.message);
    if (!isDryRun) {
      try {
        await sendNotification('error', {
          errorType: error.name || 'Unknown Error',
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        });
      } catch (notifyError) {
        console.error('Failed to send error notification:', notifyError.message);
      }
    }
    process.exit(1);
  }
}

/**
 * Check API connectivity and credits
 */
async function checkAPIConnectivity() {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not configured');
  console.log('   OpenRouter: OK');

  try {
    const creditsResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    if (creditsResponse.ok) {
      const creditsData = await creditsResponse.json();
      const remaining = creditsData.data?.limit_remaining;
      if (remaining !== undefined && remaining !== null) {
        console.log(`   Credits: ${remaining}`);
        if (remaining < 2) {
          await sendNotification('credits_warning', { serviceName: 'OpenRouter', creditsRemaining: remaining });
        }
      }
    }
  } catch (e) { /* ignore */ }

  if (!process.env.PAYLOAD_API_KEY) throw new Error('PAYLOAD_API_KEY not configured');
  console.log('   Payload CMS: OK');

  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');
  console.log('   Resend: OK');
}

/**
 * Select a random topic from the pool
 */
function selectTopic() {
  const randomIndex = Math.floor(Math.random() * TOPICS.length);
  return TOPICS[randomIndex];
}

/**
 * Generate article using OpenRouter AI
 */
async function generateArticle(topic) {
  const systemPrompt = `Sei un copywriter senior specializzato in energia e hospitality. Scrivi articoli che sembrino scritti da un ESPERTO UMANO, non da AI.

REGOLE ANTI-PATTERN AI (FONDAMENTALE):
❌ MAI iniziare con: "In questo articolo", "Negli ultimi anni", "Il settore", "L'energia", "Scopriamo"
❌ MAI usare: "È importante notare", "Inoltre", "Infatti", "In conclusione", "Riassumendo"
❌ MAI strutture ripetitive: ogni articolo deve avere un incipit COMPLETAMENTE DIVERSO
❌ MAI elenchi puntati nell'introduzione
❌ MAI frasi generiche tipo "sfida cruciale", "pilastro fondamentale", "crescente importanza"

✅ TECNICHE DI SCRITTURA UMANA (OBBLIGATORIO):

1. **INCIPIT VARIATI** - Usa UNO di questi approches (diverso per ogni articolo):
   - SCENARIO CONCRETO: "Sono le 7 del mattino. Marco apre la bolletta dell'hotel e..."
   - DOMANDA DIRETTA: "Quanto spende il tuo hotel in energia? 50.000€ l'anno? 100.000€?"
   - DATO SHOCK: "Il 43% degli hotel italiani ha visto i costi energetici raddoppiare in 18 mesi."
   - DIALOGO: "«Non posso continuare così» mi ha detto Laura, proprietaria di un 4 stelle a Firenze."
   - CONTRASTO: "Mentre l'Hotel Rossini a Bologna risparmia 80.000€ l'anno, il Bellavista..."
   - METAFORA: "La bolletta energetica del tuo hotel è come un buco nel serbatoio: più grande diventa..."

2. **RITMO NARRATIVO**:
   - Alterna paragrafi corti (2-3 righe) e lunghi (6-8 righe)
   - Usa frasi brevissime per enfasi. Come questa.
   - Inserisci domande retoriche ogni 3-4 paragrafi
   - Cambia ritmo: veloce per dati/azioni, lento per spiegazioni

3. **VOCE AUTENTICA**:
   - Scrivi come se PARLASSI a un collega esperto al bar
   - Usa "tu" (seconda persona) per coinvolgere
   - Racconta mini-storie di 2-3 righe (anche inventate ma plausibili)
   - Ammetti limiti: "Non esiste una soluzione magica, ma..."
   - Usa paragoni concreti: "Come quando cambi le gomme dell'auto..."

4. **ZERO PATTERN PREVEDIBILI**:
   - Non seguire sempre: Introduzione → Problema → Soluzione → Conclusione
   - Varia: inizia dalla soluzione, o da un caso studio, o da una domanda provocatoria
   - Non concludere MAI con "In conclusione" o riassunti

CONTENUTO STRUTTURATO (OBBLIGATORIO):
1. **DATE PRECISE**: Mai usare "es. entro fine 2024" o "circa metà 2025"
   - Formato: "31 dicembre 2024", "30 giugno 2025", "entro il 15 marzo 2026"
   - Se data incerta, scrivi "da verificare su Gazzetta Ufficiale" invece di date vaghe

2. **INCENTIVI DETTAGLIATI** - Integra dati in narrativa fluida:
   ❌ MALE: "L'Ecobonus offre: 65% detrazione, massimale 100k, durata 10 anni, scadenza 31/12/2025"
   ✅ BENE: "Con l'Ecobonus recuperi il 65% della spesa in 10 anni. Se investi 100.000€, torneranno indietro 65.000€ sotto forma di detrazione fiscale. Ma attenzione: la scadenza è il 31 dicembre 2025, e la pratica va depositata su ENEA entro 90 giorni dalla fine lavori."

   Includi SEMPRE: percentuale, massimale, durata, scadenza precisa, ente gestore
   Ma presentali come CONSIGLI PRATICI, non come elenco burocratico

3. **CASI STUDIO NARRATIVI** - Racconta storie vere con dati:
   ❌ MALE: "Hotel X: investimento 890k, risparmio 127k/anno, ROI 4,8 anni, F→C"
   ✅ BENE: "Prendiamo l'Hotel de Russie a Roma. 122 camere, 5 stelle. Nel 2022 hanno investito 890.000€ in efficientamento: cappotto termico, infissi nuovi, fotovoltaico sul tetto. Risultato? Risparmiano 127.000€ ogni anno. In meno di 5 anni rientrano dell'investimento, e sono passati da classe energetica F a C. Non male, no?"

   Includi SEMPRE: nome + località, investimento €, risparmio annuo, ROI, classe energetica, dettaglio interventi
   Ma raccontalo come STORIA, non come scheda tecnica

4. **RIFERIMENTI NORMATIVI**: Per articoli su normative/obblighi:
   - Nome completo (es: "D.Lgs. 102/2014", "Direttiva EPBD IV 2024/1275/UE")
   - Data emanazione se rilevante
   - Articolo specifico se applicabile (es: "art. 8")
   - Link Gazzetta Ufficiale o fonte EU (opzionale)

5. **CHECKLIST OPERATIVE** - Presenta come piano d'azione narrativo:
   ❌ MALE: "ENTRO 31/12/2024: Audit energetico (costo 800-2500€)"
   ✅ BENE: "Prima cosa: fai fare un audit energetico entro fine anno. Costa tra 800 e 2.500€ a seconda delle dimensioni, ma ti dice esattamente dove stai buttando soldi. Poi, entro marzo 2025, raccogli 3 preventivi..."

6. **TRANSIZIONI NATURALI** - Collega paragrafi come un discorso:
   ❌ EVITA: "Inoltre", "Infatti", "Pertanto", "Di conseguenza", "A tal proposito"
   ✅ USA: "Ecco il punto", "Ma c'è un problema", "Ora", "E poi?", "Semplice:", "Ti faccio un esempio"
   ✅ USA: Domande-risposta: "Quanto costa? Dipende da...", "Funziona davvero? Guarda questi numeri..."

7. **CONCLUSIONI AUTENTICHE** - MAI riassunti, proponi AZIONE:
   ❌ MALE: "In conclusione, abbiamo visto che l'efficienza energetica..."
   ✅ BENE: "Allora, da dove parti? Il mio consiglio: inizia dall'audit. Costa poco, ti apre gli occhi."
   ✅ BENE: "Tre numeri da tenere a mente: 65% di Ecobonus, 31 dicembre 2025 come scadenza, 4-5 anni per rientrare. Il resto viene da sé."
   ✅ BENE: "Ho visto hotel ridurre le bollette del 40% in un anno. Non con magia, ma con scelte precise. Tu quale fai?"

REGOLE SEO (senza sacrificare naturalezza):
- Keyword focus "${topic.focus}" - densità 1-2% ma NATURALE (no keyword stuffing)
- 800-1500 parole - Ma scrivi per INFORMARE, non per raggiungere conteggio
- H2/H3 con keyword - Ma formula come DOMANDE o AFFERMAZIONI umane:
  ❌ "Efficienza Energetica Hotel 2025" → ✅ "Quanto costa davvero l'efficienza energetica?"
  ❌ "Normative Compliance Hotel" → ✅ "Le nuove regole che devi conoscere entro dicembre"
- FAQ (minimo 3) - Scrivi come se RISPONDESSI a un collega al telefono:
  ❌ "Quali sono i benefici dell'efficienza energetica?" → ✅ "Quanto risparmio davvero con questi interventi?"
  Risposte: MAI generiche, SEMPRE con numeri/esempi concreti
- Entità: Cita ENEA, GSE, Federalberghi, località specifiche - Ma in CONTESTO narrativo, non come lista

FORMATO OUTPUT (JSON PURO):
{
  "title": "Meta title SEO max 55 chars STRICT (essenziale per Google)",
  "h1": "H1 max 65 chars STRICT (diverso dal title)",
  "metaDescription": "Meta description 120-160 chars, verbo d'azione iniziale",
  "directAnswer": "Risposta diretta 2-3 frasi COMPLETE (no troncamenti tipo 'Gli a...') per featured snippet Google",
  "slug": "url-slug-lowercase-con-trattini",
  "content": "HTML: h2, h3, p, strong. NO html/body/head. Solo contenuto. Includi dati precisi come da istruzioni.",
  "faq": [{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}],
  "targetLocation": "Italia",
  "secondaryKeywords": ["kw1", "kw2", "kw3"],
  "lsiKeywords": "parole correlate semanticamente, separate da virgola",
  "entityOptimization": "entità rilevanti per SEO: nomi brand, associazioni, normative, es: ENEA, GSE, Federalberghi",
  "howToSteps": [{"name": "Step 1", "text": "Descrizione dettagliata"}],
  "legislation": [{"name": "D.Lgs. 102/2014", "jurisdiction": "Italia", "type": "Decreto Legislativo", "legislationDate": "2014-07-04"}],
  "seoScore": 90
}

NOTA SCHEMA OPZIONALI:
- "howToSteps": Includi SOLO se articolo contiene procedura step-by-step (es: "Come fare audit", "Procedura richiesta incentivi")
- "legislation": Includi SOLO se articolo cita normative/leggi specifiche (es: decreti, direttive EU, leggi nazionali)
- Se NON applicabili, ometti questi campi (non usare array vuoti)`;

  const userPrompt = `Scrivi un articolo su: "${topic.title}"

Focus: ${topic.focus}
Angolo: ${topic.angle}

Target: Direttori hotel italiani che vogliono ridurre costi energetici senza grossi cantieri.
Tono: Esperto ma accessibile, pratico, con esempi concreti.

RISPONDI SOLO CON IL JSON.`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': CONFIG.siteUrl,
      'X-Title': CONFIG.siteName
    },
    body: JSON.stringify({
      model: CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error('Empty response from OpenRouter');

  // Parse JSON
  let articleJson;
  try {
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    articleJson = JSON.parse(jsonStr);
  } catch (parseError) {
    console.error('Parse error:', content.substring(0, 500));
    throw new Error('Failed to parse article JSON');
  }

  // Validate
  const required = ['title', 'h1', 'metaDescription', 'directAnswer', 'slug', 'content'];
  for (const field of required) {
    if (!articleJson[field]) throw new Error(`Missing field: ${field}`);
  }

  return articleJson;
}

/**
 * Publish article to Payload CMS
 */
async function publishToCMS(article) {
  // REMOVED NUMERIC SUFFIX FOR CLEAN SEO URLs
  // Old: article.slug = `${article.slug}-${uniqueSuffix}`;
  // New: Keep clean semantic slug (e.g., /blog/costi-energia-hotel-italia-2026/)

  // Truncate fields
  const truncDesc = article.directAnswer?.length > 160
    ? article.directAnswer.substring(0, 157) + '...'
    : article.directAnswer;
  const truncMeta = article.metaDescription?.length > 160
    ? article.metaDescription.substring(0, 157) + '...'
    : article.metaDescription;

  // Truncate Title (Strict 60 chars for Payload)
  let truncTitle = article.title;
  if (truncTitle.length > 60) {
    truncTitle = truncTitle.substring(0, 57) + '...';
  }

  // Convert to Lexical
  const contentLexical = htmlToLexical(article.content);
  const wordCount = countWords(article.content);

  // Truncate H1 (Strict 70 chars for Payload)
  let truncH1 = article.h1 || truncTitle;
  if (truncH1.length > 70) {
    truncH1 = truncH1.substring(0, 67) + '...';
  }

  const payload = {
    title: truncTitle,
    h1: truncH1,
    slug: article.slug,
    content: contentLexical,
    focusKeyword: article.slug.replace(/-/g, ' '),
    directAnswer: truncDesc,
    searchIntent: 'informational',
    targetLocation: article.targetLocation || 'Italia',
    wordCount,
    readabilityScore: 80,
    seoScore: article.seoScore || 85,
    secondaryKeywords: (article.secondaryKeywords || []).map(k => ({ keyword: k })),
    meta: {
      title: truncTitle,
      description: truncMeta,
      ogTitle: truncTitle,
      ogDescription: truncMeta,
      articleSection: 'Efficienza Energetica',
      timeToRead: Math.ceil(wordCount / 200),
      canonicalUrl: `${CONFIG.siteUrl}/blog/${article.slug}`
    },
    faqSchema: article.faq || [],
    _status: 'published'
  };

  const response = await fetch(`${PAYLOAD_CMS_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Payload CMS error: ${response.status} - ${JSON.stringify(responseData)}`);
  }

  return responseData.doc || responseData;
}

/**
 * Send email notification via Resend
 */
async function sendNotification(type, data) {
  const templates = {
    success: {
      subject: `[NexEnergy] ✅ Articolo Pubblicato`,
      html: `<h2>Nuovo articolo: ${data.title}</h2><p>URL: ${CONFIG.siteUrl}/blog/${data.slug}</p><p>Parole: ${data.words}</p>`
    },
    error: {
      subject: `[NexEnergy] ❌ Errore: ${data.errorType}`,
      html: `<h2>Errore</h2><p>${data.errorMessage}</p><p>${data.timestamp}</p>`
    },
    credits_warning: {
      subject: `[NexEnergy] ⚠️ Crediti Bassi`,
      html: `<h2>Crediti ${data.serviceName} quasi esauriti</h2><p>Rimanenti: ${data.creditsRemaining}</p>`
    }
  };

  const template = templates[type];
  if (!template) return;

  await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'NexEnergy <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: template.subject,
      html: template.html
    })
  });
}

/**
 * Convert HTML to Lexical format (simplified - strips all HTML tags)
 */
function htmlToLexical(html) {
  if (!html) {
    return { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Contenuto.', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } };
  }

  const children = [];

  // Pre-process HTML
  let processed = html
    .replace(/<\/?(?:html|head|body|!DOCTYPE)[^>]*>/gi, '')
    .replace(/<ul>/gi, '').replace(/<\/ul>/gi, '')
    .replace(/<ol>/gi, '').replace(/<\/ol>/gi, '')
    .replace(/<li>/gi, '<p>• ').replace(/<\/li>/gi, '</p>')
    .replace(/<br\s*\/?>/gi, '</p><p>');

  const parts = processed.split(/(<\/?(?:h[1-6]|p)[^>]*>)/gi);
  let currentParagraph = [];

  function flush() {
    if (currentParagraph.length > 0) {
      children.push({
        type: 'paragraph',
        children: currentParagraph,
        direction: 'ltr', format: '', indent: 0, version: 1
      });
      currentParagraph = [];
    }
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part || part.trim() === '') continue;
    const lower = part.toLowerCase();

    if (/^<h[1-6]/.test(lower)) {
      flush();
      const level = parseInt(lower.match(/<h([1-6])/)[1]);
      const text = (parts[i + 1] || '').replace(/<[^>]*>/g, '').trim();
      if (text) {
        children.push({
          type: 'heading', tag: `h${level}`,
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr', format: '', indent: 0, version: 1
        });
        i++;
      }
    } else if (/^<p/.test(lower)) {
      flush();
    } else if (/^<\//.test(lower)) {
      continue;
    } else if (!/^<[^>]*>/.test(part)) {
      const text = part.replace(/<[^>]*>/g, '').trim();
      if (text) currentParagraph.push({ type: 'text', text, version: 1 });
    }
  }

  flush();

  if (children.length === 0) {
    children.push({ type: 'paragraph', children: [{ type: 'text', text: 'Contenuto.', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 });
  }

  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } };
}

/**
 * Count words in HTML
 */
function countWords(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(w => w.length > 0).length;
}

main();
