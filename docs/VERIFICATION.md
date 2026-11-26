# VERIFICATION.md: Lab 04 Homework

Results of the verification tasks in `TASK_DECOMPOSITION.md`. Lighthouse
12.8 runs on the production build (`vite build` + `vite preview`) with the
default mobile preset (simulated throttling) and the desktop preset, 3 runs
each. Reports and screenshots stay in the git-ignored `evidence/` folder.

## HW 1: Photo & Evidence Gallery (Task H1.6)

### Lighthouse (Performance / Accessibility / Best Practices)

| Page | Mobile (3 runs) | Desktop (3 runs) | Mobile LCP / CLS / TBT | Desktop LCP / CLS / TBT |
|---|---|---|---|---|
| `/gallery` | 100/100/100 x3 | 100/100/100 x3 | 1.7 s / 0 / 0 ms | 0.4 s / 0 / 0 ms |
| `/gallery?category=forms&photoId=form-show-data` | 100/100/100 x3 | 100/100/100 x3 | 1.7 s / 0 / 0 ms | 0.5 s / 0 / 0 ms |

- Finding fixed during this task: the LCP thumbnail was lazy-loaded on
  desktop (AI Failure 02, `c5593de`).
- Remaining Lighthouse opportunity (not a failed audit): "prioritize LCP
  image" suggests a `<link rel="preload">`; the thumbnail is only known after
  the SPA renders, so it is left as is.

### URL state and lightbox (Playwright on Chrome)

| Check | Result |
|---|---|
| Category filter | `Forms` -> `?category=forms`, 3 of 11 photos; Back restores the previous filter; reload keeps it; `?category=mars` falls back to all 11 |
| Open from a thumbnail | Enter on the thumbnail pushes `photoId`, dialog is modal, labelled by the photo title, focus on the close button |
| Focus trap | Focusing a link outside the dialog fails; Tab stays inside the dialog |
| Close | Esc and the close button remove only `photoId` (`?category=forms` kept); focus returns to the thumbnail that opened it |
| History | Back after opening closes the dialog; Forward reopens it |
| Deep link | `?category=full-stack&photoId=forum-api-down` opens the dialog on load and after reload; `?photoId=nope` keeps it closed |
| Layout | 375 px: one column, no horizontal scroll; 1440 px: 6 columns; CLS 0 on load and scroll; filter targets 38 px high; focus ring 3 px `#f59e0b` |
| Console | 0 errors, 0 warnings |
