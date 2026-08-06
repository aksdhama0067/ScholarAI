"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Check, ChevronRight, Clock3, Flame, Layers3, Sparkles, Target } from "lucide-react";
import { schedule } from "@/lib/mock-data";
import type { WorkspaceTab } from "@/lib/types";

const bars = [46, 62, 38, 76, 55, 83, 68];

export function DashboardView({ navigate }: { navigate: (tab: WorkspaceTab) => void }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-5 xl:grid-cols-[1.45fr_.9fr]">
        <div className="paper-card overflow-hidden p-5 sm:p-7">
          <div className="relative z-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div className="max-w-lg"><p className="eyebrow mb-3 text-terra">A small, focused day</p><h2 className="mb-3 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">Make space for the ideas that matter.</h2><p className="text-sm leading-6 text-ink/60 sm:text-base">You have 3 gentle steps in your study trail. Your brain does better with a little momentum than a perfect plan.</p></div>
            <motion.button whileHover={{ y: -3 }} whileTap={{ scale: .97 }} onClick={() => navigate("planner")} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-paper shadow-paper transition hover:shadow-lift">Open today&apos;s trail <ArrowRight size={16} /></motion.button>
          </div>
          <div className="pointer-events-none absolute -right-6 -top-10 h-44 w-44 rounded-full bg-terra/15 blur-2xl" />
          <div className="pointer-events-none absolute bottom-2 right-28 h-20 w-20 rotate-12 rounded-2xl border border-sage/20 bg-sage-pale/70" />
        </div>

        <div className="paper-card grainy flex min-h-[230px] flex-col justify-between bg-ink p-5 text-paper sm:p-6">
          <div className="flex items-center justify-between"><span className="pill border-white/15 bg-white/10 text-paper/80"><Flame size={13} className="text-terra" /> current spark</span><span className="font-mono text-xs text-paper/50">SEP 16</span></div>
          <div><div className="mb-2 flex items-end gap-2"><span className="text-6xl font-bold tracking-tighter">07</span><span className="mb-2 text-sm text-paper/60">days in a row</span></div><p className="font-accent text-lg italic text-paper/80">“Consistency is a quiet superpower.”</p></div>
          <div className="flex gap-1.5">{[1,2,3,4,5,6,7].map((d) => <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: d * .06 }} key={d} className={`h-2 flex-1 origin-left rounded-full ${d === 7 ? "bg-paper/25" : "bg-terra"}`} />)}</div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Metric icon={Clock3} value="4h 20m" label="focus this week" tint="indigo" detail="+ 42 min from last week" />
        <Metric icon={Layers3} value="32" label="cards in your queue" tint="sage" detail="10 cards due today" />
        <Metric icon={Target} value="78%" label="concept mastery" tint="terra" detail="Up 6% this month" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="paper-card p-5 sm:p-6"><div className="mb-6 flex items-start justify-between"><div><p className="eyebrow mb-1">Time well spent</p><h3 className="text-lg font-bold">Your learning rhythm</h3></div><span className="pill text-sage-deep">+18% steady</span></div><div className="flex h-40 items-end justify-between gap-2 sm:gap-3">{bars.map((height, index) => <div key={height} className="flex h-full flex-1 flex-col justify-end gap-2"><motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * .08, type: "spring", stiffness: 90, damping: 15 }} className={`rounded-t-lg ${index === 6 ? "bg-ink" : "bg-sage/35"}`} /><span className={`text-center font-mono text-[9px] ${index === 6 ? "font-bold text-ink" : "text-ink/40"}`}>{["M","T","W","T","F","S","S"][index]}</span></div>)}</div></div>
        <div className="paper-card p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow mb-1">Next up</p><h3 className="text-lg font-bold">Today&apos;s trail</h3></div><button onClick={() => navigate("planner")} className="text-sm font-semibold text-indigo hover:text-indigo-deep">View plan <ChevronRight className="inline" size={15}/></button></div><div className="space-y-3">{schedule.map((item, i) => <div className="flex items-center gap-3" key={item.title}><span className="w-9 font-mono text-[11px] text-ink/45">{item.time}</span><span className={`h-9 w-1 rounded-full ${item.color === "sage" ? "bg-sage" : item.color === "terra" ? "bg-terra" : "bg-indigo"}`} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-ink/50">{item.tag}</p></div>{i === 0 && <span className="rounded-full bg-sage-pale px-2 py-1 text-[10px] font-bold text-sage-deep">NOW</span>}</div>)}</div></div>
      </section>

      <section className="grid gap-5 md:grid-cols-2"><button onClick={() => navigate("reader")} className="paper-card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-pale text-indigo"><BookMarked size={23}/></span><span><span className="mb-1 flex items-center gap-2 text-sm font-bold">Turn a paper into a study kit <Sparkles size={15} className="text-terra"/></span><span className="text-xs leading-5 text-ink/55">Drop a PDF, get its map, answers, and a memory deck.</span></span><ArrowRight className="ml-auto text-ink/30 transition group-hover:translate-x-1 group-hover:text-ink" size={18}/></button><div className="paper-card flex items-center gap-4 p-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-pale text-sage-deep"><Check size={24}/></span><span><span className="block text-sm font-bold">A small win is waiting</span><span className="text-xs leading-5 text-ink/55">Review 10 cards and preserve your seven-day spark.</span></span></div></section>
    </div>
  );
}

function Metric({ icon: Icon, value, label, detail, tint }: { icon: typeof Clock3; value: string; label: string; detail: string; tint: "sage" | "terra" | "indigo" }) {
  const styles = { sage: "bg-sage-pale text-sage-deep", terra: "bg-terra-pale text-terra-deep", indigo: "bg-indigo-pale text-indigo-deep" };
  return <div className="soft-card flex items-start gap-4 p-4 sm:p-5"><span className={`grid h-11 w-11 place-items-center rounded-xl ${styles[tint]}`}><Icon size={20}/></span><div><p className="text-2xl font-bold tracking-tight">{value}</p><p className="text-sm text-ink/65">{label}</p><p className="mt-1 text-[11px] font-medium text-ink/40">{detail}</p></div></div>;
}
