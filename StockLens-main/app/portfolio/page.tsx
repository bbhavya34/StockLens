"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import { demoPortfolioHoldings } from "@/data/demo-stocks";
import { api } from "@/lib/api";

type DemoPortfolio = {
  id: number;
  name: string;
  holdings: Array<{ id: number }>;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function PortfolioPage() {
  const { session, loading } = useAuth();
  const [activating, setActivating] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState<DemoPortfolio | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function activateDemoPortfolio() {
    if (!session) {
      setNotice("Sign in to save the demo portfolio to your account.");
      return;
    }

    setActivating(true);
    setNotice(null);
    try {
      const portfolio = await api.post<DemoPortfolio>(
        "/portfolios/demo/",
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      setActivePortfolio(portfolio);
      setNotice("Demo portfolio is active. Portfolio Intelligence will now analyze these holdings.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to activate the demo portfolio.");
    } finally {
      setActivating(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-80">
        <main className="min-h-screen text-foreground">
          {/* Page Header */}
          <div className="sticky top-0 z-20 border-b border-border-subtle bg-surface/95 backdrop-blur">
            <div className="px-6 py-4 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald">
                  Portfolio management
                </p>
                <h1 className="mt-2 font-display text-2xl font-semibold">
                  StockLens Demo Portfolio
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to research
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mt-8"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm leading-6 text-muted-2">
                      A ₹1,00,000 sample portfolio covering every Indian firm
                      currently supported by the demo.
                    </p>
                  </div>
                  <Button
                    onClick={activateDemoPortfolio}
                    disabled={loading || activating || Boolean(activePortfolio)}
                    size="lg"
                  >
                    {activating ? (
                      <Loader2 className="animate-spin" />
                    ) : activePortfolio ? (
                      <CheckCircle2 />
                    ) : (
                      <ShieldCheck />
                    )}
                    {activePortfolio
                      ? "Portfolio active"
                      : "Activate demo portfolio"}
                  </Button>
                </div>

                {notice && (
                  <p
                    className={`mt-5 text-sm ${
                      activePortfolio ? "text-emerald" : "text-amber"
                    }`}
                    role="status"
                  >
                    {notice}
                  </p>
                )}
              </motion.div>

              {/* Holdings Table */}
              <section className="mt-8 overflow-hidden rounded-2xl border border-border-strong bg-surface">
                <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border-strong px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-2 sm:grid-cols-[1fr_100px_120px_120px]">
                  <span>Firm</span>
                  <span>Allocation</span>
                  <span className="hidden sm:block">Quantity</span>
                  <span className="hidden text-right sm:block">
                    Avg. buy price
                  </span>
                </div>
                {demoPortfolioHoldings.map((holding) => (
                  <motion.div
                    key={holding.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-[1fr_auto] gap-4 border-b border-border-strong px-5 py-5 last:border-b-0 hover:bg-white/[0.02] transition-colors sm:grid-cols-[1fr_100px_120px_120px] sm:items-center"
                  >
                    <div>
                      <p className="font-display text-lg font-semibold">
                        {holding.symbol}
                      </p>
                      <p className="mt-1 text-sm text-muted-2">
                        {holding.company} · NSE
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1 text-sm text-emerald">
                      {holding.allocation}%
                    </span>
                    <span className="hidden text-sm text-muted-2 sm:block">
                      {holding.quantity}
                    </span>
                    <span className="hidden text-right text-sm text-muted-2 sm:block">
                      {currency.format(holding.averageBuyPrice)}
                    </span>
                  </motion.div>
                ))}
              </section>

              {/* Info Cards */}
              <section className="mt-8 grid gap-5 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="rounded-2xl border border-border-strong bg-surface p-6 hover:border-emerald/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-6 w-6 shrink-0 text-emerald" />
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        100% allocated
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-2">
                        TCS 35%, Reliance 25%, Infosys 25%, and HDFC Bank 15%.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="rounded-2xl border border-border-strong bg-surface p-6 hover:border-amber/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 shrink-0 text-amber" />
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        Research ready
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-2">
                        Activate once, then run research to include portfolio
                        concentration and exposure analysis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
