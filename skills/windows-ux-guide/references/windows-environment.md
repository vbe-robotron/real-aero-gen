# Windows Environment Reference

Source: UX Guide, "Windows Environment" section (pages 749-835).

Integration points with the Windows shell: desktop, Start menu, taskbar, notification
area, gadgets, Control Panel, Help, and User Account Control.

## Desktop

The desktop is the user's personal space — **don't abuse it; keep users in control.**

- Provide a setup option to put a program shortcut on the desktop **only if** users are
  very likely to use the program frequently; most programs aren't used often enough.
- Present the option **unselected by default** — once undesired icons are on the desktop,
  users are reluctant to remove them.
- Offer only **a single shortcut**, to the main program. Put only shortcuts on the
  desktop, never the program itself or other files.
- Choose a label that displays without truncation (no ellipsis).
- Documentation: "desktop" and "shortcut" are uncapitalized.

## Start menu

Use the Start menu so users can easily find and launch your program. Its All Programs
area is a menu tree, so reduce items and folders to keep it discoverable.

- Put **only program shortcuts** on the Start menu. Never add shortcuts to uninstallers,
  Help files, control panel items, program options, utility programs, readme files, or
  Web sites — those have better access points.
- Use a **single shortcut per program**; don't also place shortcuts to specific tasks.
- Label the shortcut with the **program name** — no trademark symbols, company name, or
  version number (unless users normally refer to it that way). Title-style capitalization.
- During setup, don't offer an option to add the shortcut (do it automatically), and
  don't offer to pin it (users pin manually; programs can't self-pin since Vista).
- **Program names**: easy to browse (self-explanatory, alphabetize well, no leading
  space/number/symbol, avoid version numbers) and easy to search (unique or familiar
  words, prefer individual words over compounds, no misspellable/jargon/made-up names).
- **Folders**: put shortcuts at the top level of All Programs. Exceptions: Control Panel
  (control panel items, troubleshooting), Accessories (non-core accessories),
  System Tools (system maintenance utilities), Administrative Tools (IT professionals).
  Don't use the Maintenance folder (reserved). Create a product folder only for a
  collection of **three or more** programs; keep it **single-level** (a secondary folder
  only for six or more programs with two or more secondary utilities).
- Choose names and infotips containing words users are likely to search for.

## Taskbar

The taskbar provides program access and window management. Its benefits: showing running
programs, switching windows, starting programs, and (Windows 7) access to common
commands via Jump Lists.

- Use **standard taskbar buttons** — don't customize. Windows manages them.
- Windows 7 features for windowless/system status should be used from the taskbar button:
  **Jump Lists** and thumbnail toolbars for common commands, **overlay icons** for status,
  **progress bars** for long-running tasks.
- Choose an **overlay icon** (Windows 7) for status if the program has desktop presence;
  otherwise use a notification area icon. Never display both overlay icons and
  notification area icons for the same status.
- A progress state should be used only for a task with a **defined start and end**; show
  indeterminate progress otherwise. Don't display progress in the taskbar button when the
  program's window is active and visible (the window's own progress is enough).
- Don't use the taskbar for program branding or promotion.

## Notification area

The notification area provides **notification and status** — nothing else. Originally a
temporary notification source, it became noisy; Windows 7 hides most icons by default and
programs **cannot promote their own icons** (only the user can).

### Is it the right UI?
- Need to display a notification? Then you must use a notification area icon.
- Temporary status change? Only if the status is **useful/relevant** (users will change
  behavior) and **not critical** — critical/immediate-action info belongs in a dialog box.
- Does the feature have **desktop presence**? If yes, show status in the window, status
  bar, or (Windows 7) on the taskbar button; use a notification area icon only when there
  is no desktop presence.
- For quick program/command access, use the Start menu, taskbar pins, Jump Lists, or
  thumbnail toolbars — not the notification area.

### Guidelines
- Keep icons focused on notifications and status; don't use them as launchers.
- Provide an **Options/Display icon in notification area** command on the icon's context
  menu so users can remove it (removal need not stop the program).
- Let users choose which notifications to display, especially FYI ones.
- Let users suspend optional background features (printing, indexing, scanning,
  synchronizing) and quit the program (temporarily, for important system utilities, or
  permanently).
- The default experience should suit most users — don't turn everything on and expect
  users to turn it off.
- Minimize to the notification area only when appropriate, and follow the icon/interaction
  guidelines; don't use balloons for critical information (use a dialog box).

## Windows Desktop Gadgets

Gadgets give **fast access to personally relevant information and simple tasks**. They are
single-purpose, visually attractive, and live on the desktop (Sidebar in Vista; free
placement in Windows 7).

- Only create a gadget when the purpose is to monitor information or perform a simple task
  quickly — not to launch a program or promote it (that's the Start menu's job).
