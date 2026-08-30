"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const reasonRows: { label: string; value: string; tone: "positive" | "warning" | "neutral" }[] = [
  { label: "Technical", value: "Positive", tone: "positive" },
  { label: "Trend", value: "Positive", tone: "positive" },
  { label: "Fundamentals", value: "Strong", tone: "positive" },
  { label: "Valuation", value: "Expensive", tone: "warning" },
  { label: "Risk", value: "Medium", tone: "warning" },
];

export function Explainability() {
  return (
    <section id="explainability" className="relative mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Signals are easy.
          <br />
          Understanding them is harder.
        </h2>
        <p className="text-balance mx-auto mt-4 max-w-xl text-sm text-muted-2 sm:text-base">
          Most stock tools compress complicated market conditions into a single BUY or SELL badge.
          StockLens exposes the evidence behind its assessment instead.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Traditional Stock Predictor
            </p>
            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-foreground">BUY</span>
              <span className="mb-1 font-mono-tab text-sm text-muted-2">82% confidence</span>
            </div>
            <p className="mt-2 text-xs text-muted">Model prediction</p>
            <Separator className="my-5" />
            <div className="flex items-center gap-2 text-sm text-amber">
              <HelpCircle className="h-4 w-4" />
              But why?
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full border-emerald/30 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_0_40px_-12px_rgba(16,185,129,0.35)]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">StockLens</p>
            <div className="mt-5">
              <Badge variant="positive" className="text-[13px]">Moderately Bullish</Badge>
            </div>
            <div className="mt-5 space-y-2.5">
              {reasonRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-2">{row.label}</span>
                  <Badge variant={row.tone}>{row.value}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center text-sm text-muted"
      >
        Every signal is traceable to the data and agent that produced it.
      </motion.p>
    </section>
  );
}
