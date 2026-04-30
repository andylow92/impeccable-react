---
id: palette-design
parent: impeccable-ui
summary: Build a palette from ink, paper, and one earned accent — never from Tailwind defaults.
---

# Palette design

## Intent
A palette is an identity decision, not a color-picker decision. AI tools
default to the same six saturated hues (`blue-500`, `red-500`, `green-500`,
`purple-500`, `yellow-500`, `pink-500`) on top of pure white and pure black,
which is why every "AI-generated UI" looks like the same UI. The palette
must be built from a deliberate ink, a deliberate paper, and one earned
accent that carries semantic meaning. Every color beyond that has to justify
its job.

This reference is distinct from `color-contrast`: contrast governs
*readability* (4.5:1, 3:1 ratios), palette governs *identity* (which colors
exist at all).

## Non-negotiable rules
- **No raw Tailwind default scale values as the brand signature.** Do not
  ship `bg-blue-500`, `bg-red-500`, `bg-green-500`, `bg-purple-500`,
  `bg-pink-500`, `bg-indigo-500`, `bg-yellow-500`, or `bg-emerald-500` as
  the dominant accent. These are the AI-default tells. If Tailwind is the
  styling system, customize `theme.colors` so accents resolve to project
  tokens (e.g. `bg-action`, `bg-risk`, `bg-ink`), not raw scale literals.
- **No pure black or pure white as ink/paper.** `#000000` and `#FFFFFF` are
  reserved for hard system surfaces. Use **off-black** ink (deep navy,
  near-black brown, or oklch lightness ≈ 18–22%) and **off-white** paper
  (cream, ice, or oklch lightness ≈ 96–98%).
- **Tinted neutrals, not pure neutrals.** Every "gray" in the palette must
  carry a hue cast (cool, warm, or aligned with the accent). A neutral
  scale produced from `oklch(L 0% h)` reads as "I have not decided."
- **One signature accent.** The palette has exactly **one** color whose job
  is "this is the brand / the primary action / the signal." Additional
  colors exist only when they encode a distinct **semantic state**
  (success, warning, error, info, ownership). Decorative second accents are
  disallowed.
- **Earn every color.** Each token in the palette must answer: *which
  decision does this color help the user make?* If you cannot answer,
  remove the color.
- **OKLCH-anchored steps.** Define the neutral and accent ramps in OKLCH
  (or LCH) so adjacent steps are perceptually uniform. RGB / HSL ramps
  produce muddy yellows, neon greens, and dead blues at the same lightness.
- **Saturation tapers.** Saturation (chroma) is highest on the signature
  accent, medium on semantic states, near-zero on neutrals. A palette where
  every color is fully saturated reads as cheap. A palette where neutrals
  match accent chroma reads as muddy.
- **Grayscale survival test.** Render the UI in grayscale. If hierarchy
  collapses, color was doing the job hierarchy should do — fix the
  hierarchy first, restore color last.
- **No decorative gradients.** Gradients ship only when the gradient itself
  encodes state (progress range, severity ramp). Brand gradients
  (blue→purple, teal→pink, "make it pop") are AI-generic on sight.
- **No three-color "primary / secondary / accent" structure.** That is a
  Bootstrap / Material default. Ship ink + paper + one accent + semantic
  states; resist the temptation to invent a "secondary brand color" without
  a job.
- **Dark mode is a re-derivation, not an inversion.** Don't flip light
  values to dark; redefine ink, paper, neutrals, and accents in OKLCH so
  contrast and hierarchy survive at low light.

## Anti-patterns and failure cues
- See: `anti-patterns/tailwind-default-palette.md`.
- A palette whose accents map directly to `blue-500` / `red-500` /
  `green-500` / `purple-500` and whose neutrals map directly to
  `slate-*` / `gray-*` / `zinc-*` defaults.
- "Primary, secondary, tertiary" color slots filled with three saturated
  hues at the same lightness.
- A purple→pink or blue→teal gradient on the hero or primary CTA.
- Pure `#000` text on pure `#FFF` background as the default text style.
- A landing page with five accent colors (logo, header, two CTAs, footer
  glyph) where no two accents share a semantic role.
- Status colors used as decoration: green checkmarks, red dots, yellow
  badges scattered across the screen with no state behind them.
- Neutrals built from `gray-*` defaults with zero hue cast — every shade
  of gray is the same gray.
- Charts where every series uses a different saturated hue at the same
  lightness; categorical encoding becomes noise.
- Dark mode that is just a CSS `invert()` of the light mode.

## Rewrite protocol
1. **Audit the current palette.** List every color literal in the codebase
   (Tailwind classes, CSS custom properties, hex/rgb/hsl values). Group by
   role: ink, paper, neutral ramp, accent, semantic state, decorative.
