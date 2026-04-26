# Design Skill: Impeccable UI (React)

## Purpose
Produce interfaces with strong visual authorship. Reject generic AI-SaaS aesthetics and default component-library styling.

## Anti-patterns (Do NOT generate)
- Rounded-everything cards (8px by habit), soft shadows, and decorative gradient borders.
- Low-contrast gray-on-dark text that buries important information.
- Random spacing values with no rhythm or repeatable system.
- Dashboard filler (progress bars, mini charts, pills) with no task hierarchy.
- Equal visual weight everywhere: same font size, same border radius, same shadow.

## Good patterns (Generate instead)
- Clear information hierarchy visible in under 3 seconds.
- Typographic steps with purpose (label -> value -> section heading).
- High-contrast color pairings where critical actions and statuses read immediately.
- Deliberate spacing system (consistent gaps, paddings, and section cadence).
- Intentional edges: either sharp utility feel or clearly softened panels, never default-middling.

## Rules
### Layout
- Use compositional zones: header, action rail, detail panel; avoid flat card stacks.
- Establish alignment anchors so eyes track left-to-right without hunting.
- Every section must justify why it exists and what decision it supports.

### Typography
- Minimum three text tiers: metadata, body/value, display heading.
- Avoid overusing medium-gray body text for primary data.
- Use uppercase micro-labels sparingly for scan cues.

### Color
- Keep base palette tight (ink, paper, one accent, one alert).
- Reserve high-chroma accents for urgency, actions, or active state.
- Gradients are optional accents, not structure.

### Components
- Buttons: explicit contrast and shape intent; no anonymous ghost defaults.
- Cards: define hierarchy and structure; no blank containers with decorative shadows.
- Progress: show accountability (who/what/status), not just percentages.

## Generic UI Smell Test
- If it looks like a template SaaS card, reject it.
- If hierarchy is unclear in 3 seconds, redesign it.
- If everything has the same radius/shadow, fix it.
