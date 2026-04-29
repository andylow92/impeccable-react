import { discover, readSource } from "./walk.js";
import { parseTsx, parseTs } from "./parsers/tsx.js";
import { runRules, type ScanReport, type RunRulesOptions } from "./pipeline.js";
import type { Document } from "./rules/types.js";

export type ScanInput =
  | { kind: "path"; path: string }
  | { kind: "url"; url: string };

export type ScanOptions = RunRulesOptions;

export async function scan(input: ScanInput, opts: ScanOptions = {}): Promise<ScanReport> {
  if (input.kind === "url") {
    throw new Error("URL mode is not implemented in this MVP slice. Use --path for now.");
  }
  const files = discover(input.path);
  const docs: Document[] = files.map((f) => {
    const src = readSource(f.absPath);
    if (f.language === "tsx" || f.language === "jsx") return parseTsx(f.absPath, src);
    return parseTs(f.absPath, src);
  });
  return runRules(docs, opts);
}

export type { ScanReport } from "./pipeline.js";
export type { Finding, Severity, Rule } from "./rules/types.js";
