"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  CircleCheck,
  Landmark,
  Newspaper,
  ScaleIcon,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StockChart } from "@/components/charts/stock-chart";
import { demoStocks, indicators, timeframes, SignalTone } from "@/data/demo-stocks";
import { useDemoStore } from "@/store/use-demo-store";
import { cn } from "@/lib/utils";

const toneStyles: Record<SignalTone, string> = {
  positive: "text-emerald",
  negative: "text-red",
  warning: "text-amber",
  neutral: "text-muted-2",
};

const toneBadge: Record<SignalTone, "positive" | "negative" | "warning" | "neutral"> = {
  positive: "positive",
  negative: "negative",
  warning: "warning",
  neutral: "neutral",
};

const signalIcons = [TrendingUp, Landmark, Newspaper, ScaleIcon, ShieldAlert];

const collectingSteps = [
  "Collecting technical data…",
  "Reading financials…",
  "Analyzing 14 news items…",
  "Evaluating risk…",
  "Research complete",
];

export function StockDashboardPreview() {
  const { selectedStock, selectedTimeframe, setSelectedTimeframe, selectedIndicators, toggleIndicator } =
    useDemoStore();
  const stock = demoStocks[selectedStock];
  const positive = stock.changePercent >= 0;
  const [step, setStep] = useState(0);
  const [trackedStock, setTrackedStock] = useState(selectedStock);

  // Reset the collecting-data animation during render when the selected stock
  // changes, rather than in an effect (avoids a cascading-render setState).
  if (trackedStock !== selectedStock) {
    setTrackedStock(selectedStock);
    setStep(0);
  }

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      if (count < collectingSteps.length) {
        setStep(count);
      }
    }, 550);
    return () => clearInterval(interval);
  }, [selectedStock]);

  const signals = [
    stock.technicalStatus,
    stock.fundamentalStatus,
    stock.newsStatus,
    stock.valuationStatus,
    stock.riskStatus,
  ];

  const complete = step === collectingSteps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_40px_80px_-24px_rgba(0,0,0,0.7)]"
      >
        {/* window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 text-[11px] text-muted">app.stocklens.ai/research</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%]">
          {/* Left: chart */}
          <div className="border-b border-border-subtle p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{stock.ticker} · {stock.exchange}</span>
                  <span className="h-1 w-1 rounded-full bg-muted" />
                  <span>Demo</span>
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{stock.company}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono-tab text-2xl font-semibold sm:text-3xl">
                    ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={cn(
                      "font-mono-tab text-sm font-medium",
                      positive ? "text-emerald" : "text-red"
                    )}
                  >
                    {positive ? "+" : ""}
                    {stock.change.toFixed(2)} ({positive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Bookmark className="h-3.5 w-3.5" />
                Watchlist
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Tabs value={selectedTimeframe} onValueChange={(v) => setSelectedTimeframe(v as typeof selectedTimeframe)}>
                <TabsList>
                  {timeframes.map((tf) => (
                    <TabsTrigger key={tf} value={tf}>
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex flex-wrap gap-1.5">
                {indicators.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => toggleIndicator(ind)}
                    aria-pressed={selectedIndicators.includes(ind)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[11px] font-mono-tab transition-colors",
                      selectedIndicators.includes(ind)
                        ? "border-cyan/30 bg-cyan/10 text-cyan"
                        : "border-border-strong text-muted hover:text-foreground"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <StockChart data={stock.chartData} positive={positive} />
            </div>
          </div>

          {/* Right: AI research summary */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald animate-pulse-soft" />
              <span className="font-display text-sm font-semibold">StockLens Research</span>
            </div>

            <div className="mt-4 rounded-lg border border-border-subtle bg-white/[0.02] p-3">
              <AnimatePresence mode="wait">
                {!complete ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-muted-2"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan" />
                    {collectingSteps[step]}
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-emerald"
                  >
                    <CircleCheck className="h-3.5 w-3.5" />
                    Research complete
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <Badge variant={toneBadge[stock.overallTone]} className="text-[13px]">
                {stock.overall}
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              {signals.map((signal, i) => {
                const Icon = signalIcons[i];
                return (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={complete ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                    transition={{ duration: 0.4, delay: complete ? i * 0.08 : 0 }}
                    className="flex items-start gap-2.5 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                  >
                    <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", toneStyles[signal.tone])} />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">{signal.label}</span>
                        <span className={cn("text-xs font-medium", toneStyles[signal.tone])}>
                          {signal.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{signal.explanation}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
              <div className="flex -space-x-2">
                {["T", "F", "N", "V", "R"].map((letter) => (
                  <span
                    key={letter}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-border-strong bg-surface-2 text-[10px] font-medium text-emerald"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-muted">Generated by 5 collaborating AI agents</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
