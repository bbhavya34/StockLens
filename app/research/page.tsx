"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  FileSearch,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar/sidebar";
import { api } from "@/lib/api";

type Agent = {
  key: string;
  name: string;
  model: string;
  endpoint: string;
  note: string;
};

const agents: Agent[] = [
  {
    key: "technical",
    name: "Technical Agent",
    model: "Technical-v2",
    endpoint: "/ml/technical/predict/",
    note: "Trend, momentum, volatility and anomaly features.",
  },
  {
    key: "fundamental",
    name: "Fundamental Agent",
    model: "Fundamental-v1",
    endpoint: "/ml/fundamental/analyze/",
    note: "Financial health, growth and valuation evidence.",
  },
  {
    key: "news",
    name: "News Intelligence",
    model: "FinSent-v3",
    endpoint: "/ml/news/analyze/",
    note: "Source-linked events and sentiment classification.",
  },
  {
    key: "risk",
    name: "Risk Agent",
    model: "Risk-v2",
    endpoint: "/ml/risk/analyze/",
    note: "Downside, liquidity, concentration and regime checks.",
  },
  {
    key: "portfolio",
    name: "Portfolio Intelligence",
    model: "Portfolio-v1",
    endpoint: "/ml/portfolio/analyze/",
    note: "Owner-scoped portfolio exposure and contribution to risk.",
  },
];

type TechnicalResult = {
  signal: string;
  confidence: number;
  forecast_5d: number;
  data_timestamp: string;
  indicators: { sma_20: number; sma_50: number; rsi_14: number; macd: number };
};

type QuoteResult = {
  symbol: string;
  price: number;
  previous_close: number | null;
  change: number | null;
  change_percent: number | null;
  currency: string | null;
  source: string;
  retrieved_at: string;
};

type AgentResult = {
  status: string;
  confidence?: number;
  data_timestamp?: string;
  reason?: string;
  evidence?: unknown[];
  articles?: unknown[];
  positions?: unknown[];
};

type TechnicalAgentResult = AgentResult & Partial<TechnicalResult>;

type SynthesisResult = {
  status: string;
  overall_signal: string;
  confidence: number;
  evidence_coverage: number;
  agent_agreement: number;
  signal_conflict: boolean;
  summary: string;
};

