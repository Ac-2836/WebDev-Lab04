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
