import { NextResponse } from "next/server";
import { generateAIText, parseJsonObject } from "@/lib/ai";
import { starterCards } from "@/lib/mock-data";
import type { Flashcard } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { text } = await request.json() as { text?: unknown };
    if (typeof text !== "string" || !text.trim()) return NextResponse.json({ error: "Add a little study material first." }, { status: 400 });
    const answer = await generateAIText({ system: "Return only valid JSON in this shape: {cards:[{id:number,topic:string,prompt:string,answer:string,cue:string,color:'sage'|'terra'|'indigo'}]}. Make 5 high-yield retrieval flashcards. Answers must be brief.", prompt: text.slice(0, 9000), maxOutputTokens: 850 });
    const parsed = parseJsonObject<{ cards: Flashcard[] }>(answer);
    return NextResponse.json(parsed?.cards?.length ? parsed : { cards: starterCards });
  } catch { return NextResponse.json({ error: "I could not create that deck just now." }, { status: 500 }); }
}


