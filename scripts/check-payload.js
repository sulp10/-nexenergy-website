require('dotenv').config();
const fetch = require('node-fetch');

async function checkPayloadStructure() {
    try {
        const response = await fetch('https://cms.immoby.org/api/posts?limit=1', {
            headers: {
                'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
            }
        });

        const data = await response.json();

        if (data.docs && data.docs[0]) {
            const post = data.docs[0];
            console.log('=== POST STRUCTURE ===');
            console.log('Keys:', Object.keys(post));
            console.log('\n=== CONTENT FIELD ===');
            console.log('Content type:', typeof post.content);
            console.log('Content value:', JSON.stringify(post.content, null, 2));
        } else {
            console.log('No posts found');
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkPayloadStructure();
