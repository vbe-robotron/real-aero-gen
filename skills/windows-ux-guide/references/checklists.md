# Checklists (pre-flight / review)

Fast, surface-specific checks to run **before finishing** any UI work. Use the full
"Top Guidelines Violations" checklist in `design-principles.md` for a deeper pass.

## Universal pre-flight

- [ ] Standard Windows look: standard window frames, Segoe UI, system colors, common
      controls, standard layout. No gratuitous custom UI.
- [ ] Fonts resolve through the stack **Meiryo UI / Meiryo → Segoe UI → Myriad → Hind →
      Noto Sans series → `system-ui`**; OS/commercial fonts are named but not embedded.
- [ ] On a Retina/4K or web viewport, type and chrome are sized in **`rem`** (no literal
      era pixels such as `12px`); era *ratios* preserved instead (main instruction ≈ 1.28x
      body, caption slightly smaller).
- [ ] Era texture kept only where it should be: **1px** outer stroke + **1px** inner
      highlight/hairline (thinned on DPR ≥ 2), gradients with era stop ratios; nothing
      blurred or screenshot-downscaled.
- [ ] Glass surfaces are **composited, not painted**: `backdrop-filter` blur + low-alpha tint
      over the extended frame (8/8/20/27), the 1px edge kept on top, desaturated when
      inactive, no shadow/radius when maximized. An opaque grey fill called "glass" fails;
      so does any `filter`/`opacity` on an ancestor of the glass layer (backdrop root →
      blur silently stops sampling). Opaque fallback exists for high contrast / engines
      without `backdrop-filter` (`modern-porting.md` §3.1–3.2).
- [ ] Layout validated at **1024x768 (4:3), 1280x1024 (5:4), 1440x900 (16:10)** and the
      **1366x768 (16:9)** height worst case; no reliance on a 16:9 canvas.
- [ ] Layout works at 800x600 effective (640x480 for safe-mode-critical UI) and is
      optimized for 1024x768; verified at 96 / 120 / 144 dpi (120 dpi for touch).
- [ ] Every control is reachable and operable by keyboard alone; initial focus is on the
      control users are most likely to use first.
- [ ] No function is available only through hover, only through a shortcut key, or only
      through a context menu.
- [ ] Commit button order: OK/[Do it]/Yes → No → Cancel → Apply. `Cancel` leaves no side
      effect (else it's `Close`/`Stop`).
- [ ] Destructive/irreversible actions are prevent-first, then confirm; every error
      explains the problem **and** an actionable solution.
- [ ] One way to do each thing; no redundant commands. Junk removed.

## Window / dialog box

- [ ] Correct surface chosen: dialog box only when users must answer before continuing;
      otherwise modeless, ribbon, toolbar, or in-place UI.
- [ ] Standard frame; title = object name or task; no "dialog"/"window" in the title.
- [ ] Main instruction states the user's goal; body text adds only what's needed.
- [ ] Margins/spacing follow the standard layout grid; controls aligned; no scroll bar
      unless overflow is expected.
- [ ] Resizing/minimizing/maximizing behave as expected; size is appropriate to content
      (setup windows are not maximized).
- [ ] No needless modality, no nested modal dialogs.

## Wizard

- [ ] Lightweight alternative considered first (single dialog / progressive disclosure).
- [ ] `Next` only advances without commitment; `Back` only corrects mistakes; commit with
      a specific verb (Print, Connect, Start) — not `Next`/`Finish`.
- [ ] Command links used for choices on a page, not for the final commitment; when command
      links finish the task, hide `Next` and keep `Cancel`.
- [ ] Completion/follow-up pages use `Close`; selections survive Back/Next.
- [ ] No "wizard" in the wizard's name; indeterminate steps numbered ("Step 1 of 3" only
      when the count is honest).

## Property window / Control Panel item

- [ ] Only necessary properties; described in user goals, not technology.
- [ ] Specific tab labels; no General/Advanced/Settings tabs or pages.
- [ ] `Apply` present only where it belongs (property sheets / control panel items).
- [ ] Hub page (no commit buttons) vs. spoke page (task page or form page with commit
      buttons) chosen per the task flow/property sheet pattern.

## Commands (menus / toolbars / ribbon)

- [ ] Commands organized by user goals; most common commands most prominent.
- [ ] Labels are verbs/tasks with access keys; no ambiguous "OK"-style labels.
- [ ] Only commonly used commands are top-level; advanced items are contextual or in
      dialogs (progressive disclosure).
