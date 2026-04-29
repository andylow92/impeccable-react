
# Anti-pattern: Uniform radius

## Why this is wrong
Border-radius is a hierarchy signal. When every container, button, badge, and
input shares the same radius, the eye has nothing to anchor on. The outer
container, the inner stat tiles, and the call-to-action button all blur into
one shape language.

## How to detect
- Four or more elements in the same component using identical
  `rounded-{xl,2xl,3xl}` classes.
- A single radius token used across both data surfaces and grouping panels.

## Replace with
Two radii at most:
- **Sharp** (or near-sharp) for data surfaces, buttons, and inputs.
- **Soft** for the outer panel that groups related content.

If you need a third, it should encode something specific (e.g. `rounded-full`
for avatars or status dots). Never apply a third just because three feels
balanced.

## Related
- `generic-saas-card`
