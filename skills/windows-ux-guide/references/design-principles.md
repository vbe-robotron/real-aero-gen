# Design Principles & Top Guidelines Violations

Source: UX Guide, pages 3-32 ("Design Principles").

## Windows User Experience Design Principles

- **Reduce concepts to increase confidence.** Is the new concept necessary? Can unneeded
  concepts go? Are distinctions meaningful? Does the UX continue the same concept?
- **Small things matter, good and bad.** Do less better. Don't cut the small things. Plan
  thoughtful details. Fix the small bugs.
- **Be great at "look" and "do".** Does the first thing users see reflect what the UX is
  great at? Is it obvious what users can do? Provide only necessary steps.
- **Solve distractions, not discoverability.** Reduce distractions; don't let features
  compete; commit to new functionality. Pinning to Start/desktop/notification area,
  notifications, first-run experiences and tours are *not* discoverability solutions.
- **UX before knobs and questions.** Turn down the volume of questions; ask once; don't
  require configuration to get value; consolidate.
- **Personalization, not customization.** Let users express themselves with existing
  features/info (location, background picture, tile) rather than new configuration.
- **Value the life cycle.** Install/creation, first use/customization, regular use,
  management/maintenance, uninstall/upgrade. Walk through it as if used for 12 months —
  with realistic content and realistic volume.
- **Time matters; build for people on the go.** Same principles at 12-inch and 20-inch.
  Be interruptible; account for starting/stopping and losing connectivity; **performance
  is the universal UX killer**.

## How to Design a Great User Experience (19 rules)

1. **Nail the basics.** Core scenarios beat fringe scenarios.
2. **Design experiences, not features.** Maintain standards end to end (bad setup makes
   users assume the whole program is buggy).
3. **Be great at something.** Make target users say "I love this program."
4. **Don't be all things to all people.**
5. **Make the hard decisions.** If a feature/command/option isn't needed, cut it; don't
   avoid decisions by making everything configurable.
6. **Make the experience like a friendly conversation.** Write UI as if explaining to a
   user looking over your shoulder.
7. **Do the right thing by default.** Safe, secure, convenient defaults; users won't
   configure their way out of a bad initial experience.
8. **Make it just work.** Obvious common tasks; no unnecessary setup or learning.
9. **Ask questions carefully.** Modeless over modal; infer intent from context; phrase in
   goals/tasks, not technology; enough info for informed decisions.
10. **Make it a pleasure to use.** Right features, right places, polished details.
11. **Make it a pleasure to see.** Standard Windows look; restrained branding; use standard
    icons/graphics/animations where possible and legal; don't rely on skins.
12. **Make it responsive.** Users find slow/unresponsive programs unusable. Tasks longer
    than 10 seconds need informative feedback and cancel. Perceived speed is driven by how
    quickly the program becomes responsive.
13. **Keep it simple.** Simplest design that does the job; no three ways where one will do.
14. **Avoid bad experiences.** Bad experiences dominate overall perception.
15. **Design for common problems.** Anticipate mistakes, slow/unavailable network, missing
    devices, bad input, skipped steps; every error must explain the problem and give an
    actionable solution.
16. **Don't be annoying.** Anything routinely dismissed without action should be redesigned
    or removed. Never interrupt what users care about with what they don't. Use sound with
    extreme restraint.
17. **Reduce effort, knowledge, and thought.** Explicit > implicit. Automatic > manual.
    Concise > verbose. Constrained > unconstrained. Enabled > disabled (only disable when
    users can easily deduce why). Remembered > forgotten (except security/privacy).
    Feedback > clueless.
18. **Follow the guidelines** — this guide is the minimum bar; stand out while fitting in.
19. **Test your UI** with real target users; welcome criticism; collect post-ship feedback.

## Top Guidelines Violations (high-frequency mistakes)

### Windows
- Support 800x600 effective resolution (640x480 for safe-mode-critical UI); reserve 48
  vertical relative pixels for the taskbar.
- Optimize resizable layouts for 1024x768; degrade functionally at lower resolutions.
- Test at 96 dpi (800x600), 120 dpi (1024x768), 144 dpi (1200x900): watch clipping and
  stretched icons/bitmaps. Touch/mobile: optimize for 120 dpi.
- Owned window: initially center on the owner (never underneath); later, consider last
  location relative to the owner.
- Contextual window: display near the source object, offset down and to the right.

