"use client";

import { motion } from "framer-motion";
import { GithubIcon } from "@/components/icons/github-icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const stats = [
  { label: "Stars", value: "2.4k" },
  { label: "Forks", value: "180" },
  { label: "Contributors", value: "32" },
];

export function OpenSource() {
  return (
    <section id="open-source" className="mx-auto max-w-4xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden p-10 text-center">
          <div className="glow-emerald pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface-2">
              <GithubIcon className="h-5 w-5" />
            </span>
            <h2 className="text-balance mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Market intelligence should be transparent.
            </h2>
            <p className="text-balance mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-2">
              StockLens is being built as an open-source research platform where models,
              indicators and reasoning can be inspected instead of hidden behind a mystery score.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
              <Button variant="secondary">Read Documentation</Button>
            </div>

            <Separator className="mx-auto mt-10 max-w-sm" />

            <div className="mt-6 flex items-center justify-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono-tab text-xl font-semibold">{stat.value}</p>
                  <p className="text-[11px] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-muted">Demo placeholder figures</p>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
