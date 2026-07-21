# ScholarAI

A tactile, AI-assisted student workspace built with Next.js App Router, React, Tailwind CSS, Framer Motion, and Lucide icons.

## Start it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The UI works in polished demo mode without credentials. Add `OPENAI_API_KEY` or select `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY` to turn on live generation. Never expose those keys through `NEXT_PUBLIC_` variables.

## Architecture

```text
app/
  page.tsx                         # App Router entry
  api/{summarize,simplify,
       flashcards,guide}/route.ts  # Request validation + product endpoints
