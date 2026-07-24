import { NextResponse } from "next/server";
import { generateAIText } from "@/lib/ai";

const depths = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown; depth?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) return NextResponse.json({ error: "Tell me what you would like to understand." }, { status: 400 });
    const depth = typeof body.depth === "string" && depths.includes(body.depth as (typeof depths)[number]) ? body.depth : "ELI5";
    const prompt = `Explain this at the ${depth} level. Use warm, precise language. Include one memorable image or analogy and keep it under 170 words.\n\n${body.text.slice(0, 9000)}`;
    const answer = await generateAIText({ system: "You are a patient teacher who does not talk down to learners.", prompt, maxOutputTokens: 350 });
    return NextResponse.json({ explanation: answer ?? `Imagine this idea as a small system with a clear job. ${body.text.trim()} becomes easier when you first name the job, then trace one concrete example from beginning to end.` });
  } catch { return NextResponse.json({ error: "I could not simplify that just now." }, { status: 500 }); }
}

