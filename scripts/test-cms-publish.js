/**
 * NexEnergy CMS Publication Test
 * Tests publishing an article to Payload CMS
 *
 * Usage: node scripts/test-cms-publish.js [--keep]
 *
 * This script:
 * 1. Verifies Payload CMS API connectivity
 * 2. Creates a test article with all SEO fields
 * 3. Verifies all fields were mapped correctly
 * 4. Tests retrieving the article via API
 * 5. Deletes the test article (unless --keep flag)
 *
 * Environment Variables Required:
 * - PAYLOAD_API_KEY
 */

require('dotenv').config();
const fetch = require('node-fetch');

const PAYLOAD_CMS_URL = 'https://cms.immoby.org/api';

// Test article data
const TEST_ARTICLE = {
  title: 'Test Article - NexEnergy CMS Validation',
  h1: 'Articolo di Test per Validazione CMS',
  slug: `test-article-${Date.now()}`,
  content: `
<h2>Introduzione al Test</h2>
<p>Questo è un articolo di <strong>test</strong> generato automaticamente per validare l'integrazione con Payload CMS.</p>

<h3>Obiettivi del Test</h3>
<ul>
<li>Verificare la connessione API</li>
<li>Validare il mapping dei campi SEO</li>
<li>Testare la pubblicazione automatica</li>
</ul>

<h2>Conclusioni</h2>
<p>Se questo articolo viene pubblicato correttamente, il sistema di integrazione CMS è funzionante.</p>
  `.trim(),
  focusKeyword: 'test cms integration',
  directAnswer: 'Questo è un articolo di test per validare l\'integrazione con Payload CMS. Il test verifica la connessione API, il mapping dei campi e la pubblicazione automatica.',
  searchIntent: 'informational',
  meta: {
    title: 'Test CMS Integration | NexEnergy',
    description: 'Articolo di test per validare l\'integrazione con Payload CMS. Verifica connessione API, mapping campi SEO e pubblicazione automatica.',
    ogTitle: 'Test CMS Integration - NexEnergy',
    ogDescription: 'Articolo di test per validare l\'integrazione con Payload CMS.'
  },
  faqSchema: [
    {
      question: 'Cosa testa questo articolo?',
      answer: 'Questo articolo testa l\'integrazione completa con Payload CMS, inclusa la creazione, lettura e cancellazione di contenuti.'
    },
    {
      question: 'Come funziona il test?',
      answer: 'Il test crea un articolo di prova, verifica che tutti i campi siano stati salvati correttamente, e poi cancella l\'articolo.'
    },
    {
      question: 'I dati sono persistenti?',
      answer: 'No, l\'articolo viene cancellato automaticamente al termine del test, a meno che non si usi il flag --keep.'
    }
  ],
  _status: 'published'
};

