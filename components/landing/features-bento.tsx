"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { demoStocks, fundamentalMetrics, mockNews, portfolioAllocation } from "@/data/demo-stocks";

const tcs = demoStocks.TCS;

const newsBadge = {
  Positive: "positive",
  Negative: "negative",
  Neutral: "neutral",
} as const;

function BentoCard({
  className,
  eyebrow,
  title,
  description,
  children,
  delay = 0,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      <Card className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong">
        <span className="text-[11px] font-medium uppercase tracking-wide text-emerald">{eyebrow}</span>
        <h3 className="mt-1.5 font-display text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{description}</p>
        {children && <div className="mt-4 flex-1">{children}</div>}
      </Card>
    </motion.div>
  );
}

export function FeaturesBento() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to research smarter.
        </h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[220px]">
        <BentoCard
          className="lg:col-span-2 lg:row-span-1"
          eyebrow="Technicals"
          title="Technical Analysis"
          description="Interactive charts with RSI, MACD, moving averages and Bollinger Bands."
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <MiniSparkline data={tcs.chartData} positive height={64} />
            </div>
            <div className="flex gap-1.5">
              {["SMA", "RSI"].map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono-tab text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </BentoCard>

        <BentoCard
          eyebrow="News"
          title="AI News Intelligence"
          description="Understand how recent news changes the market narrative."
        >
          <div className="space-y-2">
            {mockNews.map((news) => (
              <div key={news.headline} className="flex items-start justify-between gap-2 text-[11px]">
                <span className="line-clamp-2 text-muted-2">{news.headline}</span>
                <Badge variant={newsBadge[news.sentiment]} className="shrink-0 text-[9px]">
                  {news.sentiment}
                </Badge>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          eyebrow="Fundamentals"
          title="Fundamental Analysis"
          description="Track growth, profitability and leverage at a glance."
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono-tab text-xs">
            <div>
              <p className="text-muted">P/E</p>
              <p className="text-foreground">{fundamentalMetrics.TCS.pe}</p>
            </div>
            <div>
              <p className="text-muted">EPS</p>
              <p className="text-foreground">₹{fundamentalMetrics.TCS.eps}</p>
            </div>
            <div>
              <p className="text-muted">ROE</p>
              <p className="text-emerald">{fundamentalMetrics.TCS.roe}%</p>
            </div>
            <div>
              <p className="text-muted">Rev. Growth</p>
              <p className="text-emerald">{fundamentalMetrics.TCS.revGrowth}%</p>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          eyebrow="Comparison"
          title="Stock Comparison"
          description="Compare companies side-by-side across every signal."
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono-tab text-muted-2">TCS</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[78%] rounded-full bg-emerald" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono-tab text-muted-2">INFY</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[52%] rounded-full bg-cyan" />
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          className="lg:row-span-2"
          eyebrow="Portfolio"
          title="Portfolio Analytics"
          description="Measure returns, concentration, volatility and diversification."
        >
          <div className="flex flex-col items-center">
            <PortfolioChart data={portfolioAllocation} size={150} />
            <div className="mt-2 grid w-full grid-cols-2 gap-1.5">
              {portfolioAllocation.map((slice) => (
                <div key={slice.name} className="flex items-center gap-1.5 text-[10px] text-muted-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.name} {slice.value}%
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        <BentoCard
          eyebrow="Strategy"
          title="Backtesting"
          description="Demo backtest"
        >
          <div className="space-y-1.5 text-[11px] text-muted-2">
            <p className="font-mono-tab">RSI &lt; 30 → Enter</p>
            <p className="font-mono-tab">RSI &gt; 60 → Exit</p>
          </div>
          <div className="mt-3 flex gap-4 font-mono-tab text-xs">
            <span>18 trades</span>
            <span className="text-emerald">61% win rate</span>
            <span className="text-emerald">+24.3%</span>
          </div>
        </BentoCard>

        <BentoCard
          eyebrow="Alerts"
          title="Smart Alerts"
          description="Get notified the moment a price or signal level is crossed."
        >
          <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-white/[0.02] p-3 text-xs">
            <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
            <span className="text-muted-2">TCS crossed your ₹3,800 price level.</span>
          </div>
        </BentoCard>

        <BentoCard
          className="lg:col-span-2"
          eyebrow="Research"
          title="Explainable Research"
          description="Every read comes with the reasoning that produced it — never a mystery score."
        >
          <div className="rounded-lg border border-emerald/20 bg-emerald-soft/40 p-3 text-xs leading-relaxed text-muted-2">
            “Technical momentum is improving, fundamentals remain strong, news sentiment is
            moderately positive, but valuation and volatility are elevated.”
          </div>
        </BentoCard>
      </div>
    </section>
  );
}
