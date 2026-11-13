# project-rules.md

My working contract with AI for Lab 04 (In-class sprints now; homework sections are added later in the same repo). The AI must read and follow this file in full before starting any task. Sections 1-4 are my standing way of working with AI (copied from the master rules); section 5 holds the Lab 04 global rules; section 6 holds the rules specific to the In-class sprints.

---

## 1. Mandatory Workflow Contract

### Pipeline: who owns which stage

1. **Functional Slicing** (me): break requirements into small, isolated subtasks in `TASK_DECOMPOSITION.md`.
2. **Contract-First** (me): define interfaces, types, or JSDoc before asking AI to generate code.
3. **Atomic Generation** (AI): generate exactly one function or module for exactly one subtask.
4. **Independent Verification** (me): verify the output with tests, debugging tools, and `git diff`.

### Before generating

- Read `project-rules.md` first. Work only on the subtask named in the prompt; never pick up other subtasks.
- If the task is ambiguous or conflicts with these rules, stop and ask. Do not guess.
- Never change a contract I have provided.

### While generating

- Return only the requested function or module. No extra files, features, dependencies, optimizations, or refactors outside the scope.
- Do not modify code from earlier verified subtasks unless I ask.
- Follow the Code Conventions and Banned Patterns below.
- Never invent APIs. If unsure an API exists, say so explicitly.

### After generating

- Never claim the code is "tested" or "verified". Only I decide a subtask is done.
- No commit until verification is complete.
- If the output is wrong, I log it in `AI_FAILURE_AUDIT.md` first. Then the AI fixes only that subtask, based on the failure evidence I provide.

---

## 2. Roles

### AI

- Primary code generator. Follows my rules and assigned tasks strictly, with no overstepping.
- Joins project planning and documentation/specification discussions only when I ask.

### Me

- Author of the technical contracts that control AI behavior.
- Verifier and tester of everything the AI produces.
- Owner of the ideas and direction of the project: I lead, control, and confirm.

---

## 3. Code Conventions (stack-specific, adjust per project)

Current stack: React 19 + React Router v7 + Vite on the client, Node.js + Express on the server, JavaScript (JSX, ES2024), following the Google JS Style Guide.

| Item | Rule |
|---|---|
| Variables, functions, methods, properties | `camelCase` |
| React components, component files | `PascalCase` (`PersonDetail.jsx`, `PersonDetail.module.css`) |
| Custom hooks | `camelCase` with `use` prefix (`useForumMessages`) |
| Module/global constants | `UPPER_SNAKE_CASE` |
| Other files, directories | `kebab-case` |
| Indentation | 2 spaces, no tabs |
| Line length | 80 characters max |
| Semicolons | Required |
| Strings | Single quotes `'...'`; template literals only for interpolation |
| Variable declarations | `const` by default, `let` only when reassigning |
| Exports | Named exports (`export function App()`) |
| DOM | Render text through JSX `{value}` only; never `dangerouslySetInnerHTML` |

### Banned patterns

| Banned | Use instead |
|---|---|
| `var`, implicit globals | `const`, `let` |
| `keypress`, `e.keyCode` | `keydown`, `e.key` / `e.code` |
| Raw `innerHTML` / `dangerouslySetInnerHTML` | JSX text interpolation |
| Inline HTML handlers (`onclick="..."`), manual `addEventListener` on JSX elements | React event props (`onClick`, `onChange`) |

---

## 4. Git Commit Convention

### Format

```
<type>(<scope>): <description>

[optional body: explain why]
```

### Types

| Type | Use when |
|---|---|
| `feat` | Adding a new feature or function |
| `fix` | Fixing a bug |
| `refactor` | Restructuring code without changing behavior |
| `test` | Adding or changing tests or assertions |
| `docs` | Documentation-only changes |
| `style` | Formatting only, no logic change |
| `perf` | Performance improvement |
| `chore` | Maintenance tasks (config, cleanup) |
| `build` | Build system or dependency changes |
| `revert` | Reverting a previous commit |

### Scope

The module or feature area the change touches (for example `auth`, `api`, `ui`). Keep a consistent set per project. Use `docs` for documentation files.

### Writing rules

- Subject line in imperative mood ("implement", not "implemented" or "implements").
- Lowercase, no trailing period, 72 characters max (aim for under 50).
- One subtask per commit, and only after it is verified.
- Never bundle unrelated changes into one commit.
- If a project or course mandates exact commit messages, use them verbatim.
- Write commits in English.

---

## 5. Lab 04 Global Rules (apply to every Lab 04 exercise and homework)

Source: Lab 04 slides (Multi-Route SPA Architecture, Context Form Engine &
Full-Stack React 19 Systems).

### Tooling

- React 19 + Vite + ES2024. Mount with `createRoot` from `react-dom/client`
  inside `<StrictMode>`.
