export type WorkspaceTab = "dashboard" | "reader" | "simplify" | "flashcards" | "planner" | "guide";

export type Summary = {
  title: string;
  readingTime: string;
  overview: string;
  takeaways: string[];
  concepts: { label: string; detail: string; tint: "sage" | "terra" | "indigo" }[];
  questions: string[];
};


