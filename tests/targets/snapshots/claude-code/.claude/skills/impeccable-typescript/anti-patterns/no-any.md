
# Anti-pattern: `any`

## Why this is wrong
`any` silently disables every type check downstream. The compiler stops
helping the moment a value is typed as `any`, which means a typo in a
property name compiles fine and only fails at runtime. It also poisons
inference: anything derived from an `any` value becomes `any`.

## How to detect
- Type annotations: `: any`, `any[]`.
- Generic arguments: `Array<any>`, `Record<string, any>`, `Promise<any>`.
- Type assertions: `as any`, `<any>x`.
- Function parameter or return type declared as `any`.

## Replace with
- **`unknown` + narrowing.** Accept the data as `unknown`, then narrow via a
  type guard or a Zod schema before the data flows further.
- **Explicit generic.** Use the type the call site actually expects, e.g.
  `Record<string, string>` instead of `Record<string, any>`.
- **Discriminated unions.** When a value can be one of several shapes, model
  it as `type Foo = { kind: "a"; ... } | { kind: "b"; ... }` and let the
  compiler enforce exhaustive handling.

```ts
// ❌ load: unknown shape escapes into the rest of the program.
function load(data: any): string {
  return data.user.name;
}

// ✅ unknown + Zod narrowing.
function load(data: unknown): string {
  return userSchema.parse(data).name;
}
```

## Related
- `impeccable-typescript` — section 4, Boundary rule.
