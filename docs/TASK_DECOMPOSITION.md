# TASK_DECOMPOSITION.md: Lab 04

Work Breakdown Structure. One row = one atomic subtask = one AI prompt = one
verified commit. Tick a task only after I have verified it.

**Level:** Core = must master and implement myself; Awareness = understand
for debugging/lookup (Lab 04 3-tier taxonomy). **Commit** messages are used
verbatim. Task IDs: `0.x`-`3.x` In-class, `H0.x` homework setup,
`H1.x` / `H2.x` / `H3.x` Homework 1-3.

## In-class Sprints

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [x] 0.1 Scaffold project | Awareness | build | React 19 + Vite; `createRoot` + `StrictMode`; no extra deps | `chore: init react19 vite scaffold for lab 4` | `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`, `README.md` |
| - [x] 0.2 Spec documents | Core | docs | WBS, AI rules, audit template, and env template before any code | `docs(spec): task decomposition, project rules & failure audit initialization` | `docs/TASK_DECOMPOSITION.md`, `docs/project-rules.md`, `docs/AI_FAILURE_AUDIT.md`, `.env.example` |
| - [ ] 1.1 Router layout | Core | sprint1 | `react-router` v7; `<BrowserRouter>` + `<Routes>` / `<Route element>`; root layout with `NavLink` + `<Outlet />`; `PeopleLayout` sidebar with `({ isActive })` class; grid `minmax(280px, 1fr) 2fr`, one column on narrow screens; no v5 syntax | `feat: router layout` | `src/App.jsx`, `src/main.jsx`, `src/layouts/RootLayout.jsx`, `src/people/PeopleLayout.jsx`, `src/people/people-data.js`, CSS Modules |
| - [ ] 1.2 Fail test for detail route | Core | sprint1 | Vitest + jsdom + Testing Library; valid id renders a `<dl>` with name and role; unknown id renders `role="alert"` 404; red before 1.3 | `test: add fail test for person detail route` | `vitest` config, `src/people/PersonDetail.test.jsx` |
| - [ ] 1.3 Detail route handling | Core | sprint1 | `useParams()` + `people.find()`; 404 boundary; semantic `<dl>`; `React.lazy()` + `<Suspense>` skeleton with matching size, `aria-busy`, `aria-live` (CLS 0); tests green | `feat: detail route handling` | `src/people/PersonDetail.jsx`, `src/people/PersonSkeleton.jsx` |
| - [ ] 2.1 Fail test for form validation | Core | sprint2 | Pure `validateForm(values)` contract for `fullName`, `email`, `age`; red before 2.2 | `test: add fail test for form validation` | `src/form/validate-form.test.js` |
| - [ ] 2.2 Form context | Core | sprint2 | `FormContext` + `useFormContext()`; `SimpleForm` keeps `values` in `useState`, derives `errors` and `isValid` during render; zero `useEffect` | `feat: form context` | `src/form/FormContext.js`, `src/form/validate-form.js`, `src/form/SimpleForm.jsx` |
| - [ ] 2.3 Input field validation | Core | sprint2 | `useId()` label binding; `aria-invalid`, `aria-describedby`, `role="alert"`; errors shown after touch or submit; one render per keystroke | `feat: input field validation` | `src/form/InputField.jsx`, CSS Module |
| - [ ] 2.4 Inspector output | Core | sprint2 | `<ShowData />` renders submitted values as `<dl>` with `<Fragment key>`, only after a valid submit; no `JSON.stringify` dump | `feat: inspector output` | `src/form/ShowData.jsx` |
| - [ ] 3.1 Fail test for messages API | Awareness | sprint3 | API contract: GET 200 / 404 unknown forum; POST 201 `{ id, author, text, timestamp }` / 400 missing field; red before 3.2 | `test: add fail test for messages api` | `server/app.test.js` |
| - [ ] 3.2 Express messages API | Awareness | sprint3 | Express + `cors({ origin })` from env + `express.json()`; async handlers; payload validation; `crypto.randomUUID()`; in-memory forums `nasa`, `esports-tribunal`, `notNasa`; tests green | `feat(server): add express messages api with cors and payload validation` | `server/app.js`, `server/index.js`, `server/db.js`, `server` npm script |
| - [ ] 3.3 useForumMessages hook | Core | sprint3 | `AbortController` per effect run; `signal.aborted` guards in try/catch/finally; abort in cleanup; `postMessage` refetches after 201; hook test covers abort on forum change | `feat: add useForumMessages hook with abort controller` | `src/forum/useForumMessages.js`, `src/forum/useForumMessages.test.jsx` |
| - [ ] 3.4 Live channel switcher | Core | sprint3 | `NavLink`s to `/forums/:forumId`; messages in `<dl>` with `<Fragment key={msg.id}>`; post form with client validation matching the server; `aria-busy` loading, `role="alert"` errors; Slow 3G rapid switching cancels stale requests | `feat: add live forum channel switcher` | `src/forum/ForumChannels.jsx`, `src/forum/ForumMessages.jsx`, CSS Module |

