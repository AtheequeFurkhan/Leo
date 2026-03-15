"use client";

import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfidenceBadge from "@/components/analysis/confidence-badge";

interface CompetitorPricing {
  name: string;
  model: string;
  entry_price: string;
  enterprise_price: string;
  packaging: string;
}

interface WTPSignal {
  signal: string;
  confidence: "high" | "medium" | "low";
}

interface Props {
  payload: {
    competitors: CompetitorPricing[];
    willingness_to_pay: WTPSignal[];
    gaps: string[];
  };
}

export default function PricingIntelligence({ payload }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-indigo-100">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Pricing intelligence</CardTitle>
              <p className="text-sm text-slate-400">Compare price architecture, willingness to pay, and packaging gaps.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto rounded-[24px] border border-white/8 bg-black/10">
            <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Competitor</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Model</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Entry Price</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Enterprise</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Packaging</th>
            </tr>
          </thead>
          <tbody>
            {payload.competitors.map((c, i) => (
              <tr key={c.name} className={`border-b border-white/8 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                <td className="px-3 py-2 text-slate-200 font-medium">{c.name}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs text-indigo-200">{c.model}</span>
                </td>
                <td className="px-3 py-2 text-slate-300 font-mono text-xs">{c.entry_price}</td>
                <td className="px-3 py-2 text-slate-300 font-mono text-xs">{c.enterprise_price}</td>
                <td className="px-3 py-2 text-slate-400 text-xs">{c.packaging}</td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Willingness-to-pay signals</h4>
              <div className="space-y-3">
                {payload.willingness_to_pay.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="flex-1 text-sm leading-6 text-slate-300">{s.signal}</span>
                    <ConfidenceBadge confidence={s.confidence} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pricing gaps and opportunities</h4>
              <div className="space-y-3">
                {payload.gaps.map((gap, i) => (
                  <div key={i} className="rounded-2xl border border-emerald-400/12 bg-emerald-400/8 p-4 text-sm leading-6 text-emerald-200">
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
