---
id: color-contrast
parent: impeccable-ui
summary: Color encodes state. Contrast is not optional.
---

# Color and contrast

## Intent
Color must communicate meaning before style. Use contrast and accent decisions to make state, priority, and action unmistakable in one scan.

## Non-negotiable rules
- Body text and primary value text must meet **minimum 4.5:1 contrast** against their immediate background.
- Large text (18px+ regular or 14px+ bold) must meet **minimum 3:1 contrast** against its immediate background.
- Interactive UI elements (button fills, input borders, toggles, badges, pills) must meet **minimum 3:1 contrast** against adjacent surfaces in every state (default, hover, focus, disabled, selected).
- Focus indicators must meet **minimum 3:1 contrast** against surrounding colors.
- Accent colors must encode state only (action, risk, ownership, urgency, success, warning, failure). Decorative accents without state meaning are disallowed.
- Use one dominant accent per screen for the highest-priority state/action. Additional accents are allowed only when each maps to a distinct semantic state.
- Gradients are allowed only when the gradient itself encodes state (e.g., progress range, severity ramp). Decorative gradients are disallowed.

## Anti-patterns and failure cues
- See: `anti-patterns/generic-saas-card.md`.
- Decorative top bars, glows, or gradient ribbons with no status/action meaning indicate accent misuse.
- `text-gray-400` or `text-gray-500` used for body/value text on light surfaces often fails the 4.5:1 requirement.
- Button states that rely on subtle lightness changes but remain below 3:1 against the card/page surface fail state visibility.
- “Disabled” and “secondary” styles that become unreadable (text below 4.5:1 or control boundary below 3:1) fail accessibility and hierarchy.

## Rewrite protocol
1. **Detect role**: For each colored element, classify it as body text, large text, interactive surface, focus indicator, or accent marker.
2. **Measure contrast**: Compute contrast ratio against the immediate background/surrounding surface.
3. **Apply threshold mapping**:
   - If body/value text is **< 4.5:1**, darken/lighten text until ratio is **>= 4.5:1**.
   - If large text is **< 3:1**, adjust text/background until ratio is **>= 3:1**.
   - If UI surface or border in any state is **< 3:1**, adjust fill/border/state token until ratio is **>= 3:1**.
   - If focus ring is **< 3:1**, swap to a compliant focus token at **>= 3:1**.
4. **Resolve accent misuse**:
   - If accent has no explicit semantic label (status/action/ownership/urgency), remove it or convert it to neutral styling.
   - If multiple accents encode the same meaning, collapse to one dominant accent token.
   - If gradient is decorative, replace with solid neutral; if semantic, document the state mapping.
5. **Re-check all states**: Verify default/hover/focus/disabled/selected for buttons, inputs, chips, and badges.
6. **Pass/fail gate**: Mark pass only when every measured item meets its numeric threshold and every accent has explicit state meaning.

## Quick pass/fail checklist
- [ ] **Pass** only if all body/value text is **>= 4.5:1**; otherwise **Fail**.
- [ ] **Pass** only if all large text is **>= 3:1**; otherwise **Fail**.
- [ ] **Pass** only if every interactive surface/border in every state is **>= 3:1** against adjacent surfaces; otherwise **Fail**.
- [ ] **Pass** only if focus indicators are **>= 3:1**; otherwise **Fail**.
- [ ] **Pass** only if each accent maps to explicit semantics (action/risk/ownership/urgency/success/warning/failure); otherwise **Fail**.
- [ ] **Pass** only if decorative gradients/accents are removed or converted to semantic state encodings; otherwise **Fail**.

## Before/after mini examples
**Before (fail): decorative accent misuse**
```text
Card header has blue→pink gradient strip; no status, no action meaning.
```

**After (pass): state-encoding accent usage**
```text
Replace strip with a red status dot + "Blocked" label.
Accent now encodes risk state instead of decoration.
```

**Before (fail): low-contrast text/button states**
```text
Body text: #9CA3AF on white (~2.8:1).
Primary button (default): #93C5FD on white card border (~1.8:1 edge contrast).
Disabled button text: #D1D5DB on #F9FAFB (~1.4:1).
```

**After (pass): compliant alternatives**
```text
Body text: #374151 on white (~7.5:1, passes 4.5:1).
Primary button fill: #2563EB with white label (~5.2:1 text contrast) and >=3:1 edge contrast vs card.
Disabled button: #E5E7EB fill + #4B5563 label (~5.0:1 text contrast) with clear non-interactive semantics.
```
