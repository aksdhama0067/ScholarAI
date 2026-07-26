"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarDays, ChevronLeft, Compass, FileText, LayoutDashboard, Layers3, Sparkles, X } from "lucide-react";
import type { WorkspaceTab } from "@/lib/types";

const navigation: { id: WorkspaceTab; label: string; icon: typeof LayoutDashboard }[] = [

      </AnimatePresence>
    </>
  );
}
  { id: "dashboard", label: "Your desk", icon: LayoutDashboard },
  { id: "reader", label: "Paper reader", icon: FileText },
  { id: "simplify", label: "Make it clear", icon: Sparkles },
  { id: "flashcards", label: "Memory deck", icon: Layers3 },
  { id: "planner", label: "Study map", icon: CalendarDays },
  { id: "guide", label: "Future guide", icon: Compass }
];

type Props = { active: WorkspaceTab; onChange: (tab: WorkspaceTab) => void; open: boolean; onClose: () => void };

