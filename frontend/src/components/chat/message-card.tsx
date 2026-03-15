"use client";

import { motion } from "framer-motion";
import { Bot, User2 } from "lucide-react";
import { ChatMessage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AuditTrail from "@/components/AuditTrail";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: ChatMessage;
  showContextHint?: boolean;
}

export default function MessageCard({ message, showContextHint }: MessageCardProps) {
  if (message.role === "user") {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <Card className="max-w-2xl rounded-[28px] border-primary/15 bg-[linear-gradient(180deg,rgba(99,102,241,0.16),rgba(99,102,241,0.07))]">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-100">
              <User2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-100">You asked</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">{message.content}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {showContextHint && (
        <div className="flex items-center gap-2 pl-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-primary/70" />
          Building on prior conversation context
        </div>
      )}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-indigo-100">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-50">Leo synthesis</p>
                  <Badge variant="purple" className="normal-case tracking-normal">
                    Executive summary
                  </Badge>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">{message.content}</p>
              </div>
            </div>
            {message.metadata && <AuditTrail metadata={message.metadata} />}
          </div>
          {message.metadata && (
            <div className="grid gap-3 px-6 py-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Agents</div>
                <div className="mt-1 text-sm font-medium text-slate-100">{message.metadata.agentsUsed.length}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Sources</div>
                <div className="mt-1 text-sm font-medium text-slate-100">{message.metadata.sourcesHit}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Latency</div>
                <div className="mt-1 text-sm font-medium text-slate-100">{message.metadata.totalLatency.toFixed(1)}s</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {message.response?.errors.length ? (
        <div className={cn("rounded-2xl border border-amber-400/15 bg-amber-400/8 px-4 py-3 text-sm text-amber-200")}>
          This response used partial data. {message.response.errors.join(". ")}
        </div>
      ) : null}
    </motion.div>
  );
}
