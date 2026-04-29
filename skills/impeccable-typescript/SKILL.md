---
id: impeccable-typescript
name: Impeccable TypeScript
version: 1.0.0
summary: No any, schemas at boundaries, single source of truth for domain types.
voice: directive
applies_to:
  - "**/*.ts"
  - "**/*.tsx"
references:
  - domain-types
anti_patterns:
  - no-any
commands:
  - audit-typescript
  - pre-ship-gate
---

# TypeScript Skill: Enforced Discipline

This is a gate, not a guide. If your code violates a rule below, it does not ship.

---

## 1. Hard rules

1. **No `any`.** Not in code, not in `as any`, not in declaration files.
   `unknown` + a narrowing function is the answer.
2. **All external data is validated.** Anything crossing the network, the
   filesystem, `localStorage`, query strings, or `postMessage` is parsed with
   Zod (or an equivalent schema) before it enters domain logic.
3. **Explicit return types on exported functions.** Inferred returns are fine
   for module-internal helpers. Public APIs declare what they return.
4. **No duplicated types across layers.** Domain types live in `src/domain`.
   UI imports them. The reverse is forbidden.
5. **Prefer inference over manual typing.** Annotate boundaries (function
   signatures, public state). Let TypeScript infer locals.
6. **No type assertions to bypass errors.** `as Foo` is for narrowing after a
   guard, not a silencer.
7. **Strict null checking is non-negotiable.** `noUncheckedIndexedAccess` and
   `exactOptionalPropertyTypes` stay on.

---

## 2. Anti-patterns (reject in review)

```ts
// any: hides shape mismatches until runtime
function load(data: any) {
  return data.user.name;
}

// unparsed external data flowing into UI
const project = await fetch('/api/project').then((r) => r.json());
return <Card title={project.title} />; // no schema, no guarantees

// duplicated domain type in UI layer
type Project = { id: string; title: string }; // already exists in src/domain

// assertion as a silencer
const user = result as User; // result is unknown, no narrowing happened
```

---

## 3. Good patterns (generate these)

```ts
// unknown + narrowing
function load(data: unknown): string {
  const parsed = userSchema.parse(data);
  return parsed.name;
}

// schema-validated boundary
import { projectSchema, type Project } from '@/domain/project';

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/project/${id}`);
  const json: unknown = await res.json();
  return projectSchema.parse(json);
}

// discriminated unions for state
type Fetch<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };
```

---

## 4. Boundary rule

Every byte of data that did not originate inside this codebase must pass through
a schema before it is typed. The schema is the type. The type is not the schema.

```ts
export const projectSchema = z.object({ /* ... */ });
export type Project = z.infer<typeof projectSchema>;
```

---

## 5. Review checklist

- [ ] No `any` introduced (search the diff).
- [ ] Every `fetch`/`JSON.parse`/external input is followed by `.parse()`.
- [ ] Every exported function has an explicit return type.
- [ ] No domain type is redefined in the UI layer.
- [ ] No `as` assertion without a preceding narrowing check.
- [ ] `tsc --noEmit` passes with the project's strict flags on.
