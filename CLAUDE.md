# CLAUDE.md

Behavioral guidelines + project context. Loaded automatically at session start.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## Behavioral Principles

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

---

## Project Context

Wikascolemon: a fan-made Pokédex wiki (in Italian) of imaginary Pokémon from the
alta valle del Tronto / Piceno area, styled after Pokémon Central Wiki.

### Stack
- Pure static HTML/CSS — no build tools, no JS frameworks, no dependencies
- Each Pokémon page is a single self-contained `.html` file: inline `<style>`, embedded artwork (base64/SVG), UTF-8, Italian content

### Structure
- `Wikascolemon/` — the published wiki (git repo, deployed via GitHub Pages: https://g95g95.github.io/Wikascolemon/). Contains `index.html`, `README.md`, and one page per Pokémon.
- `schede _Pokemon/` — working/draft folder with page drafts and `tasks/todo.md` (current work plan). Not a git repo.
<!-- TODO: confirm the exact draft → Wikascolemon promotion workflow -->

### Key Commands
No build or test commands — pages are opened directly in a browser.
Deploy = commit & push inside `Wikascolemon/` (GitHub Pages serves the branch).

### Conventions
- New Pokémon pages: clone the structure of an existing page (e.g. `segaccio.html`) — keep the Pokémon Central Wiki look, type-color CSS variables, infobox, stats bars, responsive layout
- Pages must stay fully self-contained: no external assets, links only between local pages
- Sequential Pokédex numbering (#044 Pito, #045 Pozza, #046 Umito, #047 Segaccio, ...)
- When adding a page: update navigation links in adjacent pages, `index.html`, and the `README.md` table

### External Dependencies
- GitHub Pages site: https://g95g95.github.io/Wikascolemon/ (repo `Wikascolemon/`)

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