## Homework 0: Setup

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H0.1 Homework spec | Core | docs | Rules sections 7-10, homework WBS, `MONGODB_URI` in env template; In-class frozen at tag `inclass-submission` | `docs(spec): add homework rules and task decomposition` | `docs/project-rules.md`, `docs/TASK_DECOMPOSITION.md`, `.env.example` |

## Homework 1: Production Multi-Route Photo & Evidence Gallery SPA

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H1.1 Photo dataset and route | Core | hw1 | Local optimized images with stable ids, category, title, `alt`, `width`/`height`; `/gallery` route + nav link; thumbnail grid as `<ul>` of `<button>`s | `feat(hw1): add photo dataset and gallery route` | `src/homeworks/PhotoGallery/photos.js`, `PhotoGallery.jsx`, `public/gallery/*`, `src/App.jsx` |
| - [ ] H1.2 Fail test for URL state | Core | hw1 | `?category=` filters, unknown category falls back to all; `?photoId=` selects a photo, unknown id selects none; closing keeps `category`; red before H1.3 | `test(hw1): add fail test for gallery search params` | `src/homeworks/PhotoGallery/gallery-params.test.js` |
| - [ ] H1.3 Category filter via search params | Core | hw1 | `useSearchParams()` is the only state; filtered list derived during render; filter controls expose the active one (`aria-current` / `aria-pressed`); result count in `aria-live` | `feat(hw1): sync category filter with url search params` | `src/homeworks/PhotoGallery/gallery-params.js`, `PhotoGallery.jsx` |
| - [ ] H1.4 Dialog lightbox | Core | hw1 | Slide contract: `photoId` drives `showModal()` / `close()`; `onClose` removes only `photoId`; labelled dialog, named close button, focus returns to the opening thumbnail | `feat(hw1): open photo lightbox in native dialog from url` | `src/homeworks/PhotoGallery/Lightbox.jsx` |
| - [ ] H1.5 Responsive theme and image loading | Core | hw1 | CSS Module grid; contrast >= 4.5:1; `:focus-visible`; 375px zero horizontal scroll; lazy images below the fold, CLS 0 | `style(hw1): add responsive gallery theme and lazy images` | `src/homeworks/PhotoGallery/PhotoGallery.module.css` |
| - [ ] H1.6 Lighthouse audit | Core | hw1 | Production build: Performance and Accessibility 100 (mobile + desktop); deep link, reload and back/forward checked | `docs(hw1): record lighthouse audit` | `docs/VERIFICATION.md` (HW 1 section; screenshots stay in git-ignored `evidence/`) |

## Homework 2: Full-Stack Card-Swipe Deck ('Hẹn Hò Nhưng Không Yêu')

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H2.1 Mongoose models and connection | Awareness | hw2 | `mongoose` 8; `MONGODB_URI` guard; `mongoose.connect(uri)` with no deprecated flags; `Profile` and `Swipe` schemas (`direction` enum `left` / `right` / `up`, `profileId` required); seed profiles | `feat(hw2): add mongoose 8 profile and swipe models` | `server/homeworks/swipe/models.js`, `server/db-connect.js`, seed script |
| - [ ] H2.2 Fail test for swipe API | Awareness | hw2 | `GET /api/profiles` 200 lean array; `POST /api/swipe` 201 / 400 (bad direction, missing id; extra fields dropped); `DELETE /api/swipe/:id` 204 / 404; red before H2.3 | `test(hw2): add fail test for swipe api` | `server/homeworks/swipe/swipe-api.test.js` |
| - [ ] H2.3 Swipe API | Awareness | hw2 | `async`/`await` handlers; `.lean()` reads; whitelisted body; schema validation error -> 400; mounted on the Express app | `feat(hw2): add profiles and swipe endpoints` | `server/homeworks/swipe/routes.js`, `server/app.js` (mount) |
| - [ ] H2.4 Fail test for deck state | Core | hw2 | Pure reducer: swipe pushes `{ profileId, direction }`, undo pops LIFO, empty undo is a no-op; deck and score derived (`right` LIKE +10, `left` NOPE -5, `up` 'Hẹn hò nhưng không yêu' -5); red before H2.5 | `test(hw2): add fail test for lifo undo and asymmetric score` | `src/homeworks/SwipeDeck/deck-state.test.js` |
| - [ ] H2.5 LIFO undo and derived score | Core | hw2 | Immutable history stack; remaining deck and score derived during render; zero `useEffect` for them | `feat(hw2): add lifo undo stack and derived score` | `src/homeworks/SwipeDeck/deck-state.js`, `SwipeDeck.jsx` |
| - [ ] H2.6 Keyboard and pointer listeners | Core | hw2 | Arrow keys + Backspace on the focusable deck, `e.repeat` ignored; pointer capture, 50 px threshold, `pointercancel`; visible buttons for every action | `feat(hw2): add keyboard and pointer swipe listeners` | `src/homeworks/SwipeDeck/useSwipeGestures.js`, `SwipeDeck.jsx` |
| - [ ] H2.7 Persist swipes and undo | Core | hw2 | Load profiles with `AbortController`; save each swipe and undo through the API; a failed save rolls back and shows `role="alert"` | `feat(hw2): persist swipes and undo through the api` | `src/homeworks/SwipeDeck/swipe-api.js`, `SwipeDeck.jsx` |
| - [ ] H2.8 Theme and audit | Core | hw2 | CSS Module; contrast >= 4.5:1; visible focus; 375px zero horizontal scroll; Lighthouse Accessibility 100 | `docs(hw2): record swipe deck verification` | `src/homeworks/SwipeDeck/SwipeDeck.module.css`, `docs/VERIFICATION.md` (HW 2 section) |

