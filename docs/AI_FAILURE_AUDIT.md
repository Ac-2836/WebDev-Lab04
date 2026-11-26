# AI Failure Audit

## AI Failure 01: scaffold page logs a 404 console error (favicon)

- **AI Prompt:** Task 0.1 Scaffold project: React 19 + Vite,
  `createRoot` + `StrictMode`, no extra deps; `package.json`,
  `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`,
  `src/index.css`, `.gitignore`, `README.md`.
- **AI Generated Code:** The AI copied `index.html` (commit `018a546`) from
  the Lab 03 scaffold commit `c2d5517`, i.e. the version from before Lab 03
  AI Failure 01 was fixed. It has no `<link rel="icon">`, so Chrome requests
  `/favicon.ico`, which the Vite dev server answers with 404. The same defect
  already fixed in Lab 03 came back.
- **Risk:** The Sprint 1 checkpoint and the live defense require zero console
  warnings, and Lighthouse "Best Practices" fails the "No browser errors
  logged to the console" audit. The error would also pollute every later
  console check.
- **Detection Method / DevTools Proof:** Found during Task 1.1 verification.
  Playwright on Chrome loading `http://localhost:5173/people` captured
  console message `[ERROR] Failed to load resource: the server responded with
  a status of 404 (Not Found) @ http://localhost:5173/favicon.ico`;
  `curl http://localhost:5173/favicon.ico` returns 404. Evidence:
  `evidence/0.1-console-before-fix.txt`,
  `evidence/0.1-favicon-curl-before-fix.txt` (captured logs, not DevTools
  panel screenshots).
- **Engineering Refactor / Manual Fix:** Added an inline empty icon to
  `index.html` head: `<link rel="icon" href="data:," />`, the same fix as
  Lab 03. The browser no longer requests `/favicon.ico`, and no extra file is
  added.
- **Verification Evidence:** After the fix, reloaded `/` and `/people` on
  :5173; the same Playwright/Chrome check shows `Errors: 0, Warnings: 0` and
  no `favicon` entry in `performance.getEntriesByType('resource')`;
  `npm run build` passes. `evidence/0.1-console-after-fix.txt` (captured log,
  not a DevTools panel screenshot).

## AI Failure 02 (HW 1): LCP thumbnail is lazy-loaded on desktop

- **AI Prompt:** Task H1.1 / H1.5: thumbnail grid with lazy images below the
  fold, CLS 0, Lighthouse Performance 100.
- **AI Generated Code:** `PhotoGallery.jsx` (commit `62feb0d`, kept in
  `349938c`) loads only the first 4 thumbnails eagerly (`EAGER_COUNT = 4`)
  and marks the rest `loading="lazy"`. The number was picked without looking
  at the layout: at 1350-1440 px the `minmax(220px, 1fr)` grid shows 6
  thumbnails in the first row, so thumbnails 5 and 6 are above the fold but
  lazy, and the browser picks one of them as the Largest Contentful Paint.
- **Risk:** The LCP image waits for layout before it is requested, which
  delays LCP on slower connections; Lighthouse flags it even though the
  local score stays 100, so the "every finding fixed" rule of H1.6 fails.
- **Detection Method / DevTools Proof:** Found during Task H1.6. Lighthouse
  12.8 desktop preset on the production build (`/gallery`): audit
  "Largest Contentful Paint image was lazily loaded" score 0; the LCP
  element is `<img ... loading="lazy" src="/gallery/form-live-status-thumb.webp">`
  (5th thumbnail). Same result on `/gallery?category=forms&photoId=...`.
  Evidence: `evidence/H1.6-before-fix/lh-gallery-desktop.html`,
  `evidence/H1.6-before-fix/lcp-lazy-loaded.txt`.
- **Engineering Refactor / Manual Fix:** `EAGER_COUNT` is now 6, tied to
  the layout: `main` is capped at 1440 px, so the grid never shows more than
  6 thumbnails in its first row at any width; the first thumbnail also gets
  `fetchPriority="high"`. Thumbnails 7-11 stay lazy.
- **Verification Evidence:** Rebuilt and re-ran Lighthouse 3 times per preset
  on `/gallery` and the lightbox deep link: "Largest Contentful Paint image
  was lazily loaded" passes on desktop; Performance, Accessibility and Best
  Practices stay 100/100/100 on mobile and desktop (LCP 1.7 s / 0.4 s,
  CLS 0, TBT 0 ms). `evidence/lighthouse-hw1/summary.json`,
  `evidence/lighthouse-hw1/lh-gallery-desktop.html`.
