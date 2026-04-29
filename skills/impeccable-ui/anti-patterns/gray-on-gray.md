---
id: gray-on-gray
parent: impeccable-ui
severity: warn
detector_rule: manual-only-current-release
summary: Low-contrast gray text on gray surfaces obscures hierarchy and readability.
---

# Anti-pattern: Gray on gray

## Why this appears in AI output
AI-generated interfaces often combine neutral palettes by default and then stack muted text over muted containers. The result can look "minimal" while silently dropping readable contrast.

## Why it harms UX
When labels, values, and supporting copy all sit in similar gray ranges, hierarchy disappears and users must work harder to parse content. This especially harms glanceability in dense data views.

## How to detect manually in <30s
- Primary or value text uses gray tokens over gray backgrounds with weak separation.
- Labels and values feel similar in visual weight because contrast is too close.
- A quick squint test makes key numbers and status text fade into their container.

## How to rewrite (numbered steps)
1. Identify primary value text and promote it to a higher-contrast foreground token.
2. Keep supporting labels muted, but ensure clear separation from values.
3. Increase contrast between text and surface before adding decorative color.
4. Re-check typography tiers so contrast supports label/value/display hierarchy.
5. Validate with light/dark theme variants if both are supported.

## One compact bad→good snippet
```tsx
// Bad
<section className="bg-gray-100 p-4 text-gray-500">
  <p className="text-sm">Revenue</p>
  <p className="text-lg font-semibold text-gray-500">$342,000</p>
</section>

// Good
<section className="bg-gray-100 p-4 text-gray-600">
  <p className="text-sm text-gray-500">Revenue</p>
  <p className="text-lg font-semibold text-gray-900">$342,000</p>
</section>
```

## Detector mapping
- Stable ID: `gray-on-gray`
- Mapping: manual-only (current release)

## Related
- `typography`
