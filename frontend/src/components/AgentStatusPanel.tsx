"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, ChevronUp, LoaderCircle } from "lucide-react";
import { AgentStatusInfo, AgentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  agents: AgentStatusInfo[];
  collapsed: boolean;
  onToggle: () => void;
  totalTime?: number;
  totalSources?: number;
}

const statusIcon: Record<AgentStatus, React.ComponentType<{ className?: string }>> = {
  queued: Activity,
  running: LoaderCircle,
  done: CheckCircle2,
  failed: AlertTriangle,
  partial: AlertTriangle,
};

const statusColor: Record<AgentStatus, string> = {
  queued: "text-slate-500 border-white/10 bg-white/[0.03]",
  running: "text-indigo-300 border-primary/20 bg-primary/10",
  done: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  failed: "text-rose-300 border-rose-400/20 bg-rose-400/10",
  partial: "text-amber-300 border-amber-400/20 bg-amber-400/10",
};

const statusLabel: Record<AgentStatus, string> = {
  queued: "queued",
  running: "running",
  done: "done",
  failed: "failed",
  partial: "partial",
};

export default function AgentStatusPanel({ agents, collapsed, onToggle, totalTime, totalSources }: Props) {
  const allDone = agents.every((a) => a.status === "done" || a.status === "failed" || a.status === "partial");

  if (collapsed && allDone) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onToggle}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.09]"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
        <span>
          {agents.length} agents completed in {totalTime?.toFixed(1)}s
          {totalSources ? ` · ${totalSources} sources analysed` : ""}
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Agent Pipeline</div>
                <div className="mt-1 text-sm text-slate-300">Live execution trace across research agents</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={allDone ? "success" : "info"}>{allDone ? "Complete" : "Running"}</Badge>
                {allDone && (
                  <button onClick={onToggle} className="rounded-full border border-white/10 p-2 text-slate-400 transition-colors hover:text-white">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 p-5">
              {agents.map((agent, i) => {
                const Icon = statusIcon[agent.status];

                return (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${statusColor[agent.status]}`}>
                        <Icon className={`h-4 w-4 ${agent.status === "running" ? "animate-spin" : ""}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-200">{agent.displayName}</span>
                          <span className="text-xs font-mono text-slate-500">
                            {agent.status === "running" || agent.status === "done" || agent.status === "partial"
                              ? `${agent.elapsed.toFixed(1)}s`
                              : statusLabel[agent.status]}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className={`h-1.5 rounded-full ${
                              agent.status === "running"
                                ? "w-3/5 bg-primary"
                                : agent.status === "done"
                                ? "w-full bg-emerald-400"
                                : agent.status === "failed"
                                ? "w-full bg-rose-400"
                                : "w-1/4 bg-slate-600"
                            }`}
                          />
                        </div>
                        {agent.error ? <div className="mt-2 text-xs text-amber-300">{agent.error}</div> : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
