#!/usr/bin/env tsx
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { loadSkills } from "../src/skills/index.js";
import { loadCommands } from "../src/commands/index.js";
import { claudeCodeAdapter } from "../src/targets/claude-code.js";
import { codexAdapter } from "../src/targets/codex.js";

const ADAPTERS = [claudeCodeAdapter, codexAdapter];

function main(): void {
  const root = resolve(process.cwd());
  const skills = loadSkills(resolve(root, "skills"));
  const commands = loadCommands(resolve(root, "commands"));

  for (const adapter of ADAPTERS) {
    const outRoot = resolve(root, "dist", adapter.outDir);
    rmSync(outRoot, { recursive: true, force: true });

    const files = adapter.render({ skills, commands });
    for (const file of files) {
      const out = join(outRoot, file.path);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, file.contents, "utf8");
    }
    process.stdout.write(`✓ ${adapter.id}: ${files.length} file(s) → dist/${adapter.outDir}/\n`);
  }
}

main();
