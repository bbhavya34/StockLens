"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileChartColumn,
  Newspaper,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const agents = [
  {
    name: "Technical Agent",
    icon: ChartNoAxesCombined,
    angle: -90,
    description: "Analyzes RSI, MACD, SMA/EMA, Bollinger Bands, momentum and trend.",
  },
  {
    name: "News Agent",
    icon: Newspaper,
    angle: -18,
    description: "Aggregates company coverage and evaluates sentiment and major events.",
  },
  {
    name: "Fundamental Agent",
    icon: FileChartColumn,
    angle: 54,
    description: "Studies growth, profitability, valuation, leverage and financial quality.",
  },
  {
    name: "Risk Agent",
    icon: ShieldAlert,
    angle: 126,
    description: "Measures volatility, drawdowns and relative market risk.",
  },
  {
    name: "Portfolio Agent",
    icon: BriefcaseBusiness,
    angle: 198,
    description: "Weighs position sizing and exposure against the wider portfolio.",
  },
];

const RADIUS = 148;

function nodePosition(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: RADIUS * Math.cos(rad),
    y: RADIUS * Math.sin(rad),
  };
}

export function AgentNetwork() {
  return (
    <section id="agents" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Your own AI research desk.
        </h2>
        <p className="mt-4 text-sm text-muted-2 sm:text-base">
          Instead of one model guessing the answer, specialized agents investigate the stock from
          different perspectives.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center"
        >
          <svg
            viewBox="-180 -180 360 360"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {agents.map((agent) => {
              const pos = nodePosition(agent.angle);
              return (
                <line
                  key={agent.name}
                  x1={0}
                  y1={0}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="var(--border-strong)"
                  strokeWidth={1}
                  strokeDasharray="4 5"
                  className="animate-flow"
                />
              );
            })}
          </svg>

          {/* center node */}
          <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-emerald/40 bg-surface-2 text-center shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)]">
            <Sparkles className="h-5 w-5 text-emerald" />
            <span className="mt-1 px-1 text-[9px] leading-tight text-muted-2">Orchestrator</span>
            <span className="absolute -inset-2 -z-10 rounded-full border border-emerald/20 animate-pulse-soft" />
          </div>

          {agents.map((agent, i) => {
            const pos = nodePosition(agent.angle);
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                className="absolute z-10 flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-border-strong bg-surface text-center shadow-lg"
              >
                <Icon className="h-4 w-4 text-cyan" />
                <span className="px-1 text-[8.5px] leading-tight text-muted-2">
                  {agent.name.replace(" Agent", "")}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ...agents.map((a) => ({ name: a.name, icon: a.icon, description: a.description })),
            {
              name: "Research Agent",
              icon: Sparkles,
              description: "Challenges conflicting signals and writes the final explanation.",
            },
          ].map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="h-full p-4 transition-colors hover:border-border-strong">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-emerald" />
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{agent.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
