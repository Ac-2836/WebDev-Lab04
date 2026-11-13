# TASK_DECOMPOSITION.md: Lab 04

Work Breakdown Structure. One row = one atomic subtask = one AI prompt = one
verified commit. Tick a task only after I have verified it.

**Level:** Core = must master and implement myself; Awareness = understand
for debugging/lookup (Lab 04 3-tier taxonomy). **Commit** messages are used
verbatim. Task IDs: `0.x`-`3.x` In-class.

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
