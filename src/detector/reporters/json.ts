import type { ScanReport } from "../pipeline.js";

export function renderJson(report: ScanReport): string {
  const payload = {
    schema: "impeccable-scan-report-v1",
    summary: report.summary,
    findings: report.findings,
  };
  return JSON.stringify(payload, null, 2) + "\n";
}
