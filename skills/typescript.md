# TypeScript Skill: Production Discipline

## Rules
- No `any`, including temporary placeholders.
- All external data must be validated at the boundary (Zod required).
- Every exported function must declare an explicit return type.
- Do not duplicate domain types in UI/lib layers; import and reuse.
- Prefer inference for local variables when the type is obvious.

## Anti-patterns
- `function parse(data: any) { ... }`
- Copying `Project` type into UI files instead of importing from `domain`.
- Returning unvalidated API JSON directly to components.
- Manual typing of obvious local primitives (`const count: number = 3`).

## Good patterns
- `export async function fetchProject(): Promise<Project> { ... }`
- `const project = projectSchema.parse(raw);`
- Shared contracts in `src/domain/*` with `z.infer`.
- `type Props = { project: Project }` (imported contract).

## Examples
```ts
// bad
export function mapApi(data: any) {
  return data.items;
}

// good
const apiSchema = z.object({ items: z.array(z.string()) });
export function mapApi(data: unknown): string[] {
  return apiSchema.parse(data).items;
}
```
