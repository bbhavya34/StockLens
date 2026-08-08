"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_75%)]" />
      <div className="glow-emerald pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[52rem] -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Stop chasing signals.
          <br />
          Start understanding them.
        </h2>
        <p className="text-balance mx-auto mt-4 max-w-md text-sm text-muted-2 sm:text-base">
          Research stocks with an AI team that shows its work.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg">
            Launch StockLens
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="secondary">
            <Bot className="h-4 w-4" />
            Explore the Agents
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
