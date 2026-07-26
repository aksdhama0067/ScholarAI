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

