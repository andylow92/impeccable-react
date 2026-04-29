---
id: typography
parent: impeccable-ui
summary: Enforce hierarchy with measurable type tiers and spacing rhythm.
---

# Typography

## Intent
Typography must establish information priority at a glance. Build every screen with explicit hierarchy so users can identify context, data, and emphasis in one scan.

## Non-negotiable rules
- Implement **at least three type tiers per screen**: label tier, value/body tier, and display tier.
- Keep **body/value floor at 14px minimum**. Do not render paragraph or value text below 14px.
- Enforce tier roles:
  - **Label tier**: muted contrast, supporting role, uppercase/track only when it improves scanability.
  - **Value tier**: stronger contrast than label and semibold or stronger when presenting primary data.
  - **Display tier**: highest contrast and largest size, reserved for top-priority message only.
- Allow **maximum one display-size element per viewport** (e.g., hero metric, page title, or key status).
- Maintain vertical rhythm with predictable steps:
  - Adjacent tiers should differ by **at least 2px** in size.
  - Do not jump more than **1.5×** between adjacent tiers unless introducing the single display tier.
  - Spacing between lines/blocks must increase with tier prominence.
- Keep alignment intentional. In left-anchored layouts, left-align text; do not center titles or values as decoration.

## Anti-patterns and failure cues
- See: `gray-on-gray` (`anti-patterns/gray-on-gray.md`).
- “Centered card title” in a left-anchored layout signals template styling over information design.
- Labels and values using the same size/weight indicates collapsed hierarchy.
- Multiple display-size headlines in one viewport indicates unresolved priority.
- Sub-14px body/value text indicates readability failure.

## Rewrite protocol
1. Inventory every text element on the screen and assign each to label, value/body, or display.
2. If fewer than three tiers exist, introduce missing tiers before touching color or decoration.
3. Raise any body/value text below 14px to at least 14px.
4. Increase contrast/weight so value tier is visibly stronger than label tier.
5. Reduce display-size usage to one element per viewport and demote the rest.
6. Normalize size steps and spacing to satisfy rhythm constraints (≥2px step, ≤1.5× adjacent jump).
7. Re-check alignment so layout anchoring and text alignment agree.

## Quick pass/fail checklist
- [ ] Screen has 3+ distinct type tiers (label, value/body, display).
- [ ] Body/value text is never smaller than 14px.
- [ ] Value tier is stronger in weight and/or contrast than label tier.
- [ ] No more than one display-size element appears per viewport.
- [ ] Adjacent tier sizes step by at least 2px and no more than 1.5× (except the single display tier transition).
- [ ] Text alignment matches layout anchoring.

## Before/after mini examples
**Before (fail)**
```text
project          Atlas Replatform
client           Northstar Bio
budget           $342,000
```
All text is same weight and near-same contrast; hierarchy is ambiguous.

**After (pass)**
```text
PROJECT          Atlas Replatform
CLIENT           Northstar Bio
BUDGET           $342,000
```
Label tier uses muted support styling; value tier uses stronger weight/contrast; a separate display heading can appear once per viewport when needed.
