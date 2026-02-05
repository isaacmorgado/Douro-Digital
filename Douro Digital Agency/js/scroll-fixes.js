/*
 * Scroll Fixes — shared across all pages
 * Must load BEFORE GSAP / Refokus JS chunks.
 *
 * 1. (removed — addEventListener override was breaking wheel scroll)
 * 2. Reload on bfcache restore (back/forward navigation)
 * 3. Strip scroll-behavior: smooth from <html>
 * 4. Safety timeout to clear scroll-blocking classes
 * 5. Hydration safety for GSAP-hidden content
 * 6. Destroy IX2 on service pages (fixes IX2 + ScrollTrigger conflict)
 */
console.log('[scroll-debug] scroll-fixes.js v5 loaded');

/* 2 ── bfcache reload ──────────────────────────────────────────────── */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) location.reload();
});

/* 3 ── Strip scroll-behavior: smooth from <html> ─────────────────────
 * Webflow IX2 sets this at runtime. It conflicts with GSAP ScrollTrigger.
 */
(function stripSmoothScroll() {
  function remove() {
    var html = document.documentElement;
    if (html.style.scrollBehavior === 'smooth') {
      html.style.scrollBehavior = 'auto';
      console.log('[scroll-debug] stripped scroll-behavior:smooth from <html>');
    }
  }
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

/* 5 ── Hydration safety: reveal content stuck at opacity:0 ────────── */
document.addEventListener('DOMContentLoaded', function () {
  console.log('[scroll-debug] DOMContentLoaded heard, hydration timer started (5s)');
  setTimeout(function () {
    var hidden = 0;
    var inViewport = 0;
    var vh = window.innerHeight;
    var checks = document.querySelectorAll('.char, .word, .line, .c-heading-1, .c-heading-2, .c-heading-3, .c-text-1, .c-line, .c-button, .a-img');
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].getBoundingClientRect().top > vh) continue;
      inViewport++;
      if (getComputedStyle(checks[i]).opacity === '0') hidden++;
    }
    console.log('[scroll-debug] hydration check: hidden=' + hidden + '/inViewport=' + inViewport + '/total=' + checks.length + (hidden > 10 ? ' — THRESHOLD EXCEEDED' : ' — OK'));
    if (hidden > 10) {
      var stCount = 0;
      if (window.ScrollTrigger) {
        var triggers = ScrollTrigger.getAll();
        stCount = triggers.length;
        triggers.forEach(function (st) { st.kill(); });
      }
      console.log('[scroll-debug] killing ' + stCount + ' ScrollTrigger instances');
      document.documentElement.setAttribute('no-animation', '');
      console.log('[scroll-debug] set [no-animation] on <html>');
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

/* 6 ── Kill IX2 scroll interactions on service pages ─────────────────
 * Webflow IX2 SCROLL_INTO_VIEW interactions conflict with GSAP
 * ScrollTrigger when both run on the same page. On service pages we
 * don't need IX2 scroll interactions (they're homepage-only).
 *
 * Instead of destroying all of IX2 (which kills hover/click
 * interactions too), we selectively stop IX2 scroll event processing
 * by removing all wheel listeners from document after IX2 registers them.
 */
window.addEventListener('load', function () {
  var isHome = document.querySelector('[data-barba-namespace="home"]');
  if (isHome) return;

  // Remove IX2 wheel listeners from document — they use a throttled
  // handler for SCROLL_INTO_VIEW. We find them by checking all event
  // listeners Chrome tracks internally, but since we can't access
  // getEventListeners from page JS, we use a broader approach:
  // re-register a capture-phase passive wheel listener that prevents
  // IX2's handlers from seeing propagation.
  var blocker = function (e) {
    e.stopImmediatePropagation();
  };
  document.addEventListener('wheel', blocker, { capture: true, passive: true });
  document.addEventListener('mousewheel', blocker, { capture: true, passive: true });
  console.log('[scroll-debug] installed IX2 wheel event blocker on service page');
});
