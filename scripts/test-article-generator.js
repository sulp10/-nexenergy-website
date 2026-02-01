/**
 * NexEnergy Test Article Generator
 * Generates a test article and saves it to /blog/test-article.html
 *
 * Usage: node scripts/test-article-generator.js
 *
 * This script:
 * 1. Generates an article using OpenRouter API
 * 2. Validates word count (800-1500)
 * 3. Validates meta title and description
 * 4. Validates FAQ schema (3-5 questions)
 * 5. Saves to blog/test-article.html
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CONFIG = {
  model: process.env.ARTICLE_MODEL || 'google/gemini-2.0-flash-001',
  minWords: 800,
  maxWords: 1500,
  siteUrl: process.env.SITE_URL || 'https://nexenergy.it'
};

// Test topic
const TEST_TOPIC = {
  focus: 'risparmio energetico hotel consigli pratici',
  title: 'Consigli Pratici per il Risparmio Energetico in Hotel',
  angle: 'Guida operativa con azioni concrete che ogni hotel manager può implementare subito'
};

async function main() {
  console.log('='.repeat(60));
  console.log('NexEnergy Test Article Generator');
  console.log('='.repeat(60));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Model: ${CONFIG.model}`);
  console.log('='.repeat(60));

  // Check API key
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('ERROR: OPENROUTER_API_KEY not configured');
    process.exit(1);
  }

  try {
    // Step 1: Generate article
    console.log('\n[1/5] Generating article with AI...');
    const article = await generateArticle();

    // Step 2: Validate word count
    console.log('\n[2/5] Validating word count...');
    const wordCount = countWords(article.content);
    console.log(`   Word count: ${wordCount}`);
    if (wordCount < CONFIG.minWords) {
      console.log(`   ⚠️ Warning: Below minimum (${CONFIG.minWords})`);
    } else if (wordCount > CONFIG.maxWords) {
      console.log(`   ⚠️ Warning: Above maximum (${CONFIG.maxWords})`);
    } else {
      console.log(`   ✅ Word count OK`);
    }

    // Step 3: Validate meta title and description
    console.log('\n[3/5] Validating meta tags...');
    const titleLen = article.title.length;
    const descLen = article.metaDescription.length;
    console.log(`   Meta title: "${article.title}" (${titleLen} chars)`);
    console.log(`   ${titleLen <= 60 ? '✅' : '⚠️'} Title ${titleLen <= 60 ? 'OK' : 'exceeds 60 chars'}`);
    console.log(`   Meta description: "${article.metaDescription.substring(0, 50)}..." (${descLen} chars)`);
    console.log(`   ${descLen >= 120 && descLen <= 160 ? '✅' : '⚠️'} Description ${descLen >= 120 && descLen <= 160 ? 'OK' : 'not in 120-160 range'}`);

    // Step 4: Validate FAQ schema
    console.log('\n[4/5] Validating FAQ schema...');
    const faqCount = article.faq.length;
    console.log(`   FAQ questions: ${faqCount}`);
    if (faqCount >= 3 && faqCount <= 5) {
      console.log(`   ✅ FAQ count OK`);
    } else {
      console.log(`   ⚠️ Warning: Expected 3-5 questions`);
    }
    article.faq.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.question.substring(0, 50)}...`);
    });

    // Step 5: Generate HTML and save
    console.log('\n[5/5] Saving to blog/test-article.html...');
    const html = generateHTML(article);
    const outputPath = path.join(__dirname, '..', 'blog', 'test-article.html');
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`   ✅ Saved to ${outputPath}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('TEST ARTICLE GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Title: ${article.title}`);
    console.log(`H1: ${article.h1}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Words: ${wordCount}`);
    console.log(`FAQs: ${faqCount}`);
    console.log(`Direct Answer: ${article.directAnswer.substring(0, 100)}...`);
    console.log('='.repeat(60));

    // Output validation summary
    const validations = [
      { name: 'Word count 800-1500', pass: wordCount >= CONFIG.minWords && wordCount <= CONFIG.maxWords },
      { name: 'Meta title <= 60 chars', pass: titleLen <= 60 },
      { name: 'Meta description 120-160 chars', pass: descLen >= 120 && descLen <= 160 },
      { name: 'FAQ schema 3-5 questions', pass: faqCount >= 3 && faqCount <= 5 },
      { name: 'Content in Italian', pass: article.content.includes('hotel') && article.content.includes('energia') }
    ];

    console.log('\nVALIDATION RESULTS:');
    validations.forEach(v => {
      console.log(`  ${v.pass ? '✅' : '❌'} ${v.name}`);
    });

    const allPassed = validations.every(v => v.pass);
    console.log(`\n${allPassed ? '✅ All validations passed!' : '⚠️ Some validations failed'}`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

/**
 * Generate article using OpenRouter AI
 */
