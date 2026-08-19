"use client";

import { Bell, Menu, Search } from "lucide-react";

export function Topbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="icon-button lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
        <div><p className="eyebrow hidden sm:block">Monday, September 16</p><h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1></div>
      </div>
      <div className="flex items-center gap-2">
        <label className="hidden h-10 w-52 items-center gap-2 rounded-xl border border-line bg-white/70 px-3 text-ink/40 md:flex"><Search size={16} /><input className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35" placeholder="Search your notes" /></label>
        <button className="icon-button relative" aria-label="Notifications"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-terra" /></button>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-terra-pale font-accent text-sm font-semibold text-terra-deep shadow-sm" aria-label="Your profile">AN</button>
      </div>
    </header>
  );
}
