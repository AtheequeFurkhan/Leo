"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleDollarSign, Clock3, FileSearch, Info, Radar } from "lucide-react";
import { QueryMetadata } from "@/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  metadata: QueryMetadata;
}

export default function AuditTrail({ metadata }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-block relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
        title="Query audit trail"
      >
        <Info className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full right-0 z-50 mb-2 w-72 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/50"
          >
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Query audit trail</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <span className="flex items-center gap-2 text-slate-500"><Clock3 className="h-3.5 w-3.5" /> Timestamp</span>
                <span className="text-slate-300">{metadata.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <span className="flex items-center gap-2 text-slate-500"><Radar className="h-3.5 w-3.5" /> Agents used</span>
                <span className="text-slate-300">{metadata.agentsUsed.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <span className="flex items-center gap-2 text-slate-500"><FileSearch className="h-3.5 w-3.5" /> Sources hit</span>
                <span className="text-slate-300">{metadata.sourcesHit}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <span className="text-slate-500">Latency</span>
                <span className="text-slate-300">{metadata.totalLatency.toFixed(1)}s</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <span className="flex items-center gap-2 text-slate-500"><CircleDollarSign className="h-3.5 w-3.5" /> Est. cost</span>
                <span className="font-mono text-slate-300">${metadata.estimatedCost.toFixed(2)}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500">Agents</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {metadata.agentsUsed.map((a) => (
                    <Badge key={a} variant="default" className="normal-case tracking-normal">{a}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
