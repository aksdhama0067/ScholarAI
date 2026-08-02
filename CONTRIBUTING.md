# Contributing to ScholarAI

Thanks for your interest in contributing! This document explains how to set up your development environment, the code style we follow, and the process for submitting issues and pull requests.

## Getting started (local development)

1. Clone the repository:
```bash
git clone https://github.com/aksdhama0067/ScholarAI
cd ScholarAI
```

2. Install dependencies:
```bash
pnpm install
cp .env.example .env.local
# Edit .env.local to add any provider keys you want to test locally.
pnpm dev
```

3. Useful scripts (add to `package.json` if missing):
- `pnpm dev` — start Next.js dev server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — run linter
- `pnpm typecheck` — run TypeScript checks (`tsc --noEmit`)
- `pnpm test` — run tests (if present)
- `pnpm format` — run prettier (if configured)

## Code style & quality

- TypeScript is the primary language — keep types accurate and prefer explicit types in library code.
- Use Prettier for formatting and ESLint/Next lint rules for linting.
- Please run:
```bash
pnpm run typecheck
pnpm run lint
pnpm run format
```

Consider adding pre-commit hooks (e.g., husky + lint-staged) to run formatting and linting locally.

## Branching & commit messages

- Branch from `main` using a short descriptive name:
  - feature/<short-description>
  - fix/<short-description>
  - chore/<short-description>
- Use Conventional Commits for commit messages:
  - feat: add X
  - fix: correct Y
  - docs: update README
  - chore: housekeeping

## Pull request process

1. Create a branch with a descriptive name.
2. Open a PR against `main`.
3. Fill the PR template (title, description, test steps).
4. Ensure:
   - Type-check and lint pass
   - Tests pass (if added)
   - Screenshots or short recordings are included for UI changes
5. Wait for at least one approving review before merging. Squash & merge is preferred.

## Issue guidelines

- Search existing issues before filing.
- Use the provided templates (bug or feature) to make triage faster.

## Tests

- Add unit tests for new features. We recommend using Vitest or Jest.
- Add simple tests for core logic (e.g., provider seam behavior in `lib/ai.ts`).

## Security & data handling

- Do not commit credentials or API keys.
- Treat uploaded documents as sensitive in README and SECURITY.md. Avoid committing sample documents with real data.

## Questions or help

If you’re unsure where to start, open an issue with the “help wanted” label describing what you want to work on.
