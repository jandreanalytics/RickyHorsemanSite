/**
 * Dynamic Header CTA Button Variant
 * 
 * Changes the header CTA button label based on the current page URL,
 * while always linking to the contact destination.
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="cta-variant.js"></script>
 * 2. Add CTA_RULES below to define which pages get which labels
 * 3. Optionally set data-cta="header" on your CTA button for easy targeting
 */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  // Add or modify rules here to change CTA labels per page
  // Rules are checked in order; first match wins
  const CTA_RULES = [
    { match: /^\/$/, label: "Start Your Project", project: "General" },
    { match: /^\/concrete-construction\/?$/, label: "Get Concrete Estimate", project: "Concrete Construction" },
    { match: /^\/specialty-concrete-sport-courts\/?$/, label: "Plan Your Court", project: "Sport Courts" },
    { match: /^\/site-property-services\/?$/, label: "Request Site Services", project: "Site Services" },
    { match: /^\/seasonal-facility-support\/?$/, label: "Get Snow Service Quote", project: "Snow Removal" },
    { match: /^\/data-centers\/?$/, label: "Request Data Center Quote", project: "Data Centers" },
    { match: /^\/landscaping\/?$/, label: "Request Emergency Response", project: "Emergency Response" },
    { match: /^\/services\/?$/, label: "Start Your Project", project: "Services" },
    { match: /^\/projects\/?$/, label: "View Our Work", project: "Projects" },
    { match: /^\/about\/?$/, label: "Let's Talk", project: "About" },
  ];

  // Default label if no rule matches
  const DEFAULT_LABEL = "Start Your Project";
  const DEFAULT_PROJECT = null;

  // Contact destination (all CTAs point here)
  const CONTACT_URL = "/quote.html";

  // ===== SELECTOR STRATEGY =====
  // Try selectors in order of preference
  const SELECTORS = [
    '[data-cta="header"]',           // Preferred: explicit data attribute
    'a[href*="/quote"]',             // Fallback: link to quote/contact page
    'button[data-role="header-cta"]', // Fallback: button with role
    '#header-cta',                   // Fallback: by ID
  ];

  // ===== HELPER FUNCTIONS =====

  /**
   * Normalize URL path (remove trailing slashes for consistent matching)
   */
  function normalizePath(path) {
    return path.replace(/\/$/, '') || '/';
  }

  /**
   * Find the header CTA button using selector strategy
   */
  function findCTAButton() {
    for (let selector of SELECTORS) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  /**
   * Get the matching CTA rule for current page
   */
  function getMatchingRule() {
    const currentPath = normalizePath(window.location.pathname);
    
    for (let rule of CTA_RULES) {
      if (rule.match.test(currentPath)) {
        return rule;
      }
    }
    
    return null;
  }

  /**
   * Update the CTA button with new label and URL
   */
  function updateCTAButton(button, label, project) {
    if (!button) return;

    // Set button text
    button.innerText = label;

    // Set aria-label for accessibility
    button.setAttribute('aria-label', label);

    // Build contact URL with optional project parameter
    let contactUrl = CONTACT_URL;
    if (project) {
      const separator = CONTACT_URL.includes('?') ? '&' : '?';
      contactUrl = `${CONTACT_URL}${separator}project=${encodeURIComponent(project)}`;
    }

    // Update href if it's a link
    if (button.tagName === 'A') {
      button.href = contactUrl;
    }
    // Set click handler if it's a button
    else if (button.tagName === 'BUTTON') {
      button.onclick = function(e) {
        e.preventDefault();
        window.location.href = contactUrl;
      };
    }
  }

  /**
   * Initialize: find button and apply matching rule
   */
  function init() {
    const button = findCTAButton();
    if (!button) return false;

    const rule = getMatchingRule();
    const label = rule ? rule.label : DEFAULT_LABEL;
    const project = rule ? rule.project : DEFAULT_PROJECT;

    updateCTAButton(button, label, project);
    return true;
  }

  /**
   * Setup MutationObserver to handle late-injected headers (e.g., theme builders)
   * Retries for up to 5 seconds, then stops
   */
  function setupObserver() {
    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds with 100ms intervals
    let observer = null;

    function tryInit() {
      if (init()) {
        // Success: button found and updated
        if (observer) observer.disconnect();
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        // Give up after max attempts
        if (observer) observer.disconnect();
        return;
      }

      // Retry after a short delay
      setTimeout(tryInit, 100);
    }

    // Also watch for DOM changes in case header is injected
    observer = new MutationObserver(function() {
      if (init()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Start initial attempt
    tryInit();
  }

  // ===== EXECUTION =====
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupObserver);
  } else {
    // DOM already loaded
    setupObserver();
  }
})();
