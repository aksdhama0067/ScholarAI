import OpenAI from "openai";

type GenerateRequest = { system: string; prompt: string; maxOutputTokens?: number };

/**
 * One provider seam for the app. It returns null when no key is present so every
 * feature can keep its high-quality local demo behavior during design/dev.
 */
export async function generateAIText({ system, prompt, maxOutputTokens = 900 }: GenerateRequest) {
  const provider = process.env.AI_PROVIDER ?? "openai";

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

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
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
