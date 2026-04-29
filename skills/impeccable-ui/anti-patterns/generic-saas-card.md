---
id: generic-saas-card
parent: impeccable-ui
severity: fail
detector_rule: ui-generic-saas-card
summary: rounded-2xl + soft shadow + centered heading + single CTA. The AI default.
---

# Anti-pattern: Generic SaaS card

## Why this is wrong
This is the default shape an AI assistant produces when asked for "a card." It
signals "demo," not "product." It collapses hierarchy: every card on the screen
ends up looking the same, so nothing has priority.

## How to detect
- An outer `<div>` (or `<section>`/`<article>`) with:
  - `rounded-2xl` (or `rounded-xl`, `rounded-3xl`)
  - `shadow-md` / `shadow-lg`
  - `text-center` heading near the top
  - exactly one button, often with `rounded-full`
- Stat tiles inside that all share the same radius, shadow, and size.

## Replace with
Compositional zones. A header rail with a status pill, a body with two columns
of label/value pairs, and a footer action that is sharp (not pill-shaped) and
visually committed (not ghost). The outer container has the only soft radius;
inner data surfaces are sharp.

## Related
- `uniform-radius`
- `pill-and-ghost-stack` (forthcoming)
- `decorative-gradient` (forthcoming)
