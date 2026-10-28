# AGENTS.md

Guidance for AI coding agents working on this repository.

## Project

**ContaPesca** — corporate website for a Portuguese accounting, consulting and management firm (ContaPesca — Contabilidade, Consultadoria e Gestão, Unipessoal Lda.).

Rebuild of a Google Sites draft as a proper static website with a corporate/agency feel.

- Content language: Portuguese (PT-PT). English translation planned via a language toggle.
- Audience: Portuguese small/medium business owners and self-employed professionals.
- Tone: Professional, corporate, trustworthy, modern.

## Stack

Vanilla static site — no build step, no framework, no package manager.

- HTML5 (semantic)
- CSS3 (custom properties)
- Vanilla JavaScript (ES2020+)
- External libraries only via CDN `<script>` tags when strictly necessary
- Assets served directly from `/assets`

Do not introduce React, Vue, Svelte, TypeScript, Tailwind, Sass/Less, webpack, Vite, or any build tooling unless explicitly requested.

## Current repository layout

```
/
├── AGENTS.md
├── .gitignore
├── netlify.toml            # Netlify config (headers, cache rules)
├── index.html              # Single-page landing (hero, mission, services, new office, contact, footer)
├── privacidade.html        # Política de Privacidade / Privacy Policy (generated-style legal page, [data-legal])
├── termos.html             # Termos de Uso / Terms of Use
├── styles/
│   ├── main.css            # Imports only (order matters)
│   ├── base/               # tokens, reset, typography, layout (+ .ph), motion (reveal, reduced motion)
│   ├── components/         # buttons, header, cards, carousel, lightbox (office photo viewer, native <dialog>), tabs, map, stats, netlify-badge (hides Netlify's injected badge)
│   └── sections/           # hero, about, services, office, contact, footer
├── scripts/
│   ├── main.js             # Imports modules and calls init functions only
│   ├── i18n/               # pt.js, en.js (dictionaries), legal-pt.js / legal-en.js (legal pages only, merged when [data-legal] exists), index.js (setLang, initI18n)
│   ├── modules/            # menu, carousel, lightbox, quotes, tabs, reveal, map, hero-lines, year
│   └── utils/motion.js     # prefers-reduced-motion / hover helpers
└── assets/
    ├── favicon.png
    ├── full-logo.png       # Icon only (yellow interlocking brackets)
    ├── short-logo.png      # Icon + "ContaPesca" wordmark
    ├── office-front.jpg / office-meeting.jpg / office-meeting-close.jpg / office-entrance.jpg   # New office photos (hero carousel)
    ├── pedro-moura.jpg                          # Owner portrait
    ├── svc-*.jpg                                # Service tab photos
    └── icon-lines.svg      # Line-art version of the icon, path copied into scripts/modules/hero-lines.js (tiled wave pattern in the hero, CSS-animated, no mouse interaction)
```

**Rule:** one concern per file. Each component keeps its own media queries in its own CSS file; new CSS goes in the matching `components/` or `sections/` file and gets an `@import` in `main.css`. JS is native ES modules (`<script type="module">`, served over HTTP); each module exports an `init*` called from `main.js`. Do not create folders or files without a concrete need. Legal pages use styles/sections/legal.css. Update this section whenever the layout changes.

**Legal pages (privacidade.html, termos.html):** whenever their content changes, update the "Última atualização" / "Last updated" date to the date of the change, in the HTML and in both legal dictionaries (legal-pt.js / legal-en.js). Each page has its own key (privacidade.date, termos.date).

## Brand and design

- Flat colours only (no gradients, glow; blur only on the translucent bands over photos: carousel bar, portrait caption). Editorial / Swiss-inspired look, deliberately not generic "AI" styling.
- Tokens live in :root in styles/base/tokens.css: --ink #06080f, --navy #131634, --blue #4c6bcb, --yellow #e8bd48 (dark backgrounds / markers only), --paper #f6f4ee, --tint-blue, --tint-sand, --muted.
- Font: Instrument Sans (Google Fonts), display sizes in weight 400. Corners --radius: 2px; only pills and round buttons are rounded.
- Dark hero with an overlapping card row, off-white body, navy band for the new office section, black footer.
- No decorative dash ornaments and no slogans. The office map uses Leaflet (CDN) + OpenStreetMap tiles with a single custom marker (no API key).
- Unknown facts are visible [placeholders] marked with data-placeholder; search for it to list what is still missing. No placeholders remain; the homepage client testimonials are real quotes (PT verbatim as supplied, EN translation in en.js).
## Coding conventions

### HTML

- Semantic elements (`<header> <nav> <main> <section> <footer>`).
- `<html lang="pt">` by default.
- Meaningful `alt` text on images; `alt=""` for purely decorative.
- Visible focus states and accessible labels on interactive elements.

