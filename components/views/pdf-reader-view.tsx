"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, FileText, LoaderCircle, MessageCircleQuestion, Send, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { demoSummary } from "@/lib/mock-data";
import type { Summary } from "@/lib/types";

const toneStyles = { sage: "border-sage/25 bg-sage-pale text-sage-deep", terra: "border-terra/25 bg-terra-pale text-terra-deep", indigo: "border-indigo/20 bg-indigo-pale text-indigo-deep" };

export function PdfReaderView() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<Summary>(demoSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const analyse = useCallback(async (nextFile: File) => {
    setFile(nextFile); setIsLoading(true); setAnswer(null);
    try {
      const form = new FormData(); form.append("file", nextFile);
      const response = await fetch("/api/summarize", { method: "POST", body: form });
      if (!response.ok) throw new Error("Could not read that document.");
      setSummary(await response.json());
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "Something got tangled. Please try another PDF.");
    } finally { setIsLoading(false); }
  }, []);

  const ask = async (prompt: string) => {
    setQuestion(prompt); setAnswer(null);
    try {
      const response = await fetch("/api/guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `${prompt}\n\nUse this document context: ${summary.overview}` }) });
      const data = await response.json(); setAnswer(data.answer ?? "I couldn't form an answer just yet.");
    } catch { setAnswer("I couldn't reach the study guide. Try once more in a moment."); }
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-3 rounded-2xl border border-indigo/15 bg-indigo-pale/55 p-4 sm:flex-row sm:items-center sm:px-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo text-white"><Sparkles size={17}/></span><div><p className="text-sm font-bold">A paper, made conversational</p><p className="text-xs text-ink/55">Upload a PDF and ScholarAI will sketch a study-ready map.</p></div></div><span className="pill border-indigo/15 bg-white/70 text-indigo-deep">PDF → study kit</span></section>

      <section className="grid min-h-[620px] gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <div className="paper-card flex min-h-[500px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line bg-white/60 px-4 py-3"><div className="flex items-center gap-2"><FileText size={16} className="text-terra"/><span className="max-w-[190px] truncate text-sm font-semibold">{file?.name ?? "Sample study paper"}</span>{file && <button onClick={() => setFile(null)} className="text-ink/40 hover:text-ink" aria-label="Remove document"><X size={15}/></button>}</div><span className="font-mono text-[10px] text-ink/40">{file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "PAGE 1 / 8"}</span></div>
          {!file ? <button onClick={() => fileInput.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); const dropped = e.dataTransfer.files.item(0); if (dropped) analyse(dropped); }} className={`m-5 flex min-h-[430px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition ${dragging ? "border-indigo bg-indigo-pale" : "border-line bg-paper/50 hover:border-indigo/50 hover:bg-indigo-pale/30"}`}><motion.span animate={dragging ? { y: -5, scale: 1.04 } : { y: 0, scale: 1 }} className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white text-indigo shadow-paper"><UploadCloud size={30}/></motion.span><p className="mb-1 text-base font-bold">Drop your document here</p><p className="max-w-xs text-sm leading-6 text-ink/55">PDFs become a clear brief, concepts, and questions you can actually use.</p><span className="mt-5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold">Choose a PDF</span></button> : <DocumentPage fileName={file.name} loading={isLoading} />}
          <input ref={fileInput} onChange={(e) => { const selected = e.target.files?.item(0); if (selected) analyse(selected); }} type="file" accept="application/pdf,.txt,.md" className="hidden" />
        </div>

        <div className="paper-card flex min-h-[500px] flex-col overflow-hidden"><div className="border-b border-line px-5 py-4"><p className="eyebrow mb-1">Reading companion</p><div className="flex items-center justify-between gap-2"><h2 className="text-lg font-bold">{isLoading ? "Finding the important bits…" : summary.title}</h2><span className="shrink-0 font-mono text-[10px] text-ink/40">{summary.readingTime}</span></div></div><div className="flex-1 space-y-5 overflow-y-auto p-5"><p className="font-accent text-[17px] leading-7 text-ink/80">{summary.overview}</p><div><p className="eyebrow mb-3">Key takeaways</p><ol className="space-y-3">{summary.takeaways.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">{index + 1}</span>{item}</li>)}</ol></div><div><p className="eyebrow mb-3">Sticky concepts</p><div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">{summary.concepts.map((concept) => <div className={`rounded-xl border p-3 ${toneStyles[concept.tint]}`} key={concept.label}><p className="mb-1 text-xs font-bold">{concept.label}</p><p className="text-[11px] leading-4 opacity-80">{concept.detail}</p></div>)}</div></div></div><div className="border-t border-line bg-white/70 p-4"><div className="mb-2 flex items-center gap-2"><MessageCircleQuestion size={15} className="text-indigo"/><p className="text-xs font-bold">Ask this document</p></div><div className="mb-3 flex flex-wrap gap-2">{summary.questions.map((item) => <button key={item} onClick={() => ask(item)} className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11px] font-medium text-ink/65 transition hover:border-indigo/30 hover:text-indigo">{item}</button>)}</div><form onSubmit={(e) => { e.preventDefault(); if (question.trim()) ask(question); }} className="flex gap-2"><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a specific question…" className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-indigo"/><button className="grid h-10 w-10 place-items-center rounded-xl bg-indigo text-white transition hover:bg-indigo-deep" aria-label="Ask question"><Send size={16}/></button></form>{answer && <p className="mt-3 rounded-xl bg-indigo-pale p-3 text-xs leading-5 text-indigo-deep">{answer}</p>}</div></div>
      </section>
    </div>
  );
}

function DocumentPage({ fileName, loading }: { fileName: string; loading: boolean }) {
  return <div className="relative m-5 flex flex-1 justify-center overflow-hidden rounded-xl bg-[#EEEAE2] p-5 sm:p-8"><div className="w-full max-w-[440px] rounded-sm bg-white px-7 py-8 shadow-paper-md sm:px-10"><div className="mb-8 h-2 w-16 rounded-full bg-terra/40"/><p className="mb-2 font-mono text-[10px] uppercase tracking-[.18em] text-ink/35">Uploaded study material</p><h3 className="mb-6 font-accent text-2xl font-semibold leading-tight">{fileName.replace(/\.[^/.]+$/, "")}</h3>{["A calm page preview keeps your reading area tangible.", "The summary is generated on the right, so you can keep a visual place in the source.", "Use the prompts to interrogate ideas rather than reread them."].map((line) => <p className="mb-4 text-xs leading-6 text-ink/65" key={line}>{line}</p>)}<div className="mt-8 border-l-2 border-sage bg-sage-pale/60 p-3 text-xs leading-5 text-sage-deep">The strongest insight may be the one you explain back to yourself.</div></div>{loading && <div className="absolute inset-0 grid place-items-center bg-paper/65 backdrop-blur-[2px]"><div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-paper"><LoaderCircle className="animate-spin" size={17}/> Reading your document</div></div>}<span className="absolute bottom-5 right-5 text-ink/30"><ArrowUpRight size={18}/></span></div>;
}
