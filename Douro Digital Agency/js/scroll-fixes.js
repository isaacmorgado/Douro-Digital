/*
 * Scroll Fixes — shared across all pages
 * Must load BEFORE GSAP / Refokus JS chunks.
 *
 * 1. Force wheel listeners passive so GSAP Observer can't block native scroll
 * 2. Reload on bfcache restore (back/forward navigation)
 * 3. Safety timeout to clear scroll-blocking classes if animations stall
 */

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
})();

/* 2 ── bfcache reload ──────────────────────────────────────────────── */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) location.reload();
});

/* 3 ── Safety: ensure scroll is never permanently stuck ────────────── */
function unlockScroll() {
  document.documentElement.classList.remove('animating');
  document.body.classList.remove('overflow', 'hidden');
  document.body.style.overflowY = '';
  var pw = document.querySelector('.page-wrapper');
  if (pw) pw.style.overflow = 'visible';
}
setTimeout(unlockScroll, 2000);
window.addEventListener('load', unlockScroll);
