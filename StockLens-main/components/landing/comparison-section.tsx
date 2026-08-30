"use client";

import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { comparisonData } from "@/data/demo-stocks";

const rows: { label: string; key: keyof typeof comparisonData.TCS; tone?: "positive" | "warning" | "neutral" }[] = [
  { label: "Revenue Growth", key: "revenueGrowth" },
  { label: "Profit Growth", key: "profitGrowth" },
  { label: "P/E", key: "pe" },
  { label: "ROE", key: "roe" },
  { label: "Debt", key: "debt" },
  { label: "News Sentiment", key: "newsSentiment" },
  { label: "Volatility", key: "volatility" },
];

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">TCS vs INFY</h2>
        <p className="mt-3 text-sm text-muted-2">
          A side-by-side read of the same signals StockLens agents evaluate independently.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>TCS</TableHead>
              <TableHead>INFY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="text-muted-2">{row.label}</TableCell>
                <TableCell className="font-mono-tab font-medium">{comparisonData.TCS[row.key]}</TableCell>
                <TableCell className="font-mono-tab font-medium">{comparisonData.INFY[row.key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-6"
      >
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">AI generated</Badge>
            <span className="text-[11px] text-muted">Research, not financial advice</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-2">
            TCS currently shows stronger sentiment and profitability signals, while Infosys trades
            at a relatively different valuation profile. Neither factor alone determines the
            investment case.
          </p>
        </Card>
      </motion.div>
    </section>
  );
}
