"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const modes = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;

export function SimplifierView() {
  const [mode, setMode] = useState<(typeof modes)[number]>("ELI5");
  const [text, setText] = useState("Why does recursion need a base case?");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simplify = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fast first
      const fastResp = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, depth: mode, mode: "fast" })
      });
      const fastData = await fastResp.json();
      if (fastData?.error) {
        setError(fastData.error);
        setLoading(false);
        return;
      }
      if (typeof fastData.explanation === "string") setResult(fastData.explanation);

      // Stream the full answer and progressively update the result
      try {
        const streamResp = await fetch("/api/ask/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, depth: mode, maxOutputTokens: 350 })
        });

        if (!streamResp.ok || !streamResp.body) {
          // Fallback: fetch full answer as JSON
          const fullFallback = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, depth: mode, mode: "full", maxOutputTokens: 350 })
          });
          const fullData = await fullFallback.json();
          if (fullData?.explanation) setResult(fullData.explanation);
          setLoading(false);
          return;
        }

        const reader = streamResp.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let buffered = "";

        while (!done) {
          const { value, done: d } = await reader.read();
          if (value) {
            buffered += decoder.decode(value, { stream: true });

            // SSE framing: split on double newlines
            const parts = buffered.split("\n\n");
            buffered = parts.pop() || "";

            for (const part of parts) {
              if (part.startsWith("data: ")) {
                const payload = part.replace(/^data: /, "");
                if (payload === "[DONE]") {
                  done = true;
                  break;
                }
                // Append chunk to result
                setResult((prev) => (prev || "") + payload);
              } else if (part.startsWith("event: error")) {
                const errMsg = part.split("\n")[1]?.replace(/^data: /, "") || "Stream error";
                setError(errMsg);
                done = true;
                break;
              }
            }
          }
          if (d) {
            done = true;
            break;
          }
        }
      } catch (streamErr) {
        console.error("streaming error", streamErr);
      } finally {
        setLoading(false);
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return <div className="grid gap-5 xl:grid-cols-[.94fr_1.06fr]"><section className="paper-card p-5 sm:p-7"><div className="mb-6"><span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white"><Lightbulb /></span><h3 className="mb-1 text-lg font-semibold">Simplify</h3><p className="text-sm text-muted-foreground">Turn complicated ideas into something you can explain to a friend.</p></div><div className="flex gap-3"><select value={mode} onChange={(e) => setMode(e.target.value as any)} className="input"><option>ELI5</option><option>High school</option><option>Analogy-driven</option><option>Deep dive</option></select><div className="flex-1"></div><button onClick={simplify} className="btn btn-primary" disabled={loading}><ArrowRight className="mr-2" />{loading ? <><LoaderCircle className="animate-spin mr-2" />Thinking...</> : <>Simplify</>}</button></div><textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 textarea h-40 w-full" /></section><section className="paper-card p-5 sm:p-7"><div className="mb-6"><span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white"><Sparkles /></span><h3 className="mb-1 text-lg font-semibold">Result</h3><p className="text-sm text-muted-foreground">You'll get a quick summary immediately, followed by a fuller explanation shortly after.</p></div>{error && <div className="text-red-600">{error}</div>}{result ? <div className="prose max-w-none"><p>{result}</p></div> : <div className="text-sm text-muted-foreground">{loading ? <><LoaderCircle className="animate-spin inline-block mr-2" />Generating...</> : "Your simplified explanation will appear here."}</div>}</section></div>;
}
