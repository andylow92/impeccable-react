#!/usr/bin/env tsx
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { loadSkills } from "../src/skills/index.js";
import { loadCommands } from "../src/commands/index.js";
import { ALL_RULES } from "../src/detector/rules/index.js";

type Problem = { kind: "error" | "warning"; where: string; message: string };

function main(): void {
  const root = resolve(process.cwd());
  const problems: Problem[] = [];

  const skillsDir = resolve(root, "skills");
  const commandsDir = resolve(root, "commands");

  if (!existsSync(skillsDir)) {
    problems.push({ kind: "error", where: "skills/", message: "missing skills directory" });
  }

  const skills = existsSync(skillsDir) ? loadSkills(skillsDir) : [];
  const commands = existsSync(commandsDir) ? loadCommands(commandsDir) : [];

  // 1) Skill ids unique.
  const skillIds = new Set<string>();
  for (const s of skills) {
    if (skillIds.has(s.id)) {
      problems.push({ kind: "error", where: s.sourcePath, message: `duplicate skill id: ${s.id}` });
    }
    skillIds.add(s.id);
  }

  // 2) Reference parents must match the containing skill.
  for (const s of skills) {
    for (const r of s.references) {
      if (r.parent !== s.id) {
        problems.push({
          kind: "error",
          where: r.sourcePath,
          message: `reference parent "${r.parent}" does not match containing skill "${s.id}"`,
        });
      }
    }
    // 3) References declared in skill frontmatter must exist on disk.
    const refIds = new Set(s.references.map((r) => r.id));
    for (const declared of s.declaredReferences) {
      if (!refIds.has(declared)) {
        problems.push({
          kind: "error",
          where: s.sourcePath,
          message: `references[${declared}] is declared but no references/${declared}.md exists`,
        });
      }
    }
  }

  // 4) Anti-pattern parents must match.
  for (const s of skills) {
    for (const ap of s.antiPatterns) {
      if (ap.parent !== s.id) {
        problems.push({
          kind: "error",
          where: ap.sourcePath,
          message: `anti-pattern parent "${ap.parent}" does not match containing skill "${s.id}"`,
        });
      }
    }
    const apIds = new Set(s.antiPatterns.map((ap) => ap.id));
    for (const declared of s.declaredAntiPatterns) {
      if (!apIds.has(declared)) {
        problems.push({
          kind: "error",
          where: s.sourcePath,
          message: `anti_patterns[${declared}] is declared but no anti-patterns/${declared}.md exists`,
        });
      }
    }
  }

  // 5) Rule <-> anti-pattern join.
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
          message: `detector_rule "${ap.detector_rule}" does not exist in src/detector/rules/`,
        });
      }
    }
  }
  for (const rule of ALL_RULES) {
    if (!antiPatternRules.has(rule.id)) {
      problems.push({
        kind: "warning",
        where: `src/detector/rules/${rule.id}.ts`,
        message: `rule "${rule.id}" has no matching anti-pattern markdown — every rule should explain itself in skills/<id>/anti-patterns/<x>.md`,
      });
    }
  }

  // 6) Commands referencing non-existent skills.
  for (const c of commands) {
    for (const skillId of c.uses_skills) {
      if (!skillIds.has(skillId)) {
        problems.push({
          kind: "error",
          where: c.sourcePath,
          message: `uses_skills references unknown skill "${skillId}"`,
        });
      }
    }
  }

  if (problems.length === 0) {
    process.stdout.write(
      `verify-skills: OK — ${skills.length} skill(s), ${commands.length} command(s), ${ALL_RULES.length} rule(s)\n`,
    );
    process.exit(0);
  }

  for (const p of problems) {
    const tag = p.kind === "error" ? "error" : "warn ";
    process.stderr.write(`[${tag}] ${p.where}: ${p.message}\n`);
  }
  const errCount = problems.filter((p) => p.kind === "error").length;
  process.exit(errCount > 0 ? 1 : 0);
}

main();
