"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowupChipsProps {
  chips: string[];
  onSelect: (chip: string) => void;
  align?: "center" | "left";
}

export default function FollowupChips({ chips, onSelect, align = "center" }: FollowupChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${align === "center" ? "justify-center" : "justify-start"}`}>
      {chips.map((chip, index) => (
        <motion.div key={chip} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelect(chip)}
            className="rounded-full border-white/8 bg-white/[0.04] px-4 text-slate-300 hover:border-primary/20 hover:bg-primary/10 hover:text-indigo-100"
          >
            {chip}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
