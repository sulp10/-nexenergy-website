/**
 * Newsletter Subscription - Netlify Function
 * Integrates with MailerLite API
 *
 * Deploy: This file will be automatically deployed as a Netlify Function
 * Endpoint: /.netlify/functions/newsletter-subscribe
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, fields } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Email is required' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid email format' })
      };
    }

    // MailerLite API call
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

    if (!MAILERLITE_API_KEY) {
      console.error('MAILERLITE_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, message: 'Newsletter service not configured' })
      };
    }

    const mailerLiteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: fields?.name || '',
          last_name: fields?.last_name || ''
        },
        status: 'active'
      })
    });

    const mailerLiteData = await mailerLiteResponse.json();

    if (!mailerLiteResponse.ok) {
      // Handle specific MailerLite errors
      if (mailerLiteResponse.status === 422) {
        // Subscriber already exists - this is okay
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Already subscribed',
            data: mailerLiteData
          })
        };
      }

      console.error('MailerLite API error:', mailerLiteData);
      return {
        statusCode: mailerLiteResponse.status,
        headers,
        body: JSON.stringify({
          success: false,
          message: mailerLiteData.message || 'Failed to subscribe'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed',
        data: {
          id: mailerLiteData.data?.id,
          email: mailerLiteData.data?.email
        }
      })
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error'
      })
    };
  }
};
