---
id: impeccable-ui
name: Impeccable UI
version: 1.0.0
summary: Gate AI-generated UI against generic SaaS templates.
voice: directive
applies_to:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.html"
  - "**/*.css"
references:
  - typography
  - color-contrast
  - spatial-design
  - motion-design
  - interaction-design
  - responsive-design
  - ux-writing
anti_patterns:
  - generic-saas-card
  - uniform-radius
commands:
  - critique-ui
  - rewrite-generic
  - pre-ship-gate
  - teach
  - polish
  - animate
  - layout
  - typeset
  - clarify
  - adapt
  - craft
  - document
  - shape
  - extract
  - harden
  - onboard
  - bolder
  - quieter
  - distill
  - delight
  - overdrive
  - optimize
  - live
---

# Impeccable UI

This is not a style guide. It is a gate.
Every UI must pass this before it ships.

---

## 1. Pre-flight checklist (mandatory)

Run through every item before declaring a UI done. If you cannot answer "yes",
the UI is not finished.

- [ ] In the first 3 seconds, can a stranger tell what is most important on screen?
- [ ] Is there a clear typographic hierarchy with at least 3 distinct tiers (label, value, heading)?
- [ ] Do primary actions have visibly higher contrast than secondary ones?
- [ ] Is there a spacing rhythm (tokens), not hand-tuned padding values?
- [ ] Are radii intentional and varied by purpose (sharp for utility, soft for panels)?
- [ ] Does each section justify its existence (what decision does it support)?
- [ ] Has every "card" been challenged: is it a container, or just decorative chrome?
- [ ] Have you removed at least one element that does not communicate a decision?
- [ ] Does color encode state, ownership, or urgency — not just "look nice"?

Any unchecked item ⇒ the UI is rejected.

---

## 2. Fail conditions (auto-reject)

If any of these are true, the UI is wrong. Do not negotiate.

- **Low contrast.** Body text below 4.5:1 against its background. Action buttons
  below 3:1 against the surrounding surface.
- **Generic SaaS card.** A rectangle with `rounded-2xl`, soft shadow, centered
  heading, and a single CTA button. This is the AI default. Reject it.
- **Uniform radius.** Every container in the screen shares the same
  border-radius value. Hierarchy collapses.
- **Uniform shadow.** Every container in the screen has the same shadow.
  Depth becomes meaningless.
- **Decorative gradient.** Gradient used as background filler instead of
  encoding state, focus, or progress.
- **Pill button + ghost button stack.** The default Tailwind tutorial pattern.
  Replace with sharp utility shapes.
- **Gray-on-gray primary data.** Primary values rendered in `text-gray-500`
  or lighter on a light surface.
- **Progress bar without an owner.** A percentage that cannot answer
  "who is responsible and what is blocked?"
- **Equal weight everywhere.** Same font size, same color, same border for
  metadata and primary values.
- **Filler dashboards.** Charts, sparklines, or pills that do not change a
  decision the user makes.

If a fail condition is hit, jump to the rewrite instruction below.

---

## 3. Good patterns (generate these)

- **Compositional zones.** Header, action rail, detail panel — not flat stacks.
- **Three text tiers minimum.** Micro-label (uppercase, tracked, muted) → value
  (bold, ink) → display heading (large, ink). Never collapse two tiers into one.
- **High-contrast critical path.** The action a user is most likely to take is
  the highest-contrast element on screen. Everything else recedes.
- **Tokenized spacing.** Use `rhythm`, `gutter`, and gap tokens. No magic
  `p-[13px]` values.
- **Edge intent.** Choose: sharp utility (`rounded-sharp`) for data surfaces,
  panel softness (`rounded-panel`) for grouping. Never a single radius for both.
- **Status-aware color.** `cobalt` for action, `signal` for risk, `ink` for
  authority. Color carries meaning, not decoration.
- **Owner visibility.** Every progress, status, or assignment shows who.
  No anonymous progress bars.

---

## 4. Rewrite instruction (if generic)

If a generated UI fails the smell test, do not patch it. Rewrite it using this
sequence:

1. **Strip.** Remove every shadow, gradient, rounded corner, and pill. Reduce
   the screen to monochrome rectangles.
2. **Rank.** Identify the single most important piece of information on screen.
   Mark it. Then rank everything else relative to it.
3. **Tier typography.** Assign each element to one of three tiers. Anything
   that does not fit a tier gets removed.
4. **Re-introduce contrast.** Bring back exactly one accent color, used only on
   the highest-priority element and its action.
5. **Re-introduce shape.** Apply `rounded-sharp` to data, `rounded-panel` to
   the outer container only. Stop there.
6. **Re-introduce shadow.** At most one elevated surface per screen. Never two
   with the same shadow.

This is the redesign protocol. Skipping steps regenerates the generic output.

---

## 5. Smell test (one-line version)

> If it looks like the front page of a Tailwind UI kit, it is wrong.
> If hierarchy is unclear in 3 seconds, it is wrong.
> If every container has the same radius, the same shadow, and the same
> padding, it is wrong.
