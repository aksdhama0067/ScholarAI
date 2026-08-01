import { NextResponse } from "next/server";
import { generateAIText } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown; depth?: unknown; maxOutputTokens?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json({ error: "Tell me what you would like to understand." }, { status: 400 });
    }

    const depths = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;
    const depth = typeof body.depth === "string" && depths.includes(body.depth as (typeof depths)[number]) ? body.depth as string : "ELI5";
    const maxOutputTokens = typeof body.maxOutputTokens === "number" ? Math.max(32, Math.min(2000, body.maxOutputTokens)) : 512;

    const prompt = `Explain this at the ${depth} level. Use warm, precise language. Include one memorable image or analogy and keep it under 170 words.\n\n${(body.text as string).slice(0, 9000)}`;

    // Use full mode for streaming route
    const answer = await generateAIText({ system: "You are a patient teacher who does not talk down to learners.", prompt, maxOutputTokens, mode: "full" });
    if (!answer) return NextResponse.json({ error: "No response from model." }, { status: 502 });

    // Return the full answer as JSON if model doesn't support streaming here.
    return NextResponse.json({ explanation: answer });
  } catch (err) {
    console.error("/api/ask (non-stream) error", err);
    return NextResponse.json({ error: "I could not process that request." }, { status: 500 });
  }
}
