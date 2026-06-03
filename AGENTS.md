# JD Builds Portfolio

Codex guidance for the JD Builds portfolio/company site.

## Context

- Repository: `jonahduckworth/portfolio`.
- Canonical path: `/Users/jonah/dev/jd-builds/company/portfolio`.
- Stack: Next.js, TypeScript, npm.
- CI uses Node 20, `npm ci`, `npm run lint`, and `npm run build`.

## Work Rules

- Use npm. Do not use Bun for this repo unless the package manager is intentionally changed with matching CI updates.
- Keep site content, redirects, and navigation changes scoped and production-oriented.
- For visual changes, check desktop and mobile layouts when practical.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run build
```

## Verification

- Content or route changes: run `npm run lint` and `npm run build`.
- UI changes: run `npm run lint`, `npm run build`, and browser visual review when practical.
