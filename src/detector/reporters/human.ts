import type { ScanReport } from "../pipeline.js";
import type { Finding } from "../rules/types.js";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

export function renderHuman(report: ScanReport, useColor: boolean): string {
  const c = useColor ? COLORS : { reset: "", red: "", yellow: "", cyan: "", dim: "", bold: "" };
  if (report.findings.length === 0) {
    return `${c.dim}no findings — ${report.summary.files} file(s) scanned${c.reset}\n`;
  }
  const grouped = new Map<string, Finding[]>();
  for (const f of report.findings) {
    const arr = grouped.get(f.loc.file) ?? [];
    arr.push(f);
    grouped.set(f.loc.file, arr);
  }
  const lines: string[] = [];
  for (const [file, findings] of grouped) {
    lines.push(`${c.bold}${file}${c.reset}`);
    for (const f of findings) {
      const sev = f.severity === "fail"
        ? `${c.red}fail${c.reset}`
        : f.severity === "warn"
          ? `${c.yellow}warn${c.reset}`
          : `${c.cyan}info${c.reset}`;
      lines.push(`  ${sev} ${c.dim}${f.loc.line}:${f.loc.column}${c.reset} ${f.rule}`);
      lines.push(`       ${f.message}`);
      if (f.antiPattern) lines.push(`       ${c.dim}see anti-pattern: ${f.antiPattern}${c.reset}`);
    }
    lines.push("");
  }
  const summary = `${c.bold}summary:${c.reset} ${c.red}${report.summary.fail} fail${c.reset} · ${c.yellow}${report.summary.warn} warn${c.reset} · ${c.dim}${report.summary.info} info · ${report.summary.files} file(s)${c.reset}`;
  lines.push(summary);
  return lines.join("\n") + "\n";
}
