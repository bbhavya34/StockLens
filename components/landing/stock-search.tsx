"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { demoTickers, demoStocks } from "@/data/demo-stocks";
import { useDemoStore } from "@/store/use-demo-store";
import { cn } from "@/lib/utils";

export function StockSearch() {
  const { selectedStock, setSelectedStock } = useDemoStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto mt-12 max-w-2xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-surface-2/80 px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur">
        <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          type="text"
          readOnly
          value={`${demoStocks[selectedStock].company} · ${selectedStock}`}
          aria-label="Search demo stocks"
          placeholder="Search RELIANCE, TCS, INFY…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <kbd className="hidden rounded border border-border-strong px-1.5 py-0.5 font-mono-tab text-[10px] text-muted sm:inline-block">
          Demo
        </kbd>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {demoTickers.map((ticker) => (
          <button
            key={ticker}
            onClick={() => setSelectedStock(ticker)}
            aria-pressed={selectedStock === ticker}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium font-mono-tab transition-colors",
              selectedStock === ticker
                ? "border-emerald/40 bg-emerald-soft text-emerald"
                : "border-border-strong bg-white/[0.02] text-muted-2 hover:text-foreground"
            )}
          >
            {ticker}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted">Demo market data</p>
    </motion.div>
  );
}