- Routing with React Router v7, imported from the `react-router` package.
- Server: Node.js + Express (`cors()`, `express.json()`) as ES modules; the
  repo is `"type": "module"`, so `import` replaces the slides' `require`.
- Tests: Vitest (jsdom + `@testing-library/react` for components and hooks).
- Mandatory artifacts in `docs/`: `project-rules.md`,
  `TASK_DECOMPOSITION.md` (WBS), `AI_FAILURE_AUDIT.md`; `.env.example` at the
  repo root.
- Every subtask follows the 4-stage contract-first loop: Contract (spec in
  this file or the WBS) -> Fail test (committed red) -> Implement (minimal
  code to turn it green) -> Refactor (tests stay green).
- Never prompt the AI with a whole Exercise or Homework (one-shot prompting
  scores 0% on the 15% Git & Audit rubric). One subtask per prompt.
- Out of scope for Lab 04 (Tier 3, later labs): TanStack Query (FKA React
  Query), Next.js React Server Components.

### Banned legacy APIs

| Banned | Use instead |
|---|---|
| `ReactDOM.render()` | `createRoot(el).render()` |
| `class extends React.Component` | Pure function components |
| `Component.defaultProps` | ES6 default parameters in destructuring |
| `import * as React` | Named imports (`import { useState } from 'react'`) |
| `antd/dist/antd.css`, `http://` URLs | Scoped CSS Modules, HTTPS only |
| `setTimeout` in a constructor / render body | `useEffect` with cleanup |
| `window.alert()` | `role="alert"` / `role="status"` regions |
| `keypress`, `keyCode` | `keydown` + `e.code` |
| React Router v5 `<Switch>`, `<Redirect>`, `exact`, `component={...}`, `activeClassName` | v7 `<Routes>`, `<Route element={...}>`, `<Navigate>`, `NavLink className={({ isActive }) => ...}` |
| `react-media`, Material-UI v4 (`@material-ui/core`) | Native CSS Grid + `@media`, semantic HTML |
| `typeface-roboto` font package | System font stack / standard `@font-face` |
| `didCancel` boolean flags in fetch effects | `AbortController` + `signal.aborted` guards |
| Hardcoded connection strings, ports, secrets | `process.env.*` / `import.meta.env.VITE_*` + `.env.example` |
| Mongoose callbacks, `useNewUrlParser` / `useUnifiedTopology` | Mongoose 8 `async`/`await`, `mongoose.connect(uri)` |

### Markup and accessibility

- Semantic JSX only (`<main>`, `<section>`, `<article>`, `<header>`,
  `<hgroup>`, `<dl>`, `<dt>`, `<dd>`, `<figure>`, `<output>`). Div-soup is
  banned. Exactly one top-level `<main>` containing `<section>` / `<article>`.
- Group siblings with `<Fragment>` / `<>...</>`, not wrapper `<div>`s.
- Key-value data uses `<dl>` / `<dt>` / `<dd>`, never repeated headings.
- Every `<input>` / `<select>` is paired with `<label htmlFor={id}>` where
  `id` comes from `useId()`.
- Invalid fields set `aria-invalid` and point `aria-describedby` at their
  error message (`role="alert"`).
- Number inputs read `e.target.valueAsNumber` with a `Number.isNaN` fallback.
- Every action `<button>` has `type="button"`; icon-only buttons have an
  `aria-label`.
- Images: HTTPS, explicit `width` / `height` (zero CLS), meaningful `alt`.
- Responsive from 375px to 1440px with zero horizontal scroll; WCAG 2.2 AA;
  Lighthouse Accessibility 100.

### State and rendering

- Components are pure: `UI = f(props, state)`.
- List items use a stable, unique entity id as `key`. `key={index}` and
  raw string values as keys are banned. Map objects with
  `Object.entries()`; use `<Fragment key>` for `<dt>`/`<dd>` pairs.
- Immutable updates only (`[...prev, x]`, `filter`, `map`, `toSorted`).
  `push`, `splice`, and in-place `sort` on state are banned.
- Derived data (filter, sort, counts, validation errors) is computed during
  render. Syncing derived state through `useState` + `useEffect` is banned.
- The URL is the source of truth for the selected route entity
  (`useParams`); an unknown id renders a 404 state, never a crash.
- Async UI uses an explicit finite state machine
  (`'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'` or a stricter domain-specific
  variant). No boolean flag soup.
- Optimize only after profiling (React DevTools Profiler). No premature
  `memo` / `useMemo` / `useCallback`.

### Effects and memory safety

- Every timer, listener, subscription, or fetch inside `useEffect` returns a
  cleanup (`clearTimeout`, `removeEventListener`, `controller.abort()`).
- Fetches use `AbortController`; an `AbortError` never sets the `ERROR`
  state.
