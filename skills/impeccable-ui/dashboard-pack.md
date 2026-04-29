---
id: dashboard-pack
name: Dashboard Pack
version: 1.0.0
objective: Define a decisive dashboard UI pattern that prioritizes action and accountability.
---

# Dashboard Pack

## objective
Build dashboards that expose priority, ownership, and next actions within 3 seconds.

## hierarchy model
1. Screen objective bar (single sentence + primary action).
2. Decision-critical KPIs (top row, highest visual weight).
3. Owner + status lane (who owns what, blocked vs on-track).
4. Evidence layer (supporting charts/tables only when they alter decisions).
5. Background metadata (timestamps, tags, secondary notes).

## typography roles
- display-heading: page intent and decision context.
- value-primary: KPI values and major deltas.
- label-micro: uppercase support labels for scanability.
- body-support: annotations, caveats, and explanatory copy.
- status-inline: compact state tokens (risk, blocked, healthy).

## spacing rhythm
- Base rhythm token: 8px.
- Vertical section spacing: 32px (4x rhythm).
- Internal module padding: 16px (2x rhythm).
- Micro gaps between label/value pairs: 8px (1x rhythm).
- Dense table/list row height: 40px minimum.

## CTA strategy
- One primary CTA per viewport, visually dominant and high contrast.
- Secondary actions grouped in an action rail with reduced contrast.
- Destructive actions never colocated with primary CTA without separation.
- CTA labels start with a verb and imply outcome (e.g., "Resolve Blocker").

## anti-pattern watchlist
- Equal-weight cards with no dominant KPI.
- Charts without ownership or decision implication.
- Anonymous progress percentages.
- Uniform radius/shadow across every surface.
- Primary KPI rendered with muted text color.

## done criteria
- A new user can identify top priority and owner within 3 seconds.
- At least three text tiers are visible and distinct.
- Primary CTA is unambiguous and visually dominant.
- Spacing follows declared rhythm tokens without one-off pixel values.
- Every chart/table answers "what decision changes if this moves?".
