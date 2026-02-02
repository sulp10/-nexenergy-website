/**
 * NexEnergy Website - Google Analytics 4
 * GDPR-compliant tracking configuration
 */

(function() {
  'use strict';

  // GA4 Measurement ID - Replace with actual ID
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  // Load Google Analytics
  function loadGA() {
    // Create script element
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());

    // Configure with GDPR-compliant settings
    gtag('config', GA_MEASUREMENT_ID, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure',
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false
    });

    // GA4 initialized (debug log removed for production)
  }

  // Check for consent before loading (placeholder for cookie consent integration)
  function checkConsent() {
    // For now, load GA immediately
    // In production, integrate with cookie consent banner
    loadGA();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkConsent);
  } else {
    checkConsent();
  }

})();
