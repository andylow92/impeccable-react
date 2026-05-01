---
id: domain-types
parent: impeccable-typescript
summary: Keep domain type definitions centralized and imported across layers.
---

# Domain types

## Intent
Domain types must have a single source of truth so business semantics stay consistent across domain, library, and UI layers.

## Non-negotiable rules
- Define canonical business types in `src/domain/**` only.
- Export both schema and inferred type from domain modules when data is validated at boundaries.
- Import domain types into `lib/` and `ui/`; do not re-declare equivalent structural types in those layers.
- Any change to a domain type must update all dependent parsing/validation boundaries in the same change.
- Keep exported domain types named and discoverable; avoid anonymous inline object types in public APIs.

## Anti-patterns and failure cues
- Duplicated `type`/`interface` declarations in UI files that mirror domain entities.
- Divergent field optionality between API parser output and UI props for the same entity.
- Widespread `as SomeDomainType` casts without schema-backed narrowing.
- Imported API response shapes used directly as domain types.

## Rewrite protocol
1. Locate the canonical domain entity module under `src/domain/**`.
2. Move duplicated type declarations from `ui/` or `lib/` into the domain module.
3. Replace ad-hoc types with imports from the canonical domain module.
4. If external input is involved, introduce/align Zod schema and `z.infer` type in the domain module.
5. Remove assertion-based workarounds and route all consumers through validated types.
6. Re-run type checks and command audits to confirm no duplicate or unresolved types remain.

## Quick pass/fail checklist
- [ ] Each business entity type has exactly one canonical declaration in `src/domain/**`.
- [ ] `ui/` and `lib/` import canonical domain types instead of redefining them.
- [ ] External payloads are parsed before being treated as domain entities.
- [ ] No `as` assertions are used to bypass domain-type mismatches.
- [ ] Exported functions that return domain entities have explicit return types.

## Before/after mini examples
**Before (fail)**
```ts
// ui/ProjectCard.tsx
type Project = { id: string; title: string; budgetUsd?: number };
```
A UI-local type duplicates and can drift from the actual domain entity.

**After (pass)**
```ts
// src/domain/project.ts
export const projectSchema = z.object({ id: z.string(), title: z.string(), budgetUsd: z.number().optional() });
export type Project = z.infer<typeof projectSchema>;

// ui/ProjectCard.tsx
import type { Project } from "@/domain/project";
```
All layers depend on one canonical definition.
