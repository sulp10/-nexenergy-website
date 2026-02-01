/**
 * NexEnergy Newsletter Signup Test
 * Tests the newsletter subscription flow with MailerLite
 *
 * Usage: node scripts/test-newsletter.js [test-email@example.com]
 *
 * This script:
 * 1. Validates MailerLite API connectivity
 * 2. Creates a test subscriber (if email provided)
 * 3. Verifies subscriber was created
 * 4. Removes test subscriber (cleanup)
 *
 * Environment Variables Required:
 * - MAILERLITE_API_KEY
 */

require('dotenv').config();
const fetch = require('node-fetch');

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

async function main() {
  const testEmail = process.argv[2] || `test-${Date.now()}@nexenergy-test.it`;

  console.log('='.repeat(60));
  console.log('NexEnergy Newsletter Signup Test');
  console.log('='.repeat(60));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Test email: ${testEmail}`);
  console.log('='.repeat(60));

  // Check API key
  if (!process.env.MAILERLITE_API_KEY) {
    console.error('\n❌ ERROR: MAILERLITE_API_KEY not configured');
    console.log('\nTo run this test, set MAILERLITE_API_KEY in your .env file');
    process.exit(1);
  }

  let subscriberId = null;

  try {
    // Step 1: Verify API connectivity
    console.log('\n[1/5] Verifying MailerLite API connectivity...');
    await verifyAPIConnectivity();
    console.log('   ✅ API connection successful');

    // Step 2: Check if subscriber already exists
    console.log('\n[2/5] Checking if test subscriber exists...');
    const existing = await findSubscriber(testEmail);
    if (existing) {
      console.log(`   ⚠️ Subscriber already exists (ID: ${existing.id})`);
      subscriberId = existing.id;
    } else {
      console.log('   ✅ Email not in list (good for testing)');
    }

    // Step 3: Create test subscriber
    console.log('\n[3/5] Creating test subscriber...');
    const subscriber = await createSubscriber(testEmail, 'Test User');
    subscriberId = subscriber.data?.id;
    console.log(`   ✅ Subscriber created`);
    console.log(`   ID: ${subscriberId}`);
    console.log(`   Email: ${subscriber.data?.email}`);
    console.log(`   Status: ${subscriber.data?.status}`);

    // Step 4: Verify subscriber exists
    console.log('\n[4/5] Verifying subscriber in MailerLite...');
    const verified = await findSubscriber(testEmail);
    if (verified) {
      console.log('   ✅ Subscriber verified in MailerLite');
      console.log(`   Subscribed: ${verified.subscribed_at || 'N/A'}`);
    } else {
      throw new Error('Subscriber not found after creation');
    }

    // Step 5: Cleanup (delete test subscriber)
    console.log('\n[5/5] Cleaning up test subscriber...');
    if (subscriberId) {
      await deleteSubscriber(subscriberId);
      console.log('   ✅ Test subscriber deleted');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('NEWSLETTER TEST RESULTS');
    console.log('='.repeat(60));
    console.log('✅ API connectivity: PASS');
    console.log('✅ Subscriber creation: PASS');
    console.log('✅ Subscriber verification: PASS');
    console.log('✅ Subscriber deletion: PASS');
    console.log('='.repeat(60));
    console.log('\nAll newsletter signup tests passed!');
    console.log('\nFrontend tests (manual):');
    console.log('- [ ] Popup appears after 30 seconds');
    console.log('- [ ] Popup appears on exit intent (desktop)');
    console.log('- [ ] Form validation shows error for invalid email');
    console.log('- [ ] Form validation requires GDPR checkbox');
    console.log('- [ ] Success message shown after submission');
    console.log('- [ ] GA4 event newsletter_signup tracked');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);

    // Attempt cleanup even on error
    if (subscriberId) {
      console.log('\nAttempting cleanup...');
      try {
        await deleteSubscriber(subscriberId);
        console.log('   ✅ Cleanup successful');
      } catch (cleanupError) {
        console.log(`   ⚠️ Cleanup failed: ${cleanupError.message}`);
      }
    }

    process.exit(1);
  }
}

/**
 * Verify API connectivity by fetching groups
 */
async function verifyAPIConnectivity() {
  const response = await fetch(`${MAILERLITE_API_URL}/groups?limit=1`, {
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${error.message || 'Unknown error'}`);
  }

  return await response.json();
}

/**
 * Find subscriber by email
 */
async function findSubscriber(email) {
  const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${error.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Create subscriber
 */
async function createSubscriber(email, name) {
  const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      fields: {
        name: name
      }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${error.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Delete subscriber (GDPR forget)
 */
async function deleteSubscriber(subscriberId) {
  const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${subscriberId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // 204 No Content is success for DELETE
  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${error.message || 'Unknown error'}`);
  }

  return true;
}

// Run
main();
