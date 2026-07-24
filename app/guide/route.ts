import { NextResponse } from "next/server";
import { generateAIText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json() as { message?: unknown };
    if (typeof message !== "string" || !message.trim()) return NextResponse.json({ error: "Write a question for your guide." }, { status: 400 });
    const answer = await generateAIText({ system: "You are ScholarAI's academic and career guide. Be supportive, specific, practical, and concise. Offer a clear next action. Never claim to know a student's personal history beyond what they said.", prompt: message.slice(0, 7000), maxOutputTokens: 430 });
    return NextResponse.json({ answer: answer ?? "A good next step is to choose one small proof-of-progress for this week: a focused 45-minute study session, a single practice set, or a tiny project. Then spend five minutes noting what felt easy, what felt sticky, and what you want to revisit." });
  } catch { return NextResponse.json({ error: "Your guide is taking a moment to think. Please try again." }, { status: 500 }); }
}
