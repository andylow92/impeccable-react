import type { Rule } from "./types.js";
import { uiUniformRadius } from "./ui-uniform-radius.js";
import { uiGenericSaasCard } from "./ui-generic-saas-card.js";
import { tsNoAny } from "./ts-no-any.js";

export const ALL_RULES: ReadonlyArray<Rule> = [
  uiUniformRadius,
  uiGenericSaasCard,
  tsNoAny,
];

export function findRule(id: string): Rule | undefined {
  return ALL_RULES.find((r) => r.id === id);
}
