# Commands Reference (Menus, Toolbars, Ribbons)

Source: UX Guide, "Commands" (pages 221-297).

## Choosing a command surface

- **Menu bar**: common, easy to find, space-efficient; good for programs that create/view
  documents. Consider eliminating menu bars with 3 or fewer categories; never more than
  10 categories. Prefer task-oriented categories over generic ones.
- **Toolbar menus**: toolbars made mostly of menu buttons and split buttons.
- **Tab menus**: buttons within tabs that drop down a small set of related commands.
- **Menu buttons / split buttons**: buttons that show a drop-down (split = variations of a
  command). All menu patterns except menu bars need a drop-down arrow.
- **Toolbars**: direct commands; scale with an overflow button.
- **Ribbons**: introduced with Office 2007; task-oriented, always-visible command surface.

Choose the lightest surface that exposes the right commands. Don't duplicate the same
command prominently in several surfaces.

## Menus

### General
- All menu patterns except menu bars need a drop-down arrow.
- Don't change menu item names dynamically (confusing). Exception: names based on object
  names (recent files, window names). For modes, use bullets/checkmarks instead.

### Menu bars
- Consider eliminating menu bars with 3 or fewer categories; prefer lighter/direct
  alternatives.
- Never more than 10 menu categories.
- Consider hiding the menu bar when toolbars/direct commands cover most users' needs.
  Allow users to restore it via a **Menu bar** check mark option (View for primary
  toolbars, Tools for secondary toolbars). Hide, don't remove — menu bars are more
  accessible for keyboard users.

### Categories and organization
- Single-word category names.
- Document programs: use standard File, Edit, View, Tools, Help.
- Otherwise use natural, task-oriented categories. Avoid categories with only one or two
  items — consolidate, perhaps into a submenu.
- Order items logically; put the most common items first.

### Presentation
- Use ellipses only when more input is required before the command can complete.
- Show shortcut keys in menus; document them in menus/tooltips/Help.
- Use bullets/checkmarks for modes and toggles (don't rename items).
- Use icons on menu items selectively, not on every item.
- Context menus: place near the pointer, keep short, only contextually relevant commands.

## Toolbars

- Toolbars complement menu bars (each focuses on its strengths); it's fine to show both.
- Use standard toolbar icons and standard commands; ensure a static click affordance.
- Toolbar buttons may have tooltips that add detail beyond the label (but don't restate
  the label).
- Scale with an overflow button; keep frequently used commands visible.
- Support customization with restraint; remember/restore user's toolbar state.

## Ribbons

Source: UX Guide, "Ribbons" (pages 261-297). The ribbon is a task-oriented command
surface organized into **tabs → groups → commands**, with a persistent, always-visible
structure.

- Use the ribbon for programs with many commands organized by task/goal; it makes
  commands visible (no hunting through menus).
- Organize by user tasks, not by feature architecture. Group related commands; give
  groups labels.
- Keep the most important commands largest/labeled; smaller commands can be icon-only with
  tooltips.
- Provide a single, consistent place for each command — don't scatter the same command.
- **Meiryo UI** is preferred over Meiryo in the ribbon command UI (Japanese locale).
- Support keyboard navigation and access keys within the ribbon.
- The ribbon replaces menu bars + toolbars; don't keep a redundant menu bar alongside it
  unless needed for accessibility/compatibility.

> For exact ribbon metrics, group layouts, and the Office-style command set, consult the
> original "Ribbons" article (`sources.md`).
