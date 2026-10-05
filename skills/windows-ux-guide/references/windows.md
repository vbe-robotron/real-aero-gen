# Windows Reference (Window Management, Frames, Dialogs, Wizards, Property Windows)

Source: UX Guide, "Windows" (pages 472-587).

## Terminology

- **Top-level window**: no owner, appears on the taskbar (application windows; also
  ownerless dialog boxes and property sheets in Vista+).
- **Owned window**: has an owner, not on the taskbar (modal/modeless dialogs).
- **User-initiated / program-initiated / system-initiated**: who caused it to display.
- **Contextual window**: a user-initiated window with a strong relationship to the object
  it launched from (context menu, notification-area icon) — not menu-bar windows.
- **Active monitor**: where the active program runs. **Default monitor**: has the Start
  menu/taskbar/notification area.

## Minimum supported screen resolution

The minimum effective resolution is **800x600** (with room reserved for a 48-pixel
taskbar). Fixed-size windows must display fully at that resolution; resizable windows may
be optimized for **1024x768** but must remain functional at the minimum. High dpi
(touch): optimize for **120 dpi**.

Test at 96 dpi (800x600), 120 dpi (1024x768), and 144 dpi (1200x900); also test with the
taskbar on each side. Watch for clipped text and stretched icons/bitmaps.

## Window management

### Window size
- **Fixed-size windows**: use the recommended default size; never make them too large to
  fit the work area.
- **Resizable windows**: optimize for 1024x768, but size down to the actual resolution;
  progressively larger windows must show progressively more information (at least one
  portion/control must have resizable content). Keep the upper-left origin fixed as the
  window resizes; don't rebalance content. Set a max content width for unwieldy content
  and a minimum window size below which content is unusable. Optional UI elements should
  disappear entirely rather than be clipped.
- Dynamically adapt presentation for smaller sizes (e.g., Media Player's compact mode).

### Window location
- Initially center owned windows on their owner — never underneath it. Later, remember the
  last location relative to the owner.
- Contextual windows: display near their source object, slightly down and to the right.
- Place top-level windows in a position users can find; avoid random/center-only default
  placement for modern resolutions.

### Z order, activation, focus
- Owned windows always appear above their owner.
- When displayed, user-initiated dialogs always take input focus; program-initiated
  dialogs should **not** steal focus (unintended input could cause harm).
- Assign initial focus to the control users will most likely use first — usually, but not
  always, the first interactive control. Avoid initial focus on a Help link.

### Persistence
- Save monitor, size, location, and state (maximized vs. restored) on close; restore on
  redisplay using the appropriate monitor. Consider per-user persistence across program
  instances.
- Don't use the **Always on Top** attribute. Exception: a dialog implementing an
  essentially modal operation that must be suspended to access the owner (e.g., spell
  check while editing the document).

## Window frames / title bars

- Dialog boxes have **no title bar icon** (icons distinguish primary from secondary
  windows). Exception: a dialog implementing a primary window (utility) that appears on
  the taskbar does have one — then optimize the title for the taskbar by putting
  distinguishing information first.
- Dialog boxes always have a **Close** button; modeless dialogs may also have Minimize;
  resizable dialogs may have Maximize.
- **Don't disable the Close button** — it keeps users in control. Exception: progress
  dialogs may disable it if the task must complete for a valid state / to prevent data
  loss.
- The title-bar Close must have the same effect as the dialog's Cancel or Close button —
  never the same effect as OK.
- If the caption/icon are prominently shown elsewhere, hide the title bar caption/icon —
  but still set a suitable internal title for Windows to use.

## Dialog boxes

- A dialog is a secondary window for a specific task/interaction. Prefer modeless when the
  task is frequent, repetitive, or performed alongside other activity; use modal only when
  users must respond before continuing (critical, infrequent, one-off).
- Make modal dialogs simple and task-focused; consider alternatives (ribbons, toolbars,
  palette windows) when a dialog would be too heavy.
- Presentation follows the standard dialog layout: title bar → main instruction →
  supplemental instruction → content → commit buttons.
- Commit buttons: use the standard set (OK, Cancel, [specific verb], Apply, Close, Yes/No)
  with the standard order and placement; avoid custom wording where a standard label fits.
- Closing behavior: the title-bar Close equals Cancel/Close, never OK.

## Common dialogs

Use the standard Windows common dialogs (Open, Save, Print, Color, Font, etc.) with the
standard API to get consistency, accessibility, and OS-level features. Avoid custom
implementations that break user expectations.

## Wizards

- Use a wizard for a multi-step task that users do infrequently and that requires a
  sequence of decisions; prefer lightweight alternatives (single dialog, progressive
  disclosure) when possible.
- **Next** advances without committing; **Back** corrects mistakes. Commit with a specific
  verb (Print, Connect, Start), not Next/Finish.
- Use command links for choices within a page, not for the commitment to finish; when you
  use command links to finish, hide Next (keep Cancel).
- Use **Close** for follow-up/completion pages.
- Don't put "wizard" in the wizard's name.
- Preserve user selections through Back/Next; don't lose input.
- Keep pages focused; don't overload a page with unrelated tasks.

## Property windows (property sheets)

- Show only necessary properties; present them in terms of user goals, not technology.
- Use specific tab labels; avoid General, Advanced, and Settings tabs, and avoid
  General/Advanced pages entirely.
- Make the dialog modeless when users need to see changes applied to the object.
- Apply: only in property sheets/control panel items; it applies changes without closing.
  Follow the standard commit-button rules for the rest.

