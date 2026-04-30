# Plan UX/UI structure before any code is written

# /impeccable shape

## Purpose
Produce a structural plan for a screen or flow before code is written.
Resolve hierarchy, regions, primary action, and state inventory so the
subsequent build cannot relapse into a generic SaaS template.

## Inputs
- `brief` (required, `string`): short description of the screen, feature, or
  flow to be designed.
- `target` (optional, `path`): repo or directory whose `DESIGN.md` should
  anchor the plan.

## Procedure
1. Read `DESIGN.md` if `target` is provided. Otherwise treat the brief as the
   sole authority and flag the absence.
2. Identify the primary user task and the single highest-priority element
   that supports it.
3. Inventory regions: header, action rail, detail panel, list, empty state,
   error state. For each region, decide whether it ships in v1.
4. Resolve type tiers (per `typography`) and the primary accent (per the
   project's `DESIGN.md`).
5. Inventory required interaction states (per `interaction-design`):
   default, hover, focus-visible, active, disabled, pending, success,
   failure, empty.
6. Draft microcopy stubs per `ux-writing`: primary button, error, empty.
7. Emit JSON that exactly matches the output schema. Code is not produced.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "shape-report-v1",
  "verdict": "pass",
  "plan": {
    "primaryTask": "Send an invoice",
    "primaryElement": "Display tier total + Send invoice action",
    "regions": [
      { "name": "header", "include": true, "purpose": "context: client + due date" }
    ],
    "tiers": ["label", "value", "display"],
    "accent": "cobalt",
    "states": ["default", "focus-visible", "pending", "success", "failure", "empty"],
    "microcopy": {
      "primaryButton": "Send invoice",
      "errorPrimary": "We couldn't reach the billing service. Retry, or contact support if the issue persists.",
      "emptyPrimary": "No invoices yet — send your first invoice to start tracking."
    }
  },
  "findings": []
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"shape-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `plan`: object; all keys shown are required.
- `plan.regions`: array; each entry has `name`, `include` (boolean),
  `purpose`.
- `plan.states`: array of string state names (no duplicates).
- `findings`: required array (use `[]` when none); standard finding shape
  used for missing inputs (e.g. `DESIGN.md` not present).

## Severity rubric
- `fail`: The brief does not name a primary task or primary element.
- `warn`: Plan resolves but `DESIGN.md` is missing, or a required state is
  not included.
- `pass`: Plan is complete and grounded in `DESIGN.md`.

## Example invocation + example output
Invocation:

```text
/impeccable shape brief="Invoice send screen for billing app" target=.
```

Example output:

```json
{
  "schemaVersion": "shape-report-v1",
  "verdict": "pass",
  "plan": {
    "primaryTask": "Send an invoice",
    "primaryElement": "Display tier total + Send invoice action",
    "regions": [
      { "name": "header", "include": true, "purpose": "context: client + due date" },
      { "name": "lineItems", "include": true, "purpose": "auditable totals" },
      { "name": "actionRail", "include": true, "purpose": "primary + secondary actions" }
    ],
    "tiers": ["label", "value", "display"],
    "accent": "cobalt",
    "states": ["default", "focus-visible", "pending", "success", "failure", "empty"],
    "microcopy": {
      "primaryButton": "Send invoice",
      "errorPrimary": "We couldn't reach the billing service. Retry, or contact support if the issue persists.",
      "emptyPrimary": "No invoices yet — send your first invoice to start tracking."
    }
  },
  "findings": []
}
```
