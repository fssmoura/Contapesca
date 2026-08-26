# AGENTS.md

Guidance for AI coding agents (opencode, Claude Code, Cursor, etc.) working on this repository.

## Project

**ContaPesca** — corporate website for a Portuguese accounting, consulting and management firm (ContaPesca — Contabilidade, Consultadoria e Gestão, Unipessoal Lda.).

Rebuild of a Google Sites draft as a proper static website with an agency/corporate feel.

- **Primary language of content:** Portuguese (PT-PT). English translation available via a language toggle.
- **Audience:** Portuguese small/medium business owners and self-employed professionals.
- **Tone:** Professional, corporate, trustworthy, modern.

## Stack

Vanilla static site — no build step, no framework, no package manager.

- HTML5 (semantic)
- CSS3 (custom properties, no preprocessors)
- Vanilla JavaScript (ES2020+, no frameworks)
- External libraries only via CDN `<script>` tags when strictly necessary
- Assets served directly from `/assets`

**Do not introduce:** React, Vue, Svelte, TypeScript, Tailwind, Sass/Less, webpack, Vite, or any build tooling, unless explicitly requested by the maintainer.

## Repository layout

Current state of the repo:

```
/
├── AGENTS.md               # This file
├── index.html              # Placeholder home page (to be rebuilt)
├── netlify.toml            # Netlify config (headers, cache)
├── .gitignore
└── assets/
    ├── favicon.png
    ├── full-logo.png
    ├── short-logo.png
    └── animation.gif
```

Only add new files/folders when the work actually requires them. Do not scaffold empty directories or invent structure ahead of need. When adding a new concern (styles, scripts, locales, additional pages), place it in a sensibly named folder at the root and document it here in the same commit.

## Design system

Defined in `styles/tokens.css` as CSS custom properties.

### Colors

- `--bg: #0c0e13` — page background (dark)
- `--yellow: #dbaa35` — accent (logo, highlights, small emphases)
- `--blue: #558fd5` — primary brand color (CTAs, links, dividers)
- Additional derived tokens (elevations, muted text, borders) are defined in `tokens.css` — reuse those, do not redeclare hex values elsewhere.

### Typography

- **Font family:** Manrope (Google Fonts) for both display and body.
- Type scale, weights, line-heights defined in `tokens.css`.

### Layout

- Mobile-first.
- Max content width ~1240px, centered.
- Generous whitespace, corporate feel.
- Breakpoints: 640px, 900px, 1200px.

### Motion

- Subtle only.
- Respect `prefers-reduced-motion` — disable non-essential animations when set.
- Reveal-on-scroll via `IntersectionObserver` (progressive enhancement; content must be readable without JS).

## Coding conventions

### HTML

- Semantic elements: `<header> <nav> <main> <section> <article> <footer>`.
- `<html lang="pt">` by default; `i18n.js` swaps the attribute when switching language.
- All images have meaningful `alt` text (empty `alt=""` only for purely decorative images).
- All interactive elements have visible focus states and accessible labels.
- Translatable text uses `data-i18n="key"` attributes so `i18n.js` can swap it.
- Meta tags: viewport, description, Open Graph, Twitter card, canonical URL.
- Structured data: `application/ld+json` block for `AccountingService` on the home page.

### CSS

- Custom properties in `tokens.css` are the single source of truth for design values.
- Class naming: BEM-lite (`.card`, `.card__title`, `.card--featured`). Keep it flat and readable, not dogmatic.
- No inline styles unless dynamically computed by JS.
- No `!important` unless overriding a third-party rule with a clear comment explaining why.
- Prefer logical properties (`padding-inline`, `margin-block`) where reasonable.
- Group by concern: reset → tokens → base → components → page-specific.

### JavaScript

- ES modules where practical (`<script type="module">`).
- No global variables; wrap in an IIFE or module.
- Use `const` by default, `let` only when reassignment is required.
- Prefer `addEventListener` over inline `on*` handlers.
- Query the DOM once, cache references.
- Guard every DOM query (`if (!el) return;`) so a missing element on a given page never throws.
- No `console.log` in committed code (use for local debugging only, then remove).

### Accessibility

- WCAG 2.1 AA is the minimum bar.
- Contrast: verify all text/background combinations meet 4.5:1 (3:1 for large text).
- Keyboard: every interactive element reachable and operable via keyboard alone.
- ARIA only when a semantic element cannot express the intent.
- Test with a screen reader when adding new interactive components.

### Performance

- Images: use `loading="lazy"` for below-the-fold; `decoding="async"`; provide `width` and `height` to prevent CLS.
- Prefer SVG for icons and illustrations.
- No web fonts beyond Manrope; preload the main weight.
- No blocking third-party scripts.
- Aim for Lighthouse >= 95 in Performance, Accessibility, Best Practices, SEO.

## Internationalization

- `data-i18n="path.to.key"` attribute marks translatable text nodes.
- `data-i18n-attr="attribute:key"` for attributes (e.g. `data-i18n-attr="placeholder:contact.name.placeholder"`).
- Dictionaries live in `/locales/{pt,en}.json` mirroring the same key structure.
- Default language is `pt`. Selected language stored in `localStorage` under `contapesca.lang`.
- Language switch also updates `<html lang>` and (optionally) the URL query.

## Contact form

- Hosted on Netlify; submissions handled by **Netlify Forms**.
- Mark the `<form>` element with `name="contacto"` and `data-netlify="true"`, plus a hidden `<input name="form-name" value="contacto">` for progressive enhancement.
- Include a honeypot field (`<input name="bot-field">` hidden via CSS) to reduce spam.
- Client-side validation is UX-only; server-side validation is handled by Netlify.
- On success, replace the form with a thank-you state; do not navigate away unless the user chooses to.

## Deployment

- Hosting: Netlify (free plan), team `contapesca-unipessoal`.
- Auto-deploy on push to `main`.
- Custom domain: `contapesca.pt` (registered at amen.pt).
- DNS at amen.pt; A record for apex → Netlify load balancer; CNAME `www` → `<site>.netlify.app`.
- SSL: Let's Encrypt via Netlify.
- Netlify config in `netlify.toml` (security headers, cache rules, redirects).

## Git conventions

- Branch: `main` is the deployed branch. Feature work in short-lived branches when it warrants review; otherwise commit directly to `main` for small changes.
- Commit messages: Conventional Commits style.
  - `feat: add services section to home`
  - `fix: correct mobile nav overflow on <320px viewports`
  - `chore: update netlify security headers`
  - `docs: expand AGENTS.md deployment section`
  - `style: tighten heading letter-spacing`
  - `refactor: extract card component styles`
- One logical change per commit. Do not mix unrelated edits.
- Never commit secrets, API keys, or `.env` files.

## When making changes

1. Read this file and `README.md` before starting.
2. Match existing patterns; do not introduce new paradigms without justification.
3. Keep diffs minimal and focused.
4. Verify the site still renders correctly on:
   - Mobile (~375px)
   - Tablet (~768px)
   - Desktop (~1440px)
5. Verify both PT and EN translations if you touched translatable text.
6. Run a quick a11y check (keyboard nav + reader for new components).
7. Update this file if you introduce new conventions or structural decisions.

## Non-goals

- No CMS, no admin UI, no user accounts.
- No analytics beyond privacy-friendly options (e.g. Plausible, Umami) — and only if explicitly requested.
- No cookie banner unless we add tracking that requires one.
- No blog/news section in v1.
