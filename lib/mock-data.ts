import type { Flashcard, Summary } from "./types";

export const demoSummary: Summary = {
  title: "The architecture of a good explanation",
  readingTime: "6 min read",
  overview: "A strong explanation creates a bridge between what a learner already knows and the idea they are about to meet.",
  takeaways: [
    "Start from a familiar anchor before introducing a new abstraction.",
    "Use one clear example, then name the underlying pattern.",
    "Retrieval and spacing make understanding stick longer than rereading."
  ],
  concepts: [
    { label: "Scaffolding", detail: "Give just enough support, then gradually take it away.", tint: "sage" },
    { label: "Chunking", detail: "Group details into meaningful, recallable units.", tint: "terra" },
    { label: "Retrieval", detail: "Practice bringing an answer to mind without looking.", tint: "indigo" }
  ],
