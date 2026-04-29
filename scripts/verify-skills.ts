#!/usr/bin/env tsx
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { loadSkills, type LoadedSkill } from "../src/skills/index.js";
import { loadCommands, type LoadedCommand } from "../src/commands/index.js";
import { ALL_RULES } from "../src/detector/rules/index.js";

type Problem = { kind: "error" | "warning"; where: string; field?: string; message: string };

const REQUIRED_REFERENCE_SECTIONS = [
  "Intent",
  "Non-negotiable rules",
  "Anti-patterns and failure cues",
  "Rewrite protocol",
  "Quick pass/fail checklist",
  "Before/after mini examples",
] as const;

const REQUIRED_COMMAND_SECTIONS = [
  "Purpose",
  "Inputs",
  "Procedure",
  "Output schema",
  "Severity rubric",
  "Example invocation + example output",
] as const;

function main(): void {
  const root = resolve(process.cwd());
  const problems: Problem[] = [];

  const skillsDir = resolve(root, "skills");
  const commandsDir = resolve(root, "commands");

  if (!existsSync(skillsDir)) {
    problems.push({ kind: "error", where: "skills/", message: "missing skills directory" });
  }

  const skills: LoadedSkill[] = existsSync(skillsDir) ? loadSkills(skillsDir) : [];
  const commands: LoadedCommand[] = existsSync(commandsDir) ? loadCommands(commandsDir) : [];

  // 1) Skill ids unique.
  const seenSkillIds = new Set<string>();
  for (const s of skills) {
    if (seenSkillIds.has(s.id)) {
      problems.push({
        kind: "error",
        where: s.sourcePath,
        field: "id",
        message: `duplicate skill id: ${s.id}`,
      });
    }
    seenSkillIds.add(s.id);
  }

  // 2) Reference parents must match the containing skill, and declared
  //    references in skill frontmatter must exist on disk.
  const allReferenceIds = new Set<string>();
  for (const s of skills) {
    for (const r of s.references) {
      allReferenceIds.add(r.id);
      if (r.parent !== s.id) {
        problems.push({
          kind: "error",
          where: r.sourcePath,
          field: "parent",
          message: `parent "${r.parent}" does not match containing skill "${s.id}"`,
        });
      }
    }
    const refIds = new Set(s.references.map((r) => r.id));
    for (const declared of s.declaredReferences) {
      if (!refIds.has(declared)) {
        problems.push({
          kind: "error",
          where: s.sourcePath,
          field: `references[${declared}]`,
          message: `is declared but no references/${declared}.md exists`,
        });
      }
    }
  }

  // 3) Anti-pattern parents must match, declared anti-patterns must exist.
  for (const s of skills) {
    for (const ap of s.antiPatterns) {
      if (ap.parent !== s.id) {
        problems.push({
          kind: "error",
          where: ap.sourcePath,
          field: "parent",
          message: `parent "${ap.parent}" does not match containing skill "${s.id}"`,
        });
      }
    }
    const apIds = new Set(s.antiPatterns.map((ap) => ap.id));
    for (const declared of s.declaredAntiPatterns) {
      if (!apIds.has(declared)) {
        problems.push({
          kind: "error",
          where: s.sourcePath,
          field: `anti_patterns[${declared}]`,
          message: `is declared but no anti-patterns/${declared}.md exists`,
        });
      }
    }
  }

  // 4) Rule <-> anti-pattern join. Both directions are errors now.
  const ruleIds = new Set(ALL_RULES.map((r) => r.id));
  const antiPatternRules = new Set<string>();
  for (const s of skills) {
    for (const ap of s.antiPatterns) {
      if (!ap.detector_rule) continue;
      antiPatternRules.add(ap.detector_rule);
      if (!ruleIds.has(ap.detector_rule)) {
        problems.push({
          kind: "error",
          where: ap.sourcePath,
          field: "detector_rule",
          message: `"${ap.detector_rule}" does not exist in src/detector/rules/`,
        });
      }
    }
  }
  for (const rule of ALL_RULES) {
    if (!antiPatternRules.has(rule.id)) {
      problems.push({
        kind: "error",
        where: `src/detector/rules/${rule.id}.ts`,
        field: "anti-pattern join",
        message: `rule "${rule.id}" has no anti-pattern markdown — every rule must point to skills/<id>/anti-patterns/<x>.md (set its detector_rule field)`,
      });
    }
  }

  // 5) Commands referencing non-existent skills or unknown reference ids.
  for (const c of commands) {
    for (const skillId of c.uses_skills) {
      if (!seenSkillIds.has(skillId)) {
        problems.push({
          kind: "error",
          where: c.sourcePath,
          field: "uses_skills",
          message: `references unknown skill "${skillId}"`,
        });
      }
    }
    for (const refId of c.uses_references) {
      if (!allReferenceIds.has(refId)) {
        problems.push({
          kind: "error",
          where: c.sourcePath,
          field: "uses_references",
          message: `references unknown reference "${refId}" — known ids: ${[...allReferenceIds].sort().join(", ") || "(none)"}`,
        });
      }
    }
  }

  // 6) Reference markdown section set + order.
  for (const s of skills) {
    for (const r of s.references) {
      validateRequiredSections({
        problems,
        where: r.sourcePath,
        body: r.body,
        requiredSections: REQUIRED_REFERENCE_SECTIONS,
      });
    }
  }

  // 7) Command markdown section set + order.
  for (const c of commands) {
    validateRequiredSections({
      problems,
      where: c.sourcePath,
      body: c.body,
      requiredSections: REQUIRED_COMMAND_SECTIONS,
    });
  }

  if (problems.length === 0) {
    process.stdout.write(
      `verify-skills: OK — ${skills.length} skill(s), ${commands.length} command(s), ${ALL_RULES.length} rule(s)\n`,
    );
    process.exit(0);
  }

  for (const p of problems) {
    const tag = p.kind === "error" ? "error" : "warn ";
    const field = p.field ? ` [${p.field}]` : "";
    process.stderr.write(`[${tag}] ${p.where}${field}: ${p.message}\n`);
  }
  const errCount = problems.filter((p) => p.kind === "error").length;
  process.exit(errCount > 0 ? 1 : 0);
}

function collectHeadings(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

function validateRequiredSections({
  problems,
  where,
  body,
  requiredSections,
}: {
  problems: Problem[];
  where: string;
  body: string;
  requiredSections: readonly string[];
}): void {
  const headings = collectHeadings(body);
  const positions = new Map<string, number>();
  headings.forEach((h, idx) => {
    if (!positions.has(h)) positions.set(h, idx);
  });

  for (const section of requiredSections) {
    if (!positions.has(section)) {
      problems.push({
        kind: "error",
        where,
        field: "sections",
        message: `missing required section "${section}"`,
      });
    }
  }

  let previousPos = -1;
  for (const section of requiredSections) {
    const pos = positions.get(section);
    if (pos === undefined) continue;
    if (pos < previousPos) {
      problems.push({
        kind: "error",
        where,
        field: "sections",
        message: `out-of-order section "${section}"`,
      });
    } else {
      previousPos = pos;
    }
  }
}

main();
