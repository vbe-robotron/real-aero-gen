# Visuals Reference (Layout, Fonts, Color, Icons, Animation, Sound)

Source: UX Guide, "Visuals" (pages 588-748).

## Layout

Effective layout helps users find things quickly and makes the surface visually
appealing. Windows communicates layout in device-independent metrics: **dialog units
(DLUs)** and **relative pixels** (see Layout Metrics in the guide).

### Visual hierarchy
Achieved by combining:
- **Focus** — the layout indicates where to look first.
- **Flow** — the eye follows a clear, natural path in the order elements are used.
- **Grouping** — related elements are clearly related; unrelated are separate.
- **Emphasis** — elements are emphasized by relative importance.
- **Alignment** — coordinated placement makes scanning easy and looks orderly.

Effective layout is also: device independent (works at any typeface/size/dpi/display),
easy to scan, efficient (large things are large, small things work small), resizable,
balanced, visually simple, and consistent.

### Screen resolution and dpi
- Design for the minimum effective resolution of **800x600** (reserving 48 vertical
  relative pixels for the taskbar).
- Optimize resizable layouts for **1024x768**; degrade functionally at smaller sizes.
- Test at 96 dpi, 120 dpi, and 144 dpi (e.g., 800x600 at 96, 1024x768 at 120, 1200x900 at
  144); also test with the taskbar on other edges.
- **Aspect ratios of the era: 4:3 and 5:4 plus 16:10 — not 16:9.** The widescreen standard
  was 1280x800 / 1440x900 / 1680x1050 / 1920x1200 (16:10); square-ish 800x600, 1024x768
  (4:3) and 1280x1024 (5:4) were the bulk of the install base. 1366x768 / 1920x1080 (16:9)
  arrived only at the very end and is **not** the design assumption.
- Because 16:9 is *shorter* than 16:10 at equal width, a layout sized to the era's taller
  canvas can clip on modern screens. Budget vertical space against the 4:3/16:10 targets,
  then verify 1366x768 (plus 200% zoom) as the worst case — see `modern-porting.md` §4.
- Watch for clipped text/labels and distorted icons and bitmaps when scaling.

### Window size (layout view)
- **Fixed-size windows** must be entirely visible and fit within the work area.
- **Resizable windows** may be optimized for higher resolutions, sized down at display
  time; progressively larger sizes must show progressively more information (at least one
  portion/control resizes).
- Keep the upper-left origin fixed; don't rebalance content as the window grows.
- Set a maximum content width when content stretches too wide.
- Set a minimum window size when there's a size below which content is unusable; set
  minimum functional sizes for resizable elements (e.g., list view columns). Remove
  optional UI entirely rather than clipping it.

### Control size
- Make interactive controls at least **16x16 relative pixels** (works for mouse, pen,
  touch). Touch needs ~23x23 px minimum (touchable) or 40x40 px (touch-enabled); about
  6x6 mm physical for accurate finger targeting.
- Size controls to avoid truncated data; size list view columns to avoid truncation.
- Size controls to eliminate unnecessary scrolling (slightly larger can remove a
  scrollbar); few vertical scrollbars, no unnecessary horizontal ones.
- Reduce the number of control sizes: prefer standard sizes; use no more than ~3 widths
  for command buttons and drop-down lists; one width for list boxes and tree views. Text
  and combo box widths should suggest expected input length.
- For text-sized controls, add **30%** extra width for localization (up to 200% for short
  text).
- Extend static text, check boxes, and radio buttons to the maximum width that fits.

### Spacing and placement
- Follow recommended spacing between controls, groups, and window edges (small spacing
  between related controls; larger between unrelated groups).
- Place related items together; separate unrelated ones; let groups define structure.
- Align elements to a grid; avoid mixing alignments.

### Focus and accessibility
- Make the focus indicator always visible and clear; support keyboard navigation.
- Use system colors and respect high-contrast mode; don't rely on color alone.

## Fonts

**Segoe UI** (pronounced "SEE-go") is the Windows system font; the standard size is
**9 point**. Segoe UI ≠ Segoe (a branding font for print/advertising).

- Segoe UI is optimized for **ClearType** (on by default). With ClearType it's elegant and
  readable; without it, only marginally acceptable.
