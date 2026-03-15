"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Competitor {
  name: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  threat_level: "high" | "medium" | "low";
  sources: string[];
}

interface Props {
  payload: { competitors: Competitor[] };
}

const threatBadge = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function CompetitiveScorecard({ payload }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-indigo-100">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Competitive scorecard</CardTitle>
              <p className="text-sm text-slate-400">Positioning, strengths, weaknesses, and threat level by competitor.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-[24px] border border-white/8 bg-black/10">
            <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Competitor</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Positioning</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Strengths</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Weaknesses</th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Threat</th>
            </tr>
          </thead>
          <tbody>
            {payload.competitors.map((c, i) => (
              <tr key={c.name} className={`border-b border-white/8 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-100">{c.name}</td>
                <td className="max-w-[220px] px-4 py-4 text-slate-400">{c.positioning}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.strengths.map((s) => (
                      <span key={s} className="inline-block rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.weaknesses.map((w) => (
                      <span key={w} className="inline-block rounded-full border border-rose-400/15 bg-rose-400/10 px-2.5 py-1 text-xs text-rose-300">
                        {w}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${threatBadge[c.threat_level]}`}>
                    {c.threat_level.charAt(0).toUpperCase() + c.threat_level.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {payload.competitors.map((c) => (
              <Badge key={c.name} variant="default" className="normal-case tracking-normal">
                {c.name}: {c.sources.length} sources
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
