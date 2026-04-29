---
id: typography
parent: impeccable-ui
summary: Three-tier hierarchy or it's filler.
---

# Typography

## Rules
- At least three distinct tiers per screen: micro-label → value → display heading.
- Micro-labels are uppercase, tracked, muted. They label, they do not compete.
- Values carry the data. Bold weight, ink color, never `text-gray-400`.
- Display headings are reserved for the single most important element on screen.
- Never use `text-center` on a left-anchored layout. Alignment is an information channel.

## Anti-patterns
- See: `anti-patterns/gray-on-gray.md` (forthcoming).
- "Centered card title" — the SaaS template tell.

## Quick checks
- [ ] Three or more distinct font sizes on screen.
- [ ] Primary value has darker ink than its label.
- [ ] No body text below 14px.
- [ ] No more than one display-size element per viewport.

## Examples
A label/value pair:
```
PROJECT          Atlas Replatform
CLIENT           Northstar Bio
BUDGET           $342,000
```
Label is `text-xs uppercase tracking-wide text-ink-soft`. Value is
`text-base font-semibold text-ink`. Two tiers, one decision.
