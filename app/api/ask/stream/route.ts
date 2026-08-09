import { generateAIText } from "@/lib/ai";

export const runtime = "nodejs";

// This route streams the full answer back to the client using a simple SSE-like
// framing. It currently uses the existing generateAIText implementation to
// obtain the final text and then streams it in small chunks so the client can
// render progressive updates. Later we can wire provider-native streaming where
// supported (OpenAI/HF) for true token-level streams.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown; depth?: unknown; maxOutputTokens?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) {
      return new Response(JSON.stringify({ error: "Tell me what you would like to understand." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const depths = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;
    const depth =
      typeof body.depth === "string" && depths.includes(body.depth as (typeof depths)[number])
        ? (body.depth as string)
        : "ELI5";
    const maxOutputTokens =
      typeof body.maxOutputTokens === "number" ? Math.max(32, Math.min(2000, body.maxOutputTokens)) : 512;

    const prompt = `Explain this at the ${depth} level. Use warm, precise language. Include one memorable image or analogy and keep it under 170 words.\n\n${(
      body.text as string
    ).slice(0, 9000)}`;

    const fullText = await generateAIText({
      system: "You are a patient teacher who does not talk down to learners.",
      prompt,
      maxOutputTokens,
      mode: "full",
    });
    if (!fullText) {
      return new Response("", { status: 502 });
    }

    const encoder = new TextEncoder();
    const chunkSize = 60; // characters per chunk

    const stream = new ReadableStream({
      start(controller) {
        try {
          // Send chunks in a simple text/event-stream 'data: ' format
          for (let i = 0; i < fullText.length; i += chunkSize) {
            const chunk = fullText.slice(i, i + chunkSize);
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          }
          // Signal completion
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${(err as Error).message}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("/api/ask/stream error", err);
    return new Response(JSON.stringify({ error: "I could not process that request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