- Prefer **9 point or larger**; Segoe UI is optimized for these sizes, so avoid smaller.
- Font/color roles: Caption 9 pt black; MainInstruction 12 pt blue (#003399);
  Instruction/BodyText 9 pt black; Disabled 9 pt dark gray (#323232); HyperLinkText 9 pt
  blue (#0066CC), hot 9 pt light blue (#3399FF).
- Localized system fonts (also ClearType-optimized): **Meiryo** (Japanese), **Malgun
  Gothic** (Korean), **Microsoft JhengHei** (Traditional Chinese), **Microsoft YaHei**
  (Simplified Chinese), **Gisha** (Hebrew), **Leelawadee** (Thai). Don't use italic with
  these (synthesized/partial italics).
- **Meiryo UI** is preferred in the ribbon command UI.
- For UI text, prefer **sans serif** (clean appearance, low monitor resolution); serif is
  better for body text in documents.
- Use dark text on a light background for primary UI surfaces (highest contrast); light
  text on dark works for secondary UI surfaces you want to de-emphasize.
- Use system fonts and respect user font-size and dpi settings; don't hard-code fonts.

### Modern porting: font stack (see `modern-porting.md`)
The era's fonts are not all present on today's machines, so name them in a fallback
stack — **Meiryo UI / Meiryo → Segoe UI → Myriad → Hind → Noto Sans series**:

```css
--font-ui: "Meiryo UI", Meiryo, "Segoe UI", "Segoe UI Variable Text",
           Myriad, "Myriad Pro", Hind,
           "Noto Sans", "Noto Sans JP", "Noto Sans CJK JP", system-ui, sans-serif;
```

- Japanese-first so JA UI text keeps the era glyphs and full-width metrics (Meiryo UI for
  ribbon/narrow command text); Latin-only hosts fall through to Segoe UI, then Myriad,
  then the free fallbacks.
- Reference Segoe UI / Meiryo / Myriad **by name only** (OS/commercial); only Hind and the
  Noto Sans series (OFL) may be shipped/embedded.
- Sizes stay in `rem` using the era's *role ratios* — do **not** copy the era's literal
  pixel counts (9 pt = 12 px is unreadable on a Retina/4K viewport). See
  `modern-porting.md` §2 for the role→token mapping.

### Layout metrics warning
Text sizes are larger than they appear: a text control's height includes ascenders,
descenders, diacritics, and leading, so visible sizing/spacing can differ from actual.
Some controls also have invisible borders. Account for this when measuring.

## Color

### Color spaces
- **RGB** (red, green, blue), **HSL** (hue, saturation, luminosity), **HSV** (hue,
  saturation, value). HSL/HSV: hue 0-360°, saturation 0-100, luminosity/value 0-100.

### Use system colors
- Prefer **system (theme) colors** over hardwired colors. They respect user settings and
  are guaranteed legible in all video modes including **high-contrast mode**.
- **Match foreground colors with their associated background colors.** Foregrounds are
  legible only against their paired backgrounds; don't mix foregrounds with other
  backgrounds — and never hardwire a foreground against a hardwired background.
- If you must hardwire colors, handle high-contrast mode as a special case.
- To derive a variant (e.g., a darker background), get the theme RGB and adjust, rather
  than hardwiring.
- Respect the high-contrast themes: High Contrast Black (white on black) and High Contrast
  White (black on white), among others.

### Color meaning (Windows conventions)
| Hue | Meaning | Typical use |
| --- | --- | --- |
| blue/green | Windows brand | Background: Windows branding |
| glass/black/gray/white | neutral | Background: standard window frames |
| blue | start, commit | Background: default command buttons |
| red | error, stop, vulnerable, critical, immediate | Background: status, stopped progress |
| yellow | warning, caution, questionable | Background: status, paused progress |
| green | go, proceed, progress, safe | Background: status, normal progress |

- To avoid these meanings, choose colors with **high mid-to-low saturation and high or low
  luminosity** — users associate the meanings with full/high-saturation, mid-luminosity
  colors.
- For multiple colors, use **triad harmonies or complementary hues, not adjacent hues**;
  colors have high contrast when hue, saturation, or luminosity differ greatly. A white or
  very light background makes contrasting foregrounds easier to distinguish.
- Never rely on color alone to communicate information (about 8% of men have red-green
  color confusion).

### Modern porting: window frame glass (see `modern-porting.md` §3.1–3.2)
"Glass" in the era's frames is the Desktop Window Manager compositing the **blurred
desktop behind the window** — it is a composite, not a colour to mix. Reproduce it with
`backdrop-filter` blur + **low-alpha** tint over the *extended frame* (8/8/20/27), keep the
1px edge on top of it, desaturate (don't opaque-ify) when the window is inactive, and fall
back to opaque system colours wherever blur/transparency is unavailable (Vista Home Basic
and high contrast mode both render those regions opaque). An opaque grey-blue fill is not
glass, and a `filter` on an ancestor of the glass layer silently disables the blur.

## Icons

- Use the standard Windows icons for standard commands and concepts (see "Standard
  Icons").
- Icons should be recognizable, consistent in style/perspective/lighting, and readable at
  their display size.
- Provide multiple resolutions (16x16, 32x32, 48x48, 256x256 with alpha) so icons don't
  get stretched/blurry at other dpi settings.
- Use tooltips for icon-only controls; don't rely on an icon alone to convey a critical
  meaning.
- Don't use icons to decorate; use them to aid recognition.

## Animations and transitions

- Use animation to show relationships, provide feedback, or draw attention — not as
  decoration.
- Keep animations short, subtle, and purposeful; never make the UI feel slower.
- Respect reduced-motion / performance settings; ensure the UI is fully usable without
  animation.
- **Never** use animation/notification as a feature advertisement.

## Graphic elements

- Use graphic elements (backgrounds, separators, borders) sparingly and with restraint;
  they should clarify structure, not add clutter.
- Use system/shared resources so elements scale and adapt to themes and dpi.

## Sound

- Sound is a secondary, optional communication channel: use it to complement visual
  feedback, never as the only way to convey information.
- Follow the standard Windows sound scheme; associate sounds with standard events.
- Keep sounds minimal and brief; respect the user's sound settings and allow sounds to be
  turned off.
- Don't use sound for trivial or frequent events.

