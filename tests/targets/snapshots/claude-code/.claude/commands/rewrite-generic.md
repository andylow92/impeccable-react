---
description: Rewrite a generic UI using the strip → rank → tier protocol
---
# /impeccable rewrite-generic

You have been handed a UI that fails the Impeccable UI gate. Do not patch it.
Rewrite it using the protocol from `impeccable-ui` section 4.

## Procedure
1. **Strip.** Remove every shadow, gradient, rounded corner, and pill. Reduce
   the component to monochrome rectangles.
2. **Rank.** Identify the single most important element. Mark it. Rank
   everything else relative to it. Anything that doesn't earn a rank gets cut.
3. **Tier typography.** Three tiers: micro-label → value → display heading.
4. **Re-introduce contrast.** One accent color, on the highest-priority
   element and its action. Nowhere else.
5. **Re-introduce shape.** Sharp on data surfaces, soft on the outer panel
   only.
6. **Re-introduce shadow.** At most one elevated surface per screen.

## Output
A unified diff against the original file. No commentary outside the diff. If
the original cannot be salvaged inside its current footprint, output a full
replacement instead of a patch and say so in the first line of the response.
