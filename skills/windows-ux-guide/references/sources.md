# Sources & Provenance

## What this skill is based on

1. **Windows User Experience Interaction Guidelines** ("UX Guide") for Windows 7 /
   Windows Vista, © 2010 Microsoft Corporation. Last updated 2010-09-29. Landing page:
   <https://learn.microsoft.com/en-us/windows/win32/uxguide/> — Microsoft's own note on
   that page: *"This design guide was created for Windows 7 and has not been updated for
   newer versions of Windows. Much of the guidance still applies in principle, but the
   presentation and examples do not reflect our current design guidance."* The material we
   summarized is the printable/book form (882 pages); page references in the topic files
   correspond to that form.
2. **Windows ユーザー エクスペリエンス ガイドライン** (Japanese overview booklet, 52
   pages), an excerpt of the online UX Guide
   (<http://msdn.microsoft.com/ja-jp/library/aa511258.aspx>). The Japanese online version
   lives at <https://learn.microsoft.com/ja-jp/windows/win32/uxguide/>. It covers Design
   Principles, Desktop, Taskbar, Ribbon, Touch, and the Meiryo/Meiryo UI fonts.

These are Microsoft's documents; this skill only paraphrases and summarizes them for
reference during design/code review. Attribution is in `SKILL.md`; Microsoft reserves all
rights to the original material.

**Additions beyond the source:** `modern-porting.md` is *not* from the UX Guide — it is a
porting overlay (font fallback stack, rem scaling for high-DPI viewports, 1px chrome
texture, Aero glass compositing, era aspect ratios) recorded for applying this 2010-era
guidance on modern displays. Treat the guide-derived files as authoritative on the era's
intent, and `modern-porting.md` as the bridge to current rendering.

### Additional sources for the porting overlay (Aero glass, `modern-porting.md` §3.1–3.2)

The glass rules are paraphrased from Microsoft's Win32 **desktop composition** reference,
not from the UX Guide (the 2010 Guide describes the look, not how it is rendered):

- *DWM Blur Behind Overview* — <https://learn.microsoft.com/en-us/windows/win32/dwm/blur-ovw>
  — `DwmEnableBlurBehindWindow`, the `DWM_BLURBEHIND` structure and its `DWM_BB_ENABLE` /
  `DWM_BB_BLURREGION` flags, `hRgnBlur` (`NULL` = whole window), and the `MARGINS {-1}`
  "sheet of glass" case. Two caveats come from the same page and drive the fallback rule:
  Windows Vista **Home Basic** renders those regions opaque, and **from Windows 8 the call
  no longer produces the blur** (window rendering style changed).
- *Custom Window Frame Using DWM* —
  <https://learn.microsoft.com/en-us/windows/win32/dwm/customframe>
  — `DwmExtendFrameIntoClientArea` with `MARGINS` **8/8/20/27**, the client's thin black
  border being absorbed by the extended frame, `HitTestNCA`'s `WM_NCHITTEST` 3x3 table
  (and the `HTCAPTION` top band), and `DrawThemeTextEx` with
  `DTT_COMPOSITED | DTT_GLOWSIZE`, `iGlowSize = 15` for caption text that survives on glass.

Both pages are current Microsoft Learn documentation (Win32 APIs); attribute the original
text to Microsoft as above.

## Documented extraction (how the reference files were derived)

The topic files were distilled from plain-text extractions of the two documents. The
English extraction preserved **one form-feed (`\f`) per page** (882 pages), which lets a
script address content by page number.

### Regenerating the text

1. Obtain the two documents from Microsoft (the printable UX Guide PDF and the Japanese
   overview booklet). They are linked from the landing pages above and were historically
   hosted on the Microsoft Download Center / MSDN. Save them locally, e.g.
   `uxguide_en.pdf` and `uxguide_jp.pdf`.
2. Extract text with page breaks preserved (Poppler):

   ```bash
   sudo apt-get install -y poppler-utils   # provides pdftotext
   pdftotext -layout uxguide_en.pdf /tmp/uxguide_en.txt
   pdftotext -layout uxguide_jp.pdf /tmp/uxguide_jp.txt
   # pdftotext keeps page breaks (\f) by default; do NOT pass -nopgbrk.
   ```

   Each `\f` in the output marks a page boundary, so "page N of 882" equals the Nth
   `\f`-delimited segment.

### Splitting by page range and by section

The working files under `/tmp` were produced by splitting that page array. Each output
chunk is prefixed with a `PAGE n` marker so quotes can be traced back to a page (chapter
overviews used `===== PAGE n =====`, the focused dumps `== PAGE n ==`):

```python
txt = open('/tmp/uxguide_en.txt', encoding='utf-8', errors='replace').read()
pages = txt.split('\f')            # pages[i-1] is page i (883 segments for 882 pages)

def dump(name, start, end, sep='=====', path='/tmp'):
    """Write pages [start, end] inclusive as <path>/<name>.txt with page markers."""
    chunk = '\n'.join(f'\n{sep} PAGE {i} {sep}\n{pages[i-1]}' for i in range(start, end+1))
    with open(f'{path}/{name}.txt', 'w', encoding='utf-8') as f:
        f.write(chunk)

# Chapter overviews (sec_<name>.txt): from the chapter's first page to the end of its
# introductory overview, before the first detailed guideline subsection.
dump('sec_design_principles', 3,   32)   # Design Principles
dump('sec_controls_intro',    33,  45)   # Controls
dump('sec_commands_intro',    221, 245)  # Commands
dump('sec_text_intro',        298, 326)  # Text
dump('sec_messages_intro',    326, 345)  # Messages
dump('sec_interaction_intro', 399, 420)  # Interaction (Keyboard/Mouse)
dump('sec_windows_intro',     472, 495)  # Windows
dump('sec_visuals_intro',     588, 660)  # Visuals
dump('sec_experiences_intro', 701, 712)  # Experiences
dump('sec_wins_env_intro',    749, 770)  # Windows Environment

# Focused dumps (p_<name>.txt): the ranges consulted while writing each topic file.
dump('p_msgs2',     355, 398, sep='==')   # error / warning / confirmation messages
dump('p_exp2',      713, 748, sep='==')   # setup, first experience, printing
dump('p_env2',      749, 840, sep='==')   # desktop, Start menu, taskbar, ... Help, UAC
dump('p_winframes', 475, 490, sep='==')   # window frames / standard window layout
dump('p_touch',     434, 460, sep='==')   # mouse / touch interaction
dump('p_fonts',     619, 625, sep='==')   # fonts
dump('p_color',     625, 635, sep='==')   # color
dump('p_icons',     635, 650, sep='==')   # icons
```

(Line endings tolerated here: the `p_*` dumps above reproduce the originals byte-for-byte;
the `sec_*` ranges cover each chapter's overview pages.)

The Japanese booklet was split the same way (`/tmp/uxguide_jp.txt`); its `\f`-delimited
pages contain the Desktop (デスクトップ), Taskbar (タスク バー), Ribbon (リボン), Touch
(タッチ) and Meiryo/Meiryo UI sections summarized in `ja-overview.md`.

### Conventions used in the reference files

- Each file states the source pages it was distilled from.
- Guidance is paraphrased, then grouped under the UX Guide's own guideline headings
  (`Guidelines`, `If you do only …`, per-topic subsections) for easy lookup.
- Where the guide gives a numeric constant (control sizes, DPI, gadget dimensions, touch
  targets), the number is preserved.

## Versioning caveat

The source is frozen at Windows 7/Vista (2010). Treat it as a baseline for **classic
desktop / Aero-style UI**, and flag deviations when targeting modern Windows (Fluent,
WinUI, touch-first, dark mode) — see the scope note at the top of `SKILL.md`.
