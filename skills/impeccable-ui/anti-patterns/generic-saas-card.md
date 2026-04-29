---
id: generic-saas-card
parent: impeccable-ui
severity: fail
detector_rule: ui-generic-saas-card
summary: rounded-2xl + soft shadow + centered heading + single CTA. The AI default.
---

# Anti-pattern: Generic SaaS card

## Why this appears in AI output
Foundation model examples and UI tutorials over-index on a safe card recipe:
`rounded-2xl`, soft shadow, centered headline, one primary CTA. That pattern is
easy to autocomplete and usually passes superficial "looks modern" checks, so
AI tools reproduce it by default.

## Why it harms UX
When every module uses the same visual shell, hierarchy collapses. Users cannot
quickly distinguish framing surfaces from data surfaces, and cards read as
mockups instead of product-grade information architecture.

## How to detect manually in <30s
- An outer `<div>` (or `<section>`/`<article>`) with:
  - `rounded-2xl` (or `rounded-xl`, `rounded-3xl`)
  - `shadow-md` / `shadow-lg`
  - `text-center` heading near the top
  - exactly one button, often with `rounded-full`
- Stat tiles inside that all share the same radius, shadow, and size.

## How to rewrite (numbered steps)
1. Keep one **outer grouping panel** with a soft radius (e.g. `rounded-xl`).
2. Split internals into explicit zones: header rail, data body, action footer.
3. Remove center alignment unless content semantics require it.
4. Make inner data surfaces sharper than the outer shell (`rounded-sm`/`none`).
5. Use one committed action style (not a decorative pill) tied to intent.

## One compact bad→good snippet
```tsx
// Bad
<section className="rounded-2xl shadow-lg p-6 text-center">
  <h3 className="text-xl font-semibold">Performance</h3>
  <button className="mt-4 rounded-full px-5 py-2">View</button>
</section>

// Good
<section className="rounded-xl border p-4">
  <header className="mb-3 flex items-center justify-between">
    <h3 className="text-sm font-medium">Performance</h3>
    <span className="rounded-full border px-2 py-0.5 text-xs">Live</span>
  </header>
  <dl className="grid grid-cols-2 gap-2 text-sm">
    <div className="rounded-sm border p-2"><dt>Latency</dt><dd>82ms</dd></div>
    <div className="rounded-sm border p-2"><dt>Errors</dt><dd>0.2%</dd></div>
  </dl>
  <footer className="mt-3">
    <button className="rounded-sm border px-3 py-1.5">Open details</button>
  </footer>
</section>
```

## Detector mapping
Coverage: detector-backed
Rule ID: ui-generic-saas-card

## Related
- `uniform-radius`
- `pill-and-ghost-stack` (forthcoming)
- `decorative-gradient` (forthcoming)
