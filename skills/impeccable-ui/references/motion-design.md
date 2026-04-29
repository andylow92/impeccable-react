---
id: motion-design
parent: impeccable-ui
summary: Motion encodes causality and state change. It is never decorative.
---

# Motion design

## Intent
Animation must explain a state change. Every transition answers "what
happened, and to what?" If a motion does not clarify causality, hierarchy, or
continuity, it is decoration and must be removed.

## Non-negotiable rules
- Honor `prefers-reduced-motion: reduce`. Disable non-essential transitions
  and reduce remaining ones to opacity-only crossfades under or equal to 100ms.
- Default duration band is **120–240ms** for UI feedback (hover, focus, press,
  enter/exit of small surfaces). Page-scale transitions cap at **400ms**.
- Use easing that matches the role:
  - **Standard ease-out** for elements entering or revealing.
  - **Ease-in** for elements leaving the screen.
  - **Ease-in-out** for elements that stay on screen and reposition.
  - Never use linear easing for UI motion; reserve it for progress indicators.
- Do not animate two competing properties at once (e.g. position + scale +
  opacity) unless they share a single causal source.
- Stagger must be deterministic: a constant delay step (≤ 30ms) applied along
  one axis (top-to-bottom or first-to-last). No randomized offsets.
- Loading and skeleton animations must communicate progress, not "alive";
  pulses and shimmers cap at one effect per surface.
- All hover/focus animations must remain visible to keyboard users; never
  gate state feedback behind cursor-only events.

## Anti-patterns and failure cues
- Decorative bounce, wobble, or spring on UI surfaces with no causal source.
- Long (>400ms) page transitions that block the next interaction.
- Multiple concurrent shimmer/pulse loops on the same screen.
- Hover-only state feedback (no `:focus-visible` parity).
- Reduced-motion mode that still runs full transitions.
- Carousels or marquees that auto-advance faster than 5s without a pause
  control.

## Rewrite protocol
1. Inventory every transition and animation. For each, name the state change
   it explains. If you cannot, delete it.
2. Cap durations to the band: 120–240ms for UI feedback, ≤ 400ms for page.
3. Reassign easing by role (out for enter, in for exit, in-out for reposition).
4. Reduce concurrent animated properties to one or two with a shared cause.
5. Replace random/elastic stagger with a constant ≤ 30ms step on one axis.
6. Add or verify a `prefers-reduced-motion` branch that disables non-essential
   transitions and limits the rest to ≤ 100ms opacity crossfades.
7. Mirror every hover transition to `:focus-visible`.

## Quick pass/fail checklist
- [ ] Every animation can be named in one sentence ("X enters because Y").
- [ ] UI feedback durations sit between 120ms and 240ms.
- [ ] Easing matches role (out / in / in-out).
- [ ] No more than two animated properties per causal event.
- [ ] Staggers use a fixed step ≤ 30ms on a single axis.
- [ ] Reduced-motion mode disables non-essential motion and shortens the rest.
- [ ] Hover and focus-visible produce identical state feedback.

## Before/after mini examples
**Before (fail): decorative spring**
```css
.card { transition: transform 600ms cubic-bezier(.5, 1.6, .3, 1); }
.card:hover { transform: scale(1.04) rotate(-1deg); }
```
Long duration, elastic easing, two animated properties, no causal source,
no focus-visible parity, no reduced-motion fallback.

**After (pass): causal feedback**
```css
.card { transition: background-color 160ms ease-out, box-shadow 160ms ease-out; }
.card:hover, .card:focus-visible { background-color: var(--surface-hover); box-shadow: var(--elev-1); }
@media (prefers-reduced-motion: reduce) {
  .card { transition: background-color 80ms linear; box-shadow: none; }
}
```
160ms duration, ease-out for the entering hover state, focus-visible parity,
reduced-motion branch.
