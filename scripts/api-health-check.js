/**
 * NexEnergy API Health Check
 * Tests connectivity to all required APIs
 *
 * Usage: node scripts/api-health-check.js [--send-test-email]
 *
 * Environment Variables Required:
 * - OPENROUTER_API_KEY
 * - MAILERLITE_API_KEY
 * - PAYLOAD_API_KEY
 * - RESEND_API_KEY
 * - ADMIN_EMAIL
 */

require('dotenv').config();
const fetch = require('node-fetch');

const RESULTS = {
  openrouter: { status: 'pending', message: '' },
  mailerlite: { status: 'pending', message: '' },
  payloadcms: { status: 'pending', message: '' },
  resend: { status: 'pending', message: '' }
};

async function main() {
  const args = process.argv.slice(2);
  const sendTestEmail = args.includes('--send-test-email');

  console.log('='.repeat(60));
  console.log('NexEnergy API Health Check');
  console.log('='.repeat(60));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Test Email: ${sendTestEmail ? 'YES' : 'NO'}`);
  console.log('='.repeat(60));

  // Test 1: OpenRouter API
  console.log('\n[1/4] Testing OpenRouter API...');
  await testOpenRouter();

  // Test 2: MailerLite API
  console.log('\n[2/4] Testing MailerLite API...');
  await testMailerLite();

  // Test 3: Payload CMS API
  console.log('\n[3/4] Testing Payload CMS API...');
  await testPayloadCMS();

  // Test 4: Resend API
  console.log('\n[4/4] Testing Resend API...');
  await testResend(sendTestEmail);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('HEALTH CHECK SUMMARY');
  console.log('='.repeat(60));

  let allPassed = true;
  for (const [api, result] of Object.entries(RESULTS)) {
    const icon = result.status === 'pass' ? '✅' : (result.status === 'warn' ? '⚠️' : '❌');
    console.log(`${icon} ${api.toUpperCase()}: ${result.status.toUpperCase()}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
    if (result.status === 'fail') allPassed = false;
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('All API connections successful!');
    process.exit(0);
  } else {
    console.log('Some API connections failed. Please check configuration.');
    process.exit(1);
  }
}

/**
 * Test OpenRouter API connectivity
 */
async function testOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY) {
    RESULTS.openrouter = { status: 'fail', message: 'OPENROUTER_API_KEY not configured' };
    console.log('   ❌ API key not configured');
    return;
  }

  try {
    // Test auth/key endpoint to check credentials and credits
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const credits = data.data?.limit_remaining;
      const label = data.data?.label || 'N/A';

      console.log(`   ✅ Connection successful`);
      console.log(`   Key label: ${label}`);
      console.log(`   Credits remaining: ${credits !== undefined ? `$${credits}` : 'N/A'}`);

      if (credits !== undefined && credits < 5) {
        RESULTS.openrouter = {
          status: 'warn',
          message: `Credits low: $${credits}`
        };
      } else {
        RESULTS.openrouter = {
          status: 'pass',
          message: `Credits: $${credits || 'N/A'}`
        };
      }
    } else {
      const error = await response.json().catch(() => ({}));
      RESULTS.openrouter = {
        status: 'fail',
        message: `HTTP ${response.status}: ${error.error?.message || 'Unknown error'}`
      };
      console.log(`   ❌ HTTP ${response.status}`);
    }
  } catch (error) {
    RESULTS.openrouter = { status: 'fail', message: error.message };
    console.log(`   ❌ ${error.message}`);
  }
}

/**
 * Test MailerLite API connectivity
 */
