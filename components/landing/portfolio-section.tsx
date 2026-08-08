"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { portfolioAllocation } from "@/data/demo-stocks";

const metrics = [
  { label: "30D Return", value: "+4.8%", icon: ArrowUpRight, tone: "text-emerald" },
  { label: "Volatility", value: "18.2%", icon: Gauge, tone: "text-amber" },
  { label: "Max Drawdown", value: "-7.4%", icon: ArrowDownRight, tone: "text-red" },
  { label: "Diversification", value: "Medium", icon: AlertTriangle, tone: "text-muted-2" },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Know what your portfolio is really exposed to.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-2 sm:text-base">
            Holding several stocks doesn&apos;t automatically mean you&apos;re diversified.
            StockLens looks across your positions to surface concentration and sector risk that
            individual charts hide.
          </p>

          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <PortfolioChart data={portfolioAllocation} size={180} />
            <div>
              <p className="font-mono-tab text-2xl font-semibold">IT Exposure: 60%</p>
              <Badge variant="warning" className="mt-2">
                High sector concentration
              </Badge>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald">AI Portfolio Review</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-2">
              60% of your portfolio is allocated to IT through TCS and Infosys. This creates
              sector concentration risk even though you hold four different stocks.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-lg border border-border-subtle bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted">
                      <Icon className={`h-3 w-3 ${metric.tone}`} />
                      {metric.label}
                    </div>
                    <p className={`mt-1 font-mono-tab text-base font-semibold ${metric.tone}`}>{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
