# Japanese Overview Highlights (Windows ユーザー エクスペリエンス ガイドライン)

Source: the Japanese *Windows ユーザー エクスペリエンス ガイドライン* overview booklet
(52 pages), excerpted from the UX Guide online version
(<http://msdn.microsoft.com/ja-jp/library/aa511258.aspx>). It covers Design Principles,
Windows Environment (Desktop, Taskbar, Ribbon, Touch) and the Meiryo/Meiryo UI fonts.
Content is preliminary and subject to change.

## Design principles (デザイン原則)

Same 14 principles as the English guide. Useful Japanese key phrases:

- コンセプトを減らして、信頼を高める (reduce concepts to increase confidence)
- どんなに小さなことも重要である (small things matter — 操作は少ないほどよい)
- "外観" と "内容" を重視する (be great at look and do)
- 探し回ることのないように、見つけやすくする (solve discoverability, not distractions)
- 開始前の UX と質問 → 質問量を少なく、質問は 1 回、構成による値の設定を要求しない
  (UX before knobs and questions; ask once)
- カスタマイズではなく、個人設定にする (personalization, not customization)
- エクスペリエンスのライフ サイクル (install/creation, first use/customization, regular
  use, management/maintenance, uninstall/upgrade; validate as if used for 12 months)
- モバイル ユーザー向けに作成する (build for people on the go)

## Desktop (デスクトップ) and Taskbar (タスク バー)

- Desktop: same rule as the English guide — only offer a desktop shortcut when users are
  very likely to use the program frequently, and present the option **off by default**
  (既定ではオフ). Users rarely remove unwanted icons, so the desktop becomes cluttered.
  Offer a **single** shortcut, label it so it never truncates.
- Taskbar = the desktop access point for programs (デスクトップ プレゼンス). Windows 7
  taskbar button features the booklet highlights:
  - **Jump List (ジャンプ リスト)** — context menu on the taskbar button / Start menu item
    for frequent destinations and commands.
  - **Thumbnail toolbar (サムネイル ツール バー)** — quick commands on a window's thumbnail.
  - **Overlay icon (オーバーレイ アイコン)** — status shown on the taskbar button icon.
  - **Progress bar (進行状況バー)** — progress of a long-running task on the button.
  - **Sub-window taskbar buttons (サブ ウィンドウのタスク バー ボタン)** — switch directly
    to window tabs, project windows, MDI children, sub-windows.
  - **Pinned taskbar buttons (固定タスク バー ボタン)** — pin a program even when not
    running (user opt-in).
- **Flashing taskbar buttons (タスク バー ボタンの点滅)**: use sparingly, only when the
  user must act soon; a flashing button is disruptive. Don't flash for something the user
  can simply notice. Flash only **one** button — flashing several is needless and
  distracting. Remove the highlight when the program becomes active, and present a clear
  action (usually a dialog box) so the interruption is justified.
- **Jump List design**: satisfy the user's everyday task goals. Think about the program's
  purpose and what users are most likely to do next (document programs → recent documents;
  content viewers → frequent resources; others → new messages/videos/next meeting). Keep
  entries the user cares about. Don't over-fragment destinations (list the top-level home
  page, not every page; list the album, not every song). Don't fill every Jump List slot
  if unused — focus on the most useful items. Use **1 to 3 groups**, always group items,
  label the groups; 4+ groups makes items hard to find.
- **Quick Launch (クイック起動)**: place a shortcut there only if the user opts in; since
  Windows 7 removed Quick Launch, programs designed for Windows 7 need not add Quick
  Launch shortcuts or offer the option.


## Ribbon (リボン)

The ribbon is the modern Windows command surface: it minimizes clicks and trial-and-error
so users find, understand, and use commands directly without Help. It **replaces** the
menu bar and toolbar.

Elements: アプリケーション ボタン (Application button) · クイック アクセス ツール バー
(Quick Access Toolbar) · コア タブ (core tabs, always shown) · コンテキスト タブ
(context tabs, shown for a selected object type) · タブ セット (tab sets per object type)
· モーダル タブ (modal tabs, e.g. Print Preview) · ギャラリー / リボン内ギャラリー
(gallery, in-ribbon gallery; result-based galleries show effects) · 拡張ツールヒント
(enhanced tooltips: description + shortcut key + graphic/Help reference) · ダイアログ ボ
ックス起動ツール (dialog box launcher at the bottom of a group).

Guidelines:
- Don't combine the ribbon with a menu bar or toolbar in the same window (it replaces
  them); palette windows and navigation elements — Back/Forward, address bar — may
  coexist.
- Always combine the ribbon with the Application button and Quick Access Toolbar.
- Select the leftmost tab (usually Home) on launch; don't preserve the last selected tab
  across program instances.
- On first launch show the ribbon in its normal (unminimized) state; many users rarely
  change it. Preserve the ribbon state across instances (if minimized, show minimized next
  time).
