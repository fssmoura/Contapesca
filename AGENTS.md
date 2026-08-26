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
├── index.html              # Placeholder "em construção" page
└── assets/
    ├── favicon.png
    ├── full-logo.png
    ├── short-logo.png
    └── animation.gif
```

The site has not been built yet — `index.html` is a temporary placeholder so Netlify has something to deploy.

**Rule:** do not invent folders or split files preemptively. Add a new file/folder only when there is a concrete reason (e.g. a second page, or CSS large enough to warrant splitting). Update this section whenever the layout changes.

## Brand

- Background: `#0c0e13`
- Yellow accent: `#dbaa35`
- Blue primary: `#558fd5`
- Logo assets in `/assets`.

Additional design tokens (typography, spacing, elevations) will be defined once we start building the real pages.

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

## Contact form (planned)

- Handled by Netlify Forms.
- `<form name="contacto" data-netlify="true">` + hidden `form-name` input.
- Honeypot field (`bot-field`) for spam.
- Client-side validation is UX-only; Netlify does the real validation.

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