function AgentCard({
  agent,
  result,
  index,
}: {
  agent: Agent;
  result?: AgentResult;
  index: number;
}) {
  const complete = result?.status === "complete";
  const evidenceCount =
    result?.evidence?.length ??
    result?.articles?.length ??
    result?.positions?.length ??
    0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-surface p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium">{agent.name}</h2>
          <p className="mt-1 text-xs text-muted">Model: {agent.model}</p>
        </div>
        <span className="rounded-full border border-emerald/25 bg-emerald/10 px-2 py-1 text-xs text-emerald">
          {complete ? "Complete" : "Active"}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-2">{agent.note}</p>
      {result?.reason && (
        <p className="mt-2 text-xs text-amber">{result.reason}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        <span>
          Confidence:{" "}
          {result?.confidence === undefined
            ? "—"
            : `${Math.round(result.confidence * 100)}%`}
        </span>
        <span>Evidence: {evidenceCount}</span>
        <span>
          Freshness:{" "}
          {result?.data_timestamp
            ? new Date(result.data_timestamp).toLocaleDateString()
            : "—"}
        </span>
      </div>
    </motion.article>
  );
}

export default function ResearchPage() {
  const { session, loading } = useAuth();
  const [symbol, setSymbol] = useState("");
  const [open, setOpen] = useState(true);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState(
    "No research has been run in this session."
  );
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [technical, setTechnical] = useState<TechnicalResult | null>(null);
  const [agentResults, setAgentResults] = useState<
    Record<string, AgentResult>
  >({});
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);

  if (!loading && !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold">
            Sign in to open Research
          </h1>
          <Button className="mt-5" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  async function runResearch() {
    if (!symbol.trim() || !session) return;

    setRunning(true);
    setQuote(null);
    setTechnical(null);
    setAgentResults({});
    setSynthesis(null);
    setNotice("Requesting validated research data…");

    try {
      const report = await api.post<{
        quote?: QuoteResult | null;
        agents?: Record<string, AgentResult> & {
          technical?: TechnicalAgentResult;
        };
        synthesis?: SynthesisResult;
      }>(
        "/research/run/",
        { symbol: symbol.trim().toUpperCase() },
        { headers: { Authorization: Bearer  } }
      );

      const technicalResult = report.agents?.technical;
      setQuote(report.quote ?? null);
      setTechnical(
        technicalResult?.status === "complete" &&
          technicalResult.signal &&
          technicalResult.indicators &&
          technicalResult.forecast_5d !== undefined &&
          technicalResult.data_timestamp
          ? (technicalResult as TechnicalResult)
          : null
      );
      setAgentResults(report.agents ?? {});
      setSynthesis(
        report.synthesis?.status === "complete" ? report.synthesis : null
      );
      setNotice(
        report.synthesis?.summary ??
          "Research pipeline completed with partial provider data."
      );
    } catch (err) {
      setNotice(
        err instanceof Error
          ? `Research unavailable: ${err.message}`
          : "Research unavailable. Configure a market-data provider and retry."
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-80">
        <main className="relative min-h-screen overflow-hidden text-foreground">
          <div
            aria-hidden
            className="aurora pointer-events-none absolute inset-0 opacity-80"
          />
          <div className="sticky top-0 z-20 border-b border-border-subtle bg-surface/95 backdrop-blur">
            <div className="px-6 py-4 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald">
                  Evidence-first research
                </p>
                <h1 className="mt-2 font-display text-2xl font-semibold">
                  Research intelligence
                </h1>
              </motion.div>
            </div>
          </div>
          <div className="relative px-6 py-8 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-4xl"
            >
              <p className="text-sm leading-6 text-muted-2">
                Run specialized analysis only against provider-backed data.
                Missing or stale inputs are shown explicitly—not inferred.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Input
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && symbol.trim()) runResearch();
                  }}
                  placeholder="Search a ticker, e.g. RELIANCE.NS or AAPL"
                  className="h-12 flex-1"
                />
                <Button
                  onClick={runResearch}
                  disabled={running || !symbol.trim()}
                  className="h-12 shrink-0"
                  size="lg"
                >
                  {running ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSearch className="h-4 w-4" />
                  )}
                  {running ? "Running research…" : "Run research"}
                </Button>
              </div>
              <p role="status" className="mt-3 text-sm text-muted-2">
                {notice}
              </p>
            </motion.div>
            <section className="scanline relative mt-8 overflow-hidden rounded-2xl border border-border-strong bg-surface max-w-4xl">
              <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span>
                  <span className="text-xs font-semibold uppercase tracking-[.18em] text-emerald">
                    System transparency
                  </span>
                  <span className="mt-1 block font-display text-xl font-semibold">
                    Intelligence pipeline
                  </span>
                </span>
                <ChevronDown
                  className={h-5 w-5 transition  shrink-0}
                />
              </button>
              {open && (
                <div className="grid gap-px border-t border-border-subtle bg-border-subtle md:grid-cols-2">
                  {agents.map((agent, index) => (
                    <AgentCard
                      key={agent.key}
                      agent={agent}
                      result={agentResults[agent.key]}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </section>
            <section className="mt-6 rounded-2xl border border-border-strong bg-surface p-6 max-w-4xl">
              <div className="flex items-start gap-3">
                <BrainCircuit className="mt-1 h-5 w-5 shrink-0 text-emerald" />
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    StockLens intelligence
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-2">
                    A final view is produced only after evidence validation,
                    freshness checks and conflict detection. It is never a
                    simple average of agent scores.
                  </p>
                </div>
              </div>
              {quote && (
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border-subtle bg-surface-2 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[.16em] text-muted">
                      {quote.symbol} · {quote.source}
                    </p>
                    <p className="mt-1 font-mono-tab text-3xl font-semibold">
                      {quote.currency ? `${quote.currency} ` : ""}
                      {quote.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div
                    className={
                      quote.change !== null && quote.change < 0
                        ? "text-rose-400"
                        : "text-emerald"
                    }
                  >
                    {quote.change === null
                      ? "—"
                      : `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(
                          2
                        )}`}{" "}
                    {quote.change_percent === null
                      ? ""
                      : `(${
                          quote.change_percent >= 0 ? "+" : ""
                        }${quote.change_percent.toFixed(2)}%)`}
                  </div>
                </div>
              )}
              {technical && (
                <div className="mt-5 rounded-xl border border-emerald/25 bg-emerald/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium capitalize">
                      Technical view:{" "}
                      <span className="text-emerald">{technical.signal}</span>
                    </p>
                    <p className="text-xs text-muted">
                      As of {new Date(technical.data_timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {[
                      ["Confidence", `${Math.round(technical.confidence * 100)}%`],
                      ["5D regression forecast", technical.forecast_5d],
                      ["RSI (14)", technical.indicators.rsi_14],
                      ["MACD", technical.indicators.macd],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        className="rounded-xl border border-emerald/15 bg-background/40 p-3"
                      >
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-1 font-display font-semibold">
                          {typeof value === "number"
                            ? value.toFixed(2)
                            : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {synthesis && (
                <div className="mt-5 rounded-xl border border-emerald/25 bg-emerald/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        Overall signal:{" "}
                        <span className="text-emerald">
                          {synthesis.overall_signal}
                        </span>
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-2">
                        {synthesis.summary}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {[
                      ["Confidence", `${Math.round(synthesis.confidence * 100)}%`],
                      ["Evidence coverage", `${Math.round(synthesis.evidence_coverage * 100)}%`],
                      ["Agent agreement", `${Math.round(synthesis.agent_agreement * 100)}%`],
                      ["Signal conflict", synthesis.signal_conflict ? "Yes" : "No"],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        className="rounded-xl border border-emerald/15 bg-background/40 p-3"
                      >
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-1 font-display font-semibold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
            <aside className="mt-6 max-w-4xl rounded-2xl border border-border-strong bg-surface p-5">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber" />
                <div>
                  <h2 className="font-medium">Research guardrails</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-2">
                    Market claims need timestamped sources. Model failure,
                    stale data and missing coverage are surfaced as unavailable
                    states.
                  </p>
                </div>
              </div>
              <Link
                className="mt-5 inline-flex items-center gap-1 text-sm text-emerald hover:underline"
                href="/portfolio"
              >
                Open portfolio intelligence{" "}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