2. **Cut the decoratives.** Every color whose role is "decorative" or
   "for visual interest" gets removed. If removal breaks the design, the
   design is leaning on color where hierarchy should carry the weight.
3. **Pick ink and paper deliberately.** Replace pure black with off-black
   in OKLCH (e.g. `oklch(20% 0.02 270)` for cool ink, `oklch(22% 0.03 60)`
   for warm ink). Replace pure white with off-white
   (e.g. `oklch(98% 0.005 270)`, `oklch(97% 0.01 80)`). Document the
   choice in `DESIGN.md`.
4. **Build the neutral ramp from ink.** Generate 5–9 perceptually uniform
   steps in OKLCH between ink and paper, holding hue (and a small chroma)
   constant. Tailwind: replace `gray` / `slate` / `zinc` with a custom
   scale named after the project (e.g. `tide`, `fog`, `slate-cool`).
5. **Pick one signature accent and assign its job.** Specify the accent's
   role in `DESIGN.md` (e.g. "cobalt = the primary action, the focused
   state, the brand signature — never a status color"). Ramp the accent
   in OKLCH for hover/active/selected states.
6. **Add semantic states only as needed.** Success, warning, error, info,
   ownership — each only if the product's UX surfaces that state. Each
   semantic color must be visually distinct from the signature accent.
7. **Replace raw Tailwind defaults with project tokens.** Configure
   `theme.colors` (or CSS custom properties) so application code uses
   `bg-action`, `text-ink`, `border-tide-300`, never `bg-blue-500`.
8. **Run the grayscale survival test.** Render every screen in grayscale;
   hierarchy must survive. If it doesn't, fix typography, weight, and
   spacing first.
9. **Re-derive dark mode in OKLCH.** Define dark-mode ink, paper, neutral
   ramp, and accent ramp from scratch — do not auto-invert.

## Quick pass/fail checklist
- [ ] No raw Tailwind default accent literal (`bg-blue-500`, `bg-red-500`,
      `bg-green-500`, `bg-purple-500`, `bg-pink-500`, `bg-indigo-500`,
      `bg-yellow-500`, `bg-emerald-500`) appears in shipped UI.
- [ ] Ink is off-black; paper is off-white. No pure `#000` / `#FFF` for
      default text/background.
- [ ] All neutrals carry a hue cast (no pure-gray scale).
- [ ] Exactly one signature accent; every other accent encodes a named
      semantic state.
- [ ] Every palette token has a documented job in `DESIGN.md`.
- [ ] Neutral and accent ramps are defined in OKLCH (or LCH).
- [ ] Saturation tapers from accent → semantic → neutral.
- [ ] No decorative gradients.
- [ ] UI hierarchy survives a grayscale render.
- [ ] Dark mode is re-derived, not inverted.

## Before/after mini examples

**Before (fail): Tailwind-default identity**
```tsx
// tailwind.config.js — no customization
// theme.colors uses defaults

<button className="bg-blue-500 hover:bg-blue-600 text-white">Save</button>
<span  className="bg-green-500 text-white px-2 rounded">Active</span>
<span  className="bg-red-500 text-white px-2 rounded">Error</span>
<header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
  Welcome
</header>
<body  className="bg-white text-black"> ... </body>
```
Five accents at near-identical saturation, decorative gradient, pure
black-on-white body, neutrals are raw Tailwind grays. Reads as
AI-generated on sight.

**After (pass): earned palette in OKLCH tokens**
```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      ink:    "oklch(22% 0.03 270)",  // off-black, cool cast
      paper:  "oklch(97% 0.01 80)",   // off-white, warm cast
      tide:   {                        // tinted neutral ramp
        50:  "oklch(96% 0.01 250)",
        300: "oklch(80% 0.02 250)",
        500: "oklch(58% 0.03 250)",
        700: "oklch(38% 0.04 250)",
        900: "oklch(22% 0.04 250)",
      },
      cobalt: "oklch(58% 0.18 255)",  // signature accent (action)
      signal: "oklch(60% 0.20 25)",   // semantic: risk
      sage:   "oklch(70% 0.10 145)",  // semantic: success
    },
  },
};
```
```tsx
<button className="bg-cobalt text-paper hover:bg-cobalt/90">Save</button>
<span  className="bg-signal/10 text-signal px-2">Blocked</span>
<header className="bg-paper text-ink"> Welcome </header>
<body  className="bg-paper text-ink"> ... </body>
```
One signature accent (`cobalt`) carries action and brand. Semantic states
(`signal`, `sage`) are visually distinct from the accent and from each
other. Neutrals (`tide`) are tinted, not pure gray. Ink and paper are
off-black and off-white. No decorative gradients. Every token has a
documented job in `DESIGN.md`.
