"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, ArrowUpRight, CircleDollarSign, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfidenceBadge from "@/components/analysis/confidence-badge";

interface BriefItem {
  claim: string;
  confidence: "high" | "medium" | "low";
  source_count: number;
  sources: string[];
}

interface Props {
  payload: {
    executive_summary: string;
    opportunities: BriefItem[];
    risks: BriefItem[];
    recommended_bets: BriefItem[];
  };
}

function BriefSection({
  title,
  items,
  icon,
  accent,
}: {
  title: string;
  items: BriefItem[];
  icon: React.ReactNode;
  accent: string;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>{icon}</div>
        <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-sm leading-7 text-slate-200">{item.claim}</p>
              <div className="flex items-center gap-2 shrink-0">
                <ConfidenceBadge confidence={item.confidence} />
                <Badge variant="default" className="normal-case tracking-normal">{item.source_count} sources</Badge>
              </div>
            </div>
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="mt-3 text-xs text-indigo-300 transition-colors hover:text-indigo-100"
            >
              {expandedIdx === i ? "Hide sources" : "Show sources"}
            </button>
            {expandedIdx === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {item.sources.map((s) => (
                  <span key={s} className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                    {s}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StrategicBrief({ payload }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-indigo-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Strategic brief</CardTitle>
              <p className="text-sm text-slate-400">Condensed opportunities, risks, and recommended bets.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[24px] border border-white/8 bg-black/10 p-5">
            <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">Executive summary</div>
            <p className="text-sm leading-7 text-slate-200">{payload.executive_summary}</p>
          </div>
        </CardContent>
      </Card>
      <BriefSection title="Top opportunities" items={payload.opportunities} icon={<ArrowUpRight className="h-5 w-5 text-emerald-200" />} accent="bg-emerald-400/10 text-emerald-200" />
      <BriefSection title="Key risks" items={payload.risks} icon={<AlertTriangle className="h-5 w-5 text-rose-200" />} accent="bg-rose-400/10 text-rose-200" />
      <BriefSection title="Recommended bets" items={payload.recommended_bets} icon={<CircleDollarSign className="h-5 w-5 text-indigo-200" />} accent="bg-primary/12 text-indigo-200" />
    </motion.div>
  );
}