### Layout
- Size controls/panes to their typical content. Never truncate labels or text when space
  is available. Reserve scrolling/resizing for unusually large content. Consider limiting
  line width to 65 characters.
- List view columns: sensible default/minimum/maximum widths without truncated text.
- Layout should feel balanced (fix left-heavy layouts).
- When a resizable window truncates data, larger sizes must show more data.
- Set a minimum window size below which content is unusable; use minimum functional sizes
  for resizable elements (e.g., list view columns).

### Text
- Ordinary, conversational terms focused on user goals, not technology.
- Be polite, supportive, encouraging — never condescending, blaming, or intimidating.
- Remove redundant text across title, main/supplemental instructions, content, command
  links, commit buttons. Keep full text in main instructions and interactive controls.
- Title-style capitalization for titles; sentence-style for everything else. Don't
  capitalize generic UI element names (toolbar, menu, button). Don't use ALL CAPS for keys.

### Controls
- Commit buttons: don't use **Apply** outside property sheets/control panel items. Label
  **Cancel** only if it leaves the environment unchanged; otherwise use **Close** (complete)
  or **Stop** (in progress).
- **Command links**: always two or more; always an explicit **Cancel** button; if that
  leaves a single link, add a cancel command link too (phrased as its difference, not
  "Cancel").
- **"Don't show this again"** check boxes: only when there's no better alternative;
  name the specific item; don't select by default; note that it takes effect even if
  Cancel is clicked (meta-option).
- **Links**: no access key (use Tab); don't add "Click" / "Click here".
- **Tooltips**: only for unlabeled controls (or extra detail for toolbar buttons); don't
  repeat the label; never cover the target or the next likely target (side placement;
  horizontally arranged items → not to the right; vertically arranged → not below).
- **Progressive disclosure**: More/Fewer when the surface always shows some items,
  otherwise Show/Hide; pair with the right noun (options/commands/details/<object>).
- **Progress bars**: determinate even when time can't be predicted accurately; accurate
  time-remaining only; never restart; useful details only; never combine with a busy
  pointer.
- **Prompts** (placeholder text): italic gray, not editable, disappears on entry, no
  ending punctuation/ellipsis, never crucial information.
- **Notifications**: only for events unrelated to current activity, not requiring
  immediate action, freely ignorable. Never for feature advertisements.


### Keyboard
- Initial focus on the control users are most likely to use first.
- Tab stops on all interactive controls (incl. read-only edit boxes); radio groups are a
  single tab stop; contain groups so arrows stay within them.
- Tab order left→right, top→bottom; arrow order the same; both cycle without stopping.
- Commit button order: OK/[Do it]/Yes → [Don't do it]/No → Cancel → Apply (if present).
- Don't confuse access keys (localized, window-scoped, underlined, not memorized) with
  shortcut keys (not localized, program-wide, Ctrl/function-based, memorized). Don't
  assign access keys to OK/Cancel/Close. Never make a shortcut key the only way.
- Don't reassign well-known shortcut keys (e.g., Ctrl+F = Find).

### Mouse
- Never require a click to discover clickability. Primary UI (e.g., commit buttons) needs
  a static click affordance; secondary UI may reveal on hover.
- Hand pointer only for text and graphic links.

### Dialog boxes / property sheets / wizards
- Modal only for things users must answer before continuing (critical, infrequent,
  one-off). Otherwise prefer modeless (frequent, repetitive, ongoing) — or ribbons,
  toolbars, palette windows.
- Property sheets: only necessary properties; present in user goals, not technology;
  specific tab labels (avoid General/Advanced/Settings); avoid General/Advanced pages.
- Wizards: prefer lightweight alternatives; `Next` only to advance without commitment;
  `Back` only to correct mistakes; commit with a specific verb (Print/Connect/Start), not
  Next/Finish; command links only for choices, not commitments; hide Next when using
  command links but keep Cancel; use Close for follow-up/completion pages; don't put
  "wizard" in wizard names; preserve selections through Back/Next.

### Error / warning / confirmation messages
- Error: problem already occurred. Warning: condition that *might* cause a problem.
- Prefer prevention, auto-correction, or suppression over reporting. If users would
  dismiss without acting, omit it.
- Avoid unactionable messages and expected "errors" (e.g., cancelling a task is not an
  error). Reconsider whether the "problem" is with user goals or with the program's
  ability to satisfy them.

