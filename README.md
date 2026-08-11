# ScholarAI

[![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?branch=main)](https://github.com/OWNER/REPO/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Typescript](https://img.shields.io/badge/ts-%3E%3D5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-%3E%3D14.0-black)](https://nextjs.org/)

A tactile, AI-assisted student workspace built with Next.js (App Router), React, and Tailwind. ScholarAI provides a paper reader, summarization and simplification lenses, interactive flashcards, and a study planner — useful for students and educators who want an AI-enhanced study studio.

Demo
- The UI includes a no-key demo mode for visual review. To enable live AI features, set one of the provider keys (OpenAI / Anthropic / Hugging Face) as described below.
   
Quick start
```bash
# 1. install
pnpm install

# 2. copy example env and edit keys
cp .env.example .env.local

# 3. run (dev)
pnpm dev
## Notes for production

- Persist users, documents, cards, and SRS intervals in a database (e.g. Postgres + Prisma/Drizzle).
- Store originals in private object storage and keep only retrieval-safe document chunks in your search index.
- Add authentication, rate limits, request tracing, and a moderation/abuse layer before accepting public uploads.
- For long documents, queue extraction and generation rather than keeping the HTTP request open.