## Homework 3: Full-Stack Esports Fair-Play Appeal Tribunal (Himass & TanVuu)

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H3.1 Fail test for tribunal API | Awareness | hw3 | `GET /api/dossiers/:playerId` 200 / 404 with `appealDeadline` and server time; `POST /api/appeals` 201 / 400 with the same rules as the client form; red before H3.2 | `test(hw3): add fail test for tribunal api` | `server/homeworks/tribunal/tribunal-api.test.js` |
| - [ ] H3.2 Tribunal API and models | Awareness | hw3 | Mongoose `Dossier` and `Appeal` models; seeded Himass and TanVuu dossiers; whitelisted appeal body; tests green | `feat(hw3): add dossier and appeal endpoints` | `server/homeworks/tribunal/models.js`, `routes.js`, seed |
| - [ ] H3.3 Dossier routes | Core | hw3 | `/dossier` index + `/dossier/:playerId`; `NavLink` per player; fetch with `AbortController`; unknown id -> `role="alert"` 404; dossier facts in `<dl>` | `feat(hw3): add multi-route player dossiers` | `src/homeworks/AppealTribunal/DossierLayout.jsx`, `DossierView.jsx`, `useDossier.js` |
| - [ ] H3.4 Disproportionality matrix | Core | hw3 | Pure `computeMatrix(dossier)` with unit test; rendered as a captioned `<table>` with `scope` headers; derived during render | `feat(hw3): derive disproportionality matrix` | `src/homeworks/AppealTribunal/compute-matrix.js` (+ test), `DisproportionalityMatrix.jsx` |
| - [ ] H3.5 Fail test for SLA timer | Core | hw3 | Fake clock: remaining = deadline - (now + offset), clamps at 0, resyncs on `visibilitychange`, one state update per displayed second, cleanup on unmount; red before H3.6 | `test(hw3): add fail test for zero-drift appeal sla timer` | `src/homeworks/AppealTribunal/useAppealSlaTimer.test.jsx` |
| - [ ] H3.6 Zero-drift SLA timer | Core | hw3 | `useAppealSlaTimer(deadlineEpochMs, serverOffsetMs)`; absolute timestamps; `visibilitychange` resync; interval + listener cleanup; countdown in `<time>` with `role="timer"` | `feat(hw3): add zero-drift appeal sla timer` | `src/homeworks/AppealTribunal/useAppealSlaTimer.js` |
| - [ ] H3.7 Appeal form engine | Core | hw3 | Sprint 2 pattern: context, errors derived during render, `useId`, `aria-invalid` / `aria-describedby`, real-time validation; POST with server parity; disabled after the SLA expires | `feat(hw3): add context-driven appeal form` | `src/homeworks/AppealTribunal/AppealForm.jsx`, `validate-appeal.js` (+ test) |
| - [ ] H3.8 Theme, audit and post-mortem | Core | hw3 | 375px zero horizontal scroll; Lighthouse Accessibility 100; HW 3 post-mortem entries in the audit | `docs(hw3): record tribunal verification and post-mortem` | `src/homeworks/AppealTribunal/AppealTribunal.module.css`, `docs/VERIFICATION.md`, `docs/AI_FAILURE_AUDIT.md` |
