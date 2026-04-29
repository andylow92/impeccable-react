---
id: uniform-radius
parent: impeccable-ui
severity: warn
detector_rule: ui-uniform-radius
summary: Every rounded element shares the same border-radius. Hierarchy collapses.
---

# Anti-pattern: Uniform radius

## Why this appears in AI output
AI-generated UI often applies one "brandy" radius token everywhere because
style consistency is easier to optimize than semantic shape hierarchy.
Autocomplete also tends to repeat the first `rounded-*` class it emits.

## Why it harms UX
Radius encodes role. If outer containers, data tiles, controls, and badges all
share the same rounding, users lose structural cues and scanning slows down.
Everything feels equally important and equally interactive.

## How to detect manually in <30s
- Four or more elements in the same component using identical
  `rounded-{xl,2xl,3xl}` classes.
- A single radius token used across both data surfaces and grouping panels.

## How to rewrite (numbered steps)
1. Identify element roles: grouping panel, data surface, control, ornament.
2. Assign at most two core radii: sharp-ish for data/control, softer for group.
3. Replace repeated `rounded-2xl`/`rounded-3xl` on inner blocks with sharp-ish.
4. Keep `rounded-full` only for true circular semantics (avatar/dot/pill).
5. Re-scan component and ensure radius changes communicate hierarchy.

## One compact bad→good snippet
```tsx
// Bad
<section className="rounded-2xl p-4">
  <div className="rounded-2xl p-3">ARR</div>
  <input className="rounded-2xl border px-2" />
  <button className="rounded-2xl px-3">Update</button>
</section>

// Good
<section className="rounded-xl border p-4">
  <div className="rounded-sm border p-3">ARR</div>
  <input className="rounded-sm border px-2" />
  <button className="rounded-sm border px-3">Update</button>
</section>
```

## Detector mapping
- Stable ID: `uniform-radius`
- Rule-backed via `detector_rule: ui-uniform-radius`

## Related
- `generic-saas-card`
