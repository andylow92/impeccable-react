import { resolve } from "node:path";
import { existsSync } from "node:fs";
import type { TargetAdapter, TargetId, RenderedFile } from "./types.js";
import { claudeCodeAdapter } from "./claude-code.js";
import { codexAdapter } from "./codex.js";
import { loadSkills } from "../skills/index.js";
import { loadCommands } from "../commands/index.js";

export const ADAPTERS: ReadonlyArray<TargetAdapter> = [claudeCodeAdapter, codexAdapter];

export function findAdapter(id: string): TargetAdapter | undefined {
  return ADAPTERS.find((a) => a.id === (id as TargetId));
}

export async function renderTarget(id: string): Promise<string> {
  const adapter = findAdapter(id);
  if (!adapter) {
    return `unknown target: ${id}\nknown targets: ${ADAPTERS.map((a) => a.id).join(", ")}\n`;
  }
  const files = renderAdapterFiles(adapter);
  const lines: string[] = [];
  for (const f of files) {
    lines.push(`# ===== ${f.path} =====`);
    lines.push(f.contents);
    lines.push("");
  }
  return lines.join("\n");
}

export function renderAdapterFiles(adapter: TargetAdapter): RenderedFile[] {
  const cwd = resolve(process.cwd());
  const skillsDir = resolve(cwd, "skills");
  const commandsDir = resolve(cwd, "commands");
  const skills = existsSync(skillsDir) ? loadSkills(skillsDir) : [];
  const commands = existsSync(commandsDir) ? loadCommands(commandsDir) : [];
  return adapter.render({ skills, commands });
}

export type { TargetAdapter, TargetId } from "./types.js";
