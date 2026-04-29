import { type Rule, walkNodes, type DetectorNode } from "./types.js";

const SOFT_RADIUS = /\brounded-(?:xl|2xl|3xl)\b/;
const SHADOW = /\bshadow-(?:md|lg|xl)\b/;
const TEXT_CENTER = /\btext-center\b/;
const PILL = /\brounded-full\b/;

export const uiGenericSaasCard: Rule = {
  id: "ui-generic-saas-card",
  description:
    "rounded-2xl + soft shadow + centered heading + single CTA. The AI default.",
  defaultSeverity: "fail",
  appliesTo: ["tsx", "jsx", "html"],
  run(ctx) {
    walkNodes(ctx.doc.root, (node) => {
      if (node.kind !== "element") return;
      if (!isContainerTag(node.name)) return;
      const cls = node.attrs?.["className"] ?? node.attrs?.["class"] ?? "";
      if (!SOFT_RADIUS.test(cls) || !SHADOW.test(cls)) return;

      const headings = collectHeadings(node);
      const buttons = collectButtons(node);
      if (headings.length === 0 || buttons.length === 0) return;

      const centeredHeading = headings.some((h) => {
        const hcls = h.attrs?.["className"] ?? h.attrs?.["class"] ?? "";
        return TEXT_CENTER.test(hcls);
      });
      const pillButton = buttons.some((b) => {
        const bcls = b.attrs?.["className"] ?? b.attrs?.["class"] ?? "";
        return PILL.test(bcls);
      });
      if (!centeredHeading && !pillButton) return;

      ctx.emit({
        severity: "fail",
        message:
          "Generic SaaS card detected (soft radius + soft shadow + centered heading or pill CTA). Replace with compositional zones; use sharp radii on data surfaces and reserve soft radius for the outer panel only.",
        loc: node.loc,
        antiPattern: "generic-saas-card",
      });
    });
  },
};

function isContainerTag(name?: string): boolean {
  if (!name) return false;
  return name === "div" || name === "section" || name === "article";
}

function collectHeadings(node: DetectorNode): DetectorNode[] {
  const out: DetectorNode[] = [];
  walkNodes(node, (n) => {
    if (n.kind === "element" && /^h[1-6]$/i.test(n.name ?? "")) out.push(n);
  });
  return out;
}

function collectButtons(node: DetectorNode): DetectorNode[] {
  const out: DetectorNode[] = [];
  walkNodes(node, (n) => {
    if (n.kind === "element" && (n.name === "button" || n.name === "Button")) out.push(n);
  });
  return out;
}
