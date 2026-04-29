import { type Rule, walkNodes } from "./types.js";

export const tsNoAny: Rule = {
  id: "ts-no-any",
  description: "`any` hides shape mismatches until runtime. Use `unknown` + a narrowing schema.",
  defaultSeverity: "fail",
  appliesTo: ["tsx", "ts"],
  run(ctx) {
    walkNodes(ctx.doc.root, (node) => {
      if (node.kind !== "ts-any") return;
      ctx.emit({
        severity: "fail",
        message: "Found `any`. Replace with `unknown` and narrow with a Zod schema or type guard.",
        loc: node.loc,
      });
    });
  },
};
