---
name: Impeccable React Architecture
description: Layer boundaries, no business rules in JSX, screens own data.
---
# React Architecture Skill

Components are presentation. Domain logic is not.
If you are writing `if (project.budgetUsd > 1_000_000)` inside a `.tsx` file,
you are writing a bug that just hasn't happened yet.

---

## 1. Layer boundaries (enforced)

```
src/
  domain/   ← Zod schemas, business types, pure rules. No React. No fetch. No DOM.
  lib/      ← I/O: API clients, formatters, designGuard. Imports domain. No React.
  ui/       ← Components and screens. Imports domain + lib. Holds zero business rules.
```

Rules:

- **`domain/` may not import from `ui/` or `lib/`.**
- **`lib/` may not import from `ui/`.**
- **`ui/` may not declare domain types.** It imports them.
- **A component may not call `fetch` directly.** It calls a function from `lib/`.

If a file violates a boundary, the violation is the bug. Move the code.

---

## 2. Component rules

1. **Components are small.** If a component file exceeds ~120 lines, it has
   become a screen. Split it.
2. **No business logic inside components.** Calculations, eligibility checks,
   threshold comparisons live in `domain/` as pure functions. Components call
   them.
3. **No `useEffect` for derived state.** If you can compute it from props or
   state during render, do that.
4. **Composition over configuration.** Prefer `<Card><Card.Header /></Card>`
   or children-based composition over a 14-prop "kitchen sink" component.
5. **Prop-drill is a smell, not a sin.** Two levels is fine. Four is a signal
   to lift state into a context, a route loader, or a query cache.
6. **No anonymous booleans.** `<Button primary />` is fine. `<Button danger
   loading disabled compact />` is not — collapse into a `variant` /
   `state` prop with explicit values.

---

## 3. Data fetching rule

Every screen owns its data orchestration. Components never own it.

```tsx
// screen owns the fetch
export function ProjectScreen() {
  const project = useProject();          // hook in lib/, returns typed domain object
  if (!project) return <ScreenLoading />;
  return <ProjectView project={project} />;
}

// presentational component, no I/O, no business rules
function ProjectView({ project }: { project: Project }) {
  return <Card eyebrow="Active" title={project.title}>{/* ... */}</Card>;
}
```

Anti-patterns:

```tsx
// component fetches its own data
function Card({ id }: { id: string }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(`/api/${id}`).then(/* ... */); }, [id]);
  // now Card cannot be reused, tested, or storybooked
}

// business rule inside a component
function Risk({ project }: { project: Project }) {
  const isAtRisk =
    project.milestones.filter((m) => m.status === 'blocked').length > 1;
  return <span>{isAtRisk ? 'At risk' : 'On track'}</span>;
}
```

---

## 4. State placement

| State kind | Where it lives |
|---|---|
| Server data | `lib/` hook (or React Query / SWR) |
| Cross-screen UI state (theme, auth) | Context provider in `ui/providers/` |
| Screen-local state | `useState` in the screen component |
| Component-local state (open/closed) | `useState` in the component |
| Derived state | computed during render — never in `useEffect` |

---

## 5. Review checklist

- [ ] No component imports `fetch` or a raw API client directly.
- [ ] No business rule lives in a `.tsx` file.
- [ ] No `useEffect` is used for state that can be derived during render.
- [ ] No domain type is redeclared in the UI layer.
- [ ] No prop list exceeds ~6 props (otherwise compose).
- [ ] Each screen file has exactly one default exported screen.
