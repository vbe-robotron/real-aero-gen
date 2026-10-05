# Text Reference (UI Text, Style, Tone)

Source: UX Guide, "Text" (pages 298-325).

## Core idea

Users **scan**, they don't read. Write UI text for scanning and use the **inverted
pyramid**: lead with the essential takeaway, then progressively more detail, with a Help
link for the rest.

If you do only five things:
1. Work on text early — text problems often reveal design problems.
2. Design text for scanning.
3. Eliminate redundant text.
4. Use easy-to-understand text; don't over-communicate.
5. Link to Help for more detailed information when necessary.

## Usage patterns

- **Title bar text** identifies a window or the source of a dialog box.
- **Main instruction** is a specific statement, imperative direction, or question that
  states the user's objective (not just UI manipulation).
- **Supplemental instructions** elaborate on the main instruction with context or
  terminology — without rewording it.
- **Control labels** identify controls; place directly on/next to them.
- **Supplemental explanations** elaborate control labels (typically command links, radio
  buttons, check boxes).
- **Commit button labels** state the specific action/response.

## Guidelines

### General
- Remove redundant text across window titles, main/supplemental instructions, content
  areas, command links, commit buttons. Leave full text in the main instruction and
  interactive controls; strip redundancy elsewhere.
- Avoid large blocks of text: chunk into shorter sentences/paragraphs; use Help links for
  useful-but-nonessential info.
- Choose object names and labels that clearly communicate and differentiate purpose.

### Style and tone
- Ordinary, conversational terms; focus on user goals, not technology. Imagine explaining
  to the user over their shoulder.
- Be polite, supportive, encouraging. Never condescending, blaming, or intimidating.
- Use the second person ("you/your") and the present tense.
- Prefer active voice and direct verbs.
- Don't anthropomorphize the program or use jargon, slang, or idioms.

### Capitalization
- Title-style capitalization for titles (window titles, dialog titles, column headings,
  menu/tab labels, command button labels as needed).
- Sentence-style capitalization for all other UI elements (main/supplemental
  instructions, body text, control labels, checkbox/radio labels, tooltips).
- Exception: legacy apps may use title-style for command buttons, menus, and column
  headings to avoid mixing styles.
- Feature/technology names: conservative and consistent capitalization; typically only
  major components are capitalized.
- Don't capitalize generic UI element names (toolbar, menu, scroll bar, button, icon).
  Exceptions: Address bar, Links bar, ribbon.
- Don't use ALL CAPS for keyboard keys; follow standard keyboard capitalization.

### Punctuation
- Use ending punctuation on complete sentences; omit it for labels, tooltips, and short
  phrases.
- Use ellipses (`...`) only to indicate a command requires more input.
- Use sentence-style capitalization with sentence-ending punctuation for error text.

### Numbers, dates, times, globalization
- Follow platform conventions for dates/times; don't hard-code formats.
- Design for localization: avoid concatenating strings, allow 30%+ expansion, avoid
  ambiguous abbreviations, use complete sentences, and don't embed grammar in code.

## Accessibility of text

- Don't rely on color alone to convey meaning.
- Provide text alternatives for icons and graphics.
- Ensure sufficient contrast; use system colors so high-contrast themes work.
