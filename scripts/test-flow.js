require('dotenv').config();
const fetch = require('node-fetch');

// Simulate what blog-agent does but with explicit logging

async function testBlogAgentFlow() {
    console.log('[1] Starting test...');
    console.log('[2] isDryRun =', false);
    console.log('[3] Simulating publish...');

    const payload = {
        title: 'Test Flow ' + new Date().toISOString(),
        h1: 'Articolo Test Flow',
        slug: 'test-flow-' + Date.now(),
        focusKeyword: 'test flow',
        content: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [{ type: 'text', text: 'Test content.' }]
                    }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1
            }
        },
        _status: 'published'
    };

    console.log('[4] Sending to CMS...');

    const response = await fetch('https://cms.immoby.org/api/posts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    console.log('[5] HTTP Status:', response.status);

    const data = await response.json();
    console.log('[6] Response ID:', data.doc?.id || data.id || 'none');

    if (response.ok) {
        console.log('[7] SUCCESS!');
    } else {
        console.log('[7] FAILED:', JSON.stringify(data.errors));
    }
}

testBlogAgentFlow().catch(e => console.error('ERROR:', e));
