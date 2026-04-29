---
id: responsive-design
parent: impeccable-ui
summary: Design mobile-first with fluid type and content-driven breakpoints.
---

# Responsive design

## Intent
Layouts must adapt to the **content's** breaking points, not the device's.
Start from the smallest viewport that needs to be supported, scale up by
adding density only when it improves comprehension, and never break primary
flows on touch.

## Non-negotiable rules
- Build mobile-first: the base styles target the smallest supported viewport.
  Use `min-width` media queries (or container queries) to add density, never
  `max-width` queries to take it away.
- Pick breakpoints by where the content visually breaks, not by device class.
  Document each breakpoint with the content rule that triggered it.
- Use **container queries** for components that ship into multiple layout
  contexts. Reserve viewport queries for page-level chrome.
- Body/value text must use a **fluid scale** with a floor (≥ 14px on phones)
  and a ceiling on wide viewports. `clamp(0.875rem, 1.5vw, 1rem)` style.
- Tap targets remain **≥ 44×44** on touch viewports regardless of content
  density.
- Horizontal scrolling is **never** required to read primary content. It is
  acceptable only for explicit horizontal lists or wide tables that announce
  themselves.
- Critical actions remain visible without scrolling on the **shortest**
  supported viewport (e.g. landscape phone, ~640×360).
- Images and media declare intrinsic aspect ratio (`aspect-ratio` or
  width/height attributes) so the layout does not jump on load.

## Anti-patterns and failure cues
- Desktop-first stylesheet that uses `max-width` queries to "fix" mobile.
- Breakpoints copied from a framework (sm/md/lg/xl) with no content
  justification.
- Fixed font-size cascade (e.g. always 16px) that becomes too tight on phones
  or too loose on 4K displays.
- Tap targets that shrink below 44×44 in compact density.
- Layout that hides primary navigation behind a hamburger on desktop because
  the mobile pattern got copy-pasted upward.
- Content that requires horizontal scroll to read (not to browse a list).
- Images without aspect ratio causing layout shift on load (CLS).
- Breakpoint at exactly device-width assumption (`@media (max-width: 768px)`)
  that fails on tablet split-view.

## Rewrite protocol
1. Reset the cascade: write the base styles for the smallest viewport you
   support, then layer density via `min-width` or container queries.
2. Audit each breakpoint and record the content rule it serves
   (e.g. "≥ 720px: sidebar fits next to article without dropping line length
   below 50ch"). Remove breakpoints that have no rule.
3. Replace static type sizes for body/value text with `clamp()` expressions
   bounded by a 14px floor and a context-appropriate ceiling.
4. Convert component-level breakpoints to container queries when the
   component has multiple layout hosts.
5. Test on the shortest supported viewport. Verify primary action is reachable
   without scrolling.
6. Add `aspect-ratio` (or width/height) to every image, video, and embed.
7. Verify keyboard and touch reachability at every breakpoint, not only
   default density.

## Quick pass/fail checklist
- [ ] Base styles target the smallest viewport; density is added with
      `min-width`/container queries.
- [ ] Each breakpoint has a documented content rule, not a device label.
- [ ] Body/value text uses a fluid scale with a 14px floor.
- [ ] Tap targets remain ≥ 44×44 at every density.
- [ ] No horizontal scroll on primary content.
- [ ] Primary action is visible without scroll on the shortest supported
      viewport.
- [ ] Images and media declare aspect ratio; no CLS on load.
- [ ] Component-scoped layouts use container queries when reused.

## Before/after mini examples
**Before (fail): desktop-first, fixed type**
```css
.title { font-size: 28px; }
.body  { font-size: 14px; }
@media (max-width: 768px) {
  .title { font-size: 20px; }
  .body  { font-size: 12px; }
}
```
Stylesheet starts from desktop, shrinks below the body floor on phones, uses
a device-class breakpoint without a content rule.

**After (pass): mobile-first, fluid type**
```css
.title { font-size: clamp(1.25rem, 2.5vw, 1.75rem); }
.body  { font-size: clamp(0.875rem, 1.5vw, 1rem); }
@media (min-width: 56rem) {
  /* 56rem ≈ where the article line length would otherwise exceed 80ch */
  .layout { grid-template-columns: 16rem 1fr; }
}
```
Base styles work at 360px; type stays above the 14px floor; breakpoint is
documented by content rule (line length).