async function testMailerLite() {
  if (!process.env.MAILERLITE_API_KEY) {
    RESULTS.mailerlite = { status: 'fail', message: 'MAILERLITE_API_KEY not configured' };
    console.log('   ❌ API key not configured');
    return;
  }

  try {
    // Test by fetching subscriber groups
    const response = await fetch('https://connect.mailerlite.com/api/groups?limit=1', {
      headers: {
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const groupCount = data.data?.length || 0;

      console.log(`   ✅ Connection successful`);
      console.log(`   Groups found: ${groupCount > 0 ? 'Yes' : 'No groups yet'}`);

      RESULTS.mailerlite = {
        status: 'pass',
        message: 'API connection verified via groups endpoint'
      };
    } else {
      const error = await response.json().catch(() => ({}));
      RESULTS.mailerlite = {
        status: 'fail',
        message: `HTTP ${response.status}: ${error.message || 'Unknown error'}`
      };
      console.log(`   ❌ HTTP ${response.status}`);
    }
  } catch (error) {
    RESULTS.mailerlite = { status: 'fail', message: error.message };
    console.log(`   ❌ ${error.message}`);
  }
}

/**
 * Test Payload CMS API connectivity
 */
async function testPayloadCMS() {
  if (!process.env.PAYLOAD_API_KEY) {
    RESULTS.payloadcms = { status: 'fail', message: 'PAYLOAD_API_KEY not configured' };
    console.log('   ❌ API key not configured');
    return;
  }

  try {
    // Test by fetching posts (just checking connection)
    const response = await fetch('https://cms.immoby.org/api/posts?limit=1', {
      headers: {
        'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const postCount = data.totalDocs || 0;

      console.log(`   ✅ Connection successful`);
      console.log(`   Total posts in CMS: ${postCount}`);

      RESULTS.payloadcms = {
        status: 'pass',
        message: `${postCount} posts in database`
      };
    } else {
      const error = await response.json().catch(() => ({}));
      RESULTS.payloadcms = {
        status: 'fail',
        message: `HTTP ${response.status}: ${JSON.stringify(error)}`
      };
      console.log(`   ❌ HTTP ${response.status}`);
    }
  } catch (error) {
    RESULTS.payloadcms = { status: 'fail', message: error.message };
    console.log(`   ❌ ${error.message}`);
  }
}

/**
 * Test Resend API connectivity
 */
async function testResend(sendTestEmail = false) {
  if (!process.env.RESEND_API_KEY) {
    RESULTS.resend = { status: 'fail', message: 'RESEND_API_KEY not configured' };
    console.log('   ❌ API key not configured');
    return;
  }

  if (!process.env.ADMIN_EMAIL) {
    RESULTS.resend = { status: 'fail', message: 'ADMIN_EMAIL not configured' };
    console.log('   ❌ ADMIN_EMAIL not configured');
    return;
  }

  try {
    if (sendTestEmail) {
      // Send actual test email
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'NexEnergy Test <no-reply@nexenergy.it>',
          to: [process.env.ADMIN_EMAIL],
          subject: '[NexEnergy] ✅ API Health Check - Test Email',
          html: `
            <h2>API Health Check Successful</h2>
            <p>This is a test email from the NexEnergy API Health Check script.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">NexEnergy AI Blog Agent</p>
          `
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Test email sent successfully`);
        console.log(`   Email ID: ${data.id}`);
        console.log(`   Recipient: ${process.env.ADMIN_EMAIL}`);

        RESULTS.resend = {
          status: 'pass',
          message: `Test email sent to ${process.env.ADMIN_EMAIL}`
        };
      } else {
        const error = await response.json().catch(() => ({}));
        RESULTS.resend = {
          status: 'fail',
          message: `HTTP ${response.status}: ${error.message || JSON.stringify(error)}`
        };
        console.log(`   ❌ HTTP ${response.status}`);
      }
    } else {
      // Just verify API key exists and admin email is set
      console.log(`   ✅ API key configured`);
      console.log(`   Admin email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   (Use --send-test-email to send actual test)`);

      RESULTS.resend = {
        status: 'pass',
        message: 'API key verified (no test email sent)'
      };
    }
  } catch (error) {
    RESULTS.resend = { status: 'fail', message: error.message };
    console.log(`   ❌ ${error.message}`);
  }
}

// Run
main();
