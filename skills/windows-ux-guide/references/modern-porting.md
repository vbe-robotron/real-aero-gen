# Modern Porting Notes (Retina/4K, rem scaling, aspect ratios)

Porting overlay for reproducing this era's UI on modern displays. **Not** from the UX
Guide text (the source is frozen at 2010); it records how to keep the *look and
proportion* of that guidance alive at today's pixel densities and viewport sizes.

Core rule, stated once:

> Match the **visual scale** to the modern viewport (use `rem`, respect the user's
> font-size/zoom, don't hard-code 12px), and simulate the era's **pixel tightness only in
> texture density and line sharpness** — the 1px highlights, inner strokes, and hairline
> borders that make Aero read as Aero.

## 1. Font fallback stack

The era's system font is **Segoe UI 9 pt**, with **Meiryo / Meiryo UI** for Japanese.
On modern machines (and especially in a browser) not all of those exist, so use an
explicit stack, in this order:

```css
--font-ui:
  "Meiryo UI", Meiryo,                                   /* Japanese-first: era JA glyphs */
  "Segoe UI", "Segoe UI Variable Text",                  /* Windows Latin system font     */
  Myriad, "Myriad Pro", "Myriad Set Pro",                /* classic Humanist fallback     */
  Hind,                                                  /* Google, very close metrics    */
  "Noto Sans", "Noto Sans JP", "Noto Sans CJK JP",       /* broad-script safety net       */
  system-ui, sans-serif;
```

- **Order rationale**: Meiryo/Meiryo UI first so Japanese UI text gets the era's glyph
  design and full-width metrics; Latin-only hosts fall through to Segoe UI, then Myriad,
  then the free fallbacks.
- **Ribbon / narrow command text**: prefer **Meiryo UI** over Meiryo (glyphs, tracking and
  line spacing tuned for the narrow text boxes of the ribbon).
- **Web distribution**: Segoe UI, Meiryo and Myriad are OS/commercial fonts — reference
  them by name only, never `@font-face`-embed them. Hind and the Noto Sans series are
  OFL, so they are the only safe ones to ship.
- **Never** use synthesized italics on Meiryo/Meiryo UI or the Noto CJK faces; use the
  real italic face or don't use italic.
- Don't mix families within one surface: pick the stack and let it resolve. Font *sizes*
  still follow the era's role table (see §2).
- Pair `font-weight` with the era look: regular (400) for body, semibold/600 for headings
  and main instructions; avoid 300 (too thin, loses the ClearType-era texture).

## 2. Scaling: keep the proportions, not the pixel counts

Era sizes are **device pixels at 96 dpi** (9 pt = 12 px). A literal
`font-size: 12px` on a 4K/Retina display is a grain of rice — unreadable relative to the
screen. Keep the *ratios* and let the modern viewport set the scale:

- Express all type and chrome in **`rem`** (never bare `px`) so browser/user font-size,
  page zoom and OS scaling all work as users expect.
- Anchor one token, `--ui-scale`, and derive everything from it:

```css
:root {
  --ui-scale: 1;                 /* 1 = comfortable; 0.9 = dense/era-compact */
  --ui-font: calc(0.875rem * var(--ui-scale));   /* body text            */
  --ui-font-sm: calc(0.8125rem * var(--ui-scale)); /* caption, disabled  */
  --ui-font-lg: calc(1.125rem * var(--ui-scale));  /* main instruction   */
  --ui-line: 1.4;
  --hairline: 1px;               /* see §3 */
}
```

- **Era role → modern token** (roughly ×1.15–1.2, i.e. one step bigger than the era's
  literal pixels, so proportions survive at modern densities):

| Era role | Era size (96 dpi) | Modern token | Notes |
| --- | --- | --- | --- |
| Caption | 9 pt = 12 px | `--ui-font-sm` (13 px) | smallest size to still look intentional |
| Instruction / BodyText / Disabled / Hyperlink | 9 pt = 12 px | `--ui-font` (14 px) | default UI text |
| Main instruction (blue `#003399`) | 12 pt = 16 px | `--ui-font-lg` (18 px) | keep the 1.5× jump over body text |
| Window/dialog chrome | — | inherit `--ui-font` | never let chrome text be the smallest |

- **Keep the ratios that carry meaning**: main instruction ≈ 1.28× body text; caption ≈
  0.93× body text; control heights, margins and paddings scale with the same token.
- Scale **lengths** (padding, control height, icon box, taskbar reserve) with `rem`; the
  era's *density* is then reproduced by keeping the spacing ratios, not by keeping
  `height: 23px`.
- Reserve ~48 relative pixels of taskbar at 96 dpi → in rem terms keep the reserved band
  proportional to viewport height (`--taskbar-h`), not a fixed 48 px.
- **Don't** scale type with `vw` — it breaks zoom and user font-size preferences; if a
  fluid type step is wanted use `clamp()` around the rem token only.

## 3. Texture and line sharpness: the era's 1px tightness

This is the only place literal pixels are still allowed — and should be enforced.

- **1px is the texture.** Aero's chrome is defined by a 1px outer stroke plus a 1px inner
  highlight (glass edge). Keep those at hairline width even though everything around them
  grew:
  - `box-shadow: inset 0 1px 0 rgba(255,255,255,.65), 0 0 0 1px rgba(0,0,0,.28);`
  - borders: `border: var(--hairline) solid …`, not `2px`/`3px` "scaled up" borders.
- **On DPR ≥ 2** a CSS 1px is 2+ device pixels and reads as a fat, cheap line. Thin the
  hairline to keep the *device-pixel* tightness:

```css
@media (min-resolution: 2dppx) { :root { --hairline: 0.5px; } }
```

  (Fallback for engines that still snap 0.5px to 1px: keep 1px and lower the stroke's
  alpha rather than its width.)
- **Highlight/shadow density stays era-tight**: 1px inner highlight at the top edge,
  1px shade at the bottom edge, gradients with the era's *stop ratios* (light upper half,
  darker lower half) — scale the element, not the stop count.
