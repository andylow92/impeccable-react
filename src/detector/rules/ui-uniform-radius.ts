import { type Rule, walkNodes } from "./types.js";

const RADIUS_CLASS = /\brounded(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?\b/g;
const MIN_CONTAINER_OCCURRENCES = 4;
const CONTAINER_TAGS = new Set(["div", "section", "article", "main", "aside"]);

export const uiUniformRadius: Rule = {
  id: "ui-uniform-radius",
  description:
    "Container elements share a single border-radius — hierarchy collapses. Vary radius by surface kind.",
  defaultSeverity: "warn",
  appliesTo: ["tsx", "jsx", "html"],
  run(ctx) {
    // Count radii ONLY on container elements, ignoring buttons/inputs/badges
    // which legitimately use distinct radii (e.g. rounded-full pills).
    const counts = new Map<string, { n: number; firstLoc: import("./types.js").SourceLoc }>();
    walkNodes(ctx.doc.root, (node) => {
      if (node.kind !== "element") return;
      const tag = (node.name ?? "").toLowerCase();
      if (!CONTAINER_TAGS.has(tag)) return;
      const cls = node.attrs?.["className"] ?? node.attrs?.["class"] ?? "";
      const matches = cls.match(RADIUS_CLASS);
      if (!matches) return;
      for (const m of matches) {
        const existing = counts.get(m);
        if (existing) existing.n += 1;
        else counts.set(m, { n: 1, firstLoc: node.loc });
      }
    });
    if (counts.size !== 1) return;
    const entry = [...counts.entries()][0];
    if (!entry) return;
    const [token, info] = entry;
    if (info.n < MIN_CONTAINER_OCCURRENCES) return;

    ctx.emit({
      severity: "warn",
      message: `Every container element uses "${token}" (${info.n} occurrences). Vary radius by surface kind: sharp for data tiles, soft for the outer panel only.`,
      loc: info.firstLoc,
      antiPattern: "uniform-radius",
    });
  },
};
