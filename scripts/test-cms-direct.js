require('dotenv').config();
const fetch = require('node-fetch');

async function testPublish() {
    // Simple test with required fields
    const testPayload = {
        title: 'Test AI Blog ' + new Date().toISOString(),
        h1: 'Articolo Test Automatico',
        slug: 'test-ai-blog-' + Date.now(),
        focusKeyword: 'test efficienza energetica',
        content: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'heading',
                        tag: 'h2',
                        children: [{ type: 'text', text: 'Introduzione' }]
                    },
                    {
                        type: 'paragraph',
                        children: [{ type: 'text', text: 'Questo è un articolo test generato dal blog agent AI per verificare la connessione al CMS.' }]
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

    console.log('Publishing test article...');
    console.log('Title:', testPayload.title);
    console.log('Slug:', testPayload.slug);

    try {
        const response = await fetch('https://cms.immoby.org/api/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testPayload)
        });

        console.log('\nHTTP Status:', response.status);

        const data = await response.json();

        if (response.ok) {
            console.log('SUCCESS!');
            console.log('Created ID:', data.doc?.id || data.id);
            console.log('Slug:', data.doc?.slug || data.slug);
        } else {
            console.log('FAILED!');
            console.log('Errors:', JSON.stringify(data.errors, null, 2));
        }
    } catch (error) {
        console.error('Network Error:', error.message);
    }
}

testPublish();
