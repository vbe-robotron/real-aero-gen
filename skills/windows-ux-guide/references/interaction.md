# Interaction Reference (Keyboard, Mouse, Touch, Pen, Accessibility)

Source: UX Guide, "Interaction" (pages 399-471).

## Match the input device to the job

- **Keyboard**: best for text input and commands with minimal hand movement.
- **Mouse**: best for efficient, precise pointing.
- **Touch**: best for object manipulation and simple commands.
- **Pen**: best for freeform expression (handwriting, drawing).

If a UI works for a finger, it usually works for a pen (fingers need larger targets;
hover must be optional). Mouse-friendly is *not* automatically touch-friendly.

## Keyboard

### Navigation elements
- **Input focus**: the control receiving most keyboard input, shown by the focus rectangle.
- **Tab stops**: every interactive control (including read-only edit boxes that can be
  scrolled/copied).
- **Arrow navigation** within a group; **access keys** (Alt, underlined, localized,
  window-scoped); **shortcut keys** (Ctrl/function, program-wide, not localized,
  memorized).

### Guidelines
- Assign initial focus to the control users are most likely to interact with first (often
  the first interactive control). If that isn't a good choice, revisit the layout.
- Tab order: left→right, top→bottom (follows reading order). Tab cycles through all stops,
  both directions, without stopping. Make exceptions only to bring commonly used controls
  earlier.
- Arrow-key order within a stop: left→right, top→bottom, no exceptions; cycles without
  stopping.
- Radio button groups are a single tab stop; contain groups so arrows stay inside.
- Commit button order: OK/[Do it]/Yes → [Don't do it]/No → Cancel → Apply (if present).
- Access keys: assign unique keys where possible (~20 max in one dialog, English). Assign
  to a character early in the label. Localized. Don't assign to OK/Cancel/Close (Enter/Esc
  serve that role), unless a control means OK/Cancel with a different label.
- Shortcut keys: only for the most commonly used commands; use memorable letters
  (Ctrl+C = Copy); never reassign well-known shortcuts (Ctrl+F = Find); only for programs
  and features frequent enough to memorize.
- Never make a shortcut key the only way to perform a task.
- Don't try to assign system-wide shortcut keys — they only work with your program's focus.
- Support common Windows keyboard and mouse combinations (Shift+click, Ctrl+click, etc.).

## Mouse

- **Never require users to click to determine clickability** — clickability must be
  apparent by visual inspection.
  - Primary UI (commit buttons) needs a **static** click affordance; users shouldn't have
    to hover to discover primary UI.
  - Secondary UI (secondary commands, progressive disclosure) may show affordance on
    hover.
  - Text links statically suggest link text, then underline (with hand pointer) on hover.
  - Graphic links only show a hand pointer on hover.
- Use the hand ("link select") pointer **only** for text and graphic links.
- Provide appropriate target sizes; respect Fitts' Law (size and distance both matter).

## Touch

### Touchability levels
- **Touchable**: interactive controls at least **23x23 px (13x13 DLU)**; good mouse and
  keyboard support; no task requires hover or the touch pointer; controls expose MSAA.
- **Touch-enabled**: most frequently used controls at least **40x40 px (23x22 DLU)**;
  relevant gestures supported and effects occur at the point of contact; smooth,
  responsive feedback while panning/zooming/rotating.
- **Touch-optimized**: designed for touch — most frequent commands placed directly on the
  UI for easy reach, etc.

### Guidelines
- Minimum target area for accurate finger interaction is about **6x6 mm** (physical area,
  not just pixels/DLUs).
- **Hover must never be required.**
- Avoid long text input and precise text selection; use auto-completion and sensible
  defaults.
- Keep interactions within the range of a resting hand; long-distance repeated moves are
  tedious.
- Small targets near the display edge are hard to touch (protruding bezels, reduced edge
  sensitivity); e.g., title-bar Minimize/Maximize/Close when maximized.
- Support standard Windows Touch gestures: pan, zoom, rotate, two-finger tap, press and
  tap; flicks (navigational: drag up/down, back/forward; editing: copy, paste, undo,
  delete) and manipulations.
- Don't rely on the touch pointer (disabled by default in Windows 7) to fix touch UI
  problems — it's a last resort.

## Pen

- Pen is best for handwriting, drawing, and freeform expression; treat pen like touch but
  with finer precision (hover may be available).
- Ensure the UI works when the pen is used as a pointing device; provide ink/text
  distinction and eraser behavior where relevant.

## Accessibility (cross-cutting)

- Provide keyboard access to all functionality (access keys + shortcut keys).
- Expose UI via Microsoft Active Accessibility (MSAA) / UI Automation.
- Never rely on color, sound, or hover alone to convey information.
- Respect high-contrast themes, system colors, and dpi scaling.
- Support keyboard focus visibility and logical focus order at all times.
