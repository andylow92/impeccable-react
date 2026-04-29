import type { TargetAdapter, RenderedFile } from "./types.js";
import type { LoadedSkill } from "../skills/index.js";
import type { LoadedCommand } from "../commands/index.js";

export const claudeCodeAdapter: TargetAdapter = {
  id: "claude-code",
  outDir: "claude-code",
  render({ skills, commands }): RenderedFile[] {
    const files: RenderedFile[] = [];

    for (const s of skills) {
      files.push({
        path: `.claude/skills/${s.id}/SKILL.md`,
        contents: skillMarkdown(s),
      });
      for (const r of s.references) {
        files.push({
          path: `.claude/skills/${s.id}/references/${r.id}.md`,
          contents: r.body,
        });
      }
      for (const ap of s.antiPatterns) {
        files.push({
          path: `.claude/skills/${s.id}/anti-patterns/${ap.id}.md`,
          contents: ap.body,
        });
      }
    }

    for (const c of commands) {
      files.push({
        path: `.claude/commands/${c.id}.md`,
        contents: commandMarkdown(c),
      });
    }

    return files;
  },
};

function skillMarkdown(s: LoadedSkill): string {
  const fm = [
    "---",
    `name: ${s.name}`,
    `description: ${s.summary}`,
    "---",
    "",
  ].join("\n");
  return fm + s.body.trimStart();
}

function commandMarkdown(c: LoadedCommand): string {
  const fm = [
    "---",
    `description: ${c.title}`,
    "---",
    "",
  ].join("\n");
  return fm + c.body.trimStart();
}
