const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_DIR = path.join(__dirname, '..');
const AI_DIR = path.join(BASE_DIR, 'ai');
const BLOG_DIR = path.join(BASE_DIR, 'blog');

// Ensure ai dir exists
if (!fs.existsSync(AI_DIR)) {
    fs.mkdirSync(AI_DIR, { recursive: true });
}

function clean($) {
    // Remove non-content elements
    $('script, style, link, meta, noscript, svg, form, iframe, .cookie-banner, .header, .footer, footer, nav, .nav, .menu-toggle').remove();

    // Strip attributes but keep structure
    $('*').each((i, el) => {
        const attribs = el.attribs;
        for (const attr in attribs) {
            // Keep specific useful attributes if needed, e.g. href for links, but strip everything else to be raw
            if (el.tagName === 'a' && attr === 'href') continue;
            // Maybe keep id for anchor linking?
            if (attr === 'id') continue;
            $(el).removeAttr(attr);
        }
    });

    // Remove empty structural tags that might be left over
    $('div, span, section').each(function () {
        if ($(this).text().trim().length === 0 && $(this).children().length === 0) {
            $(this).remove();
        }
    });
}

function processMainPages() {
    let combinedHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>NexEnergy AI Content</title></head><body>`;

    // Index
    console.log('Processing index.html...');
    const indexContent = fs.readFileSync(path.join(BASE_DIR, 'index.html'), 'utf8');
    const $index = cheerio.load(indexContent);
    clean($index);
    // For index, we might want to capture specific specific sections if body is too messy
    // But clean() function is quite aggressive, so body content might be fine.
    combinedHtml += `<main id="home"><h1>Home Page</h1>${$index('body').html()}</main><hr>`;

    // Legal Pages
    ['privacy-policy.html', 'cookie-policy.html'].forEach(file => {
        const filePath = path.join(BASE_DIR, file);
        if (fs.existsSync(filePath)) {
            console.log(`Processing ${file}...`);
            const content = fs.readFileSync(filePath, 'utf8');
            const $ = cheerio.load(content);
            clean($);
            const mainContent = $('main').length ? $('main').html() : $('body').html();
            combinedHtml += `<main id="${file.replace('.html', '')}"><h1>${file}</h1>${mainContent}</main><hr>`;
        }
    });

    combinedHtml += `</body></html>`;
    const outputPath = path.join(AI_DIR, 'content.html');
    fs.writeFileSync(outputPath, combinedHtml);
    console.log(`Generated ${outputPath}`);
}

function processBlog() {
    let combinedHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>NexEnergy Blog Archive</title></head><body><h1>Blog Archive</h1>`;

    if (fs.existsSync(BLOG_DIR)) {
        const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
        console.log(`Processing ${files.length} blog posts...`);

        files.forEach(file => {
            const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
            const $ = cheerio.load(content);
            clean($);

            const article = $('article');
            let articleContent = '';

            if (article.length) {
                articleContent = article.html();
            } else {
                // Fallback: try to find h1 and subsequent content
                const h1 = $('h1').first();
                if (h1.length) {
                    articleContent = h1.parent().html();
                } else {
                    articleContent = $('body').html();
                }
            }

            combinedHtml += `<article id="${file.replace('.html', '')}">${articleContent}</article><hr>`;
        });
    }

    combinedHtml += `</body></html>`;
    const outputPath = path.join(AI_DIR, 'blog-archive.html');
    fs.writeFileSync(outputPath, combinedHtml);
    console.log(`Generated ${outputPath}`);
}

function generateIndex() {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>NexEnergy AI Reading</title>
</head>
<body>
<h1>NexEnergy Content for AI Agents</h1>
<p>This directory contains raw HTML versions of the website content, optimized for machine reading.</p>
<ul>
<li><a href="content.html">Main Site Content</a> (Home, Privacy, Cookies)</li>
<li><a href="blog-archive.html">Blog Archive</a> (All articles)</li>
</ul>
</body>
</html>`;
    const outputPath = path.join(AI_DIR, 'index.html');
    fs.writeFileSync(outputPath, html);
    console.log(`Generated ${outputPath}`);
}

try {
    processMainPages();
    processBlog();
    generateIndex();
    console.log('AI pages generation complete.');
} catch (error) {
    console.error('Error generating AI pages:', error);
    process.exit(1);
}
