"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, FileText, LoaderCircle, MessageCircleQuestion, Send, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { demoSummary } from "@/lib/mock-data";
import type { Summary } from "@/lib/types";

const toneStyles = { sage: "border-sage/25 bg-sage-pale text-sage-deep", terra: "border-terra/25 bg-terra-pale text-terra-deep", indigo: "border-indigo/20 bg-indigo-pale text-indigo-deep" };

