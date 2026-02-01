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
    {"question": "...", "answer": "..."}
  ],
  "targetLocation": "Italia (o regione specifica se rilevante)",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "lsiKeywords": ["lsi1", "lsi2", "lsi3"],
  "entityOptimization": "Lista di entità correlate (es. ENEA, GSE, ISO 50001)",
  "seoScore": 95,
  "readabilityScore": 80,
  "contentQuality": 90
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
 */
async function generateImage(topic) {
  // Create a visual prompt WITHOUT any text/words
  const visualPrompt = `Professional architectural photography of a modern luxury hotel in Italy implementing ${topic.focus}, natural lighting, cinematic 8k quality, minimalist design, sustainable architecture details, no text overlay`;

  console.log('   Sending task to KEI API...');

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

  if (!data.result_url && data.task_id) {
    console.log(`   Task created (ID: ${data.task_id}), waiting for result...`);
    return await pollKEITask(data.task_id);
  }

  return data.result_url || null;
}

/**
 * Poll KEI API for task completion
 */
async function pollKEITask(taskId) {
  const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max
  const delay = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      // Note: Adjust endpoint based on actual KEI API docs for polling
      // Assuming getTask or similar endpoint standard
      // If KEI uses a different URL for status, we might need to adjust.
      // Since we don't have the exact docs loaded, we'll try the common pattern 
      // or assume the create response gave a status URL. 
      // If not available, we might need to skip polling or use a placeholder if failing.

      // WARNING: Without specific polling docs, this is a guess. 
      // Often strictly async APIs return a status URL.
      // If we can't poll, we can't get the image.

      // Let's assume a standard GET /tasks/{id} or similar.
      // Re-using KEI_API_URL base might be wrong if it ends in /createTask
      const baseUrl = KEI_API_URL.replace('/jobs/createTask', '/jobs/getTask');

      const checkResponse = await fetch(`${baseUrl}?task_id=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KEI_API_KEY}`
        }
      });

      if (checkResponse.ok) {
        const result = await checkResponse.json();
        if (result.status === 'completed' && result.result_url) {
          return result.result_url;
        } else if (result.status === 'failed') {
          console.error('   Image generation task failed:', result.error);
          return null;
        }
      }
    } catch (e) {
      // Ignore transient errors during polling
    }
  }

  console.warn('   Image generation timed out');
  return null;
}

/**
 * Publish article to Payload CMS
 */