- **Don't** solve sharpness by downscaling a screenshot of the era UI, and don't blur:
  crisp 1px strokes are the point. Prefer vector-ish CSS (gradients, shadows, filters) so
  chrome is resolution-independent except for the hairlines.
- Icons: use the era's multi-resolution assets (16/32/48/256) rather than letting one
  bitmap stretch. At DPR ≥ 2 either build 2× assets or use the 32x32 at 16x16 logical size
  (integer scaling only) — never non-integer scaling.
- Glass is a **second layer**, not a texture: the 1px edge stays crisp on top of it
  (`backdrop-filter` must not swallow the frame strokes). See §3.1 — an opaque
  gradient fill is *not* a substitute for the composition.

### 3.1 Aero glass is DWM's blur composite — not an opaque grey fill

The era's "glass" is not a colour. It is the **Desktop Window Manager compositing the
blurred desktop behind the window**. Port the composition, not a grey-blue paint: a
frame that is opaque is, by definition, not glass, and reads as plastic.

What the DWM does (Win32 desktop-composition docs, see `sources.md`), and what to
reproduce:

| DWM behaviour | Win32 API / constant | Web equivalent |
| --- | --- | --- |
| The frame is composited over the desktop with the backdrop blurred behind it | `DwmEnableBlurBehindWindow` / `DWM_BLURBEHIND` (`fEnable`, `hRgnBlur`) | `backdrop-filter: blur()` on the frame layer |
| The frame extends into the client area: **left 8, right 8, bottom 20, top 27 px** (the 27px top band is the title bar) | `DwmExtendFrameIntoClientArea(hwnd, MARGINS)` | one frame layer with those proportions — the document/client area stays **opaque**, don't blur it |
| Extending the frame absorbs the client's thin black border; the frame supplies the edge | extended frame draws 1px outer stroke + 1px inner highlight | `box-shadow: 0 0 0 1px <outer>, inset 0 1px 0 <highlight>` |
| Caption text is drawn with a white glow so it survives on glass | `DrawThemeTextEx` + `DTT_COMPOSITED \| DTT_GLOWSIZE`, `iGlowSize = 15` | layered white `text-shadow`: a 1px core plus a soft halo |
| An inactive window loses the frame's *colour*, not its transparency | frame material desaturates when not active | lower `saturate()` on the inactive frame, same blur |
| Maximized windows get no shadow and no rounded corners | DWM drops the frame around a maximized window | remove `box-shadow`/`border-radius` when maximized |
| Dragging/resizing belongs to the frame, not the client | `WM_NCHITTEST` 3x3 grid (8px edges, 20px bottom, the 27px top band = `HTCAPTION`) | size cursor/hit areas to the same bands |

