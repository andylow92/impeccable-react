import type { Document, Finding, Rule, Severity } from "./rules/types.js";
import { ALL_RULES, findRule } from "./rules/index.js";

export type ScanReport = {
  findings: Finding[];
  summary: { fail: number; warn: number; info: number; files: number };
};

export type RunRulesOptions = {
  rules?: string[];
  fast?: boolean;
  overrides?: Record<string, Severity | "off">;
};

const SLOW_RULES = new Set<string>(["ui-template-density", "ui-low-contrast-tokens"]);

export function runRules(docs: Document[], opts: RunRulesOptions = {}): ScanReport {
  const enabled: ReadonlyArray<Rule> = opts.rules
    ? opts.rules
        .map((id) => findRule(id))
        .filter((r): r is Rule => Boolean(r))
    : ALL_RULES;
  const rules = opts.fast ? enabled.filter((r) => !SLOW_RULES.has(r.id)) : enabled;

  const findings: Finding[] = [];
  for (const doc of docs) {
    for (const rule of rules) {
      if (!rule.appliesTo.includes(doc.language)) continue;
      const override = opts.overrides?.[rule.id];
      if (override === "off") continue;
      rule.run({
        doc,
        emit: (f) => {
          findings.push({
            rule: rule.id,
            severity: override ?? f.severity,
            message: f.message,
            loc: f.loc,
            ...(f.fix ? { fix: f.fix } : {}),
            ...(f.antiPattern ? { antiPattern: f.antiPattern } : {}),
          });
        },
        options: {},
      });
    }
  }

  return {
    findings,
    summary: {
      fail: findings.filter((f) => f.severity === "fail").length,
      warn: findings.filter((f) => f.severity === "warn").length,
      info: findings.filter((f) => f.severity === "info").length,
      files: docs.length,
    },
  };
}
