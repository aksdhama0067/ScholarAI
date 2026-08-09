import fetch from "node-fetch";
import process from "node:process";

interface HFResponse {
  generated_text?: string;
}

export async function generateWithHuggingFace(
  model: string,
  prompt: string,
  max_new_tokens = 128,
  temperature = 0.2
) {
  const HF_TOKEN = process.env.HF_API_KEY;
  if (!HF_TOKEN) throw new Error('HF_API_KEY not set');

  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const body = {
    inputs: prompt,
    parameters: { max_new_tokens, temperature },
    options: { wait_for_model: true }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF inference error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as HFResponse | HFResponse[] | string;

  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  if (typeof data === 'object' && data !== null && 'generated_text' in data && typeof data.generated_text === 'string') {
    return data.generated_text;
  }
  return typeof data === 'string' ? data : JSON.stringify(data);
}
