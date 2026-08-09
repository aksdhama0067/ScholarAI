"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Flame, Plus, Target } from "lucide-react";
import { useState } from "react";
import { schedule } from "@/lib/mock-data";

const days = [
  { label: "Mon", date: 16, done: 2 },
  { label: "Tue", date: 17, done: 1 },
  { label: "Wed", date: 18, done: 0 },
  { label: "Thu", date: 19, done: 0 },
  { label: "Fri", date: 20, done: 0 },
  { label: "Sat", date: 21, done: 0 },
  { label: "Sun", date: 22, done: 0 },
];

const lineColor = { sage: "bg-sage", terra: "bg-terra", indigo: "bg-indigo" };

export function PlannerView() {
  const [completed, setCompleted] = useState<number[]>([]);

  const done = (index: number) =>
    setCompleted((items) =>
      items.includes(index) ? items.filter((item) => item !== index) : [...items, index]
    );

  return (
    <div className="space-y-5">
      <section className="paper-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">Your study map</p>
            <h2 className="text-3xl font-bold tracking-tight">A plan with breathing room.</h2>
            <p className="mt-2 text-sm text-ink/60">
              SRS places ideas back in your path just before they fade.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="icon-button" aria-label="Previous week">
              <ChevronLeft size={18} />
            </button>
            <button className="icon-button" aria-label="Next week">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {days.map((day, index) => (
            <button
              key={day.date}
              className={`group min-h-20 rounded-xl border p-2 text-left transition sm:min-h-28 sm:p-3 ${
                index === 0
                  ? "border-ink bg-ink text-paper shadow-paper"
                  : "border-line bg-white hover:-translate-y-1 hover:shadow-paper"
              }`}
            >
              <p
                className={`font-mono text-[9px] uppercase sm:text-[10px] ${
                  index === 0 ? "text-paper/55" : "text-ink/40"
                }`}
              >
                {day.label}
              </p>
              <p className="mt-1 text-xl font-bold sm:text-2xl">{day.date}</p>
              <div className="mt-3 flex gap-1">
                {[0, 1, 2].map((marker) => (
                  <span
                    key={marker}
                    className={`h-1.5 flex-1 rounded-full ${
                      marker < day.done
                        ? index === 0
                          ? "bg-terra"
                          : "bg-sage"
                        : index === 0
                        ? "bg-white/20"
                        : "bg-line"
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