- Add a new tab only when it can be described exactly by its label and doesn't force
  excessive tab switching for common tasks; ensure most work can be done on the Home tab.
- Don't assume an efficient ribbon is easy to make — it is not a mechanical port of a
  menu bar + toolbar; verify it scales properly.
- Make frequently used commands visible; don't hide commands (hiding changes layout and
  breaks consistency). Common commands use 32x32 icons; don't convert 16x16-only
  commands to 32x32. Within a group, put 32x32-icon commands before 16x16 ones; allocate
  a 3rd tab for a commonly-used extra tab.
- Use in-ribbon galleries for a well-defined set of related choices presented graphically
  (16x16, 48x48, or 64x48 thumbnails; up to 128x128 in other contexts) when the choices
  are limited and users benefit.

## Touch (タッチ)

Touch is best for manipulating objects and issuing simple commands; it becomes the
spotlight for poor design. Principles: simplicity (簡単), efficiency (効率性),
responsiveness (応答性), and forgiveness/tolerance (寛容性).

### What touch teaches (タッチの対話操作モデル)
- **Small controls are hard to use**: controls need at least **23x23 px (13x13 DLU)** to
  be touchable; **40x40 px (23x22 DLU)** or larger is comfortable. Start menu
  (42x35 px) is easy; a spin control (15x11 px) is too small for fingers.
- Keep tasks in a **narrow range**: moving the pointer 30 cm on screen is 6 cm with a
  mouse but 30 cm with touch. Minimize travel between distant targets — context menus
  help because they need no hand travel.
- **Hover is not reliable**: most touchscreens detect pen hover but not finger hover, so
  tasks that depend on hover can't be done efficiently by touch.
- **Text entry and selection are hard**: long text is especially difficult; auto-complete
  and acceptable default text help. Precise caret placement is hard — design so it isn't
  needed.
- **Small targets near display edges are very hard** (bezel width, lower edge
  sensitivity) — e.g., window title-bar buttons get awkward when maximized.

### Design guidelines
- Accept only valid values via controls whose range is constrained: lists and sliders
  beat text boxes because they reduce text input.
- Choose appropriate defaults: default to the safest/most secure option (prevent data loss
  or lost system access); otherwise choose the most-used or most convenient option to save
  unnecessary interaction.
- Provide **auto-complete** for text: a list of most-used or recently-used values.
- Don't assume a UI that works well with a mouse works well with touch. Don't rely on the
  touch pointer (a mouse pointer controlled by touch) to fix touch problems — it's a last
  resort for programs not designed for touch. Making a program touch-capable also greatly
  helps pen support; fingers need bigger targets and hover must be optional.

### Forgiveness (寛容性)
- Provide an **Undo** command; ideally every command can be undone.
- When practical, give finger-contact feedback but **don't apply the operation until the
  finger lifts**, so users can correct mistakes; if the operation applies on lift, let
  users slide to correct while still touching.
- Resist motion to show that direct manipulation isn't possible; if something does move,
  return it to its original position when released to signal the operation is recognized
  but unsupported.
- Physically separate frequently used commands from risky commands. A command is risky if
  its result is broad and not easily undone, or its result isn't immediately visible.
- **Confirm risky or unintended-consequence operations** with a confirmation dialog box.
  Consider confirming other operations that are commonly touched by accident, unnoticed,
  or hard to undo (everyday-action confirmations) — but suppress unnecessary confirmation
  in general; show the confirmation **only when the command was initiated by touch**.

## Meiryo and Meiryo UI (メイリオと Meiryo UI)

Text is the UI element users see most. **Segoe UI** is the Windows system font for
Western text; for Japanese text display, **Meiryo (メイリオ)** is the standard. The default
font size for both Western and Japanese text is **9 point**.

Windows 7 introduced the **ribbon** control, which is icon-heavy and whose text areas are
often narrower than those of ordinary UI. **Meiryo UI** is optimized for text on the
ribbon.

- Meiryo and Meiryo UI are separate fonts, both ClearType-optimized, highly legible
  Japanese fonts.
- **Meiryo**: all Japanese characters are designed at the standard full-width (全角) used
  in Japanese typesetting, readable for both body text and UI text across generations.
- **Meiryo UI**: as its name implies, its katakana and hiragana (common in UI) have
  adjusted glyph shapes, letter spacing, and line spacing so legibility is preserved even
  in narrow areas — optimized for the Windows 7 ribbon UI platform.

### Modern fallback stack (see `modern-porting.md`)
On today's machines the era fonts are not all installed, so name them in this order and
let the host resolve — **Meiryo UI / Meiryo → Segoe UI → Myriad → Hind → Noto Sans
series** — then `system-ui`. Keep the era's *role ratios* (body 9 pt vs main instruction
12 pt) in `rem` rather than copying `12px`, which is unreadable on a Retina/4K viewport.
Meiryo, Segoe UI and Myriad are OS or commercial fonts (name them); Hind and the Noto
Sans series are OFL and are the only ones safe to embed.

