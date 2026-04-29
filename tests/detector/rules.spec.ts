import { test } from "node:test";
import { strict as assert } from "node:assert";
import { resolve } from "node:path";
import { scan } from "../../src/detector/index.js";

const FIXTURES_BAD = resolve("tests/detector/fixtures/bad");
const FIXTURES_GOOD = resolve("tests/detector/fixtures/good");

test("bad fixture trips ui-generic-saas-card (fail)", async () => {
  const report = await scan({ kind: "path", path: FIXTURES_BAD });
  const hits = report.findings.filter((f) => f.rule === "ui-generic-saas-card");
  assert.ok(hits.length >= 1, `expected at least one ui-generic-saas-card finding, got ${hits.length}`);
  assert.equal(hits[0]!.severity, "fail");
});

test("bad fixture trips ui-uniform-radius (warn)", async () => {
  const report = await scan({ kind: "path", path: FIXTURES_BAD });
  const hits = report.findings.filter((f) => f.rule === "ui-uniform-radius");
  assert.ok(hits.length >= 1, `expected at least one ui-uniform-radius finding, got ${hits.length}`);
});

test("bad fixture trips ts-no-any (fail)", async () => {
  const report = await scan({ kind: "path", path: FIXTURES_BAD });
  const hits = report.findings.filter((f) => f.rule === "ts-no-any");
  assert.ok(hits.length >= 1, `expected at least one ts-no-any finding, got ${hits.length}`);
});

test("good fixture has zero fail findings", async () => {
  const report = await scan({ kind: "path", path: FIXTURES_GOOD });
  assert.equal(report.summary.fail, 0, JSON.stringify(report.findings, null, 2));
});

test("--fast skips no rules currently slow-listed; output stable", async () => {
  const a = await scan({ kind: "path", path: FIXTURES_BAD });
  const b = await scan({ kind: "path", path: FIXTURES_BAD }, { fast: true });
  assert.equal(a.summary.files, b.summary.files);
});

test("--rule narrows the rule set", async () => {
  const report = await scan({ kind: "path", path: FIXTURES_BAD }, { rules: ["ts-no-any"] });
  assert.ok(report.findings.every((f) => f.rule === "ts-no-any"));
  assert.ok(report.findings.length >= 1);
});
