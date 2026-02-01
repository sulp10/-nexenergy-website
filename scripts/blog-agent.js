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
 * - KEI_API_KEY: (Optional) KEI image generation API key
 */

require('dotenv').config();
const fetch = require('node-fetch');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const PAYLOAD_CMS_URL = 'https://cms.immoby.org/api';
const RESEND_API_URL = 'https://api.resend.com/emails';
const KEI_API_URL = 'https://api.kie.ai/api/v1/jobs/createTask';

// Configuration
const CONFIG = {
  model: process.env.ARTICLE_MODEL || 'google/gemini-2.0-flash-001',
  minWords: 800,
  maxWords: 1500,
  language: 'it',
  siteUrl: process.env.SITE_URL || 'https://nexenergy.it',
  siteName: process.env.SITE_NAME || 'NexEnergy Blog Agent'
};

// Topics pool for random selection
const TOPICS = [
  {
    focus: 'risparmio energetico hotel estate',
    title: 'Come Risparmiare Energia in Hotel Durante l\'Estate',
    angle: 'Strategie per ottimizzare i consumi HVAC nei mesi caldi'
  },
  {
    focus: 'efficienza energetica strutture ricettive',
    title: 'Guida all\'Efficienza Energetica per Strutture Ricettive',
    angle: 'Best practice per ridurre i costi operativi mantenendo il comfort'
  },
  {
    focus: 'automazione climatizzazione hotel',
    title: 'Automazione della Climatizzazione negli Hotel',
    angle: 'Come i sistemi smart riducono sprechi e migliorano l\'esperienza ospite'
  },
  {
    focus: 'gestione consumi energetici albergo',
    title: 'Gestione Intelligente dei Consumi Energetici in Albergo',
    angle: 'Dashboard e analytics per il controllo in tempo reale'
  },
  {
    focus: 'retrofit energetico hotel senza cantiere',
    title: 'Retrofit Energetico senza Cantiere: È Possibile?',
    angle: 'Soluzioni non invasive per modernizzare gli impianti'
  },
  {
    focus: 'sensori presenza camera hotel',
    title: 'Sensori di Presenza nelle Camere d\'Hotel',
    angle: 'Tecnologia che riconosce quando la stanza è realmente occupata'
  },
  {
    focus: 'costi energia hotel italia 2026',
    title: 'Costi Energetici Hotel Italia: Scenario 2026',
    angle: 'Analisi dell\'andamento prezzi e strategie di mitigazione'
  },
  {
    focus: 'sostenibilità hotel green hospitality',
    title: 'Sostenibilità nell\'Hospitality: Oltre il Greenwashing',
    angle: 'Azioni concrete per ridurre l\'impatto ambientale'
  }
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
    console.log('\n[1/6] Checking API connectivity...');
    await checkAPIConnectivity();

    // Step 2: Select topic
    console.log('\n[2/6] Selecting topic...');
    const topic = selectTopic();
    console.log(`   Topic: ${topic.focus}`);
    console.log(`   Title: ${topic.title}`);

    // Step 3: Generate article content
    console.log('\n[3/6] Generating article content...');
    const article = await generateArticle(topic);
    console.log(`   Words: ${countWords(article.content)}`);
    console.log(`   FAQs: ${article.faq.length}`);

    // Step 4: Generate featured image (optional)
    let imageUrl = null;
    if (process.env.KEI_API_KEY && !isDryRun) {
      console.log('\n[4/6] Generating featured image...');
      try {
        imageUrl = await generateImage(topic);
        console.log(`   Image: ${imageUrl || 'Using placeholder'}`);
      } catch (imgError) {
        console.log(`   Image generation failed: ${imgError.message}`);
        console.log('   Using placeholder image');
      }
    } else {
      console.log('\n[4/6] Skipping image generation (no KEI_API_KEY or dry run)');
    }

    // Step 5: Publish to CMS
    if (!isDryRun) {
      console.log('\n[5/6] Publishing to Payload CMS...');
      const published = await publishToCMS(article, imageUrl);
      console.log(`   Status: Published`);
      console.log(`   Slug: ${published.slug}`);

      // Step 6: Send notification
      console.log('\n[6/6] Sending notification email...');
      await sendNotification('success', {
        title: article.title,
        slug: published.slug,
        words: countWords(article.content)
      });
      console.log('   Email sent to admin');
    } else {
      console.log('\n[5/6] Skipping CMS publish (dry run)');
      console.log('\n[6/6] Skipping notification (dry run)');

      // Output article for review
      console.log('\n' + '='.repeat(60));
      console.log('GENERATED ARTICLE (DRY RUN)');
      console.log('='.repeat(60));
      console.log(`\nTitle: ${article.title}`);
      console.log(`H1: ${article.h1}`);
      console.log(`Meta Description: ${article.metaDescription}`);
      console.log(`\nDirect Answer:\n${article.directAnswer}`);
      console.log(`\nContent Preview (first 500 chars):\n${article.content.substring(0, 500)}...`);
      console.log(`\nFAQ Schema:`);
      article.faq.forEach((q, i) => {
        console.log(`  ${i + 1}. Q: ${q.question}`);
        console.log(`     A: ${q.answer.substring(0, 100)}...`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('Blog Agent completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n[ERROR]', error.message);

    // Send error notification
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
  // Check OpenRouter
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  console.log('   OpenRouter: OK (key present)');

  // Check OpenRouter credits
  try {
    const creditsResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });
    if (creditsResponse.ok) {
      const creditsData = await creditsResponse.json();
      const remaining = creditsData.data?.limit_remaining;
      if (remaining !== undefined) {
        console.log(`   OpenRouter credits: ${remaining}`);
        // Warn if credits are low (< 5 USD)
        if (remaining < 5) {
          console.log('   WARNING: OpenRouter credits running low!');
          await sendNotification('credits_warning', {
            serviceName: 'OpenRouter',
            creditsRemaining: remaining
          });
        }
      }
    }
  } catch (e) {
    console.log('   OpenRouter credits: Unable to check');
  }

  // Check Payload CMS
  if (!process.env.PAYLOAD_API_KEY) {
    throw new Error('PAYLOAD_API_KEY not configured');
  }
  console.log('   Payload CMS: OK (key present)');

  // Check Resend
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }
  console.log('   Resend: OK (key present)');

  // Check Admin Email
  if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL not configured');
  }
  console.log('   Admin Email: OK');
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
  const systemPrompt = `Sei un esperto copywriter italiano specializzato in efficienza energetica per l'hospitality.

REGOLE FONDAMENTALI:
1. Scrivi SEMPRE in italiano naturale e colloquiale, come un professionista del settore
2. Lunghezza: 800-1500 parole (OBBLIGATORIO)
3. Usa la keyword focus "${topic.focus}" naturalmente, densità < 3%
4. NESSUN pattern ripetitivo AI (non iniziare paragrafi con le stesse parole)
5. Includi esempi concreti di hotel italiani
6. Tono: professionale ma accessibile, mai accademico

STRUTTURA OUTPUT (JSON):
{
  "title": "Meta title SEO (max 60 chars)",
  "h1": "H1 diverso dal title, con keyword",
  "metaDescription": "Meta description 120-160 chars, inizia con verbo",
  "directAnswer": "Risposta diretta 2-3 frasi per featured snippet",
  "slug": "url-slug-lowercase-hyphen",
  "content": "Articolo completo in HTML (h2, h3, p, ul, strong)",
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`;

  const userPrompt = `Scrivi un articolo blog su: "${topic.title}"

Angolo/Focus: ${topic.angle}
Keyword principale: ${topic.focus}

L'articolo deve essere utile per direttori d'hotel italiani che vogliono ridurre i costi energetici senza grossi investimenti o cantieri.

Rispondi SOLO con il JSON, nessun testo aggiuntivo.`;

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
      temperature: 0.8,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from OpenRouter');
  }

  // Parse JSON from response (handle markdown code blocks)
  let articleJson;
  try {
    // Remove markdown code blocks if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    articleJson = JSON.parse(jsonStr);
  } catch (parseError) {
    console.error('Failed to parse AI response:', content.substring(0, 500));
    throw new Error('Failed to parse article JSON from AI response');
  }

  // Validate required fields
  const requiredFields = ['title', 'h1', 'metaDescription', 'directAnswer', 'slug', 'content', 'faq'];
  for (const field of requiredFields) {
    if (!articleJson[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate word count
  const wordCount = countWords(articleJson.content);
  if (wordCount < CONFIG.minWords) {
    console.warn(`   Warning: Article has ${wordCount} words (minimum: ${CONFIG.minWords})`);
  }

  // Validate FAQ count
  if (!Array.isArray(articleJson.faq) || articleJson.faq.length < 3) {
    throw new Error('FAQ must have at least 3 questions');
  }

  return articleJson;
}

/**
 * Generate featured image using KEI API (Flux-2)
 * Note: Flux-2 does NOT support text in images
 */
async function generateImage(topic) {
  // Create a visual prompt WITHOUT any text/words
  const visualPrompt = `Professional photography of a modern luxury hotel room, warm ambient lighting, smart thermostat on wall, comfortable bed, elegant Italian design, cinematic lighting, high-end hospitality atmosphere, no text, no words, no letters, no logos`;

  const response = await fetch(KEI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KEI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'flux-2/pro-text-to-image',
      prompt: visualPrompt,
      aspect_ratio: '16:9',
      output_format: 'webp'
    })
  });

  if (!response.ok) {
    throw new Error(`KEI API error: ${response.status}`);
  }

  const data = await response.json();

  // KEI returns async task - we'd need to poll for result
  // For now, return null and use placeholder
  console.log('   KEI task created:', data.task_id || 'N/A');
  return null;
}