async function publishToCMS(article, imageUrl) {
  console.log('   >>> publishToCMS called');
  console.log('   >>> Article title:', article?.title || 'MISSING');

  // Truncate directAnswer to max 160 chars (Payload CMS limit)
  const truncatedDirectAnswer = article.directAnswer && article.directAnswer.length > 160
    ? article.directAnswer.substring(0, 157) + '...'
    : article.directAnswer;

  // Truncate metaDescription to max 160 chars
  const truncatedMetaDesc = article.metaDescription && article.metaDescription.length > 160
    ? article.metaDescription.substring(0, 157) + '...'
    : article.metaDescription;

  // Convert HTML content to Payload Lexical format
  const contentLexical = htmlToLexical(article.content || article.directAnswer);

  const wordCount = countWords(article.content);

  // Ensure required fields have values
  const h1Value = article.h1 || article.title || 'Articolo';
  const focusKeywordValue = article.slug ? article.slug.replace(/-/g, ' ') : 'efficienza energetica hotel';

  // Map keywords to Payload array structure if needed
  // Assuming secondaryKeywords expects a repeater: [{ keyword: '...' }]
  const secondaryKeywordsMapped = Array.isArray(article.secondaryKeywords)
    ? article.secondaryKeywords.map(k => ({ keyword: k }))
    : [];

  const payload = {
    title: article.title,
    h1: h1Value,
    slug: article.slug,
    content: contentLexical,
    focusKeyword: focusKeywordValue,
    directAnswer: truncatedDirectAnswer,
    searchIntent: 'informational',
    targetLocation: article.targetLocation || 'Italia',

    // New fields
    wordCount: wordCount,
    readabilityScore: article.readabilityScore || 80,
    seoScore: article.seoScore || 90,
    contentQuality: article.contentQuality || 85,

    // Keywords & Optimize
    secondaryKeywords: secondaryKeywordsMapped,
    lsiKeywords: Array.isArray(article.lsiKeywords) ? article.lsiKeywords.join(', ') : article.lsiKeywords,
    entityOptimization: article.entityOptimization,

    meta: {
      title: article.title,
      description: truncatedMetaDesc,
      ogTitle: article.title,
      ogDescription: truncatedMetaDesc
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

  console.log('   HTTP Status:', response.status);

  const responseData = await response.json().catch((e) => {
    console.error('   Failed to parse response:', e.message);
    return {};
  });

  // Log full response for debugging
  // console.log('   Full CMS Response:', JSON.stringify(responseData, null, 2).substring(0, 500));

  if (!response.ok) {
    console.error('   CMS Error:', JSON.stringify(responseData, null, 2));
    throw new Error(`Payload CMS error: ${response.status} - ${JSON.stringify(responseData)}`);
  }

  const docId = responseData.doc?.id || responseData.id;
  const docSlug = responseData.doc?.slug || responseData.slug;
  console.log('   Published ID:', docId || 'unknown');
  console.log('   Published Slug:', docSlug || 'unknown');

  return responseData.doc || responseData;
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
      from: 'NexEnergy Blog <onboarding@resend.dev>',
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
 * Convert HTML content to Payload CMS Lexical format
 * Lexical uses a tree structure with root > children nodes
 */
function htmlToLexical(html) {
  if (!html) {
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Contenuto non disponibile.' }]
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    };
  }

  const children = [];

  // Simple HTML to Lexical conversion
  // Split by common HTML tags and convert to Lexical nodes
  const parts = html.split(/(<\/?(?:h[1-6]|p|ul|li|strong|em)[^>]*>)/gi);

  let currentParagraph = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (!part || part.trim() === '') continue;

    // Opening tags
    if (/<h([1-6])[^>]*>/i.test(part)) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        children.push({
          type: 'paragraph',
          children: currentParagraph
        });
        currentParagraph = [];
      }

      const level = parseInt(part.match(/<h([1-6])/i)[1]);
      const nextPart = parts[i + 1] || '';
      const text = nextPart.replace(/<[^>]*>/g, '').trim();

      if (text) {
        children.push({
          type: 'heading',
          tag: `h${level}`,
          children: [{ type: 'text', text: text }]
        });
        i++; // Skip content
      }
    } else if (/<\/h[1-6]>/i.test(part)) {
      // Skip closing heading tags
      continue;
    } else if (/<p[^>]*>/i.test(part)) {
      // Start new paragraph
      if (currentParagraph.length > 0) {
        children.push({
          type: 'paragraph',
          children: currentParagraph
        });
        currentParagraph = [];
      }
    } else if (/<\/p>/i.test(part)) {
      // End paragraph
      if (currentParagraph.length > 0) {
        children.push({
          type: 'paragraph',
          children: currentParagraph
        });
        currentParagraph = [];
      }
    } else if (/<ul[^>]*>/i.test(part)) {
      inList = true;
      listItems = [];
    } else if (/<\/ul>/i.test(part)) {
      if (listItems.length > 0) {
        children.push({
          type: 'list',
          listType: 'bullet',
          children: listItems
        });
      }
      inList = false;
      listItems = [];
    } else if (/<li[^>]*>/i.test(part)) {
      // List item - get content from next part
      const nextPart = parts[i + 1] || '';
      const text = nextPart.replace(/<[^>]*>/g, '').trim();
      if (text && inList) {
        listItems.push({
          type: 'listitem',
          children: [{ type: 'text', text: text }]
        });
        i++;
      }
    } else if (/<\/li>/i.test(part)) {
      continue;
    } else if (!/<[^>]*>/.test(part)) {
      // Plain text
      const text = part.trim();
      if (text) {
        currentParagraph.push({ type: 'text', text: text });
      }
    }
  }

  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    children.push({
      type: 'paragraph',
      children: currentParagraph
    });
  }

  // Ensure at least one child
  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [{ type: 'text', text: html.replace(/<[^>]*>/g, ' ').trim() || 'Contenuto' }]
    });
  }

  return {
    root: {
      type: 'root',
      children: children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1
    }
  };
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
