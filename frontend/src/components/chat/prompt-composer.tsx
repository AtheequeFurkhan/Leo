"use client";

import { Dispatch, FormEvent, SetStateAction } from "react";
import { Paperclip, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PromptComposerProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSubmit: (value: string) => void;
  isProcessing: boolean;
  useMock: boolean;
  setUseMock: Dispatch<SetStateAction<boolean>>;
}

export default function PromptComposer({
  input,
  setInput,
  onSubmit,
  isProcessing,
  useMock,
  setUseMock,
}: PromptComposerProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(input);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-slate-950/75 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:left-[280px] lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-3 shadow-[0_-12px_40px_-30px_rgba(99,102,241,0.65)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="gap-1 normal-case tracking-normal">
                  <Sparkles className="h-3.5 w-3.5" />
                  Strategic prompt
                </Badge>
                <span className="hidden text-xs text-slate-500 sm:inline">
                  Ask for competitor moves, pricing pressure, category trends, or next-best bets.
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-white/5"
                />
                Demo mode
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" className="hidden rounded-2xl border border-white/8 bg-white/[0.03] sm:flex">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your market, competitors, pricing, positioning, or strategic risk..."
                disabled={isProcessing}
                className="h-14 rounded-2xl border-white/8 bg-slate-950/60 text-[15px]"
              />
              <Button type="submit" size="lg" disabled={!input.trim() || isProcessing} className="min-w-[132px] rounded-2xl">
                {isProcessing ? "Analysing..." : "Send"}
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
