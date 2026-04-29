import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "../util/frontmatter.js";
import { commandFrontmatter, type CommandFrontmatter } from "./schema.js";

export type LoadedCommand = CommandFrontmatter & { body: string; sourcePath: string };

export function loadCommands(dir: string): LoadedCommand[] {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
  const loaded = files.map((file) => {
    const p = join(dir, file);
    const raw = readFileSync(p, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const fm = commandFrontmatter.parse(data);
    return { ...fm, body, sourcePath: p };
  });
  return loaded.sort((a, b) => a.id.localeCompare(b.id));
}
