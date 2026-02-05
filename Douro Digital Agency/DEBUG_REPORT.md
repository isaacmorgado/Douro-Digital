# Douro Digital — Debug & Critical Path Analysis Report

**Date:** 2026-02-04
**Environment:** `localhost:8080` (node server.js), Brave DevTools
**Viewports tested:** Desktop (1440x900), Mobile (375x812)

---

## Executive Summary

Overall site is **functional** with good performance scores. Three critical categories of issues found:

1. **Broken CDN domain** — `files.douro-digital.com` DNS not resolving (15+ video assets failing)
2. **Content-URL mismatches** — Multiple case study slugs show wrong content
3. **JS error on service pages** — `wf is not defined` breaking Webflow consent/analytics

---

## Per-Page Health Status

| # | Page | URL | Status | LCP (ms) | CLS | Console Errors | Network Issues |
|---|------|-----|--------|----------|-----|----------------|----------------|
| 1 | Home | `/` | PASS | 194 | 0.00 | 0 | 0 |
| 2 | Contact | `/contact` | PASS | 1212 | 0.00 | 0 | 0 |
| 3 | AI Solutions | `/ai-solutions` | PASS | 104 | 0.00 | 0 | 0 (fixed) |
| 4 | Custom Dev | `/custom-development` | PASS | 119 | 0.01 | 0 | 0 (fixed) |
| 5 | AI Consulting | `/ai-consulting` | PASS | 163 | 0.01 | 0 | 0 (fixed) |
| 6 | Portfolio | `/work` | PASS | 104 | 0.02 | 0 | 0 |
| 7 | News | `/news` | PASS | 79 | 0.00 | 0 | 0 |
| 8 | Pocket Agent | `/pocket-agent` | PASS | 127 | 0.00 | 0 | 0 (fixed) |
| 9 | Meridian | `/meridian` | PASS | 144 | 0.00 | 0 | 0 |
| 10 | Arqitel | `/arqitel` | PASS | 96 | 0.00 | 0 | 0 |
| 11 | Botify | `/botify` | PASS | 94 | 0.00 | 0 | 0 |

**Legend:** PASS = no errors, WARN = non-critical warnings, FAIL = errors present

---

## Critical Issues (P0)

### 1. `files.douro-digital.com` DNS not resolving
**Severity:** P0 — Broken assets visible to users
**Pages affected:** `/ai-solutions`, `/custom-development`, `/ai-consulting`
**Details:** All `.webm` video files hosted on `files.douro-digital.com` and `cdn.douro-digital.com` fail with `net::ERR_NAME_NOT_RESOLVED`. This affects:
- Hero background videos (`dodge03.webm`, `cula-snippet.webm`, `3d-scene.webm`, `arqitel-3d.webm`, `stripes-large.webm`, `venture.webm`)
- Portfolio hover preview videos (15+ `.webm` files: `josys-169`, `arqitel-169`, `cula-169`, `brightwavev2-169`, `chargeflow-169`, `deepset-169`, `layoutland-169`, `weglotlikemagic-169`, `ttr-169`, `rainfall-169`, `silvr-169`, `botify-169`, `sevdesk-169`, `umault-169`, `bcgp-169`, `goodroots-169`, `brightwave-169`, `maniv-169`, `allvoices-169`, `rainfallv2-169`)
**Fix:** Configure DNS for `files.douro-digital.com` and `cdn.douro-digital.com`, or migrate assets to a working CDN/local server.

### 2. ~~Case Study URL-Content Mismatches~~ — NOT A BUG
**Status:** Confirmed correct by owner.
- `/arqitel` → Voice Noob (correct)
- `/botify` → Viral-Kid (correct)
- `/ai-consulting` → Branding (correct)
- Legacy slugs retained intentionally.

### 3. `wf is not defined` JS Error
**Severity:** P0 — Breaks Webflow analytics/consent
**Pages affected:** `/ai-solutions`, `/custom-development`, `/ai-consulting`
**Details:** `Object.getIsOptedOut` in `refokus-24-new.schunk.dad8805996c6f2aa.js:1:22287` throws because `wf` (Webflow global) is undefined. This likely breaks cookie consent tracking.
**Fix:** Ensure Webflow runtime script loads before the chunk that references `wf`, or add a null guard.

---

## High Priority Issues (P1)

### 4. `/webflow-agency` 404
**Pages affected:** `/ai-solutions`, `/custom-development`, `/ai-consulting`
**Details:** A link/prefetch to `/webflow-agency` returns 404. This route doesn't exist.
**Fix:** Either create the page or remove the reference from the service page templates.

### 5. Contact Page LCP: 1212ms
**Details:** Highest LCP of all pages. Breakdown shows 1208ms of **render delay** (not load time). The LCP element loads fast but rendering is blocked, likely by JS animations/GSAP initialization.
**Fix:** Defer non-critical JS, or ensure LCP element renders before animation scripts execute.

