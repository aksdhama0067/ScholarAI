"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const modes = ["ELI5", "High school", "Analogy-driven", "Deep dive"] as const;

export function SimplifierView() {
  const [mode, setMode] = useState<(typeof modes)[number]>("ELI5");
  const [text, setText] = useState("Why does recursion need a base case?");
  const [result, setResult] = useState("A recursive function is like a row of dominoes. Each domino asks the next one to do a smaller version of the same job. The base case is the final, already-solved domino — it stops the chain so the answer can travel back up.");
  const [loading, setLoading] = useState(false);

  const simplify = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try { const response = await fetch("/api/simplify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, depth: mode }) }); const data = await response.json(); setResult(data.explanation); } finally { setLoading(false); }
  };

  return <div className="grid gap-5 xl:grid-cols-[.94fr_1.06fr]"><section className="paper-card p-5 sm:p-7"><div className="mb-6"><span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-terra-pale text-terra"><Sparkles size={22}/></span><p className="eyebrow mb-2">Make it clear</p><h2 className="text-3xl font-bold tracking-tight">Untangle a hard idea.</h2><p className="mt-2 text-sm leading-6 text-ink/60">Drop in a concept, a paragraph, or the precise thing that keeps catching in your mind.</p></div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a topic or passage…" className="h-48 w-full resize-none rounded-2xl border border-line bg-paper/70 p-4 text-sm leading-6 outline-none transition placeholder:text-ink/35 focus:border-terra/60 focus:bg-white"/><div className="mt-5"><p className="eyebrow mb-2">Choose a lens</p><div className="flex flex-wrap gap-2">{modes.map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${mode === item ? "border-ink bg-ink text-paper shadow-paper" : "border-line bg-white text-ink/60 hover:border-ink/30"}`}>{item}</button>)}</div></div><motion.button whileHover={{ y: -2 }} whileTap={{ scale: .98 }} onClick={simplify} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-terra px-4 py-3 text-sm font-bold text-white shadow-paper transition hover:bg-terra-deep disabled:opacity-65">{loading ? <><LoaderCircle size={17} className="animate-spin"/> Finding the thread</> : <>Simplify this <ArrowRight size={17}/></>}</motion.button></section><section className="paper-card grainy relative overflow-hidden p-5 sm:p-7"><div className="relative z-10"><div className="mb-8 flex items-center justify-between"><div><p className="eyebrow mb-1">A kinder explanation</p><h3 className="text-lg font-bold">{mode} lens</h3></div><span className="rounded-full bg-terra-pale px-3 py-1.5 text-xs font-bold text-terra-deep">plain language</span></div><div className="rounded-2xl border border-terra/15 bg-white/80 p-5 shadow-paper"><span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-terra-pale text-terra"><Lightbulb size={19}/></span><p className="font-accent text-xl leading-8 text-ink/85 sm:text-2xl sm:leading-9">{result}</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-sage-pale p-4"><p className="eyebrow mb-1 text-sage-deep">Memory hook</p><p className="text-sm font-semibold text-sage-deep">“Stop sign at the end of the domino line.”</p></div><div className="rounded-xl bg-indigo-pale p-4"><p className="eyebrow mb-1 text-indigo-deep">Try it back</p><p className="text-sm font-semibold text-indigo-deep">Explain the base case without using the word “stop”.</p></div></div></div><div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-terra/10 blur-2xl"/></section></div>;
}
