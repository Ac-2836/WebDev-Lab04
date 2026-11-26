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

## HW 2: Card-Swipe Deck (Task H2.8)

### Lighthouse (Performance / Accessibility / Best Practices)

| Page | Mobile (3 runs) | Desktop (3 runs) | Mobile LCP / CLS / TBT | Desktop LCP / CLS / TBT |
|---|---|---|---|---|
| `/swipe` (API + MongoDB running) | 100/100/100 x3 | 100/100/100 x3 | 1.7 s / 0 / 0 ms | 0.4 s / 0 / 0 ms |

### API (curl against the running server, MongoDB 8 in Docker)

| Request | Result |
|---|---|
| `GET /api/profiles` | 200, 8 seeded profiles in deck order (`.lean()`, no `__v`) |
| `POST /api/swipe` with an extra `score` field | 201 `{ profileId, direction, _id, createdAt }`; `score` dropped |
| `POST /api/swipe` with `direction: 'down'` | 400, Mongoose enum validation message |
| `DELETE /api/swipe/:id` twice | 204, then 404 |
| `GET /api/messages/nasa` | 200 (In-class route still works after mounting the HW router) |

### Deck behaviour (Playwright on Chrome)

| Check | Result |
|---|---|
| Buttons | Like +10, Nope -5, 'Hẹn hò nhưng không yêu' -5; 1 React commit per click; two Undos restore the cards in LIFO order |
| Keyboard on the focused card | ArrowRight / ArrowLeft / ArrowUp swipe, Backspace undoes; a held key (5 `repeat` events) swipes once; arrows outside the card do nothing; the page does not scroll |
| Pointer | 80 px right drag -> Like, 90 px up -> 'up', 30 px drag -> nothing; the card follows the pointer while dragging; a stray `pointerup` without `pointerdown` does nothing (no error) |
| Persistence | POST 201 per swipe, DELETE 204 per undo; MongoDB holds exactly the swipes left on the client stack; Undo stays disabled until the pending save returns |
| Failures | POST 500 -> card comes back, `role="alert"` "Swipe on Bình was not saved"; DELETE 500 -> undone card goes back on the stack, `role="alert"` "Undo was not saved" |
| Layout | 375 px no horizontal scroll, buttons 44 px high; focus ring on the card |
| Console | 0 app errors (only Chrome's network lines for the forced 500 responses) |

## HW 3: Fair-Play Appeal Tribunal (Task H3.8)

### Lighthouse (Performance / Accessibility / Best Practices)

| Page | Mobile (3 runs) | Desktop (3 runs) | Mobile LCP / CLS / TBT | Desktop LCP / CLS / TBT |
|---|---|---|---|---|
| `/dossier/himass` | 100/100/100 x3 | 100/100/100 x3 | 1.7 s / 0 / 0 ms | 0.4 s / 0 / 0 ms |
| `/dossier/tanvuu` | 100/100/100 x3 | 100/100/100 x3 | 1.7 s / 0 / 0 ms | 0.4 s / 0 / 0 ms |

### API (curl, MongoDB 8 in Docker)

| Request | Result |
|---|---|
| `GET /api/dossiers/himass` | 200 with `charges`, `appealDeadline`, `serverNow` |
| `GET /api/dossiers/nobody` | 404 `Unknown player` |
| `POST /api/appeals` valid, extra `status` field | 201; `status` dropped |
| `POST /api/appeals` bad email, short grounds | 400 with the same messages the form shows |
| `POST /api/appeals` after the deadline | 409 `The appeal window has closed` |

### Routes, matrix, timer and form (Playwright on Chrome)

| Check | Result |
|---|---|
| Routes | `/dossier` index prompt; `NavLink` active for Tribunal and the player; `/dossier/nobody` -> `role="alert"` 404 |
| Fast switching on Slow 3G | TanVuu -> Himass -> TanVuu 150 ms apart: 2 stale requests `net::ERR_ABORTED`, only the last resolves |
| Matrix | Himass C1 2.14x Disproportionate, C2 1.00x, whole case 1.94x Elevated; TanVuu C1 3.00x, whole case 2.00x Elevated; `caption` + `scope` on every `th`; at 375 px the table scrolls in its own focusable region, page has no horizontal scroll |
| SLA timer | 3 s -> 3 React commits (one per second); tab hidden + clock +10 min -> on visible the countdown jumps 10 min at once with 1 commit |
| Appeal form | Empty submit: 3 `role="alert"` errors, focus on email, no request; live error while grounds < 30 chars; 1 commit per keystroke; valid submit -> POST 201, `role="status"` reference, form cleared; draft does not carry over to the other player |
| Deadline passes on screen | Countdown 00:00:08 -> "The appeal window for TanVuu has closed", fieldset disabled; the API answers 409 for the same appeal |
| Console | 0 app errors (only Chrome's network line for the intended 404) |
