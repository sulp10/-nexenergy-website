/**
 * Blog Sync Script - Downloads articles from Payload CMS and generates static HTML pages
 * 
 * Purpose: SEO, GEO, AEO optimization - articles must be on-site for Google/AI crawlers
 * 
 * Run: node scripts/blog-sync.js
 * Schedule: Every 12 hours via cron or GitHub Actions
 * Last Updated: 2026-02-02 (CI Trigger)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  payloadUrl: process.env.PAYLOAD_CMS_URL || 'https://cms.immoby.org/api',
  siteUrl: process.env.SITE_URL || 'https://nex-energy.it',
  blogDir: path.join(__dirname, '..', 'blog'),
  templatePath: path.join(__dirname, 'blog-article-template.html')
};

/**
 * Fetch all published articles from Payload CMS
 */
async function fetchArticles() {
  console.log('📥 Fetching articles from Payload CMS...');

  const response = await fetch(`${CONFIG.payloadUrl}/posts?limit=100&sort=-createdAt&where[_status][equals]=published`);

  if (!response.ok) {
    throw new Error(`CMS responded with ${response.status}`);
  }

  const data = await response.json();
  console.log(`   Found ${data.docs?.length || 0} published articles`);

  return data.docs || [];
}

/**
 * Parse Payload's rich text JSON tree into HTML
 */
function parseContentToHtml(content) {
  if (!content?.root?.children) return '';

  return content.root.children.map(node => parseNode(node)).join('\n');
}

function parseNode(node) {
  if (!node) return '';

  switch (node.type) {
    case 'heading':
      const tag = node.tag || 'h2';
      const headingText = extractText(node);
      return `<${tag}>${headingText}</${tag}>`;

    case 'paragraph':
      const paragraphText = extractText(node);
      if (!paragraphText.trim()) return '';
      return `<p>${paragraphText}</p>`;

    case 'list':
      const listTag = node.listType === 'number' ? 'ol' : 'ul';
      const listItems = node.children?.map(item =>
        `<li>${extractText(item)}</li>`
      ).join('\n') || '';
      return `<${listTag}>\n${listItems}\n</${listTag}>`;

    case 'quote':
      return `<blockquote>${extractText(node)}</blockquote>`;

    default:
      if (node.children) {
        return node.children.map(child => parseNode(child)).join('');
      }
      return '';
  }
}

function extractText(node) {
  if (!node) return '';

  if (node.text !== undefined) {
    let text = escapeHtml(node.text);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    return text;
  }

  if (node.children) {
    return node.children.map(child => extractText(child)).join('');
  }

  return '';
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generate FAQ Schema.org JSON-LD
 */
function generateFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return '';

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/**
 * Generate Article Schema.org JSON-LD
 */
function generateArticleSchema(article) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.h1 || article.title,
    "description": article.meta?.description || article.directAnswer || '',
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "NexEnergy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NexEnergy",
      "url": CONFIG.siteUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${CONFIG.siteUrl}/blog/${article.slug}.html`
    },
    "articleSection": article.meta?.articleSection || "Efficienza Energetica",
    "wordCount": article.wordCount || 0
  };

  if (article.heroImage?.url) {
    schema.image = article.heroImage.url;
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
function generateBreadcrumbSchema(article) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": CONFIG.siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${CONFIG.siteUrl}/blog/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.h1 || article.title,
        "item": `${CONFIG.siteUrl}/blog/${article.slug}.html`
      }
    ]
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/**
 * Generate FAQ HTML section
 */
function generateFaqHtml(faqs) {
  if (!faqs || faqs.length === 0) return '';

  const faqItems = faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${escapeHtml(faq.question)}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${escapeHtml(faq.answer)}</p>
      </div>
    </div>
  `).join('\n');

  return `
    <section class="article-faq" itemscope itemtype="https://schema.org/FAQPage">
      <h2>Domande Frequenti</h2>
      ${faqItems}
    </section>
  `;
}

