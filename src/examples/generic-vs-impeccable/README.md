# Before / After: Generic vs Impeccable

Two implementations of the same project card. Same data, opposite design posture.

## Files

- `GenericProjectCard.tsx` — the AI-default. Use only as a reference of what
  to reject. Read the comment block at the top of the file: it lists every
  smell, line by line.
- `ImpeccableProjectCard.tsx` — the rewrite. Read the comment block to see
  exactly what changed and why each change matters.

## Why the generic version feels generic

It is not "ugly". It is *anonymous*. Every component lives at the same visual
weight, every container has the same radius, every shadow does the same job.
The eye has nowhere to land, so the brain treats every element as filler.

Specifically:

1. **Centered title with a decorative gradient strip.** Communicates nothing.
   Could be on any SaaS dashboard ever shipped.
2. **Identical `rounded-2xl` everywhere.** When every container has the same
   radius, hierarchy collapses into a single texture.
3. **Identical `shadow-md` everywhere.** Shadow stops meaning "elevated" and
   starts meaning "rectangle".
4. **Stat tiles in `text-gray-500` on white.** Primary data rendered as
   incidental text. The user has to *hunt* for the value.
5. **A 67% progress bar.** Implies motion, hides accountability. Who is
   responsible for the 33%? What is blocked? Unanswerable from the bar alone.
6. **Pill button + ghost button stack.** The default Tailwind tutorial CTA
   pattern. Communicates no priority.

## Why the impeccable version feels intentional

Every element exists because it answers a question the user is about to ask.

1. **Accent rail on the left.** Encodes priority and tone (`authority` vs
   `risk`) before any text is read. The card has a *side*, not just a top.
2. **Two intentional radii.** `rounded-panel` for the outer surface,
   `rounded-sharp` for inner data tiles. The contrast makes hierarchy legible
   at a glance.
3. **One elevated surface.** Inner tiles use borders, not shadows. Elevation
   means "this is the page-level object", not "this is a rectangle".
4. **Three text tiers.** Slate micro-labels → ink-bold values → display
   heading. The reading order is built into the typography.
5. **Status-rail instead of a percentage.** Names the blocked milestone and
   its owner. Accountability is rendered, not abstracted into a number.
6. **State-driven CTA.** When the project is at risk, the rail flips to
   `risk` tone and the primary CTA becomes `critical: Escalate`. Color and
   shape are reinforcement, not decoration.

## How to use this in review

When reviewing AI-generated React UI, open both files side by side. Ask:

- Which one would a stakeholder mistake for "every other dashboard"?
- Which one tells you what to do next without reading the labels?

If the answer to the second question is "neither", you have a generic card.
Go to `skills/design.md` § 4 (Rewrite instruction) and start over.
