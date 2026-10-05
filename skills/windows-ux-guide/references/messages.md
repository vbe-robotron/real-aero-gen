# Messages Reference (Errors, Warnings, Confirmations, Notifications)

Source: UX Guide, "Messages" (pages 326-398).

## Message type decision

| Situation | Use |
| --- | --- |
| A problem has already occurred | **Error message** |
| A condition *might* cause a problem in the future | **Warning message** |
| User must choose to proceed with an action (2+ responses) | **Confirmation** |
| Event unrelated to current activity, no immediate action, freely ignorable | **Notification** |

A confirmation that involves risk is also a warning; apply both sets of guidelines.
"Good warning" is a subset of "good message" — a bad warning doesn't have to be deleted,
just reclassified.

## Error messages

An error alerts users of a problem **that has already occurred**. Effective errors state
what happened, why, and how to fix it. Users should act or change behavior as a result.

### Is an error the right UI? (prefer suppression)
- Can the problem be **prevented** without confusion? Prevent it (constrained controls,
  disabling with an obvious reason).
- Can it be **corrected automatically**? Handle it and suppress the message.
- Will users actually do something? If not, suppress it.
- Is it unrelated to current activity and freely ignorable? Use an action-failure
  notification instead.
- Related to a background task? Consider a status bar.
- For IT professionals, alternatives like logs/e-mail alerts may suit better.

### Qualities of good errors
Relevant · Actionable · User-centered (user goals, not code) · Brief · Clear · Specific
(names/locations/values) · Courteous (never blame) · **Rare** (frequent errors indicate
bad design).

### Guidelines
- Use complete sentences, sentence-style capitalization, ending punctuation.
- Presentation: main instruction states the problem; supplemental instruction gives the
  solution; use in-place errors where possible.
- Don't recommend contacting technical support; only recommend an administrator when that
  is among the most likely solutions.
- Commit buttons: provide **Close** (not OK — problems aren't OK). Exception: OK when the
  API has fixed labels. If the program must terminate, provide **Exit program** (not
  Close).
- Icons, progressive disclosure, Help links, error codes, and optional sound follow their
  own guidelines; keep sound minimal.

## Warning messages

A warning alerts users to a condition that **might cause a problem in the future**. The
risk typically involves loss of: a valuable asset (data/financial), system access or
integrity, privacy/confidential information, or significant time (30 seconds or more).
A warning is only justified if the consequence is unexpected/unintended and not easily
corrected.

### Avoid overwarning
Overwarning makes software feel hazardous. The mere potential for data loss is not enough.

### Characteristics of good warnings
- **Involve risk** — alert about something significant.
- **Have immediate relevance** — users must care *now*.
- **Lead to action** — something to do or be aware of; the consequence of ignoring it is
  clear.
- **Are not obvious** — don't state the obvious consequence.
- **Occur infrequently.**

### Design patterns
| Pattern | Main instruction | Supplemental | Commit buttons |
| --- | --- | --- | --- |
| Awareness | Describe the condition/potential problem | Explain the implication and why it matters | **Close** (not OK) |
| Imminent problem | Describe what to do now | Explain the condition and why it matters | A button/link per option, or OK if the action is external |
| Risky-action confirmation | Ask whether to proceed | Explain non-obvious reasons not to proceed | **Yes / No** |

- Titles: identify the source; don't explain what to do (that's the main instruction);
  title-style capitalization, no ending punctuation.
- Main instruction: one complete sentence; use "now"/"immediately" only if truly urgent;
  be specific; sentence-style capitalization.
- Don't repeat the main instruction in the supplemental instruction; omit it if there's
  nothing more to add.

## Confirmations

A confirmation is a **modal** dialog that asks whether to proceed. It is a direct result
of a user action, verifies intent, and has a simple question plus 2+ responses. Most
useful when the user must make a relevant, distinct choice that **can't be made later**.

- Prefer a design that eliminates the need for the confirmation; frequent confirmations
  are learned and ignored.
- Don't confirm abandoning a task — users understand the consequences.
- Confirm when: the action is risky (significant consequences, not easily undone),
  consequences the user may not be aware of, the action is likely in error given context,
  or it has security implications (security may require a confirmation even if other
  tests say no).
- Use Yes/No (or specific verbs) and place them per commit-button order. Provide a safe
  default where one exists.

## Notifications

Source: Controls/Notifications. A notification informs users of events **unrelated to the
current activity**, that **don't require immediate action**, and that users can **freely
ignore**.

- Only use a notification when needed — you may be interrupting or annoying the user.
- Use for non-critical events; for critical events requiring immediate action, use a modal
  dialog box instead.
- **Never use notifications for feature advertisements.**
- Respect the user's notification settings; don't require the notification area to be
  visible for important information.

## Shared rules

- "Don't show this message again" options: use only when there's no better alternative,
  name the specific item, don't select by default, and note that it takes effect even if
  the user then clicks Cancel (it's a meta-option).
- Use progressive disclosure to move rarely needed detail (error codes, technical
  details) out of the way.
- Documentation: refer to messages by their main instruction/question, bold the text
  where possible, and only call it an "error message" in technical documentation.

