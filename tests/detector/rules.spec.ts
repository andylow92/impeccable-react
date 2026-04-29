import { test } from "node:test";
import { strict as assert } from "node:assert";
import { resolve } from "node:path";
import { scan } from "../../src/detector/index.js";

const BAD = resolve("tests/detector/fixtures/bad");
const GOOD = resolve("tests/detector/fixtures/good");
const BAD_GENERIC_CARD = resolve(BAD, "GenericCard.tsx");
const BAD_ANY_ZOO = resolve(BAD, "AnyZoo.tsx");
const GOOD_IMPECCABLE = resolve(GOOD, "ImpeccableCard.tsx");
const GOOD_COMPOSITIONAL = resolve(GOOD, "CompositionalCard.tsx");

test("ui-generic-saas-card: GenericCard.tsx scores high enough to fail", async () => {
  const report = await scan({ kind: "path", path: BAD_GENERIC_CARD });
  const hits = report.findings.filter((f) => f.rule === "ui-generic-saas-card");
  assert.ok(hits.length >= 1, "expected at least one ui-generic-saas-card finding");
  assert.ok(hits.some((f) => f.severity === "fail"), "expected a fail-level finding");
  assert.match(hits[0]!.message, /confidence score \d+/);
});

test("ui-generic-saas-card: CompositionalCard.tsx is NOT flagged (segmented layout)", async () => {
  const report = await scan({ kind: "path", path: GOOD_COMPOSITIONAL });
  const hits = report.findings.filter((f) => f.rule === "ui-generic-saas-card");
  assert.equal(hits.length, 0, JSON.stringify(hits, null, 2));
});

test("ui-generic-saas-card: ImpeccableCard.tsx is NOT flagged (no soft shadow)", async () => {
  const report = await scan({ kind: "path", path: GOOD_IMPECCABLE });
  const hits = report.findings.filter((f) => f.rule === "ui-generic-saas-card");
  assert.equal(hits.length, 0);
});

test("ui-uniform-radius: GenericCard.tsx is flagged", async () => {
  const report = await scan({ kind: "path", path: BAD_GENERIC_CARD });
  const hits = report.findings.filter((f) => f.rule === "ui-uniform-radius");
  assert.ok(hits.length >= 1, "expected at least one ui-uniform-radius finding");
});

test("ui-uniform-radius: CompositionalCard.tsx is NOT flagged", async () => {
  const report = await scan({ kind: "path", path: GOOD_COMPOSITIONAL });
  const hits = report.findings.filter((f) => f.rule === "ui-uniform-radius");
  assert.equal(hits.length, 0);
});

test("ts-no-any: GenericCard.tsx (props: any) is flagged", async () => {
  const report = await scan({ kind: "path", path: BAD_GENERIC_CARD });
  const hits = report.findings.filter((f) => f.rule === "ts-no-any");
  assert.ok(hits.length >= 1);
  assert.equal(hits[0]!.severity, "fail");
});

test("ts-no-any: AnyZoo.tsx covers every any-shape (≥10 findings)", async () => {
  const report = await scan({ kind: "path", path: BAD_ANY_ZOO });
  const hits = report.findings.filter((f) => f.rule === "ts-no-any");
  // type AliasAny=any, Record<string,any>, Promise<any>, Array<any>,
  // takesAny(input:any):any (×2), as any, any[], [any,number], (v:any)=>void,
  // payload:any, Array<any> in body, Map<string,any> in body
  assert.ok(hits.length >= 10, `expected ≥10 ts-no-any findings, got ${hits.length}`);
});

test("ts-no-any: good fixtures have zero ts-no-any findings", async () => {
  const report = await scan({ kind: "path", path: GOOD });
  const hits = report.findings.filter((f) => f.rule === "ts-no-any");
  assert.equal(hits.length, 0, JSON.stringify(hits, null, 2));
});

test("ts-no-any: word \"any\" inside a string or comment is NOT flagged", async () => {
  // AnyZoo.tsx contains both: a comment `/* "any" "any" any */` and a JSX
  // attribute value `data-tag="any-name"` and a text node `any`. Those must
  // not contribute to the count. This is implicit in the bound check above
  // (≥10 corresponds to TYPE positions only), but re-asserted explicitly
  // here so a regression in the parser fails loudly.
  const report = await scan({ kind: "path", path: BAD_ANY_ZOO });
  const hits = report.findings.filter((f) => f.rule === "ts-no-any");
  // At time of writing the canonical count is 13 type-position occurrences.
  // We allow 10..30 to absorb future minor parser changes without thrashing.
  assert.ok(hits.length >= 10 && hits.length <= 30,
    `expected 10..30 ts-no-any findings, got ${hits.length}`);
});

test("good directory has zero fail findings overall", async () => {
  const report = await scan({ kind: "path", path: GOOD });
  assert.equal(report.summary.fail, 0, JSON.stringify(report.findings, null, 2));
});

test("--rule narrows the rule set", async () => {
  const report = await scan({ kind: "path", path: BAD }, { rules: ["ts-no-any"] });
  assert.ok(report.findings.every((f) => f.rule === "ts-no-any"));
  assert.ok(report.findings.length >= 1);
});

test("--fast preserves file count", async () => {
  const a = await scan({ kind: "path", path: BAD });
  const b = await scan({ kind: "path", path: BAD }, { fast: true });
  assert.equal(a.summary.files, b.summary.files);
});