- [ ] Ribbon replaces menu bar + toolbar (not combined); paired with Application button and
      Quick Access Toolbar; Home tab selected on launch; ribbon state preserved.
- [ ] Shortcut keys follow well-known assignments and are never the only way.

## Text / labels / messages

- [ ] UI text is in the user's language; no jargon, internal names, or technology terms.
- [ ] Sentence-style capitalization for instructions and labels (title-style only for
      titles/column headers); no ending periods on labels and short phrases.
- [ ] Main instruction + optional body text + optional controls; instructions describe
      what to do, not how the feature works.
- [ ] Access keys on controls, shown with underlines; no access keys on OK/Cancel/Close.
- [ ] Error/warning/confirmation/notification messages each match their purpose; messages
      give a solution or next step.
- [ ] Notifications: only for events unrelated to current activity, not requiring immediate
      action, and freely ignorable; never feature advertisements.
- [ ] Confirmations reserved for risky, infrequent actions; users can turn off routine
      confirmations.

## Interaction / accessibility

- [ ] Keyboard: full tab order left→right, top→bottom; arrow order matches; groups
      contained; radio groups are one tab stop; disabled controls are skipped appropriately.
- [ ] Mouse: static click affordance on primary UI; hand pointer only for links; no
      click-to-discover; hover only for nonessential aids.
- [ ] Touch: interactive targets at least 23x23 px (40x40 px comfortable); important
      commands kept within a small travel range; no dependence on hover; constrained
      controls (lists/sliders) over text entry; auto-complete where text is needed.
- [ ] Forgiveness: Undo available; operations apply on release, not on contact; risky
      commands physically separated and confirmed.
- [ ] Accessibility: screen-reader names/roles for all controls; color is never the only
      cue; high-contrast and increased-dpi layouts work.

## Visuals (layout / fonts / color / icons / animation)

- [ ] Standard layout grid; fonts and sizes per the standard (Segoe UI 9 pt; Meiryo/Meiryo
      UI for Japanese, Meiryo UI in ribbon UI) — expressed in modern `rem` tokens, not the
      era's literal pixels (`modern-porting.md`).
- [ ] Font fallback stack applied (Meiryo UI → Meiryo → Segoe UI → Myriad → Hind → Noto
      Sans → `system-ui`); no synthetic italics on Meiryo/CJK faces.
- [ ] System colors and standard icons used; color used meaningfully, not decoratively.
- [ ] Glass legibility comes from the 1px edge + the caption glow (a `DTT_GLOWSIZE = 15`
      style halo), **not** from raising the tint's alpha; the client/document area stays
      opaque while only the frame region is blurred.
- [ ] Icons: standard glyphs for standard actions; 16x16/32x32 variants at the right DPI;
      no text in icons; no hand-drawn one-offs for standard meanings.
- [ ] Animation and sound restrained and used only to support comprehension or on user
      action; nothing disruptive, blinking, or gratuitous.
- [ ] Branding restrained: standard look; brand only special experiences; never brand the
      Windows desktop.

## Experiences (setup / first experience / printing)

- [ ] Setup is simple/lightweight, works unattended/scripted/uninstalled, elevates as late
      as possible, is digitally signed, and logs support information.
- [ ] Setup window not maximized; file named `Setup.exe` (or includes the program name when
      downloaded); Repair option considered.
- [ ] First experience gets the program working immediately with safe defaults and asks
      only what's required (once).
- [ ] Printing: standard Print common dialog extended, not replaced; preview where layout
      matters; print settings remembered; print errors handled gracefully.

## Windows Environment

- [ ] Desktop shortcut offered only for frequently used programs, off by default, single
      shortcut, non-truncating label.
- [ ] Start menu: single program shortcut, top level (or correct folder), program name
      label, no uninstaller/Help/options/readme/website shortcuts.
- [ ] Taskbar: standard buttons; Windows 7 status via overlay icon/progress on the button,
      never both overlay and notification-area icons for the same status.
- [ ] Notification area used only for notifications/status without desktop presence;
      icon has a Display icon in notification area option; program promotes no icon itself.
- [ ] Help is secondary; essential info is in the UI with links to topics.
- [ ] UAC: elevates only when needed and as late as possible; shield icon on elevating
      commands; signed executables.

