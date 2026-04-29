import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { ALL_RULES } from "./detector/rules/index.js";
import { loadCommands, type LoadedCommand } from "./commands/index.js";
import { loadSkills, type LoadedSkill } from "./skills/index.js";

export type Row = { id: string; description: string };

const ROOT = resolve(process.cwd());

export function listRules(): Row[] {
  return ALL_RULES.map((r) => ({ id: r.id, description: r.description }));
}

export function listCommands(): Row[] {
  const dir = resolve(ROOT, "commands");
  if (!existsSync(dir)) return [];
  return loadCommands(dir).map((c: LoadedCommand) => ({ id: c.id, description: c.title }));
}

export function listSkills(): Row[] {
  const dir = resolve(ROOT, "skills");
  if (!existsSync(dir)) return [];
  return loadSkills(dir).map((s: LoadedSkill) => ({ id: s.id, description: s.summary }));
}

export function explainRule(id: string): string {
  const rule = ALL_RULES.find((r) => r.id === id);
  if (!rule) return `unknown rule: ${id}\n`;

  const lines: string[] = [];
  lines.push(`# ${rule.id}`);
  lines.push("");
  lines.push(`severity: ${rule.defaultSeverity}`);
  lines.push(`applies to: ${rule.appliesTo.join(", ")}`);
  lines.push("");
  lines.push(rule.description);
  lines.push("");

  // Find matching anti-pattern by detector_rule join.
  const skillsDir = resolve(ROOT, "skills");
  if (existsSync(skillsDir)) {
    const skills = loadSkills(skillsDir);
    for (const skill of skills) {
      for (const ap of skill.antiPatterns) {
        if (ap.detector_rule === id) {
          lines.push(`## anti-pattern: ${ap.id}`);
          lines.push("");
          lines.push(readFileSync(ap.sourcePath, "utf8"));
          break;
        }
      }
    }
  }
  return lines.join("\n") + "\n";
}