async function generateArticle() {
  const systemPrompt = `Sei un esperto copywriter italiano specializzato in efficienza energetica per l'hospitality.

REGOLE FONDAMENTALI:
1. Scrivi SEMPRE in italiano naturale e colloquiale, come un professionista del settore
2. Lunghezza: 800-1500 parole (OBBLIGATORIO)
3. Usa la keyword focus "${TEST_TOPIC.focus}" naturalmente, densità < 3%
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

  const userPrompt = `Scrivi un articolo blog su: "${TEST_TOPIC.title}"

Angolo/Focus: ${TEST_TOPIC.angle}
Keyword principale: ${TEST_TOPIC.focus}

L'articolo deve essere utile per direttori d'hotel italiani che vogliono ridurre i costi energetici senza grossi investimenti o cantieri.

Rispondi SOLO con il JSON, nessun testo aggiuntivo.`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': CONFIG.siteUrl,
      'X-Title': 'NexEnergy Test Generator'
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

  // Parse JSON from response
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const article = JSON.parse(jsonStr);

  // Validate required fields
  const requiredFields = ['title', 'h1', 'metaDescription', 'directAnswer', 'slug', 'content', 'faq'];
  for (const field of requiredFields) {
    if (!article[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return article;
}

/**
 * Generate full HTML page
 */
function generateHTML(article) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': article.faq.map(q => ({
      '@type': 'Question',
      'name': q.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.answer
      }
    }))
  };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': article.h1,
    'description': article.metaDescription,
    'author': {
      '@type': 'Organization',
      'name': 'NexEnergy'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NexEnergy',
      'logo': {
        '@type': 'ImageObject',
        'url': `${CONFIG.siteUrl}/images/logo.svg`
      }
    },
    'datePublished': new Date().toISOString().split('T')[0],
    'dateModified': new Date().toISOString().split('T')[0],
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${CONFIG.siteUrl}/blog/test-article.html`
    }
  };

  return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.metaDescription}">
    <meta name="robots" content="noindex, nofollow">

    <!-- Open Graph -->
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.metaDescription}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${CONFIG.siteUrl}/blog/test-article.html">

    <!-- Schema.org -->
    <script type="application/ld+json">
${JSON.stringify(blogPostingSchema, null, 2)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
    </script>

    <!-- Styles -->
    <link rel="stylesheet" href="../css/main.css">
    <style>
        .test-article-banner {
            background: #ffeb3b;
            color: #000;
            padding: 1rem;
            text-align: center;
            font-weight: bold;
        }
        .article-content {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            line-height: 1.8;
        }
        .article-content h2 {
            margin-top: 2rem;
            color: var(--color-primary, #0066CC);
        }
        .article-content h3 {
            margin-top: 1.5rem;
        }
        .direct-answer {
            background: #f5f5f5;
            padding: 1.5rem;
            border-left: 4px solid var(--color-primary, #0066CC);
            margin: 2rem 0;
        }
        .faq-section {
            margin-top: 3rem;
            padding: 2rem;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .faq-item {
            margin-bottom: 1.5rem;
        }
        .faq-question {
            font-weight: bold;
            color: var(--color-primary, #0066CC);
        }
        .meta-info {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="test-article-banner">
        ⚠️ TEST ARTICLE - NOT FOR PRODUCTION - Generated ${new Date().toLocaleString('it-IT')}
    </div>

    <article class="article-content">
        <h1>${article.h1}</h1>

        <div class="meta-info">
            <span>Pubblicato: ${new Date().toLocaleDateString('it-IT')}</span> |
            <span>Parole: ${countWords(article.content)}</span> |
            <span>Keyword: ${TEST_TOPIC.focus}</span>
        </div>

        <div class="direct-answer">
            <strong>In breve:</strong> ${article.directAnswer}
        </div>

        ${article.content}

        <section class="faq-section">
            <h2>Domande Frequenti</h2>
            ${article.faq.map(q => `
            <div class="faq-item">
                <p class="faq-question">${q.question}</p>
                <p>${q.answer}</p>
            </div>
            `).join('')}
        </section>
    </article>

    <footer style="text-align: center; padding: 2rem; color: #666;">
        <p>Test article generated by NexEnergy AI Blog Agent</p>
        <p><a href="index.html">&larr; Back to Blog</a></p>
    </footer>
</body>
</html>`;
}

/**
 * Count words in HTML content
 */
function countWords(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(w => w.length > 0).length;
}

// Run
main();
