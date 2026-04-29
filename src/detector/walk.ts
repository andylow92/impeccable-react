import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type DiscoveredFile = {
  absPath: string;
  relPath: string;
  language: "tsx" | "jsx" | "ts" | "js";
};

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".next",
  ".turbo",
  ".cache",
  "coverage",
]);

const EXT_TO_LANG: Record<string, DiscoveredFile["language"]> = {
  ".tsx": "tsx",
  ".jsx": "jsx",
  ".ts": "ts",
  ".js": "js",
};

export function discover(input: string): DiscoveredFile[] {
  const stat = statSync(input);
  if (stat.isFile()) {
    const lang = languageFor(input);
    if (!lang) return [];
    return [{ absPath: input, relPath: input, language: lang }];
  }
  const out: DiscoveredFile[] = [];
  walkDir(input, input, out);
  return out;
}

function walkDir(root: string, dir: string, out: DiscoveredFile[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(root, p, out);
      continue;
    }
    if (!entry.isFile()) continue;
    const lang = languageFor(p);
    if (!lang) continue;
    out.push({ absPath: p, relPath: relative(root, p) || entry.name, language: lang });
  }
}

function languageFor(file: string): DiscoveredFile["language"] | null {
  const ext = file.slice(file.lastIndexOf("."));
  return EXT_TO_LANG[ext] ?? null;
}

export function readSource(file: string): string {
  return readFileSync(file, "utf8");
}
