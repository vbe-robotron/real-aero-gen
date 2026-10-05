# Experiences Reference (Branding, Setup, First Experience, Printing)

Source: UX Guide, "Experiences" (pages 701-748).

## Software branding

Branding is the **emotional positioning** of a product as perceived by customers — not
just logos and color schemes.

### Attributes of good branding
Clear, distinct style and personality · creates an emotional connection · high quality ·
strategically placed and consistently executed · aligns to overall brand strategy · long
lasting (as enjoyable the thousandth time as the first).

### Poor branding
No obvious theme · in the user's face · annoying · everywhere · custom look without user
benefit · quickly tiresome.

### Guidelines
- **Start with the product itself.** Unique functionality and attention to detail are the
  most powerful branding statements.
- **Choose a good product name**: memorable, distinctive, concisely conveys the benefit.
- **Prefer secondary branding elements over primary.** Use primary elements with
  restraint, in a few strategic experiences.
  - Primary: product name, logo, color scheme, product-specific sounds (not recommended
    for most programs).
  - Secondary: element shapes, icon/graphic styles, accent colors, animations,
    transitions, shadows, backgrounds/transparency.
  - Tertiary (use only for special programs such as games): custom window frames, custom
    controls.
- **Brand special experiences**, not everything: first experiences, main window/home page,
  start and completion of important tasks, important transitions, waiting time during
  long-running tasks, log on/log off.
- **Never brand the Windows desktop** (work area, Start menu, Quick Launch, notification
  area, gadgets). It's the user's entry point; leave the user in control.
- **Splash screens**: don't use them for branding, and don't use animated ones (users
  blame the animation for slow load times). Avoid them — they make users associate the
  program with slow startup.
- Use branding professionals; minimal good branding beats extensive annoying branding.

## Setup

Installing is the **one task all users must complete successfully**. Users don't enjoy
setup — they endure it.

### If you do only three things
1. Make setup as simple and lightweight as possible — trim every nonessential question,
   option, page, and path.
2. Design for all scenarios: unattended, scripted, and uninstall; separate setup phases
   cleanly for efficient unattended installs.
3. Let users resolve problems themselves, but log technical support information; provide
   clear error messages and consider a **Repair** option.

### Guidelines
- Apply the standard **wizard** guidelines for wizard-based setup.
- Allow restarting setup where the user left off; restore previous input.
- **Don't display setup windows maximized** — choose a size appropriate to the content.
- Name the file **Setup.exe** ("Install.exe" acceptable). For downloads, include the
  program name (e.g., `SetupVisualStudioExpress2008.exe`) to help organize the Downloads
  folder.
- Copy program files to the proper file system locations.
- **User Account Control**: digitally sign the setup executable; if elevation may be
  required, **elevate as late as possible** (only after the user commits to the install).
- Keep support-only details out of the user experience — write them to a **setup log
  file** instead.
- Provide practical solutions and Help links in setup errors.

## First experience

You have only one chance to make a good first impression — and it lasts.

> **If you do only one thing:** keep the first experience as simple as possible. Get the
> program working right away. Choose safe, secure, convenient defaults, and ask questions
> during setup and first use only when you must.

- Limit first experiences to tasks and settings **required** to use the program or feature,
  and only when there is no better alternative.
- Prefer safe, secure, convenient defaults; defer optional configuration until it's
  needed (progressive disclosure).
- Ask once: don't repeat introductory questions every launch, and don't show the same
  first-run experience on every start.
- Respect the user's time — the first experience should quickly get users to doing
  something useful, not to a series of setup pages.
- Don't use the first experience for marketing/branding pitches (feature advertisement);
  focus on getting started.
- Follow the standard window/dialog/wizard presentation for any UI shown.

## Printing

Printing is "the user experience on paper" — easy to overlook but part of the overall
experience.

### If you do only five things
1. Design a printing experience appropriate for your program type.
2. Review printing scenarios; make the need to print optional where possible.
3. Provide useful printing **extensions by customizing the Print common dialog** — don't
   create a custom Print dialog.
4. Optimize Print options for reprints and similar jobs.
5. Provide a **preview** feature whenever appropriate.

### Printing patterns by program type
- **Document programs** (word processors, spreadsheets, publishing): full-featured
  printing — page setup, preview, print options, multiple copies, ranges.
- **Image/graphic programs**: print the image, scale to page, and choose the printer;
  preview is essential.
- **Simple/utility programs**: minimal printing — delegate to the standard Print dialog
  and common Print command.
- **Programs with little/no printing**: make printing optional or omit it.

### Guidelines
- Use the **standard Print common dialog** and standard commands (Print, Print Preview,
  Page Setup) rather than custom dialogs.
- Provide a preview when layout/pagination matters; make preview read-only from the print
  flow.
- Remember and restore print settings per user; optimize for repeating the same job.
- Handle print errors gracefully: explain the problem, avoid scary/technical detail, and
  offer a practical next step. Use standard error guidelines.
- Don't require printing for core tasks; where printing is peripheral, keep it out of the
  primary workflow.

