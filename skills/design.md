# Design Skill: Impeccable UI Enforcement (React)

## Shipping Checklist (must pass all)
- [ ] Hierarchy is obvious in 3 seconds: heading, decision data, next action.
- [ ] Primary text contrast is >= 7:1; secondary is >= 4.5:1.
- [ ] Spacing uses defined tokens only; no random one-off paddings.
- [ ] Card layouts have role-based structure (header, decision block, action block).
- [ ] Radius/shadow choices are intentional and not identical across every surface.
- [ ] Progress visualization explains accountability (owner/status/risk), not just percentage.

## Fail Conditions (auto reject)
- Reject low-contrast UI where key text blends into the surface.
- Reject generic card layouts that look like template SaaS placeholders.
- Reject uniform radius/shadow treatment applied everywhere.

## Rewrite Instruction (mandatory)
If the UI looks generic, rewrite it before shipping:
1. Increase hierarchy separation (scale, weight, placement).
2. Replace decorative containers with role-specific structure.
3. Reassign color to encode priority and state, not decoration.
4. Rebuild progress as an accountable status model.

## Hard Rules
### Layout
- Build clear zones: context, decision metrics, execution state, and actions.
- Do not ship flat stacks of visually identical cards.

### Typography
- Use at least three tiers: micro label, operative value, section headline.
- Do not use low-contrast gray for important information.

### Color
- Keep palette tight: ink + paper + one action accent + one risk accent.
- Use saturated color only for semantic emphasis.

### Components
- Buttons must communicate priority at a glance.
- Cards must shape reading order, not just wrap content.
- Progress components must expose owner + status + risk.
