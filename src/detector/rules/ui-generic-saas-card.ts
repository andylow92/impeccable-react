import { type Rule, walkNodes, type DetectorNode } from "./types.js";

/**
 * Detects the AI-default "generic SaaS card" pattern using a small
 * confidence score rather than a single OR over signals. The previous
 * version flagged any soft-radius + soft-shadow container that contained
 * a heading and a button, which produced false positives for legitimate
 * panel layouts (modals, marketing cards).
 *
 * Scoring:
 *   +2 BASE: container element with rounded-{xl,2xl,3xl} AND shadow-{md,lg,xl}
 *   +1 a heading inside has text-center
 *   +1 a button inside has rounded-full (pill button)
 *   +1 a child div is a decorative gradient bar (small height + bg-gradient-*)
 *   +1 the heading uses muted ink (text-gray-{500,600,700} on a light surface)
 *   +1 the outer container has both `mx-auto` and a `max-w-*` cap
 *      (the centered "demo" framing)
 *
 * Negative:
 *   -2 any descendant has `border-b`, `border-t`, `divide-x`, `divide-y`,
 *      OR contains a sibling group of mixed radii — the layout is
 *      compositional, not generic.
 *
 * Thresholds:
 *   score >= 4 → fail (it's the SaaS template)
 *   score >= 3 → warn (base + at least one smell signal; review)
 *   score <  3 → no finding (a plain rounded+shadow rectangle on its own
 *                is not enough to flag — it needs at least one of the
 *                positive signals above)
 */

const SOFT_RADIUS = /\brounded-(?:xl|2xl|3xl)\b/;
const SHADOW = /\bshadow-(?:md|lg|xl)\b/;
const TEXT_CENTER = /\btext-center\b/;
const PILL = /\brounded-full\b/;
const MUTED_HEADING_INK = /\btext-gray-(?:500|600|700)\b/;
const SMALL_HEIGHT = /\bh-(?:0\.5|1|1\.5|2|2\.5|3)\b/;
const GRADIENT_BG = /\bbg-gradient-(?:to-[trblxy]+|radial|conic)\b/;
const CONSTRAINED = /\bmx-auto\b/;
const MAX_WIDTH = /\bmax-w-(?:xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|prose|screen-[a-z0-9]+|\[[^\]]+\])\b/;
const SEGMENTED = /\b(?:border-[tb](?:-|\b)|border-y(?:-|\b)|divide-[xy](?:-|\b))/;

const CONTAINER_TAGS = new Set(["div", "section", "article", "main", "aside"]);
const BUTTON_NAMES = new Set(["button", "Button"]);

export const uiGenericSaasCard: Rule = {
  id: "ui-generic-saas-card",
  description:
    "rounded-{xl,2xl,3xl} + soft shadow + centered heading + pill CTA. The AI default.",
  defaultSeverity: "fail",
  appliesTo: ["tsx", "jsx", "html"],
  run(ctx) {
    walkNodes(ctx.doc.root, (node) => {
      if (node.kind !== "element") return;
      if (!CONTAINER_TAGS.has((node.name ?? "").toLowerCase())) return;
      const cls = clsOf(node);
      if (!SOFT_RADIUS.test(cls) || !SHADOW.test(cls)) return;

      const headings = collectByTag(node, (n) => /^h[1-6]$/i.test(n.name ?? ""));
      const buttons = collectByTag(node, (n) => BUTTON_NAMES.has(n.name ?? ""));
      const gradientBars = collectByTag(node, (n) => isGradientBar(n));

      let score = 2; // base condition

      if (headings.some((h) => TEXT_CENTER.test(clsOf(h)))) score += 1;
      if (buttons.some((b) => PILL.test(clsOf(b)))) score += 1;
      if (gradientBars.length > 0) score += 1;
      if (headings.some((h) => MUTED_HEADING_INK.test(clsOf(h)))) score += 1;
      if (CONSTRAINED.test(cls) && MAX_WIDTH.test(cls)) score += 1;

      // Negative: segmented layouts are compositional, not generic SaaS cards.
      if (hasSegmentedDescendants(node)) score -= 2;

      if (score >= 4) {
        ctx.emit({
          severity: "fail",
          message:
            `Generic SaaS card detected (confidence score ${score}). ` +
            "Replace with compositional zones: vary radii by surface kind, drop the centered title + pill CTA pattern, and reserve elevation for at most one surface per screen.",
          loc: node.loc,
          antiPattern: "generic-saas-card",
        });
      } else if (score >= 3) {
        ctx.emit({
          severity: "warn",
          message:
            `Possible generic-card pattern (confidence score ${score}). ` +
            "Review against the impeccable-ui preflight checklist; if hierarchy is unclear in 3 seconds, rewrite.",
          loc: node.loc,
          antiPattern: "generic-saas-card",
        });
      }
    });
  },
};

function clsOf(node: DetectorNode): string {
  return node.attrs?.["className"] ?? node.attrs?.["class"] ?? "";
}

function collectByTag(root: DetectorNode, predicate: (n: DetectorNode) => boolean): DetectorNode[] {
  const out: DetectorNode[] = [];
  walkNodes(root, (n) => {
    if (n === root) return;
    if (n.kind === "element" && predicate(n)) out.push(n);
  });
  return out;
}

function isGradientBar(node: DetectorNode): boolean {
  if (node.kind !== "element") return false;
  if ((node.name ?? "").toLowerCase() !== "div") return false;
  const cls = clsOf(node);
  return GRADIENT_BG.test(cls) && SMALL_HEIGHT.test(cls);
}

function hasSegmentedDescendants(root: DetectorNode): boolean {
  let found = false;
  walkNodes(root, (n) => {
    if (found) return;
    if (n === root) return;
    if (n.kind !== "element") return;
    if (SEGMENTED.test(clsOf(n))) found = true;
  });
  return found;
}
