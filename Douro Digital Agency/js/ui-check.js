/*
 * UI Consistency Check Script
 * Run window.uiCheck() in DevTools console to validate page state
 */
(function () {
  'use strict';

  function check(name, condition, detail) {
    var status = condition ? 'PASS' : 'FAIL';
    var symbol = condition ? '\u2713' : '\u2717';
    console.log('[ui-check] ' + symbol + ' ' + name + (detail ? ' — ' + detail : ''));
    return condition;
  }

  function runChecks() {
    console.log('[ui-check] === UI Consistency Check ===');
    var passed = 0;
    var failed = 0;

    // 1. Footer present
    var footer = document.querySelector('.c-footer, footer, [class*="footer"]');
    if (check('Footer present', !!footer)) passed++; else failed++;

    // 2. Navigation present
    var nav = document.querySelector('.c-nav, nav, [class*="nav"]');
    if (check('Navigation present', !!nav)) passed++; else failed++;

    // 3. Scroll position (should be at top on fresh load)
    var atTop = window.scrollY < 100;
    if (check('Scroll position near top', atTop, 'scrollY=' + window.scrollY)) passed++; else failed++;

    // 4. Check for orphan arrows (broken links)
    var ctaWrappers = document.querySelectorAll('.c-cta-wrapper');
    var orphans = 0;
    ctaWrappers.forEach(function (el) {
      var hasLink = el.querySelector('a[href]');
      var hasText = el.querySelector('.c-text-1, .c-button_text-wrap');
      if (!hasLink || !hasText) orphans++;
    });
    if (check('No orphan arrow links', orphans === 0, orphans + ' found')) passed++; else failed++;

    // 5. Hero-rain canvas on homepage
    var isHome = location.pathname === '/' || location.pathname.endsWith('index.html');
    if (isHome) {
      var canvas = document.querySelector('canvas');
      var heroRainReady = !!window.__heroRain;
      if (check('Hero-rain canvas present (homepage)', !!canvas)) passed++; else failed++;
      if (check('Hero-rain object initialized', heroRainReady)) passed++; else failed++;
    }

    // 6. Check GSAP loaded (on pages that use it)
    var gsapLoaded = !!window.gsap || !!window.__gsapLoaded;
    if (check('GSAP available', gsapLoaded)) passed++; else failed++;

    // 7. Check for hidden-in-viewport elements (hydration failure indicator)
    var vh = window.innerHeight;
    var hiddenInViewport = 0;
    var checkSelectors = '.char, .word, .line, .c-heading-1, .c-heading-2, .c-heading-3, .c-text-1';
    document.querySelectorAll(checkSelectors).forEach(function (el) {
      if (el.getBoundingClientRect().top > vh) return;
      if (getComputedStyle(el).opacity === '0') hiddenInViewport++;
    });
    if (check('No hidden elements in viewport', hiddenInViewport < 5, hiddenInViewport + ' hidden')) passed++; else failed++;

    // 8. Check scroll is not locked
    var scrollable = document.documentElement.scrollHeight > window.innerHeight;
    var overflowOk = getComputedStyle(document.documentElement).overflowY !== 'hidden';
    if (check('Scroll not locked', !scrollable || overflowOk)) passed++; else failed++;

    // Summary
    console.log('[ui-check] === Summary: ' + passed + ' passed, ' + failed + ' failed ===');
    return { passed: passed, failed: failed };
  }

  window.uiCheck = runChecks;
  console.log('[ui-check] UI check loaded. Run window.uiCheck() to validate.');
})();
