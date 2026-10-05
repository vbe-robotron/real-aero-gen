# Controls Reference

Source: UX Guide, "Controls" (pages 33-220). Each control article follows the pattern:
*Is this the right control? → Usage patterns → Guidelines (incl. sizing/labels) → Documentation*.

## Control selection map

| User intent | Use |
| --- | --- |
| Immediate action | Command button |
| Choose among 2+ clearly opposite states | Check box (toggle on/off, select/deselect) |
| Choose one of 2-5 mutually exclusive, related choices needing explanation | Radio buttons (or command links if longer explanations) |
| Choose one of a set of mutually exclusive values, compact | Drop-down list / combo box |
| Choose among a small set of related choices as a question response | Command links (2+) |
| Select from a small always-visible set | List box |
| View/interact with a collection | List view |
| Navigate, show a definition, or initiate a lightweight command | Link |
| Locate objects/text quickly | Search box |
| Choose from a continuous range | Slider |
| Increment a numeric value | Spin control |
| Hide advanced/rare options | Progressive disclosure control |
| Show state/context of a window or background task | Status bar |
| Present related info on labeled pages | Tabs |
| Non-critical problem/special condition in a control | Balloon |
| Label an unlabeled control | Tooltip |
| Describe the object pointed at | Infotip |
| Hierarchically arranged objects | Tree view |
| Follow long-running operation | Progress bar |
| Unrelated event, no immediate action needed | Notification |

## Key guidelines by control

### Check boxes
- Only for toggling on/off or selecting/deselecting; label states the selected meaning,
  the cleared state must be its unambiguous opposite. If the cleared meaning isn't
  obvious, use radio buttons (they can label each state).
- Groups mean independent choices (zero or more). For dependent choices requiring one or
  more, use a group of check boxes and handle "none selected" as an error.
- Keep to 10 or fewer options; more than 10 → use a check box list.
- Selecting a parent implies selecting subordinate check boxes — do so explicitly.
- Labels: focus on differences between options.

### Command buttons
- Use for immediate actions. Provide a static click affordance; don't require hover.
- Standard labels acceptable without verbs: Advanced, Back, *Browse...*, Cancel, Close,
  Next, No, OK, Options, Previous, Print, Save, Yes, etc.
- `Browse...` opens a dialog box to look for a file or object (ellipsis = further input).
- Recommended sizing/spacing: align per the UX Guide "Recommended sizing and spacing".
- A menu button shows a small set of related commands; a split button varies a command.
- Progressive disclosure hides infrequently used options until needed.

### Command links vs. links
- Command links answer "what do you want to do?" with mutually exclusive choices and an
  optional supplemental explanation; use 2+. Not usable in property windows/tabbed
  dialogs. In wizards, use specific commit buttons for commitment, not command links.

### Dialogs and commit behavior
- `Cancel` returns the environment to its previous state (no side effect). If that isn't
  true, label it `Close` (operation complete) or `Stop` (operation in progress).
- Don't use `Apply` outside property sheets and control panel items.

### Search boxes
- Search must be a simple, consistent, reliable part of the experience.

### Progress bars
- Determinate for bounded work even if the time isn't predictable; indeterminate only to
  show *something* is happening.
- Accurate time-remaining only; otherwise omit. Never restart a progress bar — share
  progress across steps and complete once. Details only if actionable and readable.
- Never combine a progress bar with a busy pointer.

### Tooltips and infotips
- Tooltips label unlabeled controls; not required for labeled controls. May add detail to
  labeled toolbar buttons but must not restate the label.
- Never cover the object (or the next likely target). Side placement, even with a small
  gap. Exception: full-name tooltips in lists/trees.
- Hand/link-select pointer only for text and graphic links.

### Prompts (placeholder text)
- Only when space is at a premium (e.g., toolbar), and never for crucial information.
- Italic gray vs. roman black input; not editable; disappears on click/tab-in (exception:
  if the box has default focus, it disappears when typing starts). No ending punctuation
  or ellipsis.

### Balloons
- For special conditions that are valid yet likely unintended. Use the icon based on the
  usage pattern; don't present two problems at once. Error text: complete sentences,
  sentence-style capitalization, ≤200 characters (body ≤255, expandable 30%+ for
  localization). Refer to it as a *balloon* in documentation, not a notification/alert.

### Notifications
- For events unrelated to current activity, not requiring immediate action, freely
  ignorable. When shown, you may be interrupting — justify it. Never advertise features.

### Layout-related control rules
- Size controls to typical content; avoid truncated text; no ellipses as a substitute for
  space. List views get sensible default/min/max column widths.
- Keep line width ≤ ~65 characters for readability.

> For exact pixel/DLU sizing tables per control, consult the original "Recommended sizing
> and spacing" section of each control article (see `sources.md`).
