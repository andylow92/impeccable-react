---
id: interaction-design
parent: impeccable-ui
summary: Every interactive element must show focus, state, and outcome unambiguously.
---

# Interaction design

## Intent
Interaction surfaces must declare what they are, where focus is, what state
they're in, and what happened after the user acted. Ambiguity in any of these
four answers is a defect.

## Non-negotiable rules
- Every interactive element must render a **visible `:focus-visible`** state
  with a focus ring at **≥ 3:1 contrast** against its surrounding surface.
  Never rely on `:hover` alone.
- Interactive elements must be reachable via keyboard in DOM order. Custom
  controls (divs/spans wired with `onClick`) must declare role, `tabIndex=0`,
  and key handlers for Enter and Space.
- Buttons must show **five distinct states**: default, hover, focus-visible,
  active/pressed, disabled. Each state must be visually distinguishable
  without relying on color alone.
- Form fields must surface validation **inline, next to the field**, with both
  an icon/symbol and text. Never use color alone (red border) to mean "error".
- Every async action must show a state for **pending**, **success**, and
  **failure**. A button that submits without changing label or affordance is
  a defect.
- Loading states resolved in under **300ms** must not flash a spinner;
  states longer than **1s** must show progress or a skeleton; states longer
  than **10s** must explain why.
- Destructive actions (delete, archive, irreversible writes) must require an
  explicit confirmation step or an undo affordance with a clear time window.
- Inputs must keep their **label visible** while the user types. Floating
  labels that disappear on focus break recall.

## Anti-patterns and failure cues
- Interactive cards or rows that have hover styling but no focus-visible ring.
- Buttons whose disabled state is "lighter blue" — same hue, no semantic shift.
- Forms that only color-flag errors and rely on submit-time validation.
- "Submit" buttons that stay in default state during a network call,
  enabling double-submission.
- Modal "Are you sure?" dialogs whose primary button is the destructive one
  styled identically to a standard primary action.
- Placeholder-only inputs (no persistent label) that lose context on focus.
- Custom dropdowns or tabs implemented with `<div onClick>` and no keyboard
  handlers.

## Rewrite protocol
1. Audit every interactive element for a `:focus-visible` style at ≥ 3:1.
   Add or fix the ring.
2. Walk the page with Tab and Shift+Tab. If focus order is illogical or skips
   a control, fix `tabIndex` and DOM order before styling anything else.
3. Specify all five button states. For disabled, change opacity + cursor
   AND remove hover/focus motion, not color alone.
4. Move form validation inline and pair every error with an icon + text
   message. Validate on blur for fields, on submit for the form.
5. For every async action, wire pending (label change + spinner + disabled),
   success (state confirmation), and failure (inline error with retry).
6. Apply the loading-time bands: 0–300ms (no spinner), 300ms–1s (spinner),
   1s–10s (progress or skeleton), >10s (explanation).
7. Add confirmation or undo to every destructive action. Differentiate the
   destructive primary button from a standard primary (color + label).
8. Convert any clickable `<div>` into a real `<button>`/`<a>`, or add role,
   `tabIndex`, and Enter/Space handlers.

## Quick pass/fail checklist
- [ ] Every interactive element shows a focus-visible ring at ≥ 3:1.
- [ ] Tab order matches visual reading order.
- [ ] Buttons render five distinct states (default / hover / focus / active /
      disabled).
- [ ] Form errors appear inline with icon + text, not color alone.
- [ ] Async actions have pending, success, and failure UI.
- [ ] Loading respects the 300ms / 1s / 10s bands.
- [ ] Destructive actions require confirmation or expose an undo.
- [ ] Input labels remain visible while typing.

## Before/after mini examples
**Before (fail): hover-only feedback, color-only error**
```tsx
<input
  className="border border-gray-300 hover:border-gray-400"
  placeholder="Email"
/>
{error && <input className="border-red-500" />}
<button className="bg-blue-500 hover:bg-blue-600" onClick={save}>Save</button>
```
No persistent label, no focus-visible ring, error signaled only by red border,
no pending/success/failure for `save`.

**After (pass): explicit states**
```tsx
<label className="block text-xs uppercase tracking-wide">Email</label>
<input
  className="border focus-visible:ring-2 focus-visible:ring-cobalt"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" className="flex items-center gap-1 text-signal">
    <ErrorIcon aria-hidden /> {error}
  </p>
)}
<button
  className="focus-visible:ring-2 disabled:opacity-50"
  disabled={pending}
  onClick={save}
>
  {pending ? "Saving…" : "Save"}
</button>
```
Persistent label, focus-visible ring, icon + text for errors, pending state on
the action.
