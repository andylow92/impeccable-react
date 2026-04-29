---
id: form-flow-pack
name: Form Flow Pack
version: 1.0.0
objective: Define a friction-aware form flow that preserves momentum and reduces user error.
---

# Form Flow Pack

## objective
Design form flows that keep users oriented, reduce cognitive load, and maximize completion quality.

## hierarchy model
1. Flow framing (what this form achieves and expected time).
2. Current step focus (single active segment with clear progress state).
3. Input cluster (related fields grouped by intent, not datatype alone).
4. Validation + guidance layer (inline, immediate, actionable).
5. Review/confirmation layer (summary before commit).

## typography roles
- display-heading: form purpose and step title.
- section-heading: cluster labels for grouped inputs.
- field-label: explicit prompt above each input.
- helper-text: pre-emptive guidance and constraints.
- validation-text: concise error or success feedback.

## spacing rhythm
- Base rhythm token: 8px.
- Spacing between field label and input: 8px (1x rhythm).
- Spacing between related fields: 16px (2x rhythm).
- Spacing between clusters: 32px (4x rhythm).
- Sticky footer/action area padding: 16px vertical, 24px horizontal.

## CTA strategy
- Primary CTA reflects step intent ("Continue", "Submit", "Confirm").
- Secondary CTA ("Back" or "Save draft") is visually subordinate.
- Disabled primary CTA requires visible reason and recovery path.
- Final submission CTA appears only after required validation conditions are met.

## anti-pattern watchlist
- Multiple competing primary buttons in one step.
- Placeholder-only labels.
- Error messages detached from offending fields.
- Large ungrouped field walls with no sectional hierarchy.
- Progress indicators that do not match actual step count.

## done criteria
- Users can state where they are, what is required, and what happens next.
- Required fields and constraints are clear before submission.
- Errors are inline, specific, and recoverable in one interaction.
- CTA hierarchy remains consistent at every step.
- Review state accurately mirrors entered data before final commit.
