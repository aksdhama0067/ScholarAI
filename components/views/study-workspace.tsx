"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DashboardView } from "@/components/views/dashboard-view";
import { FlashcardsView } from "@/components/views/flashcards-view";
import { GuideView } from "@/components/views/guide-view";
import { PdfReaderView } from "@/components/views/pdf-reader-view";
import { PlannerView } from "@/components/views/planner-view";
import { SimplifierView } from "@/components/views/simplifier-view";
import type { WorkspaceTab } from "@/lib/types";

const pageTitles: Record<WorkspaceTab, string> = {
  dashboard: "Good morning, Anika.", reader: "Paper reader", simplify: "Make it clear",
  flashcards: "Memory deck", planner: "Study map", guide: "Future guide"
};

export function StudyWorkspace() {
  const [active, setActive] = useState<WorkspaceTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const views: Record<WorkspaceTab, React.ReactNode> = {
    dashboard: <DashboardView navigate={setActive}/>, reader: <PdfReaderView/>, simplify: <SimplifierView/>,
    flashcards: <FlashcardsView/>, planner: <PlannerView/>, guide: <GuideView/>
  };
  return <div className="min-h-screen lg:flex"><Sidebar active={active} onChange={setActive} open={menuOpen} onClose={() => setMenuOpen(false)}/><main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 xl:p-10"><Topbar title={pageTitles[active]} onMenu={() => setMenuOpen(true)}/>{views[active]}</main></div>;
}