/**
 * Publish article to Payload CMS
 */
async function publishToCMS(article, imageUrl) {
  const payload = {
    title: article.title,
    h1: article.h1,
    slug: article.slug,
    content: article.content,
    focusKeyword: article.slug.replace(/-/g, ' '),
    directAnswer: article.directAnswer,
    searchIntent: 'informational',
    meta: {
      title: article.title,
      description: article.metaDescription,
      ogTitle: article.title,
      ogDescription: article.metaDescription
    },
    faqSchema: article.faq,
    _status: 'published'
  };

  if (imageUrl) {
    payload.heroImage = imageUrl;
  }

  const response = await fetch(`${PAYLOAD_CMS_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Payload CMS error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

/**
 * Send email notification via Resend
 */
async function sendNotification(type, data) {
  const templates = {
    success: {
      subject: `[NexEnergy Blog] ✅ Articolo Pubblicato - ${new Date().toLocaleDateString('it-IT')}`,
      html: `
        <h2>Nuovo articolo pubblicato con successo</h2>
        <p><strong>Titolo:</strong> ${data.title}</p>
        <p><strong>URL:</strong> <a href="${CONFIG.siteUrl}/blog/${data.slug}.html">${CONFIG.siteUrl}/blog/${data.slug}.html</a></p>
        <p><strong>Parole:</strong> ${data.words}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">NexEnergy AI Blog Agent</p>
      `
    },
    error: {
      subject: `[NexEnergy Blog] ❌ ERRORE - ${data.errorType}`,
      html: `
        <h2>Errore durante la generazione articolo</h2>
        <p><strong>Tipo:</strong> ${data.errorType}</p>
        <p><strong>Messaggio:</strong> ${data.errorMessage}</p>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <hr>
        <p>Azione richiesta: Verificare crediti API o configurazione.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">NexEnergy AI Blog Agent</p>
      `
    },
    credits_warning: {
      subject: `[NexEnergy Blog] ⚠️ Crediti API in esaurimento`,
      html: `
        <h2>Attenzione: Crediti API quasi esauriti</h2>
        <p><strong>Servizio:</strong> ${data.serviceName}</p>
        <p><strong>Crediti rimanenti:</strong> ${data.creditsRemaining}</p>
        <hr>
        <p>Si prega di ricaricare i crediti per evitare interruzioni del servizio.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">NexEnergy AI Blog Agent</p>
      `
    }
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'NexEnergy Blog <no-reply@nexenergy.it>',
      to: [process.env.ADMIN_EMAIL],
      subject: template.subject,
      html: template.html
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

/**
 * Count words in HTML content
 */
function countWords(html) {
  // Strip HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(w => w.length > 0).length;
}

// Run main
main();
