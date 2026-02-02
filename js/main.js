/**
 * NexEnergy Website - Main JavaScript
 * Handles form validation, navigation, and interactions
 */

(function () {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations(); // New scroll animations
    initFormValidation();
    initSectionTracking();
    initCTATracking();
    initRoiCalculator(); // New ROI Calculator
    initNewsletterPopup(); // Newsletter popup with MailerLite
  }

  /**
   * ROI Calculator Logic
   */
  function initRoiCalculator() {
    const roomsInput = document.getElementById('calc-rooms');
    const occupancyInput = document.getElementById('calc-occupancy');
    const energyInput = document.getElementById('calc-energy-cost');

    // Custom Energy Controls
    const energyMinusBtn = document.getElementById('energy-minus');
    const energyPlusBtn = document.getElementById('energy-plus');
    const energyDisplayVal = document.getElementById('energy-display-val');

    // UI elements to update
    const roomsVal = document.getElementById('roi-rooms-val');
    const occupancyVal = document.getElementById('roi-occupancy-val');
    const savingsYear = document.getElementById('roi-savings-year');

    // New UI Elements
    const roiMonthsStandard = document.getElementById('roi-months-standard');
    const roiMonthsIncentivized = document.getElementById('roi-months-incentivized');
    const roiInvestmentTotal = document.getElementById('roi-investment-total');
    const roiInvestmentDiscounted = document.getElementById('roi-investment-discounted');

    // Check if elements exist (to avoid errors on pages without calc)
    if (!roomsInput || !occupancyInput || !energyInput) return;

    function updateRoi() {
      // Get values
      const rooms = parseInt(roomsInput.value);
      const occupancy = parseInt(occupancyInput.value);
      const energyCost = parseFloat(energyInput.value);

      // Update UI labels
      roomsVal.textContent = rooms;
      occupancyVal.textContent = occupancy + '%';

      // Update Energy Display
      if (energyDisplayVal) {
        energyDisplayVal.textContent = energyCost.toFixed(2);
      }

      // 1. Savings Calculation (Marketing Adjusted)
      const avgConsumptionPerRoomDay = 25;
      const savingPercentage = 0.42;
      const occupiedDays = 365 * (occupancy / 100);

      const totalConsumptionYear = rooms * avgConsumptionPerRoomDay * occupiedDays;
      const savingsKwh = totalConsumptionYear * savingPercentage;
      const savingsEuro = savingsKwh * energyCost;

      // 2. Investment Calculation (CAPEX)
      // €150/room + €30k software + €5k installation
      const sensorCost = rooms * 150;
      const softwareCost = 30000;
      const installCost = 5000;
      const totalInvestment = sensorCost + softwareCost + installCost;

      // 3. Incentivized Investment (ZES/4.0)
      // Customer pays only 20%
      const discountedInvestment = totalInvestment * 0.20;

      // 4. ROI Calculation (Months)
      const roiStandard = (totalInvestment / savingsEuro) * 12;
      const roiIncentivized = (discountedInvestment / savingsEuro) * 12;

      // Update UI
      const currencyFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

      savingsYear.textContent = currencyFmt.format(savingsEuro);
      roiInvestmentTotal.textContent = currencyFmt.format(totalInvestment);
      roiInvestmentDiscounted.textContent = currencyFmt.format(discountedInvestment);

      roiMonthsStandard.textContent = Math.max(1, Math.round(roiStandard)) + " Mesi";

      const roiIncVal = Math.max(0.1, roiIncentivized);
      if (roiIncVal < 1) {
        roiMonthsIncentivized.textContent = "< 1 Mese!";
      } else {
        roiMonthsIncentivized.textContent = Math.round(roiIncVal) + " Mesi";
      }
    }

    // Energy Button Logic
    if (energyMinusBtn && energyPlusBtn) {
      energyMinusBtn.addEventListener('click', () => {
        let current = parseFloat(energyInput.value);
        if (current > 0.05) {
          energyInput.value = (current - 0.05).toFixed(2);
          updateRoi();
        }
      });

      energyPlusBtn.addEventListener('click', () => {
        let current = parseFloat(energyInput.value);
        if (current < 1.00) {
          energyInput.value = (current + 0.05).toFixed(2);
          updateRoi();
        }
      });
    }

    // Attach listeners to range inputs
    roomsInput.addEventListener('input', updateRoi);
    occupancyInput.addEventListener('input', updateRoi);

    // Init calculate
    updateRoi();

    // Expose to window for inline onclicks if needed
    window.updateRoi = updateRoi;
  }

  /**
   * Scroll Reveal Animations
   */
  function initScrollAnimations() {
    // Add .reveal class to elements we want to animate
    const elementsToReveal = document.querySelectorAll('.benefit-card, .phase, .problema-content > *, .contact-form, .metodo-quote');

    elementsToReveal.forEach(el => {
      el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px"
    });

    elementsToReveal.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.header');

    if (!menuToggle) return;

    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
      <button class="mobile-menu-close" aria-label="Chiudi menu">&times;</button>
      <nav>
        <a href="#problema">Il Problema</a>
        <a href="#soluzione">La Soluzione</a>
        <a href="#metodo">Il Metodo</a>
        <a href="/blog/">Blog</a>
        <a href="#contatti" class="btn btn-primary">Richiedi Demo</a>
      </nav>
    `;
    document.body.appendChild(mobileMenu);

    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');

    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', closeMobileMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Smooth Scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /**
   * Form Validation
   */
  function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.querySelector('.form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('has-error');
      });
      form.querySelectorAll('input, select').forEach(function (field) {
        field.classList.remove('error');
      });

      // Validate required fields
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) return;

      // Track form submission
      trackEvent('form_submit_demo', {
        event_category: 'lead_generation',
        event_label: 'contact_form'
      });

      // Simulate form submission (replace with actual endpoint)
      submitForm(form);
    });

    // Real-time validation on blur
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(this);
      });

      // Clear error on input
      field.addEventListener('input', function () {
        const group = this.closest('.form-group');
        if (group) {
          group.classList.remove('has-error');
        }
        this.classList.remove('error');
      });
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      let isValid = true;

      // Check if empty
      if (!field.value.trim()) {
        isValid = false;
      }

      // Check email format
      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
        }
      }

      if (!isValid && group) {
        group.classList.add('has-error');
        field.classList.add('error');
      }

      return isValid;
    }

    async function submitForm(form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Preserve UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (param) {
        if (urlParams.has(param)) {
          data[param] = urlParams.get(param);
        }
      });

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso...';

      try {
        // Try multiple endpoints
        const endpoints = [
          '/api/contact/submit',
          '/.netlify/functions/contact-submit'
        ];

        let response;
        for (const endpoint of endpoints) {
          try {
            response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            if (response.status !== 404) break;
          } catch (e) {
            console.log(`Endpoint ${endpoint} not available`);
          }
        }

        if (response && response.ok) {
          // Show success message
          form.style.display = 'none';
          if (successMessage) {
            successMessage.hidden = false;
          }
        } else {
          throw new Error('Errore invio');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Si è verificato un errore. Riprova o contattaci direttamente via email.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  /**
   * Track section views on scroll
   */
  function initSectionTracking() {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackEvent('section_view', {
            event_category: 'engagement',
            event_label: entry.target.id
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /**
   * Track CTA clicks
   */
  function initCTATracking() {
    document.querySelectorAll('[data-track]').forEach(function (element) {
      element.addEventListener('click', function () {
        const trackingId = this.getAttribute('data-track');
        trackEvent(trackingId, {
          event_category: 'engagement',
          event_label: this.textContent.trim()
        });
      });
    });
  }

  /**
   * Track event (wrapper for gtag)
   */
  function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    console.log('Event tracked:', eventName, params);
  }

  /**
   * Newsletter Popup with MailerLite Integration
   */
  function initNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    const form = document.getElementById('newsletter-form');

    if (!popup || !form) return;

    const STORAGE_KEY = 'nexenergy_newsletter_shown';
    const POPUP_DELAY = 30000; // 30 seconds

    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem(STORAGE_KEY);
    if (wasShown) return;

    // Elements
    const closeButtons = popup.querySelectorAll('[data-close-popup]');
    const emailInput = document.getElementById('newsletter-email');
    const nameInput = document.getElementById('newsletter-name');
    const gdprCheckbox = document.getElementById('newsletter-gdpr');
    const submitBtn = popup.querySelector('.newsletter-submit');
    const submitText = popup.querySelector('.newsletter-submit-text');
    const submitLoading = popup.querySelector('.newsletter-submit-loading');
    const successState = popup.querySelector('.newsletter-success');
    const errorState = popup.querySelector('.newsletter-error-state');
    const retryBtn = popup.querySelector('.newsletter-retry');

    // Show popup after delay
    let popupTimer = setTimeout(showPopup, POPUP_DELAY);

    // Exit intent detection (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mouseout', handleExitIntent);
    }

    function handleExitIntent(e) {
      if (e.clientY <= 0 && !popup.hasAttribute('hidden') === false) {
        clearTimeout(popupTimer);
        showPopup();
        document.removeEventListener('mouseout', handleExitIntent);
      }
    }

    function showPopup() {
      popup.hidden = false;
      sessionStorage.setItem(STORAGE_KEY, 'true');
      document.body.style.overflow = 'hidden';

      // Track popup view
      trackEvent('newsletter_popup_view', {
        event_category: 'newsletter',
        event_label: 'popup_shown'
      });
    }

    function hidePopup() {
      popup.hidden = true;
      document.body.style.overflow = '';
    }

    // Close button handlers
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', hidePopup);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !popup.hidden) {
        hidePopup();
      }
    });

    // Form validation
    function validateForm() {
      let isValid = true;

      // Email validation
      const emailGroup = emailInput.closest('.newsletter-form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        emailGroup.classList.add('has-error');
        emailInput.classList.add('error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
        emailInput.classList.remove('error');
      }

      // GDPR consent validation
      const gdprGroup = gdprCheckbox.closest('.newsletter-form-group');
      if (!gdprCheckbox.checked) {
        gdprGroup.classList.add('has-error');
        isValid = false;
      } else {
        gdprGroup.classList.remove('has-error');
      }

      return isValid;
    }

    // Clear errors on input
    emailInput.addEventListener('input', function () {
      this.closest('.newsletter-form-group').classList.remove('has-error');
      this.classList.remove('error');
    });

    gdprCheckbox.addEventListener('change', function () {
      this.closest('.newsletter-form-group').classList.remove('has-error');
    });

    // Form submission
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Show loading state
      submitBtn.disabled = true;
      submitText.hidden = true;
      submitLoading.hidden = false;

      try {
        const response = await subscribeToNewsletter({
          email: emailInput.value.trim(),
          name: nameInput.value.trim() || undefined
        });

        if (response.success) {
          // Show success state
          form.hidden = true;
          successState.hidden = false;

          // Track successful signup
          trackEvent('newsletter_signup', {
            event_category: 'newsletter',
            event_label: 'subscription_success'
          });

          // Auto-close after 3 seconds
          setTimeout(hidePopup, 3000);
        } else {
          throw new Error(response.message || 'Subscription failed');
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);

        // Show error state
        form.hidden = true;
        errorState.hidden = false;

        // Track error
        trackEvent('newsletter_error', {
          event_category: 'newsletter',
          event_label: error.message
        });
      } finally {
        submitBtn.disabled = false;
        submitText.hidden = false;
        submitLoading.hidden = true;
      }
    });

    // Retry button
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        errorState.hidden = true;
        form.hidden = false;
      });
    }
  }

  /**
   * Subscribe to newsletter via MailerLite API
   * Uses a serverless function or backend endpoint to avoid CORS
   * Supports multiple deployment targets: Vercel, Netlify, custom backend
   */
  async function subscribeToNewsletter(data) {
    // Try multiple endpoints in order of preference
    const endpoints = [
      '/api/newsletter/subscribe',           // Vercel / custom backend
      '/.netlify/functions/newsletter-subscribe'  // Netlify Functions
    ];

    const payload = JSON.stringify({
      email: data.email,
      fields: {
        name: data.name || ''
      }
    });

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: payload
        });

        // If endpoint exists and responds
        if (response.status !== 404) {
          const result = await response.json();
          return result;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} not available:`, error.message);
      }
    }

    // Fallback: store locally for demo/static site
    console.log('No newsletter API available, using fallback mode');
    storeNewsletterSignup(data);
    return { success: true, message: 'Stored locally (demo mode)' };
  }

  /**
   * Fallback: Store newsletter signup in localStorage (for demo/static site)
   */
  function storeNewsletterSignup(data) {
    const signups = JSON.parse(localStorage.getItem('nexenergy_newsletter_signups') || '[]');
    signups.push({
      email: data.email,
      name: data.name,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('nexenergy_newsletter_signups', JSON.stringify(signups));
    console.log('Newsletter signup stored locally:', data.email);
  }

})();
