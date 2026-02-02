/**
 * Contact Form Submit - Netlify Function
 * Sends contact form data via Resend email API
 *
 * Endpoint: /.netlify/functions/contact-submit
 */

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
        const { nome, email, telefono, nome_struttura, numero_camere, messaggio } = body;

        // Validate required fields
        if (!nome || !email || !nome_struttura || !numero_camere) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Campi obbligatori mancanti' })
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Email non valida' })
            };
        }

        // Get Resend API key
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sulpizii.paypal@gmail.com';

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, message: 'Servizio email non configurato' })
            };
        }

        // Build email content
        const timestamp = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
        const htmlContent = `
      <h2>🏨 Nuova Richiesta Demo NexEnergy</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nome:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${nome}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Telefono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${telefono || 'Non specificato'}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Struttura:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${nome_struttura}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>N. Camere:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${numero_camere}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Messaggio:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${messaggio || 'Nessun messaggio'}</td></tr>
      </table>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Ricevuto: ${timestamp}</p>
    `;

        // Send via Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'NexEnergy <onboarding@resend.dev>',
                to: [ADMIN_EMAIL],
                subject: `🏨 Nuova Richiesta Demo: ${nome_struttura} (${numero_camere} camere)`,
                html: htmlContent,
                reply_to: email
            })
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
            console.error('Resend API error:', resendData);
            return {
                statusCode: resendResponse.status,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Errore invio email. Riprova più tardi.'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Richiesta inviata con successo!',
                id: resendData.id
            })
        };

    } catch (error) {
        console.error('Contact form error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Errore interno. Riprova più tardi.'
            })
        };
    }
};
