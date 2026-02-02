/**
 * Blog Posts Proxy - Netlify Function
 * Proxies requests to Payload CMS to avoid CORS issues
 *
 * Endpoint: /.netlify/functions/blog-posts
 */

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const PAYLOAD_CMS_URL = 'https://cms.immoby.org/api';
        const limit = event.queryStringParameters?.limit || 20;

        const response = await fetch(
            `${PAYLOAD_CMS_URL}/posts?limit=${limit}&sort=-createdAt&where[_status][equals]=published`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`CMS responded with ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Blog posts fetch error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Failed to fetch articles',
                docs: []
            })
        };
    }
};
