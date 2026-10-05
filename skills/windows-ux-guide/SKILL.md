---
name: windows-ux-guide
description: Design, implement, and review Windows desktop user interfaces using Microsoft's official User Experience Interaction Guidelines (the "UX Guide" for Windows 7 / Windows Vista). Use when creating or auditing windows, dialog boxes, wizards, property sheets, controls, menus/ribbons/toolbars, UI text and labels, error/warning/confirmation/notification messages, keyboard/mouse/touch/pen interaction, layout, fonts, color, icons, animation, setup, branding/printing experiences, Windows Environment integration (desktop, Start menu, taskbar, notification area, control panels, Help, UAC), or when porting the classic Windows/Aero look to modern high-DPI displays and web viewports (font fallback stacks, rem-based scaling, 1px chrome texture, 4:3 / 5:4 / 16:10 aspect ratios).
---

# Windows UX Guide (Windows 7 / Windows Vista)

Distilled from Microsoft's official *Windows User Experience Interaction Guidelines*
(UX Guide, last updated 2010-09-29) and its Japanese overview booklet.

Treat this guide as the **minimum quality and consistency bar** for Windows-based
desktop applications. Follow it for routine decisions so creative energy goes to what
makes the product unique.

> Scope note: the source was written for Windows 7/Vista. Much of the guidance still
> applies in principle, but presentation and examples do not reflect current Microsoft
> design guidance. Use it for classic desktop / Aero-style UI (this repository's focus),
> and flag deviations when targeting modern Windows.

## How to use this skill

1. **Classify the surface** before writing code: window, dialog box, wizard, property
   sheet, task pane/ribbon, or in-place UI. Pick the lightest surface that does the job.
2. **Load the matching reference** from `references/` (index below). Read only what the
   task needs.
3. **Apply the design principles** and the **top-violations checklist** in
   `references/checklists.md` as a self-review before finishing.
4. **State assumptions** when the guide is ambiguous, and prefer the standard Windows
   control/behavior over a custom one.
5. **Porting to a modern viewport?** Read `references/modern-porting.md` before writing CSS:
   rem-based scale for the visual size, 1px hairlines/highlights for the era texture, the
   Meiryo → Segoe UI → Myriad → Hind → Noto Sans font stack, and 4:3 / 5:4 / 16:10 (not
   16:9) layout validation. For window frames read **§3.1–3.2 first**: Aero glass is the
   DWM's blur composite (`backdrop-filter` blur + tint, extended frame at 8/8/20/27), never
   an opaque grey fill — and a `filter` on an ancestor of a glass layer silently breaks it.

## The 14 design principles (short form)

1. Reduce concepts to increase confidence.
2. Small things matter, good and bad (`Do less better`).
3. Be great at "look" and "do".
4. Solve distractions, not discoverability (pinning/notifications/tours are not fixes).
5. UX before knobs and questions (ask once; don't require configuration to get value).
6. Personalization, not customization.
7. Value the life cycle (install, first use, regular use, maintenance, uninstall/upgrade).
8. Time matters: build for people on the go (interruptible; performance is the UX killer).
9. Ask questions carefully (modeless over modal; phrase in user goals, not technology).
10. Make it a pleasure to use.
11. Make it a pleasure to see (standard Windows look; restrained branding).
12. Make it responsive (perceived speed is set by how fast the UI becomes responsive).
13. Keep it simple (one way to do a thing; remove junk).
14. Avoid bad experiences (bad experiences dominate the user's overall impression).

See `references/design-principles.md` for the full 19 "How to Design a Great User
Experience" rules and the complete "Top Guidelines Violations" checklist.

## Non-negotiable defaults

- **Standard Windows look**: standard window frames, Segoe UI, system colors, common
  controls, standard layout. Avoid custom UI; use branding with restraint.
- **Fonts (modern hosts)**: fall back in order **Meiryo UI / Meiryo → Segoe UI → Myriad →
  Hind → Noto Sans series**, then `system-ui`. Name OS/commercial fonts only; ship just the
  OFL ones (Hind, Noto Sans). See `references/modern-porting.md`.
- **Resolution**: support 800x600 effective (640x480 for safe-mode-critical UI; reserve
  48 vertical relative pixels for the taskbar). Optimize resizable layouts for 1024x768.
  Test at 96/120/144 dpi (touch/mobile: optimize for 120 dpi).
- **Aspect ratios**: the era is **4:3 (800x600, 1024x768) / 5:4 (1280x1024) / 16:10
  (1280x800, 1440x900, 1920x1200)** — **not** 16:9. 16:9 is shorter, so validate the
  1366x768 worst case on top of the era targets.
- **Retina/4K**: never copy era pixel counts (`font-size: 12px` becomes unreadable). Keep
  the visual scale in `rem` (respecting user font-size/zoom) and simulate the era's pixel
  tightness **only** in texture density and line sharpness — 1px outer stroke + 1px inner
  highlight, hairline-thinned on DPR ≥ 2. See `references/modern-porting.md`.
- **Aero glass**: the frame is `backdrop-filter` blur + tint over the desktop, not an
  opaque gradient; keep the alpha stops low, desaturate when inactive, drop shadow/radius
  when maximized, and never put `filter`/`opacity` on an ancestor of a glass layer (see
  `references/modern-porting.md` §3.1–3.2).
- **One shortcut is enough**: don't offer three ways to do something when one will do.
- **Prevent errors instead of reporting them**; constrain input; the best error message
  is often none.
- **Never make hover the only way** to discover or perform something.
- **`Cancel` must leave no side effect**; otherwise label it `Close` (complete) or
  `Stop` (in progress). Commit button order: OK/[Do it]/Yes, No, Cancel, Apply.

## Reference index

| Read this | For |
| --- | --- |
| `references/design-principles.md` | Principles + top violations checklist + powerful & simple |
| `references/controls.md` | Choosing and configuring controls (buttons, text boxes, lists, progress, tooltips, etc.) |
| `references/commands.md` | Menus, toolbars, ribbons, command organization |
| `references/text.md` | UI text, style, tone, capitalization, labels, instructions |
| `references/messages.md` | Errors, warnings, confirmations, notifications |
| `references/interaction.md` | Keyboard, mouse, touch, pen, accessibility |
| `references/windows.md` | Window management, frames, dialog boxes, wizards, property sheets |
| `references/visuals.md` | Layout, fonts, color, icons, standard icons, animation, sound |
| `references/experiences.md` | Branding, setup, first experience, printing |
| `references/windows-environment.md` | Desktop, Start menu, taskbar, notification area, control panels, Help, UAC |
| `references/checklists.md` | Fast pre-flight / review checklists by surface |
| `references/ja-overview.md` | Japanese overview highlights (Meiryo, taskbar, ribbon, touch) |
| `references/modern-porting.md` | Retina/4K & web porting: font stack, rem scaling, 1px texture, Aero glass compositing (§3.1–3.2), 4:3/5:4/16:10 |
| `references/sources.md` | Provenance and how to regenerate the extracted text |

## Attribution

Guidance paraphrased/summarized from Microsoft's *Windows User Experience Interaction
Guidelines* (Windows 7/Vista, © 2010 Microsoft Corporation) and the Japanese overview
booklet. Microsoft reserves all rights to the original material.
