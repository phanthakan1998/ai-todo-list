# AI Todo List

A React + TypeScript todo app built with strict engineering practices: TDD, ATDD, BDD, SOLID principles, clean code, and DRY. Built as a learning project for an AI course.

**Live:** https://ai-todo-list.vercel.app *(replace with your actual Vercel URL)*

---

## Quick Start

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run test       # run all 69 tests once
npm run test:watch # run tests in watch mode
npm run build      # production build
```

---

## Features

- **Work / Private tabs** — todos are scoped to a category
- **Add todo** — text + optional deadline date
- **Toggle done / delete**
- **Deadline status badge** — `ok` (green) · `soon` within 3 days (yellow) · `overdue` (red)
- **Stats bar** — pending / done / overdue counts per tab
- **localStorage persistence** — survives page reload
- **Fully responsive** — mobile-first, works on any screen size

---

## Project Structure

```
src/
├── types/
│   └── todo.ts                  # All shared TypeScript interfaces (single source of truth)
├── constants/
│   └── deadline.ts              # SOON_THRESHOLD_DAYS = 3, MS_PER_DAY
├── utils/
│   ├── deadlineUtils.ts         # Pure fn: computeDeadlineStatus(deadline, done, today)
│   └── dateFormatter.ts         # Pure fn: formatShortDate(isoString)
├── services/
│   └── todoStorageService.ts    # Implements StoragePort — only file that touches localStorage
├── hooks/
│   ├── useTodos.ts              # State + mutations: addTodo, toggleTodo, deleteTodo
│   └── useTodoStats.ts          # Derived stats: pending / done / overdue counts
├── components/
│   ├── TabBar/                  # Category tab switcher
│   ├── AddTodoForm/             # Controlled form: text input + date picker
│   ├── TodoList/                # Maps todos → TodoItem, shows EmptyState if empty
│   ├── TodoItem/                # Single row: checkbox, text, DeadlineTag, delete button
│   ├── DeadlineTag/             # Coloured status badge
│   ├── StatsBar/                # Pending / done / overdue dot-counts
│   └── EmptyState/              # "No todos yet" placeholder
├── __tests__/
│   ├── setup.ts                 # jest-dom matchers + localStorage mock
│   ├── testUtils.tsx            # createMockStorage, renderWithMockStorage helpers
│   ├── unit/                    # Unit tests for utils, services, hooks
│   └── acceptance/              # Full user-journey tests through <App />
└── App.tsx                      # Composition root — wires everything together
```

---

## Engineering Practices

### TDD — Test-Driven Development
Every file was written **test first** (Red → Green → Refactor). The implementation order follows the dependency graph:

1. Pure utils (`deadlineUtils`, `dateFormatter`)
2. Storage service (`todoStorageService`)
3. Hooks (`useTodos`, `useTodoStats`)
4. Components (leaf → root: `DeadlineTag` → `TodoItem` → `TodoList` → `App`)
5. Acceptance tests drive `App.tsx` composition

### BDD — Behavior-Driven Development
All `describe` blocks use **Given / When / Then** language:

```ts
describe('Given a todo with deadline 3 days away and not done', () => {
  it('Then returns state "soon" with label "3d left"', () => {
    const status = computeDeadlineStatus('2026-04-29', false, today)
    expect(status?.state).toBe('soon')
    expect(status?.label).toBe('3d left')
  })
})
```

### ATDD — Acceptance Test-Driven Development
`src/__tests__/acceptance/todoApp.acceptance.test.tsx` tests full user journeys through the rendered `<App />` before `App.tsx` is wired up.

### SOLID Principles

| Principle | How it's applied |
|---|---|
| **S** — Single Responsibility | Each file has one job. `deadlineUtils` only classifies dates. `useTodos` only manages mutations. `StatsBar` only renders stats. |
| **O** — Open/Closed | `DeadlineState` is a union type — add a new state by extending the type, no existing branches change. `StoragePort` interface means swapping localStorage for IndexedDB requires only a new implementation file. |
| **L** — Liskov Substitution | `MockStoragePort` in tests is a full substitute for `todoStorageService` — hook behaviour is identical either way. |
| **I** — Interface Segregation | `DeadlineTagProps` only receives `DeadlineStatus`, not the full `Todo`. `StatsBarProps` only receives `TodoStats`, not raw arrays. |
| **D** — Dependency Inversion | `useTodos` receives a `StoragePort` abstraction — never calls `localStorage` directly. `computeDeadlineStatus` receives `today: Date` as a parameter instead of calling `new Date()` internally — clock dependency is injected. |

### DRY
- `createMockStorage` and `renderWithMockStorage` helpers are shared across all test files via `testUtils.tsx`
- All types live in `src/types/todo.ts` — no duplication across files
- Constants in `src/constants/deadline.ts` — no magic numbers anywhere

---

## Key Design Decisions

### Why `computeDeadlineStatus` accepts `today: Date` as a parameter
If the function called `new Date()` internally it would be non-deterministic — impossible to test reliably. Injecting `today` makes every test run against a fixed date. This is Dependency Inversion applied to time.

### Why `useTodos` accepts a `StoragePort` interface
So tests can inject a fast in-memory mock instead of real `localStorage`. The hook never knows or cares which implementation it uses. Only `App.tsx` passes the real `todoStorageService`.

### Why `useTodoStats` is a separate hook from `useTodos`
Single Responsibility: `useTodos` owns mutations (add/toggle/delete). `useTodoStats` owns derived read computation. Merging them means a change to how "overdue" is counted forces touching the same file as add/delete logic.

### Why no Redux or global state
The data flow is shallow — `App` owns `activeCategory`; `useTodos` owns the array. No component is more than two levels from its state. Adding Redux would introduce layers without solving any real problem.

---

## Adding a New Feature (example: priority levels)

1. **Extend the type** in `src/types/todo.ts`:
   ```ts
   type Priority = 'low' | 'medium' | 'high'
   interface Todo { ...; priority: Priority }
   ```
2. **Write the test first** for any logic change (e.g. stats by priority)
3. **Update `AddTodoForm`** to expose a priority selector — its `onAdd` callback signature changes
4. **Update `useTodos.addTodo`** to accept the new field
5. **Update `TodoItem`** to display the priority badge
6. Run `npm run test` — all existing tests still pass; new tests define the new behaviour

---

## Deployment

The app auto-deploys to **Vercel** on every push to `main`.

To deploy a fork or a new project:
```bash
# Option A — Vercel dashboard (easiest)
# Go to vercel.com/new → Import from GitHub → click Deploy

# Option B — CLI
npx vercel
```

Build command: `npm run build`  
Output directory: `dist`  
Framework: Vite (auto-detected)
