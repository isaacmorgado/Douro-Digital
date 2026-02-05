/*
 * Scroll Fixes — shared across all pages
 * Must load BEFORE GSAP / Refokus JS chunks.
 *
 * 1. Force wheel listeners passive so GSAP Observer can't block native scroll
 * 2. Reload on bfcache restore (back/forward navigation)
 * 3. Safety timeout to clear scroll-blocking classes if animations stall
 */
console.log('[scroll-debug] scroll-fixes.js loaded');

/* 1 ── Passive wheel listeners ─────────────────────────────────────── */
(function () {
  var orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (type === 'wheel' || type === 'mousewheel') {
      var capture = false;
      if (typeof opts === 'boolean') capture = opts;
      else if (opts && typeof opts === 'object') capture = !!opts.capture;
      opts = { capture: capture, passive: true };
    }
    return orig.call(this, type, fn, opts);
  };
  console.log('[scroll-debug] passive wheel override applied');
})();

/* 2 ── bfcache reload ──────────────────────────────────────────────── */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) location.reload();
});

/* 3 ── Strip scroll-behavior: smooth from <html> ─────────────────────
 * Webflow IX2 sets this at runtime. It conflicts with GSAP ScrollTrigger
 * and makes sticky-hero pages feel frozen (smooth-scrolling through the
 * ~850px dead zone takes ages with small wheel ticks).
 */
(function stripSmoothScroll() {
  function remove() {
    var html = document.documentElement;
    if (html.style.scrollBehavior === 'smooth') {
      html.style.scrollBehavior = 'auto';
      console.log('[scroll-debug] stripped scroll-behavior:smooth from <html>');
    }
  }
  // Run early, on load, and as a mutation observer in case IX2 sets it late
  remove();
  document.addEventListener('DOMContentLoaded', remove);
  window.addEventListener('load', remove);
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'style') { remove(); return; }
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }
})();

/* 4 ── Safety: ensure scroll is never permanently stuck ────────────── */
function unlockScroll() {
  var html = document.documentElement;
  var body = document.body;
  var cleared = [];
  if (html.classList.contains('animating')) cleared.push('html.animating');
  if (body.classList.contains('overflow')) cleared.push('body.overflow');
  if (body.classList.contains('hidden')) cleared.push('body.hidden');
  html.classList.remove('animating');
  body.classList.remove('overflow', 'hidden');
  html.style.overflowY = 'auto';
  body.style.overflowY = 'auto';
  var pw = document.querySelector('.page-wrapper');
  if (pw) pw.style.overflow = 'visible';
  console.log('[scroll-debug] unlockScroll() — cleared: ' + (cleared.length ? cleared.join(', ') : 'nothing'));
}
setTimeout(unlockScroll, 1500);
window.addEventListener('load', function () {
  setTimeout(unlockScroll, 500);
  setTimeout(unlockScroll, 2000);
});

/* 5 ── Hydration safety: reveal content stuck at opacity:0 ──────────
 * GSAP SplitText + ScrollTrigger hides elements for animation, but if
 * animations stall or scroll is blocked, content stays invisible forever.
 *
 * Uses DOMContentLoaded + 5s (not window.load + timeout, which fires too
 * late on image-heavy pages). DOMContentLoaded fires at ~100ms after HTML
 * parse, so total = ~5s from page start — enough for GSAP to init but
 * catches stuck animations reliably.
 *
 * Must kill ScrollTrigger BEFORE clearing styles, otherwise ST resets
 * inline opacity:0 on each animation frame.
 */
document.addEventListener('DOMContentLoaded', function () {
  console.log('[scroll-debug] DOMContentLoaded heard, hydration timer started (5s)');
  setTimeout(function () {
    var hidden = 0;
    var inViewport = 0;
    var vh = window.innerHeight;
    var checks = document.querySelectorAll('.char, .word, .line, .c-heading-1, .c-heading-2, .c-heading-3, .c-text-1, .c-line, .c-button, .a-img');
    for (var i = 0; i < checks.length; i++) {
      // Only count above-the-fold elements — below-fold ones are intentionally
      // hidden by ScrollTrigger and should not trigger the safety net
      if (checks[i].getBoundingClientRect().top > vh) continue;
      inViewport++;
      if (getComputedStyle(checks[i]).opacity === '0') hidden++;
    }
    console.log('[scroll-debug] hydration check: hidden=' + hidden + '/inViewport=' + inViewport + '/total=' + checks.length + (hidden > 10 ? ' — THRESHOLD EXCEEDED' : ' — OK'));
    // If more than 10 above-fold elements are still hidden, animations are stuck
    if (hidden > 10) {
      // Kill all ScrollTrigger instances so they stop resetting inline styles
      var stCount = 0;
      if (window.ScrollTrigger) {
        var triggers = ScrollTrigger.getAll();
        stCount = triggers.length;
        triggers.forEach(function (st) { st.kill(); });
      }
      console.log('[scroll-debug] killing ' + stCount + ' ScrollTrigger instances');
      // Set no-animation attribute — uses existing [no-animation] CSS with !important
      document.documentElement.setAttribute('no-animation', '');
      console.log('[scroll-debug] set [no-animation] on <html>');
      // Clear inline animation props (keep display:inline-block for SplitText layout)
      var all = document.querySelectorAll('.char, .word, .line, [simple-blur], [asset-reveal], [testimonials-slider]');
      for (var j = 0; j < all.length; j++) {
        all[j].style.opacity = '';
        all[j].style.filter = '';
        all[j].style.transform = '';
        all[j].style.translate = '';
        all[j].style.rotate = '';
        all[j].style.scale = '';
      }
      console.log('[scroll-debug] cleared ' + all.length + ' inline styles');
    }
  }, 5000);
});
