#!/usr/bin/env node
import { parseArgs } from "node:util";
import { writeFileSync } from "node:fs";
import { scan } from "./detector/index.js";
import { renderHuman } from "./detector/reporters/human.js";
import { renderJson } from "./detector/reporters/json.js";
import { renderTarget, ADAPTERS } from "./targets/index.js";
import { listRules, listCommands, listSkills, explainRule } from "./meta.js";
import { VERSION } from "./version.js";

type Sub = "scan" | "list" | "render" | "explain" | "help" | "version";

async function main(argv: string[]): Promise<number> {
  const [sub, ...rest] = argv;
  switch ((sub ?? "help") as Sub) {
    case "scan":
      return await runScan(rest);
    case "list":
      return runList(rest);
    case "render":
      return await runRender(rest);
    case "explain":
      return runExplain(rest);
    case "version":
      process.stdout.write(`${VERSION}\n`);
      return 0;
    case "help":
    default:
      printHelp();
      return 0;
  }
}

async function runScan(argv: string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        rule: { type: "string", multiple: true },
        severity: { type: "string", default: "warn" },
        strict: { type: "boolean", default: false },
        reporter: { type: "string", default: "human" },
        output: { type: "string" },
        fast: { type: "boolean", default: false },
        url: { type: "string" },
        "no-color": { type: "boolean", default: false },
      },
    });
  } catch (err) {
    process.stderr.write(`error: ${(err as Error).message}\n`);
    return 2;
  }
  const { values, positionals } = parsed;

  const target = values.url
    ? ({ kind: "url", url: values.url } as const)
    : positionals[0]
      ? ({ kind: "path", path: positionals[0] } as const)
      : null;
  if (!target) {
    process.stderr.write("usage: impeccable scan <path> [--rule id]... [--reporter human|json] [--strict] [--fast]\n");
    return 2;
  }

  let report;
  try {
    const ruleArg = values.rule as string[] | undefined;
    report = await scan(target, {
      ...(ruleArg ? { rules: ruleArg } : {}),
      fast: values.fast === true,
    });
  } catch (err) {
    process.stderr.write(`scan failed: ${(err as Error).message}\n`);
    return 2;
  }

  const reporter = values.reporter ?? "human";
  const useColor = !values["no-color"] && process.stdout.isTTY === true;
  let text: string;
  if (reporter === "json") text = renderJson(report);
  else if (reporter === "human") text = renderHuman(report, useColor);
  else {
    process.stderr.write(`unknown reporter: ${reporter}\n`);
    return 2;
  }

  if (values.output) writeFileSync(values.output, text);
  else process.stdout.write(text);

  const failed = report.summary.fail > 0 || (values.strict && report.summary.warn > 0);
  return failed ? 1 : 0;
}

function runList(argv: string[]): number {
  const what = argv[0];
  if (what === "rules") {
    for (const row of listRules()) printRow(row.id, row.description);
    return 0;
  }
  if (what === "commands") {
    for (const row of listCommands()) printRow(row.id, row.description);
    return 0;
  }
  if (what === "skills") {
    for (const row of listSkills()) printRow(row.id, row.description);
    return 0;
  }
  if (what === "targets") {
    for (const a of ADAPTERS) printRow(a.id, `→ dist/${a.outDir}/`);
    return 0;
  }
  process.stderr.write("usage: impeccable list <rules|commands|skills|targets>\n");
  return 2;
}

async function runRender(argv: string[]): Promise<number> {
  const target = argv[0];
  if (!target) {
    process.stderr.write(`usage: impeccable render <${ADAPTERS.map((a) => a.id).join("|")}>\n`);
    return 2;
  }
  process.stdout.write(await renderTarget(target));
  return 0;
}

function runExplain(argv: string[]): number {
  const id = argv[0];
  if (!id) {
    process.stderr.write("usage: impeccable explain <rule-id>\n");
    return 2;
  }
  process.stdout.write(explainRule(id));
  return 0;
}

function printRow(id: string, desc: string): void {
  const pad = id.padEnd(28);
  process.stdout.write(`${pad}${desc}\n`);
}

function printHelp(): void {
  process.stdout.write(
    [
      `impeccable ${VERSION}`,
      "",
      "usage:",
      "  impeccable scan <path> [--rule id]... [--reporter human|json] [--strict] [--fast]",
      "  impeccable list <rules|commands|skills|targets>",
      "  impeccable render <claude-code|codex>",
      "  impeccable explain <rule-id>",
      "  impeccable version",
      "",
    ].join("\n"),
  );
}

main(process.argv.slice(2)).then((code) => {
  process.exit(code);
});
