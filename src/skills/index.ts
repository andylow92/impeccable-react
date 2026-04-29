import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "../util/frontmatter.js";
import {
  skillFrontmatter,
  referenceFrontmatter,
  antiPatternFrontmatter,
  type SkillFrontmatter,
  type ReferenceFrontmatter,
  type AntiPatternFrontmatter,
} from "./schema.js";

export type LoadedReference = ReferenceFrontmatter & { body: string; sourcePath: string };
export type LoadedAntiPattern = AntiPatternFrontmatter & { body: string; sourcePath: string };

export type LoadedSkill = Omit<SkillFrontmatter, "references" | "anti_patterns"> & {
  body: string;
  sourcePath: string;
  /** Hydrated reference docs found on disk under references/. */
  references: LoadedReference[];
  /** Hydrated anti-pattern docs found on disk under anti-patterns/. */
  antiPatterns: LoadedAntiPattern[];
  /** What the skill frontmatter declared (raw ids). */
  declaredReferences: string[];
  declaredAntiPatterns: string[];
};

export function loadSkills(rootDir: string): LoadedSkill[] {
  const skillDirs = readdirSync(rootDir)
    .filter((entry) => {
      const p = join(rootDir, entry);
      return statSync(p).isDirectory();
    })
    .sort();
  const loaded = skillDirs.map((dir) => loadSkill(join(rootDir, dir)));
  // Final sort by id to be filesystem-order independent.
  return loaded.sort((a, b) => a.id.localeCompare(b.id));
}

function loadSkill(dir: string): LoadedSkill {
  const skillPath = join(dir, "SKILL.md");
  const raw = readFileSync(skillPath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const fm = skillFrontmatter.parse(data);

  const references: LoadedReference[] = readDirSafe(join(dir, "references"))
    .map((file) => {
      const p = join(dir, "references", file);
      const src = readFileSync(p, "utf8");
      const { data: d, body: b } = parseFrontmatter(src);
      return { ...referenceFrontmatter.parse(d), body: b, sourcePath: p };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const antiPatterns: LoadedAntiPattern[] = readDirSafe(join(dir, "anti-patterns"))
    .map((file) => {
      const p = join(dir, "anti-patterns", file);
      const src = readFileSync(p, "utf8");
      const { data: d, body: b } = parseFrontmatter(src);
      return { ...antiPatternFrontmatter.parse(d), body: b, sourcePath: p };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const { references: declaredReferences, anti_patterns: declaredAntiPatterns, ...rest } = fm;

  return {
    ...rest,
    body,
    sourcePath: skillPath,
    references,
    antiPatterns,
    declaredReferences,
    declaredAntiPatterns,
  };
}

function readDirSafe(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}
