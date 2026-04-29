---
id: color-contrast
parent: impeccable-ui
summary: Color encodes state. Contrast is not optional.
---

# Color and contrast

## Rules
- Body text at minimum 4.5:1 contrast against its background.
- UI surfaces (buttons, badges) at minimum 3:1 against the surrounding surface.
- Every accent color must encode something: action, risk, ownership, urgency.
- One accent per screen for the highest-priority element. Adding a second dilutes both.
- Gradients only when the gradient itself encodes state (progress, focus). Never as wallpaper.

## Anti-patterns
- See: `anti-patterns/generic-saas-card.md` — decorative gradient bar at top of card.

## Quick checks
- [ ] Primary value is not `text-gray-400` or `text-gray-500` on a light background.
- [ ] Action button contrast against its surrounding surface ≥ 3:1.
- [ ] No more than one accent color used purely decoratively.

## Examples
- ✅ A red dot next to "blocked." Color = state.
- ❌ A blue-to-pink gradient header bar. Color = decoration.
