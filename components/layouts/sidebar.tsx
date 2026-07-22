"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarDays, ChevronLeft, Compass, FileText, LayoutDashboard, Layers3, Sparkles, X } from "lucide-react";
import type { WorkspaceTab } from "@/lib/types";

const navigation: { id: WorkspaceTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Your desk", icon: LayoutDashboard },
  { id: "reader", label: "Paper reader", icon: FileText },
  { id: "simplify", label: "Make it clear", icon: Sparkles },
  { id: "flashcards", label: "Memory deck", icon: Layers3 },
  { id: "planner", label: "Study map", icon: CalendarDays },
  { id: "guide", label: "Future guide", icon: Compass }
];

type Props = { active: WorkspaceTab; onChange: (tab: WorkspaceTab) => void; open: boolean; onClose: () => void };

function SidebarContent({ active, onChange, onClose }: Omit<Props, "open">) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8 flex items-center justify-between px-2 pt-1">
        <button onClick={() => onChange("dashboard")} className="flex items-center gap-2 text-left" aria-label="Go to your desk">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper shadow-paper">
            <BookOpen size={19} strokeWidth={2.2} />
          </span>
          <span><span className="block text-base font-bold tracking-tight">Scholar<span className="text-terra">AI</span></span><span className="block font-mono text-[9px] tracking-[.14em] text-ink/45">STUDY STUDIO</span></span>
        </button>
        <button onClick={onClose} className="icon-button lg:hidden" aria-label="Close menu"><X size={18} /></button>
      </div>

      <p className="eyebrow mb-2 px-3">Your workspace</p>
      <nav className="space-y-1">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { onChange(id); onClose(); }} className={`nav-link w-full ${active === id ? "nav-link-active" : ""}`}>
            <Icon size={18} strokeWidth={active === id ? 2.4 : 1.8} /> {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-sage/20 bg-sage-pale p-4">
        <div className="mb-3 flex items-center gap-2"><span className="text-lg">🔥</span><span className="text-sm font-bold">7 day spark</span></div>
        <p className="mb-3 text-xs leading-5 text-ink/60">A tiny session today keeps your memory trail warm.</p>
        <div className="flex gap-1.5">{[1, 2, 3, 4, 5, 6, 7].map((day) => <span key={day} className={`h-2 flex-1 rounded-full ${day < 7 ? "bg-sage" : "bg-sage/25"}`} />)}</div>
      </div>
    </div>
  );
}

export function Sidebar({ active, onChange, open, onClose }: Props) {
  return (
    <>
      <aside className="hidden min-h-screen w-[250px] shrink-0 border-r border-line bg-white/55 lg:block"><SidebarContent active={active} onChange={onChange} onClose={onClose} /></aside>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 340, damping: 32 }} className="relative h-full w-[275px] border-r border-line bg-paper shadow-paper-md">
            <SidebarContent active={active} onChange={onChange} onClose={onClose} />
          </motion.aside>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}