Recipe (frame layer only):

```css
:root {
  --glass-blur: 20px;                     /* the blur is what makes it glass        */
  --glass-sat: 1.6;                       /* DWM tints glass; desaturate inactive   */
  --glass-top: rgba(240, 248, 255, .52);  /* tint only — never a high-alpha fill    */
  --glass-mid: rgba(208, 229, 250, .40);
  --glass-bot: rgba(170, 202, 234, .34);
}
.glass-chrome {                           /* = the extended frame                    */
  background: linear-gradient(var(--glass-top), var(--glass-mid) 42%, var(--glass-bot));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  box-shadow: inset 0 var(--hairline) 0 rgba(255, 255, 255, .9),  /* keep §3's edge  */
              0 0 0 var(--hairline) rgba(0, 0, 0, .38);
}
```

Era caveats worth knowing (they explain a naive port's disappointment): the effect is
**absent on Windows Vista Home Basic** — those regions render opaque — and **from Windows 8
the `DwmEnableBlurBehindWindow` call no longer produces a blur** because of a change in how
windows are rendered. So the old API is not a fallback you can call; the composition has to
be reproduced (and faked opaquely when it can't be, §3.2).

### 3.2 Traps that silently turn the glass back into plastic

- **A `filter` on an ancestor creates a *backdrop root* and breaks `backdrop-filter`
  underneath it** — the subtree stops sampling the desktop and often renders flat or
  empty. This is why window shadows are `box-shadow`, **not**
  `filter: drop-shadow(...)`, on any element that contains a glass layer. If a
  silhouette shadow is really needed, draw it on a separate element *behind* the glass.
  (`opacity < 1`, `mask`, and `will-change` on an ancestor can do the same damage.)
- **Raising the fill's alpha is not a fix for legibility.** Legibility on glass comes
  from the glow (§3.1) and the 1px edge. If the tint has to become opaque to look right,
  the blur is missing — fix the composition, don't repaint the fill.
- **Don't blur the client area or scrolling content.** DWM blurs the frame/extended
  region; blurring a document area both contradicts the reference and costs frames
  (principle 8, "performance is the UX killer"). One blurred frame layer per window.
- **Always provide the opaque fallback**: `@supports not (backdrop-filter: blur(1px))`,
  high contrast mode (Windows itself turns transparency off there — mirror it), and users
  who ask for reduced transparency. Keep it a token swap to the era's opaque values, so
  the layout and the 1px texture are identical either way.


## 4. Aspect ratios: 4:3 and 16:10, *not* 16:9

The era sat at the transition between square-ish and widescreen monitors, and its
"widescreen" was **16:10**, not today's 16:9:

| Ratio | Era resolutions | Role |
| --- | --- | --- |
| **4:3** | 800x600 (minimum), 1024x768 (design target), 1280x960 | dominant install base |
| **5:4** | 1280x1024 | common "big" LCD of the era |
| **16:10** | 1280x800, 1440x900, 1680x1050, 1920x1200 | the era's widescreen standard |
| 16:9 | 1366x768, 1600x900, 1920x1080 | very late transition; **not** the design assumption |

Consequences for a modern port:

- **16:9 has less vertical room than 16:10 at the same width.** A dialog laid out for
  1440x900 (16:10) will clip at ~1366x768 (16:9) once browser/OS chrome is subtracted.
  Budget vertical space against the **4:3 / 16:10** targets, then verify the 16:9
  worst case (1366x768) as an extra.
- Size constrained surfaces with `max-height: calc(100dvh - <chrome>)` plus internal
  scrolling so no era-faithful layout is cut off; never assume the era's taller canvas.
- Keep **upper-left anchoring** and progressive disclosure of information as the window
  grows; ultrawide screens just add empty (or max-width-capped) space — don't stretch
  content to fill 21:9.
- Validate at: **1024x768 (4:3)**, **1280x1024 (5:4)**, **1440x900 / 1920x1200 (16:10)**,
  and **1366x768 (16:9 worst case for height)**, plus 200% zoom.
- Minimum supported size is still 800x600 effective (640x480 for safe-mode-critical UI);
  on modern viewports that means the layout must survive a *very* short window, so test by
  resizing tall/wide, not only by resolution.


## 5. Quick recipe (tokens to copy)

```css
:root {
  --ui-scale: 1;
  --font-ui: "Meiryo UI", Meiryo, "Segoe UI", "Segoe UI Variable Text",
             Myriad, "Myriad Pro", "Myriad Set Pro", Hind,
             "Noto Sans", "Noto Sans JP", "Noto Sans CJK JP", system-ui, sans-serif;

  --ui-font:    calc(0.875rem  * var(--ui-scale)); /* 14px: body/instruction */
  --ui-font-sm: calc(0.8125rem * var(--ui-scale)); /* 13px: caption/disabled */
  --ui-font-lg: calc(1.125rem * var(--ui-scale));  /* 18px: main instruction */

  --hairline: 1px;          /* 2dppx: 0.5px */
  --hl-inner: rgba(255, 255, 255, .65);
  --stroke:   rgba(0, 0, 0, .28);
  --taskbar-h: calc(3rem * var(--ui-scale));

  /* Aero glass (§3.1): the frame blurs the desktop and tints it — the tokens are
     tint + blur strength, never an opaque fill; the .52/.40/.34 stops are the point. */
  --glass-blur: 20px;
  --glass-sat: 1.6;
  --glass-top: rgba(240, 248, 255, .52);
  --glass-mid: rgba(208, 229, 250, .40);
  --glass-bot: rgba(170, 202, 234, .34);
  --shadow-win: 0 1px 2px rgba(0, 0, 0, .18), 0 8px 24px rgba(0, 0, 0, .28);
  /* must stay a box-shadow: filter: drop-shadow() here would be a backdrop root (§3.2) */
}
@media (min-resolution: 2dppx) { :root { --hairline: 0.5px; } }

.chrome-quiet {                     /* in-window chrome: opaque, era-tight texture */
  border: var(--hairline) solid var(--stroke);
  box-shadow: inset 0 var(--hairline) 0 var(--hl-inner);
  background: linear-gradient(to bottom, #fdfefe 0 50%, #eef2f6 50% 100%);
}
```

## 6. Do / Don't

| Do | Don't |
| --- | --- |
| `font-size: var(--ui-font)` in `rem` | `font-size: 12px` copied from the era |
| Scale chrome with the same token as type | Scale type but leave 23px controls/48px taskbar |
| Keep 1px outer stroke + 1px inner highlight | Scale highlights to 2–3px, or blur/downscale screenshots |
| `backdrop-filter` on the frame; `box-shadow` for the window shadow | An opaque grey-blue fill called "glass", or `filter: drop-shadow()` on a glass ancestor (§3.1–3.2) |
| Drop shadow/radius when maximized, desaturate when inactive | Keep the frame identical active/inactive, or shadowed when maximized |
| Validate at 4:3, 5:4, 16:10 (+1366x768) | Design to 1920x1080/ultrawide and call it era-faithful |
| Ship Hind / Noto Sans; name Segoe UI, Meiryo, Myriad | `@font-face`-embed OS/commercial fonts |
| `prefers-reduced-motion`, high contrast, 200% zoom | Assume a desktop denser than 1.25 device px ratio |

## 7. Related files

- `visuals.md` — era font roles, layout metrics, resolution/dpi guidance.
- `ja-overview.md` — Meiryo vs Meiryo UI, ribbon text areas.
- `checklists.md` — pre-flight items for the above.
- `sources.md` — provenance, incl. the DWM desktop-composition API docs §3.1 paraphrases.

