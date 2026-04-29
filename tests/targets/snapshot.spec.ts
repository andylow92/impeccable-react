import { test } from "node:test";
import { strict as assert } from "node:assert";
import { resolve, dirname, join } from "node:path";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { loadSkills } from "../../src/skills/index.js";
import { loadCommands } from "../../src/commands/index.js";
import { claudeCodeAdapter } from "../../src/targets/claude-code.js";
import { codexAdapter } from "../../src/targets/codex.js";
import type { TargetAdapter } from "../../src/targets/types.js";

const SNAPSHOT_ROOT = resolve("tests/targets/snapshots");
const UPDATE = process.env["UPDATE_SNAPSHOTS"] === "1";

const SKILLS = loadSkills(resolve("skills"));
const COMMANDS = loadCommands(resolve("commands"));

for (const adapter of [claudeCodeAdapter, codexAdapter] as const satisfies ReadonlyArray<TargetAdapter>) {
  test(`${adapter.id}: emits stable file paths in deterministic order`, () => {
    const a = adapter.render({ skills: SKILLS, commands: COMMANDS });
    const b = adapter.render({ skills: SKILLS, commands: COMMANDS });
    assert.deepEqual(
      a.map((f) => f.path),
      b.map((f) => f.path),
      "adapter must produce the same path list across two runs",
    );
    for (let i = 0; i < a.length; i++) {
      assert.equal(a[i]!.contents, b[i]!.contents, `contents drift at ${a[i]!.path}`);
    }
  });

  test(`${adapter.id}: matches stored snapshot (set UPDATE_SNAPSHOTS=1 to refresh)`, () => {
    const files = adapter.render({ skills: SKILLS, commands: COMMANDS });
    const snapshotDir = join(SNAPSHOT_ROOT, adapter.id);

    if (UPDATE) {
      // Wipe and rewrite the snapshot.
      rmrf(snapshotDir);
      for (const f of files) {
        const out = join(snapshotDir, f.path);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, f.contents, "utf8");
      }
      return;
    }

    const expectedPaths = listFilesRel(snapshotDir).sort();
    const actualPaths = files.map((f) => f.path).sort();
    assert.deepEqual(
      actualPaths,
      expectedPaths,
      `path set drift for ${adapter.id} — re-run with UPDATE_SNAPSHOTS=1 if intentional`,
    );

    for (const f of files) {
      const expectedPath = join(snapshotDir, f.path);
      assert.ok(existsSync(expectedPath), `missing snapshot: ${expectedPath}`);
      const expected = readFileSync(expectedPath, "utf8");
      assert.equal(
        f.contents,
        expected,
        `content drift at ${adapter.id}/${f.path} — re-run with UPDATE_SNAPSHOTS=1 if intentional`,
      );
    }
  });
}

function listFilesRel(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else out.push(p.slice(root.length + 1));
    }
  }
  walk(root);
  return out;
}

function rmrf(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}
