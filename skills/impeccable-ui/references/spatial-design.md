---
id: spatial-design
parent: impeccable-ui
summary: Use a tokenized spacing scale so density encodes hierarchy.
---

# Spatial design

## Intent
Spacing is hierarchy. Distance between elements signals relationship more
reliably than borders, shadows, or background fills. Every gap on screen must
come from a tokenized scale and serve a grouping decision.

## Non-negotiable rules
- Use a fixed spacing scale (e.g. 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64) and
  reject any one-off `p-[13px]` or `mt-[7px]` value.
- Group spacing must follow the **proximity rule**: related elements sit
  closer than unrelated elements by **at least one full step** of the scale.
- A grouping panel must contain **at least one step more outer padding** than
  the gap between its child rows; collapsing the two reads as a flat stack.
- Adjacent sibling sections must be separated by a **larger gap** than the
  internal gap of either section.
- Hit targets must be **at least 44×44 logical px** for touch and **24×24** for
  pure pointer surfaces; padding, not margin, creates the target.
- Maintain a single horizontal rhythm token (gutter) per layout. Do not mix
  `gap-3` and `gap-5` siblings under the same parent.
- Whitespace at the page edge must be **at least one step larger** than the
  internal column gutter so the content has a frame.

## Anti-patterns and failure cues
- Identical padding on outer container and inner rows ⇒ flat-stack feel.
- Magic pixel values (`p-[13px]`, `mt-[7px]`) ⇒ untokenized layout.
- Two visually adjacent sections with the same gap as their internal rows
  ⇒ user cannot tell where one section ends.
- Buttons or icon controls below 44×44 on touch surfaces ⇒ accessibility fail.
- Cards rely on shadow or border to imply grouping that proximity should do.

## Rewrite protocol
1. Replace every arbitrary spacing value with the nearest scale token.
2. Audit grouping: for each container, ensure outer padding ≥ inner gap + 1
   step. If not, increase outer padding.
3. Audit separation: between sibling sections, increase the gap until it is
   visibly larger than the internal gap of both sides.
4. Audit hit targets: enlarge clickable controls via padding, not via fixed
   width/height.
5. Remove any border or shadow whose only purpose is to imply grouping that
   proximity now expresses.
6. Re-scan the layout and confirm density itself communicates the hierarchy.

## Quick pass/fail checklist
- [ ] Every spacing value comes from the documented scale.
- [ ] Outer padding of each grouping container is ≥ one step larger than its
      internal row gap.
- [ ] Inter-section gaps exceed intra-section gaps.
- [ ] Touch hit targets are ≥ 44×44; pointer hit targets are ≥ 24×24.
- [ ] No two siblings under the same parent use different gutter tokens.
- [ ] No grouping is carried by shadow/border alone.

## Before/after mini examples
**Before (fail): flat-stack spacing**
```tsx
<section className="p-3 space-y-3">
  <header className="p-3">Project</header>
  <div className="p-3">Atlas Replatform</div>
  <div className="p-3">Northstar Bio</div>
</section>
```
Outer padding equals inner gap; the section reads as four equal rows.

**After (pass): proximity-based hierarchy**
```tsx
<section className="p-6 space-y-2">
  <header className="pb-3 text-xs uppercase tracking-wide">Project</header>
  <div>Atlas Replatform</div>
  <div>Northstar Bio</div>
</section>
```
Outer padding (24px) is two steps larger than inner gap (8px). The header
sits one step from its values; the section frames itself.
