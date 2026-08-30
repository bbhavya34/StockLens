"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-4 pt-40 sm:pt-48">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_75%)]" />
      <div className="glow-emerald pointer-events-none absolute left-1/2 top-[-12rem] h-[36rem] w-[60rem] -translate-x-1/2" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/[0.04] px-3 py-1 text-xs text-muted-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-soft" />
          Agentic market intelligence for Indian equities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-balance mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
        >
          Understand the{" "}
          <span className="bg-gradient-to-r from-emerald to-cyan bg-clip-text text-transparent">market</span>.
          <br />
          Not just the{" "}
          <span className="bg-gradient-to-r from-emerald to-cyan bg-clip-text text-transparent">signal</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-balance mx-auto mt-6 max-w-2xl text-base text-muted-2 sm:text-lg"
        >
          StockLens combines technicals, fundamentals, news, sentiment and portfolio risk through
          specialized AI agents — then explains exactly why a stock looks bullish, bearish or
          uncertain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" className="w-full sm:w-auto">
            Analyze a Stock
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            <Bot className="h-4 w-4" />
            Explore How It Works
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-5 text-xs text-muted"
        >
          Explainable research · No black-box predictions · Open-source first
        </motion.p>
      </div>
    </section>
  );
}
