/**
 * Newsletter Subscription API Endpoint
 * Integrates with MailerLite API
 *
 * Can be deployed as:
 * - Netlify Function (netlify/functions/subscribe.js)
 * - Vercel Serverless Function (api/newsletter/subscribe.js)
 * - Node.js Express endpoint
 */

// For Vercel/Netlify serverless functions
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email, fields } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // MailerLite API call
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

    if (!MAILERLITE_API_KEY) {
      console.error('MAILERLITE_API_KEY not configured');
      return res.status(500).json({ success: false, message: 'Newsletter service not configured' });
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
        return res.status(200).json({
          success: true,
          message: 'Already subscribed',
          data: mailerLiteData
        });
      }

      console.error('MailerLite API error:', mailerLiteData);
      return res.status(mailerLiteResponse.status).json({
        success: false,
        message: mailerLiteData.message || 'Failed to subscribe'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed',
      data: {
        id: mailerLiteData.data?.id,
        email: mailerLiteData.data?.email
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// For Netlify Functions format
export const config = {
  runtime: 'edge',
};

// Alternative CommonJS export for Netlify Functions
// exports.handler = async (event, context) => {
//   // Similar logic adapted for Netlify's event/context format
// };
