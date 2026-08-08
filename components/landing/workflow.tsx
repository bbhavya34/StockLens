"use client";

import { motion } from "framer-motion";
import { Search, Database, GitCompare, ShieldQuestion, FileText } from "lucide-react";

const steps = [
  { title: "Search a stock", icon: Search },
  { title: "Agents collect evidence", icon: Database },
  { title: "Signals are evaluated", icon: GitCompare },
  { title: "Conflicts are resolved", icon: ShieldQuestion },
  { title: "AI writes the research thesis", icon: FileText },
];

export function Workflow() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          From ticker to thesis in seconds.
        </h2>
      </motion.div>

      <div className="relative mt-16">
        <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-px bg-border-strong lg:left-0 lg:top-5 lg:h-px lg:w-full" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:text-center"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-muted-2 lg:bg-background">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="pt-1.5 lg:pt-0">
                  <p className="text-xs font-medium text-muted">Step {i + 1}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{step.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
