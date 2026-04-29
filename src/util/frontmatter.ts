/**
 * Tiny YAML-frontmatter parser. Handles the subset we use:
 *   - top-level scalar keys: `key: value`
 *   - top-level block lists of scalars: `key:\n  - item\n  - item`
 *   - top-level block lists of mappings:
 *       key:
 *         - subkey: value
 *           subkey: value
 *         - subkey: value
 *   - quoted strings, numbers, booleans, null
 *
 * If the file has no frontmatter, returns an empty `data` object and the full
 * source as `body`.
 */

export type Frontmatter = {
  data: Record<string, unknown>;
  body: string;
};

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(source: string): Frontmatter {
  const match = source.match(FENCE);
  if (!match) return { data: {}, body: source };
  const yaml = match[1] ?? "";
  const body = source.slice(match[0].length);
  return { data: parseYamlSubset(yaml), body };
}

type Line = { indent: number; raw: string };

function tokenize(yaml: string): Line[] {
  const out: Line[] = [];
  for (const raw of yaml.split(/\r?\n/)) {
    if (raw.trim() === "" || raw.trimStart().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    out.push({ indent, raw });
  }
  return out;
}

function parseYamlSubset(yaml: string): Record<string, unknown> {
  const lines = tokenize(yaml);
  const out: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.indent !== 0) { i += 1; continue; }
    const m = line.raw.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) { i += 1; continue; }
    const key = m[1] as string;
    const rawVal = (m[2] ?? "").trim();

    if (rawVal === "" || rawVal === "[]") {
      const { items, next } = readList(lines, i + 1);
      out[key] = items;
      i = next;
      continue;
    }
    out[key] = parseScalar(rawVal);
    i += 1;
  }
  return out;
}

function readList(lines: Line[], start: number): { items: unknown[]; next: number } {
  const items: unknown[] = [];
  let i = start;
  let listIndent = -1;

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.indent === 0) break;
    const dashMatch = line.raw.slice(line.indent).match(/^-\s+(.*)$/);
    if (!dashMatch) break;
    if (listIndent === -1) listIndent = line.indent;
    if (line.indent !== listIndent) break;

    const after = (dashMatch[1] ?? "").trim();
    const kvMatch = after.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kvMatch) {
      items.push(parseScalar(after));
      i += 1;
      continue;
    }

    // Object item. Collect this k:v plus any following lines indented deeper
    // than the dash's indent + 2 (the column the keys sit at).
    const obj: Record<string, unknown> = {};
    const firstKey = kvMatch[1] as string;
    const firstVal = (kvMatch[2] ?? "").trim();
    obj[firstKey] = firstVal === "" ? "" : parseScalar(firstVal);
    i += 1;
    const childIndent = line.indent + 2;
    while (i < lines.length) {
      const child = lines[i]!;
      if (child.indent < childIndent) break;
      if (child.indent === listIndent) break;
      const ck = child.raw.slice(child.indent).match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
      if (!ck) { i += 1; continue; }
      obj[ck[1] as string] = parseScalar((ck[2] ?? "").trim());
      i += 1;
    }
    items.push(obj);
  }
  return { items, next: i };
}

function parseScalar(raw: string): unknown {
  const v = raw.trim();
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;
  if (/^-?\d+$/.test(v)) return Number(v);
  if (/^-?\d+\.\d+$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}