/**
 * Generate secondary keywords meta
 */
function generateKeywordsMeta(keywords) {
  if (!keywords || keywords.length === 0) return '';
  const kwList = keywords.map(k => k.keyword || k).join(', ');
  return `<meta name="keywords" content="${escapeHtml(kwList)}">`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate a complete HTML page for an article
 */
function generateArticleHtml(article) {
  const title = article.meta?.title || article.title || '';
  const h1 = article.h1 || article.title || '';
  const description = article.meta?.description || article.directAnswer || '';
  const canonicalUrl = `${CONFIG.siteUrl}/blog/${article.slug}.html`;
  const publishDate = formatDate(article.publishedAt || article.createdAt);
  const readTime = article.meta?.timeToRead || Math.ceil((article.wordCount || 500) / 200);

  const contentHtml = parseContentToHtml(article.content);
  const faqHtml = generateFaqHtml(article.faqSchema);
  const faqSchema = generateFaqSchema(article.faqSchema);
  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema(article);
  const keywordsMeta = generateKeywordsMeta(article.secondaryKeywords);

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Primary -->
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonicalUrl}">
  ${keywordsMeta}
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="it_IT">
  <meta property="og:site_name" content="NexEnergy">
  ${article.heroImage?.url ? `<meta property="og:image" content="${article.heroImage.url}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  
  <!-- Article Meta -->
  <meta property="article:published_time" content="${article.publishedAt || article.createdAt}">
  <meta property="article:modified_time" content="${article.updatedAt}">
  <meta property="article:section" content="${article.meta?.articleSection || 'Efficienza Energetica'}">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Schema.org -->
  ${articleSchema}
  ${faqSchema}
  ${breadcrumbSchema}
  
  <link rel="stylesheet" href="/css/style.css">
  <style>
    /* === MOBILE-FIRST OPTIMIZATIONS FOR 50+ USERS === */
    /* Larger base font, high contrast, big touch targets */
    
    .article-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 120px 20px 80px;
    }
    .article-header {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .article-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      color: var(--color-text-dim, #94a3b8);
      font-size: 1rem; /* Larger for readability */
      margin-bottom: 1.5rem;
    }
    .article-meta span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .article-title {
      font-size: 2.2rem;
      line-height: 1.3;
      margin-bottom: 1.5rem;
      color: white;
    }
    .article-excerpt {
      font-size: 1.25rem; /* Larger for older readers */
      color: var(--color-text-light, #e2e8f0); /* High contrast */
      line-height: 1.7;
    }
    .article-content {
      color: var(--color-text-light, #e2e8f0); /* Higher contrast */
      line-height: 1.9; /* More line spacing */
      font-size: 1.15rem; /* Larger base text */
    }
    .article-content h2 {
      font-size: 1.75rem;
      margin: 2.5rem 0 1rem;
      color: white;
    }
    .article-content h3 {
      font-size: 1.4rem;
      margin: 2rem 0 0.75rem;
      color: var(--color-primary, #00d4ff);
    }
    .article-content p {
      margin-bottom: 1.2rem;
    }
    .article-content ul, .article-content ol {
      margin: 1rem 0 1.5rem 1.5rem;
    }
    .article-content li {
      margin-bottom: 0.5rem;
    }
    .article-content blockquote {
      border-left: 4px solid var(--color-primary, #00d4ff);
      padding-left: 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: var(--color-text-dim, #94a3b8);
    }
    .article-faq {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .article-faq h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: white;
    }
    .faq-item {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .faq-item h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      color: var(--color-primary, #00d4ff);
    }
    .faq-item p {
      margin: 0;
      color: var(--color-text-light, #cbd5e1);
      line-height: 1.6;
    }
    .article-cta {
      margin-top: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 157, 0.1));
      border-radius: 16px;
      text-align: center;
    }
    .article-cta h3 {
      margin-bottom: 1rem;
      color: white;
    }
    .article-cta p {
      margin-bottom: 1.5rem;
      color: var(--color-text-light, #cbd5e1);
    }
    .back-link {
      display: inline-block;
      margin-top: 2rem;
      color: var(--color-primary, #00d4ff);
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    
    /* Dark theme basics if no style.css */
    :root {
      --color-primary: #00d4ff;
      --color-secondary: #00ff9d;
      --color-text-light: #cbd5e1;
      --color-text-dim: #94a3b8;
    }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #0b0f19;
      color: white;
      margin: 0;
    }
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 1rem 2rem;
      background: rgba(11, 15, 25, 0.9);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--color-primary);
      text-decoration: none;
      text-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
      animation: logoFlip 10s infinite ease-in-out;
      transform-style: preserve-3d;
      backface-visibility: visible;
      perspective: 1000px;
    }
    @keyframes logoFlip {
      0% { transform: rotateY(0deg); }
      10% { transform: rotateY(360deg); }
      100% { transform: rotateY(360deg); }
    }
    .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 14px 28px;
      min-height: 52px;
      background: linear-gradient(135deg, #00d4ff 0%, #00ff9d 100%);
      color: #0b0f19;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
      border: none;
      cursor: pointer;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.5);
      background: linear-gradient(135deg, #00ff9d 0%, #00d4ff 100%);
    }
    
    /* Mobile optimizations for 50+ users */
    @media (max-width: 768px) {
      .article-container {
        padding: 100px 16px 60px;
      }
      .article-title {
        font-size: 1.75rem;
        line-height: 1.35;
      }
      .article-content {
        font-size: 1.1rem; /* Minimum 18px on mobile */
        line-height: 1.8;
      }
      .article-content h2 {
        font-size: 1.5rem;
      }
      .article-content h3 {
        font-size: 1.25rem;
      }
      .article-meta {
        font-size: 0.95rem;
      }
      .btn {
        width: auto; /* Revert full width */
        max-width: 100%;
        display: inline-flex;
        justify-content: center;
        text-align: center;
        padding: 14px 24px; /* Slightly reduced padding */
        font-size: 1.1rem;
        margin: 0 auto; /* Center button */
      }
      .header .btn {
        padding: 10px 18px; /* Smaller for header */
        font-size: 0.95rem;
        min-height: 44px;
      }
      .back-link {
        display: block;
        padding: 16px 0;
        font-size: 1.1rem;
      }
      .faq-item {
        padding: 1.25rem;
      }
      .faq-item h3 {
        font-size: 1.1rem;
        line-height: 1.4;
      }
      .faq-item p {
        font-size: 1rem;
        line-height: 1.7;
      }
    }
    .footer {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 2rem;
      text-align: center;
      color: var(--color-text-dim);
    }
    .footer a {
      color: var(--color-primary);
    }
  </style>
</head>
<body>
  <header class="header">
    <a href="/" class="logo">NexEnergy</a>
    <a href="/#contatti" class="btn">Richiedi Demo</a>
  </header>

  <main class="article-container" itemscope itemtype="https://schema.org/BlogPosting">
    <article>
      <header class="article-header">
        <div class="article-meta">
          <span>📅 <time datetime="${article.publishedAt || article.createdAt}" itemprop="datePublished">${publishDate}</time></span>
          <span>⏱️ ${readTime} min lettura</span>
          ${article.wordCount ? `<span>📝 ${article.wordCount} parole</span>` : ''}
        </div>
        <h1 class="article-title" itemprop="headline">${escapeHtml(h1)}</h1>
        ${article.directAnswer ? `<p class="article-excerpt" itemprop="abstract">${escapeHtml(article.directAnswer)}</p>` : ''}
      </header>

      <div class="article-content" itemprop="articleBody">
        ${contentHtml}
      </div>

      ${faqHtml}

      <div class="article-cta">
        <h3>Vuoi ridurre i costi energetici del tuo hotel?</h3>
        <p>Scopri come NexEnergy può aiutarti a risparmiare fino al 35% sui consumi energetici.</p>
        <a href="/#contatti" class="btn">Richiedi Consulenza Gratuita</a>
      </div>

      <a href="/blog/" class="back-link">← Torna al Blog</a>
    </article>
  </main>

  <footer class="footer">
    <p>&copy; 2026 NexEnergy. <a href="/privacy-policy.html">Privacy Policy</a> | <a href="/cookie-policy.html">Cookie Policy</a></p>
  </footer>

  <script defer src="/js/analytics.js"></script>
</body>
</html>`;
}

/**
 * Update sitemap.xml with new articles
 */
function updateSitemap(articles) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');

  if (!fs.existsSync(sitemapPath)) {
    console.log('⚠️ sitemap.xml not found, skipping update');
    return;
  }

  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Remove existing blog article URLs to avoid duplicates (excluding main /blog/ page)
  const urlRegex = /<url>(?:(?!<\/url>).)*?\/blog\/(?!$)(?:(?!<\/url>).)*?<\/url>/gs;
  sitemapContent = sitemapContent.replace(urlRegex, '');

  // Create new URL entries
  const today = new Date().toISOString().split('T')[0];
  const newUrls = articles.map(article => `  <url>
    <loc>${CONFIG.siteUrl}/blog/${article.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  // Insert new URLs before </urlset>
  sitemapContent = sitemapContent.replace('</urlset>', `${newUrls}\n</urlset>`);

  // Clean up empty lines
  sitemapContent = sitemapContent.replace(/^\s*[\r\n]/gm, '');

  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`   Updated sitemap.xml with ${articles.length} articles`);
}

/**
 * Update the blog index page with all articles
 */
function generateBlogIndexJson(articles) {
  const indexData = articles.map(article => ({
    slug: article.slug,
    title: article.h1 || article.title,
    excerpt: article.meta?.description || article.directAnswer || '',
    date: article.publishedAt || article.createdAt,
    wordCount: article.wordCount,
    readTime: article.meta?.timeToRead || Math.ceil((article.wordCount || 500) / 200)
  }));

  const indexPath = path.join(CONFIG.blogDir, 'articles.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`   Updated articles.json with ${indexData.length} articles`);
}

/**
 * Main sync function
 */
async function syncBlog() {
  console.log('\n🔄 NexEnergy Blog Sync');
  console.log('='.repeat(50));
  console.log(`📅 ${new Date().toISOString()}\n`);

  try {
    // Ensure blog directory exists
    if (!fs.existsSync(CONFIG.blogDir)) {
      fs.mkdirSync(CONFIG.blogDir, { recursive: true });
    }

    // Fetch articles from CMS
    const articles = await fetchArticles();

    if (articles.length === 0) {
      console.log('⚠️  No articles found in CMS');
      return;
    }

    // Generate HTML page for each article
    console.log('\n📝 Generating article pages...');
    let created = 0;
    let updated = 0;

    for (const article of articles) {
      if (!article.slug) {
        console.log(`   ⚠️ Skipping article without slug: ${article.title}`);
        continue;
      }

      const filePath = path.join(CONFIG.blogDir, `${article.slug}.html`);
      const html = generateArticleHtml(article);

      const existed = fs.existsSync(filePath);
      fs.writeFileSync(filePath, html);

      if (existed) {
        updated++;
        console.log(`   📄 Updated: ${article.slug}.html`);
      } else {
        created++;
        console.log(`   ✨ Created: ${article.slug}.html`);
      }
    }

    // Generate articles index JSON for the blog listing page
    generateBlogIndexJson(articles);

    // Update sitemap.xml
    updateSitemap(articles);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Sync completed!');
    console.log(`   Created: ${created} articles`);
    console.log(`   Updated: ${updated} articles`);
    console.log(`   Total: ${articles.length} articles\n`);

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run sync
syncBlog();
