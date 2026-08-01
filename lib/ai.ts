import OpenAI from "openai";
import { generateWithHuggingFace } from "./adapters/hfAdapter";

type GenerateRequest = { system: string; prompt: string; maxOutputTokens?: number; mode?: "fast" | "full" };

/**
 * One provider seam for the app. It returns null when no key is present so every
 * feature can keep its high-quality local demo behavior during design/dev.
 */
export async function generateAIText({ system, prompt, maxOutputTokens = 900, mode = "full" }: GenerateRequest) {
  const provider = process.env.AI_PROVIDER ?? "openai";

  // Anthropic (unchanged)
  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5", max_tokens: maxOutputTokens, system, messages: [{ role: "user", content: prompt }] })
    });
    if (!response.ok) throw new Error(`Anthropic request failed (${response.status}).`);
    const data = await response.json() as { content?: { type: string; text?: string }[] };
    return data.content?.find((part) => part.type === "text")?.text ?? null;
  }

  // Hugging Face adapter: supports fast | full modes
  if (provider === "hf" && process.env.HF_API_KEY) {
    const model = process.env.HF_MODEL ?? (mode === "fast" ? "google/flan-t5-small" : "google/flan-t5-large");
    const maxNewTokens = mode === "fast" ? Math.min(80, maxOutputTokens) : maxOutputTokens;
    const promptText = `${system}\n\n${prompt}`;
    const out = await generateWithHuggingFace(model, promptText, maxNewTokens, mode === "fast" ? 0.1 : 0.6);
    return out ?? null;
  }

  // OpenAI fallback (respect fast/full by model selection)
  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL ?? (mode === "fast" ? "gpt-4o-mini" : "gpt-5.6-luna");
    const response = await client.responses.create({
      model,
      input: `${system}\n\n${prompt}`,
      max_output_tokens: maxOutputTokens
    });
    return response.output_text || null;
  }

  return null;
}

export function parseJsonObject<T>(value: string | null): T | null {
  if (!value) return null;
  const candidate = value.match(/\{[\s\S]*\}/)?.[0] ?? value;
  try { return JSON.parse(candidate) as T; } catch { return null; }
}

export function cleanExcerpt(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 12000);
}