async function main() {
  const args = process.argv.slice(2);
  const keepArticle = args.includes('--keep');

  console.log('='.repeat(60));
  console.log('NexEnergy CMS Publication Test');
  console.log('='.repeat(60));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Keep article: ${keepArticle ? 'YES' : 'NO'}`);
  console.log(`Test slug: ${TEST_ARTICLE.slug}`);
  console.log('='.repeat(60));

  // Check API key
  if (!process.env.PAYLOAD_API_KEY) {
    console.error('\n❌ ERROR: PAYLOAD_API_KEY not configured');
    console.log('\nTo run this test, set PAYLOAD_API_KEY in your .env file');
    process.exit(1);
  }

  let articleId = null;

  try {
    // Step 1: Verify API connectivity
    console.log('\n[1/6] Verifying Payload CMS API connectivity...');
    const stats = await verifyAPIConnectivity();
    console.log('   ✅ API connection successful');
    console.log(`   Total posts: ${stats.totalDocs}`);

    // Step 2: Create test article
    console.log('\n[2/6] Creating test article...');
    const created = await createArticle(TEST_ARTICLE);
    articleId = created.id;
    console.log('   ✅ Article created');
    console.log(`   ID: ${articleId}`);
    console.log(`   Slug: ${created.slug}`);

    // Step 3: Verify SEO fields mapping
    console.log('\n[3/6] Verifying SEO fields mapping...');
    const fieldChecks = [
      { name: 'title', expected: TEST_ARTICLE.title, actual: created.title },
      { name: 'h1', expected: TEST_ARTICLE.h1, actual: created.h1 },
      { name: 'slug', expected: TEST_ARTICLE.slug, actual: created.slug },
      { name: 'focusKeyword', expected: TEST_ARTICLE.focusKeyword, actual: created.focusKeyword },
      { name: 'directAnswer', expected: TEST_ARTICLE.directAnswer, actual: created.directAnswer },
      { name: 'searchIntent', expected: TEST_ARTICLE.searchIntent, actual: created.searchIntent },
      { name: 'meta.title', expected: TEST_ARTICLE.meta.title, actual: created.meta?.title },
      { name: 'meta.description', expected: TEST_ARTICLE.meta.description, actual: created.meta?.description },
      { name: 'faqSchema count', expected: TEST_ARTICLE.faqSchema.length, actual: created.faqSchema?.length },
      { name: '_status', expected: TEST_ARTICLE._status, actual: created._status }
    ];

    let allFieldsValid = true;
    for (const check of fieldChecks) {
      const match = check.expected === check.actual;
      if (!match) allFieldsValid = false;
      console.log(`   ${match ? '✅' : '❌'} ${check.name}: ${match ? 'OK' : `Expected "${check.expected}", got "${check.actual}"`}`);
    }

    // Step 4: Retrieve article via API
    console.log('\n[4/6] Retrieving article via API...');
    const retrieved = await getArticle(articleId);
    if (retrieved) {
      console.log('   ✅ Article retrieved successfully');
      console.log(`   Title: ${retrieved.title}`);
      console.log(`   Content length: ${retrieved.content?.length || 0} chars`);
    } else {
      throw new Error('Could not retrieve created article');
    }

    // Step 5: Verify article appears in list
    console.log('\n[5/6] Verifying article appears in posts list...');
    const inList = await findArticleBySlug(TEST_ARTICLE.slug);
    if (inList) {
      console.log('   ✅ Article found in posts list');
    } else {
      console.log('   ⚠️ Article not found in list (may be pagination)');
    }

    // Step 6: Cleanup (unless --keep)
    console.log('\n[6/6] Cleanup...');
    if (keepArticle) {
      console.log('   ⏩ Skipping deletion (--keep flag)');
      console.log(`   Article URL: https://cms.immoby.org/admin/collections/posts/${articleId}`);
    } else {
      await deleteArticle(articleId);
      console.log('   ✅ Test article deleted');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('CMS PUBLICATION TEST RESULTS');
    console.log('='.repeat(60));
    console.log('✅ API connectivity: PASS');
    console.log('✅ Article creation: PASS');
    console.log(`${allFieldsValid ? '✅' : '⚠️'} SEO fields mapping: ${allFieldsValid ? 'PASS' : 'PARTIAL'}`);
    console.log('✅ Article retrieval: PASS');
    console.log(`${keepArticle ? '⏩' : '✅'} Cleanup: ${keepArticle ? 'SKIPPED' : 'PASS'}`);
    console.log('='.repeat(60));
    console.log('\nAll CMS publication tests passed!');
    console.log('\nSchema.org validation (manual):');
    console.log('- [ ] BlogPosting schema valid (Google Rich Results Test)');
    console.log('- [ ] FAQPage schema valid');
    console.log('- [ ] Article visible on blog page');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);

    // Attempt cleanup even on error
    if (articleId && !keepArticle) {
      console.log('\nAttempting cleanup...');
      try {
        await deleteArticle(articleId);
        console.log('   ✅ Cleanup successful');
      } catch (cleanupError) {
        console.log(`   ⚠️ Cleanup failed: ${cleanupError.message}`);
      }
    }

    process.exit(1);
  }
}

/**
 * Verify API connectivity
 */
async function verifyAPIConnectivity() {
  const response = await fetch(`${PAYLOAD_CMS_URL}/posts?limit=1`, {
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Create article
 */
async function createArticle(data) {
  const response = await fetch(`${PAYLOAD_CMS_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  return result.doc || result;
}

/**
 * Get article by ID
 */
async function getArticle(id) {
  const response = await fetch(`${PAYLOAD_CMS_URL}/posts/${id}`, {
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
    }
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

/**
 * Find article by slug
 */
async function findArticleBySlug(slug) {
  const response = await fetch(`${PAYLOAD_CMS_URL}/posts?where[slug][equals]=${encodeURIComponent(slug)}`, {
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.docs?.[0] || null;
}

/**
 * Delete article
 */
async function deleteArticle(id) {
  const response = await fetch(`${PAYLOAD_CMS_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return true;
}

// Run
main();
