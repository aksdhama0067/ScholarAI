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
  questions: ["What is the core claim?", "Give me an analogy", "Make a 5-card deck"]
};

export const starterCards: Flashcard[] = [
  { id: 1, topic: "Learning science", prompt: "What makes a study session durable?", answer: "Active recall, followed by feedback and a little spacing.", cue: "Picture a well-worn forest trail.", color: "sage" },
  { id: 2, topic: "Computer science", prompt: "What does a stack do?", answer: "It stores items so the last one in is the first one out — like a stack of plates.", cue: "Stacked ceramic plates.", color: "terra" },
  { id: 3, topic: "Mathematics", prompt: "What is a derivative in plain language?", answer: "It measures how fast something changes at one exact moment.", cue: "A speedometer needle.", color: "indigo" }
];

export const schedule = [
  { time: "09:00", title: "Review: Graph theory", tag: "Memory deck", color: "sage" },
  { time: "14:30", title: "Read: Operating systems", tag: "45 minute focus", color: "indigo" },
  { time: "18:00", title: "Mock quiz", tag: "12 questions", color: "terra" }
];
