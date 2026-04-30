---
id: tailwind-default-palette
parent: impeccable-ui
severity: fail
summary: Brand identity carried by raw Tailwind default colors (blue-500, red-500, green-500, purple-500) — the AI-generated tell.
---

# Anti-pattern: Tailwind default palette

## Why this appears in AI output
The Tailwind default palette is the most-frequent color reference in AI
training data: tutorials, marketing pages, dashboards, starter kits, and
component libraries all reach for `blue-500` as the primary, `green-500`
for success, `red-500` for danger, and `purple-500` / `pink-500` for
"make it pop." When asked to generate UI, models default to the same six
saturated hues over `bg-white` and `text-black`, plus a `from-purple-500
to-pink-500` gradient for the hero. The result looks generated because it
*was* — by the same statistical pull, every time.

## Why it harms UX
- **No identity.** The product becomes visually indistinguishable from
  every other AI-generated landing page, dashboard, and SaaS template.
- **No semantics.** Saturated reds and greens scattered as decoration train
  the user to ignore them when they actually *do* mean error or success.
- **Hierarchy carried by color.** Five competing accents at the same
  lightness defeat scanning; the eye has nothing to anchor on.
- **Accessibility drift.** Defaults like `text-gray-400` on `bg-white`
  fail body-text contrast (≈2.8:1, below the 4.5:1 floor) yet ship
  routinely.
- **Dark mode breaks.** Pure black + pure white inverted produces glare
  in dark mode; OKLCH-derived palettes survive the transition.

## How to detect manually in <30s
- Search the codebase for any of: `bg-blue-500`, `bg-red-500`,
  `bg-green-500`, `bg-purple-500`, `bg-pink-500`, `bg-indigo-500`,
  `bg-yellow-500`, `bg-emerald-500`. If the dominant accent or any
  shipped CTA uses one as a literal, the palette is generic.
- Search for `from-*-500 to-*-500` (Tailwind gradient utilities). If a
  decorative gradient ships outside a state encoding, the palette is
  generic.
- Inspect `tailwind.config.js`. If `theme.colors` is unset or only adds
  a single extra hue alongside the defaults, the palette has not been
  designed.
- Check the body element. If background is `bg-white` and text is
  `text-black` (or `text-gray-900` on `bg-white`), ink/paper were never
  chosen.
- Render the screen in grayscale (browser devtools → emulate vision
  deficiencies → achromatopsia). If hierarchy disappears, color was
  carrying the work.

## How to rewrite (numbered steps)
1. List every Tailwind default color literal in the codebase. Group by
   role: ink, paper, neutral, accent, semantic state.
2. Customize `tailwind.config.js` `theme.colors`. Define `ink`, `paper`,
   a tinted neutral ramp (named after the project — `tide`, `fog`,
   `dune`), one signature accent, and 0–4 semantic states. Use OKLCH
   values so the ramps are perceptually uniform.
3. Replace every `bg-blue-500` (and friends) call site with the
   corresponding semantic token (`bg-action`, `bg-signal`, `bg-sage`).
4. Replace `bg-white` / `text-black` body styling with `bg-paper` /
   `text-ink`.
5. Remove every decorative gradient. Keep gradients only when they
   encode a state (progress, severity).
6. Re-render every screen in grayscale; verify hierarchy survives. If
   it doesn't, raise typography weight and contrast first, then restore
   color.
7. Re-derive dark mode in OKLCH. Do not rely on `dark:` inversions of
   light-mode default literals.

## One compact bad→good snippet
```tsx
// Bad — Tailwind default palette as identity
<header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
  Welcome
</header>
<button  className="bg-blue-500 hover:bg-blue-600 text-white">Save</button>
<span    className="bg-green-500 text-white">Active</span>
<span    className="bg-red-500   text-white">Error</span>

// Good — earned palette
<header className="bg-paper text-ink">Welcome</header>
<button  className="bg-cobalt text-paper hover:bg-cobalt/90">Save</button>
<span    className="bg-sage/10 text-sage">Active</span>
<span    className="bg-signal/10 text-signal">Error</span>
```
The "good" version assumes `tailwind.config.js` defines `paper`, `ink`,
`cobalt`, `sage`, `signal` in OKLCH (see `palette-design.md`). The
header drops the decorative gradient. Status colors live in their
own muted variants (`bg-sage/10`, `bg-signal/10`) rather than competing
with the action accent.

## Detector mapping
Coverage: manual-only (current release)

A future detector rule could pattern-match against `bg-(blue|red|green|
purple|pink|indigo|yellow|emerald)-(400|500|600)` literals in `.tsx`/
`.jsx`/`.html` source. Until then, this is enforced by `/impeccable
critique` and `/impeccable colorize`.

## Related
- `palette-design`
- `color-contrast`
- `generic-saas-card`
