import { NextResponse } from "next/server";
import { cleanExcerpt, generateAIText, parseJsonObject } from "@/lib/ai";
import { demoSummary } from "@/lib/mock-data";
import type { Summary } from "@/lib/types";

export const runtime = "nodejs";
const maxFileBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const rawText = formData.get("text");
    if (!(file instanceof File) && typeof rawText !== "string") return NextResponse.json({ error: "Add a PDF or some text first." }, { status: 400 });
    if (file instanceof File && file.size > maxFileBytes) return NextResponse.json({ error: "Please use a document smaller than 10 MB." }, { status: 413 });

    const source = typeof rawText === "string" ? rawText : file instanceof File ? await extractText(file) : "";
    const excerpt = cleanExcerpt(source);
    if (!excerpt) return NextResponse.json({ error: "I could not find readable text in that file." }, { status: 422 });

    const instruction = "You are ScholarAI, a precise and encouraging study assistant. Return only valid JSON matching this exact shape: {title:string,readingTime:string,overview:string,takeaways:string[],concepts:[{label:string,detail:string,tint:'sage'|'terra'|'indigo'}],questions:string[]}. Keep 3 takeaways, 3 concepts, and 3 short study questions. Never invent facts not supported by the source.";
    const response = await generateAIText({ system: instruction, prompt: `Summarize this study source:\n\n${excerpt}`, maxOutputTokens: 950 });
    const generated = parseJsonObject<Summary>(response);
    const fallback: Summary = { ...demoSummary, title: file instanceof File ? file.name.replace(/\.[^/.]+$/, "") : "Your study material", overview: `Here is the learning thread I found: ${excerpt.slice(0, 240)}${excerpt.length > 240 ? "…" : ""}` };
    return NextResponse.json(generated ?? fallback);
  } catch (error) {
    console.error("summary route", error);
    return NextResponse.json({ error: "Something went wrong while reading the document." }, { status: 500 });
  }
}

async function extractText(file: File) {
  if (file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
    const { default: pdf } = await import("pdf-parse");
    const parsed = await pdf(Buffer.from(await file.arrayBuffer()));
    return parsed.text;
  }
  return file.text();
}
