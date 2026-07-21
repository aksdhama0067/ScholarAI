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
components/
  study-workspace.tsx              # Top-level tab state / composition
  layout/                          # Responsive sidebar + header
  views/                           # Feature-level interactive surfaces
lib/
  ai.ts                            # OpenAI / Anthropic provider seam
  mock-data.ts                     # Useful, no-key demo content
  types.ts                         # Shared product data contracts
```

### Request flow

`View → /api route → lib/ai provider seam → OpenAI Responses API or Anthropic Messages API`

The routes return a meaningful local response when no provider key is configured, which makes visual development, demos, and offline product reviews frictionless.

## Feature map

- **Your desk:** streak, goals, rhythm chart, current study trail, and mastery snapshot.
- **Paper reader:** drag-and-drop upload, PDF text extraction, grounded summary, concept tags, and follow-up prompts.
- **Make it clear:** depth lenses from ELI5 through deep dive.
- **Memory deck:** spring-animated 3D cards, spatial cues, grading buttons, and instant feedback quiz.
- **Study map:** daily agenda, completion state, weekly goals, and an SRS revision queue.
- **Future guide:** tailored academic/career conversation with an active route.

## Notes for production

- Persist users, documents, cards, and SRS intervals in a database (e.g. Postgres + Prisma/Drizzle).
- Store originals in private object storage and keep only retrieval-safe document chunks in your search index.
- Add authentication, rate limits, request tracing, and a moderation/abuse layer before accepting public uploads.
- For long documents, queue extraction and generation rather than keeping the HTTP request open.