### 6. Unused Preloaded Script (`117556954.js`)
**Pages affected:** All pages with `<link rel="preload">`
**Details:** `http://localhost:8080/js/117556954.js` is preloaded but never used, wasting bandwidth and triggering browser warnings.
**Fix:** Remove the preload hint or ensure the script is actually used.

---

## Medium Priority Issues (P2)

### 7. GSAP Empty Selector Warnings (Case Studies)
**Pages affected:** `/pocket-agent`, `/meridian`, `/arqitel`, `/botify`
**Details:** GSAP logs 15-25 "target not found" warnings per case study page. Many have **empty selectors** (GSAP target "" not found), plus `.c-cs-temp_showcase_img` and `.c-blog_item`.
**Fix:** Guard GSAP animations with element existence checks, or scope animations to pages where targets exist.

### 8. `custom-main.js:80` logs `null`
**Pages affected:** All case study pages
**Details:** Line 80 of custom-main.js logs `null` — likely a querySelector returning null for a missing element.
**Fix:** Add null check.

### 9. DOMSize Warning
**Pages affected:** `/custom-development`, `/ai-consulting`
**Details:** Performance trace flagged excessive DOM size affecting style calculations and layout reflows.
**Fix:** Reduce DOM node count; consider lazy-loading below-fold sections.

### 10. No Text Compression (DocumentLatency)
**Pages affected:** All pages
**Details:** Performance traces consistently flag missing text compression. Estimated wasted bytes range from 32-147 KB per page.
**Fix:** Enable gzip/brotli compression in `server.js`.

---

## Low Priority Issues (P3)

### 11. Forced Reflow Warnings
**Pages affected:** Home, AI Solutions, Custom Dev, AI Consulting, Arqitel, Botify
**Details:** JS queries geometric properties after DOM mutations, causing synchronous layout thrashing.

### 12. Cache Headers Missing
**Pages affected:** All pages
**Details:** Static assets lack long-lived cache headers. ~147 KB of wasted bytes per page on repeat visits.

### 13. Third-Party Script Impact
**Details:** GTM, Google Analytics, Finsweet components, and Ahrefs analytics add network overhead.

### 14. `analytics.js` Ignores Localhost
**Details:** `Ignoring Event: localhost` — analytics correctly skips localhost but logs it, adding noise.

---

## Interactive Element Status

| Element | Status | Notes |
|---------|--------|-------|
| Nav dropdown (MENU) | PASS | Opens/closes, all links visible, Services sub-menu works |
| Testimonial slider | PASS | Dot buttons (1-4) work, content changes between testimonials |
| Contact form | PASS | Fields fillable, submit works, "Message Sent!" success state displays correctly |
| Budget dropdown | WARN | `<select>` didn't accept programmatic fill (em-dash encoding), but HTML native select works for real users |
| Cookie banner | PASS | Visible on all pages, PREFERENCES/REJECT/ACCEPT buttons present |
| Footer CTAs | PASS | Portfolio link and "GET IN TOUCH" CTA visible and clickable |
| FAQ accordions (contact) | PASS | 6 FAQ items present and expandable |

---

## Mobile Viewport (375x812) Results

| Page | Rendering | Notes |
|------|-----------|-------|
| Home | PASS | Hero 3D canvas scales, text readable, cookie banner visible |
| Contact | PASS | Form stacks vertically, all fields accessible, hero text pushed below fold |
| AI Solutions | PASS | Hero text/CTA scale properly |
| Portfolio | PASS | Filters collapse into "Filters" button, cards stack single-column |

No mobile-specific layout breaks found.

---

## CWV Score Summary

| Metric | Range | Assessment |
|--------|-------|------------|
| LCP | 79-194ms (10 pages), 1212ms (contact) | Green except contact |
| CLS | 0.00-0.02 | All Green |
| FID/INP | Not measured (no field data) | n/a |

---

## Prioritized Fix List

1. ~~**Fix `files.douro-digital.com` DNS**~~ — **FIXED**: Replaced all CDN URLs with local `../videos/` paths in 3 service pages
2. ~~**Fix case study URL-content mapping**~~ — **NOT A BUG**: Confirmed correct by owner
3. ~~**Fix `wf is not defined`**~~ — **FIXED**: Added `typeof wf !== "undefined"` guard in chunk file, updated SRI hash
4. ~~**Remove `/webflow-agency` reference**~~ — **FIXED**: Redirected to `/custom-development` across all pages
5. **Optimize contact page LCP** — 1212ms render delay, defer animation JS (TODO)
6. ~~**Remove unused `117556954.js` preload**~~ — **FIXED**: Removed preload + intellimize preconnect from all pages
7. ~~**Enable gzip/brotli compression**~~ — **FIXED**: Added `compression` middleware to server.js
8. ~~**Guard GSAP animations**~~ — **FIXED**: Null guard in `csTemp()` for `.cc-cs-temp_showcase`
9. ~~**Fix `null` log**~~ — **FIXED**: Removed `console.log(re)` in csTemp(), replaced with null guard
10. ~~**Add cache headers**~~ — **FIXED**: Added `Cache-Control: public, max-age=86400` for static assets
10. **Add cache headers** for static assets