### CSS

- Design tokens as CSS custom properties, single source of truth.
- No inline styles unless dynamically computed.
- No `!important` unless overriding a third-party rule (with a comment).

### JavaScript

- `const` by default, `let` only when reassignment is required.
- `addEventListener`, not inline `on*`.
- Guard DOM queries (`if (!el) return;`).
- No committed `console.log`.

### Accessibility

- WCAG 2.1 AA minimum.
- Keyboard-operable, sufficient contrast, ARIA only when semantics are insufficient.

### Performance

- Lazy-load below-the-fold images, provide `width`/`height`.
- Prefer SVG for icons.
- No blocking third-party scripts.
- Target Lighthouse ≥ 95 across the board.

## Contact

- A single mailto: button (no form, no Netlify Forms). Subject follows the active language.

## Internationalisation

- Portuguese is the default and is written directly in the HTML. English lives in scripts/i18n/en.js (PT keys in scripts/i18n/pt.js, kept in sync).
- Elements use data-i18n="key" (text) and data-i18n-aria="key" (aria-label). setLang() swaps them, updates <html lang>, title and meta description.
- Language order: ?lang= query, localStorage('cp-lang'), then pt. No browser auto-detection.

## Local preview

- Run python -m http.server 5500 from the repo root and open http://localhost:5500 (add ?lang=en for English).
## Deployment

- Host: Netlify (free plan), team `contapesca-unipessoal`.
- Auto-deploy on push to `main`.
- Domain: `contapesca.pt` (registered at amen.pt).
- DNS stays at amen.pt; A record for apex to Netlify, CNAME `www` to `<site>.netlify.app`.
- SSL via Let's Encrypt through Netlify.

## Git conventions

- `main` is the deployed branch.
- Conventional Commits:
  - `feat: add services section to home`
  - `fix: correct mobile nav overflow`
  - `chore: update netlify security headers`
  - `docs: expand AGENTS.md`
  - `refactor: extract card component styles`
- One logical change per commit.
- Never commit secrets.

## Working with the maintainer

- **Never publish invented facts.** Do not put any company data (NIFs, addresses, phone numbers, email addresses, statistics, dates, names, titles) on the site unless it was explicitly supplied by the maintainer or copied verbatim from a source the maintainer designated as canonical (the original Google Sites screenshots, provided LinkedIn URL, etc.). If a piece of factual content is missing, leave it out or leave a clearly-marked placeholder — never guess.
- **Use existing copy verbatim.** The original Google Sites version is the source of truth for the site's text. Rewrites and improvements come later, only when the maintainer asks. Match phrasing, headings and CTAs from the original unless the maintainer says otherwise.
- **When in doubt about content, ask before writing.** A short question is cheaper than a wrong claim on a live site.
- **Verify visual/reference material before implementing.** If the maintainer shares an animation, screenshot or reference, study it carefully. Ask if the intended interpretation is unclear rather than guessing.
- **Never run `git add`, `git commit`, or `git push` without explicit approval.** File edits are fine; git operations are not. Wait for the maintainer to say "commit" / "push" / equivalent before touching git state.
- **Never invent structure ahead of need.** Do not create folders, files, or scaffolding just because they might be useful later. Add them only when there is a concrete, current reason.
- **Do not over-explain internals.** When the maintainer asks a practical question, answer it directly. Don't unfold implementation details unless asked.
- **One step at a time.** For multi-step processes (deploys, DNS, configuration), give one action at a time, wait for confirmation, then proceed. Do not batch instructions the maintainer hasn't asked for.
- **Match the maintainer's pace and scope.** If unsure whether to expand a task, ask before expanding.
- **Ask before destructive actions.** File deletions, git resets, force pushes, dependency changes — always confirm first.
- **Stop when the maintainer says stop.** If the maintainer signals a change is good or asks you to hold, do not keep tweaking, polishing, or adding follow-up work — even if you spot improvements. Wait for the next instruction.

## Asset naming (repo-specific)

- `assets/full-logo.png` — the **icon only** (two interlocking angular brackets in yellow).
- `assets/short-logo.png` — icon **plus** the "ContaPesca" wordmark.
- Names are inverted from what the words might suggest; use them accordingly.

## Before making changes

1. Read this file.
2. Match existing patterns; do not introduce new paradigms without justification.
3. Keep diffs minimal.
4. Verify rendering on mobile (~375px), tablet (~768px), desktop (~1440px) when touching layout.
5. Update this file if you introduce new conventions or structural decisions.

## Non-goals

- No CMS, admin UI, or user accounts.
- No analytics unless explicitly requested (and if added, privacy-friendly only).
- No cookie banner unless tracking requires one.
- No blog in v1.
