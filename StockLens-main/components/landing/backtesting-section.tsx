"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { backtestResult } from "@/data/demo-stocks";

export function BacktestingSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Test ideas against history.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10"
      >
        <Card className="grid grid-cols-1 gap-0 overflow-hidden lg:grid-cols-2">
          <div className="border-b border-border-subtle p-6 font-mono-tab text-sm lg:border-b-0 lg:border-r">
            <p className="mb-4 text-[11px] uppercase tracking-wide text-muted">Strategy builder</p>
            <div className="space-y-3 text-muted-2">
              <p>
                <span className="text-emerald">IF</span> RSI is below{" "}
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-foreground">30</span>
              </p>
              <p className="pl-4">
                <span className="text-cyan">THEN</span> Enter Position
              </p>
              <Separator className="my-2" />
              <p>
                <span className="text-red">EXIT WHEN</span> RSI is above{" "}
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-foreground">60</span>
              </p>
            </div>
            <Button className="mt-6" size="sm">
              <Play className="h-3.5 w-3.5" />
              Run Backtest
            </Button>
          </div>

          <div className="p-6">
            <p className="mb-4 text-[11px] uppercase tracking-wide text-muted">Results</p>
            <div className="grid grid-cols-2 gap-4 font-mono-tab">
              <div>
                <p className="text-2xl font-semibold">{backtestResult.totalTrades}</p>
                <p className="text-xs text-muted">Total Trades</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-emerald">{backtestResult.winners}</p>
                <p className="text-xs text-muted">Winners</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-red">{backtestResult.losers}</p>
                <p className="text-xs text-muted">Losers</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-emerald">+{backtestResult.returnPct}%</p>
                <p className="text-xs text-muted">Return</p>
              </div>
            </div>
            <p className="mt-6 rounded-md border border-amber/20 bg-amber-soft px-3 py-2 text-[11px] text-amber">
              Historical performance does not guarantee future results.
            </p>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
