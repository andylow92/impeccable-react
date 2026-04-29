---
id: ux-writing
parent: impeccable-ui
summary: Microcopy must name the action, the state, and the next step.
---

# UX writing

## Intent
Every label, error, empty state, and confirmation is interface. Microcopy
must let a user predict what will happen, recognize what did happen, and
recover when it didn't. Decoration words ("Awesome!", "Oops!") are noise.

## Non-negotiable rules
- **Buttons name the action**, not the location. Prefer "Save changes",
  "Delete project", "Send invite" over "Submit", "OK", "Continue".
- **Verbs lead.** Action labels begin with a verb. Toggles describe the
  state they will produce, not the current state.
- **Errors explain what to do next.** Every error states (a) what is wrong,
  (b) which field/scope it applies to, (c) the corrective action. Never end
  on the failure.
- **Empty states are specific.** Replace "No data" with the entity, the
  reason, and the primary action ("No invoices yet — send your first invoice").
- **Don't apologize.** No "Oops!", "Whoops", "Something went wrong" without
  the actual reason or a retry path.
- **Numbers, dates, and units are unambiguous.** Always show timezone, currency,
  and unit. "12:00" is a defect; "12:00 PT" is acceptable.
- **Ban filler.** No "Please", "Just", "Simply", "Easily", "Quickly". Cut
  them on sight.
- **Title-case is for product nouns.** Sentence case for everything else
  (buttons, labels, sections).
- **Use the user's noun.** If the product calls them "projects", do not
  switch to "items", "entries", or "things" in the same flow.
- **Plural and gender are neutral.** Prefer "they" and pluralize. Do not
  assume the user's role from their name or email domain.

## Anti-patterns and failure cues
- Buttons labeled "Submit", "OK", "Continue", "Done" without context.
- Error toasts that say "Something went wrong. Please try again." with no
  reason and no retry.
- Empty states that say "Nothing here" or "No data".
- Tooltips that restate the visible label ("Save — saves the project").
- Decorative emoji or "!" in serious failure paths.
- Validation that fires before the user finishes typing.
- Mixing "log in" / "sign in" / "login" in the same flow.
- Time without timezone, prices without currency, distances without unit.

## Rewrite protocol
1. Replace every generic button label with a verb + object pair that names
   the outcome.
2. Audit every error message. Add the cause and the corrective action.
   Add a retry control if the failure is transient.
3. Audit every empty state. Add the entity, the reason it is empty, and the
   primary action that resolves it.
4. Strip filler words ("just", "simply", "easily", "please") from the entire
   copy pass.
5. Confirm sentence case for UI labels and title case only for product nouns.
6. Standardize the user's nouns. Pick one term per concept and replace
   synonyms across screens.
7. Add timezone, currency, and unit to every number that has one.
8. Replace decorative phrases ("Awesome!", "You did it!") with specific
   confirmations ("Invoice sent to maya@acme.com").

## Quick pass/fail checklist
- [ ] Every button label is a verb + object that names the outcome.
- [ ] Every error states what is wrong, where, and what to do next.
- [ ] Every empty state names the entity, the reason, and the primary action.
- [ ] No "Submit", "OK", "Oops", "Just", "Simply", "Please" in the build.
- [ ] Sentence case for UI; title case only for product nouns.
- [ ] One term per concept across the flow.
- [ ] Numbers/dates show timezone, currency, and unit.
- [ ] Confirmations are specific, not decorative.

## Before/after mini examples
**Before (fail): generic, apologetic, decorative**
```text
Button: Submit
Empty:  No data
Error:  Oops! Something went wrong. Please try again.
Toast:  Awesome! 🎉
```

**After (pass): specific, actionable, neutral**
```text
Button: Send invoice
Empty:  No invoices yet — send your first invoice to start tracking.
Error:  We couldn't reach the billing service. Retry, or contact support if
        the issue persists. [Retry]
Toast:  Invoice #1042 sent to maya@acme.com.
```
