import { NextResponse } from "next/server";
import { generateAIText } from "@/lib/ai";

const depths = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown; depth?: unknown; mode?: unknown; maxOutputTokens?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json({ error: "Tell me what you would like to understand." }, { status: 400 });
    }

    const depth = typeof body.depth === "string" && depths.includes(body.depth as (typeof depths)[number]) ? body.depth as string : "ELI5";
    const mode = body.mode === "fast" ? "fast" : "full";
    const maxOutputTokens = typeof body.maxOutputTokens === "number" ? Math.max(32, Math.min(2000, body.maxOutputTokens)) : undefined;

    const prompt = `Explain this at the ${depth} level. Use warm, precise language. Include one memorable image or analogy and keep it under 170 words.\n\n${(body.text as string).slice(0, 9000)}`;

    // Respect mode when calling the model; fast uses fewer tokens
    const answer = await generateAIText({ system: "You are a patient teacher who does not talk down to learners.", prompt, maxOutputTokens: maxOutputTokens ?? (mode === "fast" ? 90 : 350), mode: mode as "fast" | "full" });

    return NextResponse.json({ explanation: answer ?? null });
  } catch (err) {
    console.error("/api/ask error", err);
    return NextResponse.json({ error: "I could not process that request." }, { status: 500 });
  }
}