- **Expose core functionality in the concise/docked state** (assume the gadget always runs
  there). Use the detailed/floating state for extra always-useful functionality, flyouts
  for secondary sometimes-useful information, and link to the full application for complex
  or time-intensive tasks.
- Don't gratuitously add functionality; if there's no need, make both states the same.
- Keep appearance/interaction similar across states; use the same drop shadow so edges
  align. Don't use flyouts for options (use an options dialog box).
- On installation, consider performing an action that demonstrates the purpose; **avoid
  initial configuration** (choose good defaults).
- Provide loading ("Getting data...") and offline (16x16 information icon) feedback;
  activate automatically when a connection becomes available. Maintain state across
  sessions.
- Show errors/warnings **in place or as a different gadget state**, never in dialog boxes.
  Don't provide Help — make the design self-explanatory.
- Use animation and sound judiciously (user-triggered animation is encouraged; sound only
  on user interaction).
- Options dialog box: single page, no tabs, no scroll bar, look like property windows;
  open it from the gadget's Options button; omit it if unnecessary.
- Sizing: concise/docked width **130 px**, with 5 px drop shadow (2 px left, 3 px right);
  minimum height 84 px, recommended maximum 200 px. Detailed/floating no larger than
  **400x400 px**.
- Windows 7 setup: offer (unselected by default) to install **a single gadget**; install
  after first run if it depends on program setup. Consider extending to Windows SideShow.

## Control Panel items

Control panel items use either a **task flow** or a **property sheet**.

- **Hub pages** present high-level choices and have **no commit buttons**:
  - *Task-based* hubs present the most common/important tasks as links to spoke pages;
    best for a few common tasks with system-wide configuration and one or two objects.
    The *hybrid* variant also exposes frequently used properties/commands directly and is
    strongly recommended when users mainly use the item for those.
  - *Object-based* hubs use a list view of objects (single-click selects, double-click
    selects and navigates); best when there may be several objects (user accounts, network
    connections, printers).
- **Spoke pages** perform configuration:
  - *Task pages* have a specific task-based main instruction and are best when guidance is
    needed; the final page has commit buttons.
  - *Form pages* present related properties/tasks under a general main instruction, best
    for many properties needing a direct, single-page presentation (e.g. advanced
    properties); the final page has commit buttons.
- Avoid making an item bloated: use task-based spokes for the common/important tasks and a
  form-based page for the less common, advanced properties.
- An object-based hub can carry all properties/tasks itself (no spokes), and a form page
  can stand alone without a hub.


## Help

Help is **secondary** — the primary mechanism is the UI itself. Users consult Help only
when the UI fails them.

### Is Help right?
- How motivated are target users? Highly motivated users will research Help topics.
- Are you using Help to fix a bad UI? Better UI means less need for Help.
- Is the program simple? Put all necessary assistance into the primary UI surfaces.
- Are users developers/IT professionals/experts? Then reference and in-depth conceptual
  Help are expected.

### Guidelines
- **Try to make Help unnecessary**: make common tasks discoverable, provide clear main
  instructions and goal-oriented labels, supply supplemental instructions, anticipate
  problems with constrained controls/defaults/input handling, write actionable error
  messages, and avoid confusing UI.
- Add **Help links** from primary UI surfaces (dialog boxes, error messages, wizards) that
  take users directly to the pertinent topic; keep essential information in the UI, not
  only in Help.
- Match users' motivation: for impatient users (kiosks), make the UI self-sufficient;
  provide deeper Help for motivated, expert users.
- Write for **scanning**: "how-to" topics use numbered steps, reference topics use tables,
  conceptual topics use subheadings; bulleted lists scan better than paragraphs (use them
  judiciously).
- Focus content on the **top questions in top scenarios** (technical support is a good
  source); don't try to document every feature.
- Help topics are task-based (not feature-focused) and use a relaxed, informal tone with
  real-world language.

## User Account Control (UAC)

UAC limits programs to standard-user privileges until elevation is approved, protecting
users while keeping them in control.

- **Design programs to run without elevation** when possible; require administrator
  privileges only when necessary.
- **Elevate as late as possible** — only after the user has committed to the action that
  needs it, so UAC prompts are tied to an obvious cause.
- **Digitally sign** executables so the elevation UI can show a more specific, trusted
  identity.
- Identify UI that requires elevation with the **UAC shield icon** on the control/command,
  and follow the standard shield usage guidelines.
- Minimize the number of elevation prompts; avoid prompting repeatedly for the same
  workflow. Don't require elevation for common tasks users would expect to do without it.
- Explain why elevation is needed in the elevation UI, and keep the experience
  straightforward; don't try to brand or personalize the elevation UI.