- Dependency arrays are honest: every reactive value read in the effect is
  listed (no stale closures).
- Zero unhandled promise rejections and zero effect loops.

### Server and API contract

- The API contract is written before the code; route handlers are `async`
  and return JSON with an explicit status.
- `POST` payloads are validated on the server (400 on missing fields) with
  the same rules as the client form (client/server validation parity).
- Ids come from `crypto.randomUUID()`; CORS allows only the client origin
  read from the environment.

### Evaluation (keep the repo defensible at all times)

- Live defense (Block 5, 3-minute protocol): AI tools closed; I explain the
  architecture and module relationships, defend each state choice (local,
  global, persistent), and fix a live injected bug. Possible challenges:
  `useSearchParams` sync, cross-field validation without `useEffect`, retry
  with exponential backoff that respects the abort signal, a protected route
  that redirects to login and keeps the target URL. Code I cannot explain or
  verify scores zero.
- AI failure audit (15% of the lab grade): every non-functional AI output,
  hallucinated API, and broken effect loop logged in
  `docs/AI_FAILURE_AUDIT.md` with DevTools proof and the manual fix; atomic
  commits matching `TASK_DECOMPOSITION.md`.

---

## 6. In-class Rules: Sprints 1-3 (180-minute session)

Commit messages for each sprint are mandated by the slides and used verbatim
where the slides give them; the rest come from `TASK_DECOMPOSITION.md`.

### Sprint 1: Responsive Master-Detail Directory & Case Dossier Router (35 min)

- Ex 1.2 / 1.2.1: `<BrowserRouter>` in `main.jsx`, `<Routes>` +
  `<Route element>` in `App.jsx`; a root layout with a `<nav>` of `NavLink`s
  and an `<Outlet />`.
- Ex 1.2.2: `PeopleLayout` (`/people`) renders a sidebar `<nav>` of
  `NavLink`s to `/people/:id` (active class from `({ isActive })`) and an
  `<Outlet />`; grid `minmax(280px, 1fr) 2fr`, one column on narrow screens.
- `PersonDetail` (`/people/:id`) reads `id` with `useParams()`, finds the
  record with `people.find()`, renders a `role="alert"` 404 state for an
  unknown id, otherwise a `<dl>` of the person's attributes.
- Ex 1.1: `PersonDetail` is code-split with `React.lazy()` inside
  `<Suspense>`; the fallback skeleton matches its size and has
  `aria-busy="true"` + `aria-live="polite"` (CLS 0).
- Checkpoint 1: zero console warnings; deep link and reload on
  `/people/:id` work; an invalid id shows the 404 state.

### Sprint 2: Context-Driven Multi-Field Form Engine & `<ShowData />` Inspector (45 min)

- Ex 1.3: fields `fullName` (required, at least 2 characters), `email`
  (required, valid format), `age` (required, integer 1-120).
- `validateForm(values)` is pure and returns `{ [field]: message }`;
  `isValid` is `Object.keys(errors).length === 0`.
- `SimpleForm` keeps `values` in `useState`, derives `errors` during render,
  and shares `{ values, errors, handleChange }` through `FormContext`;
  consumers use `useFormContext()`. Zero `useEffect` in the form.
- `InputField` binds label and input with `useId()`, sets `aria-invalid` +
  `aria-describedby`, and shows the error with `role="alert"` once the field
  is touched or a submit was attempted.
- A valid submit renders `<ShowData data={...} />` as a `<dl>` (no
  `JSON.stringify` dump).
- Checkpoint 2: typing one character causes exactly one render pass
  (React Profiler); no "Maximum update depth exceeded" error.

### Sprint 3: Full-Stack Custom Hook `useForumMessages` & Live Channel Switcher (35 min)

- Ex 1.7.1 API: `GET /api/messages/:forum` returns 200 with the messages or
  404 for an unknown forum; `POST /api/messages/:forum` with
  `{ author, text }` returns 201 with `{ id, author, text, timestamp }` or
  400 if a field is missing or blank. Forums `nasa`, `esports-tribunal`,
  `notNasa`, kept in memory (no database in the In-class part).
- The slides use two paths (`/api/forums/:id/messages` in the hook,
  `/api/messages/:forum` on the server); this repo uses the server path.
- `useForumMessages(forumId)` returns `{ data, loading, error, postMessage }`,
  creates an `AbortController` per effect run, guards every state update with
  `signal.aborted`, and aborts in the cleanup; `postMessage` refetches after
  a 201.
- Channel switcher: `NavLink`s to `/forums/:forumId`; messages in a `<dl>`
  with `<Fragment key={msg.id}>`; `aria-busy` loading region; errors in
  `role="alert"`.
- Checkpoint 3: under Slow 3G, rapid channel switches show the stale requests
  as canceled in the Network panel with no console errors; the full-stack
  error log is saved as evidence.
