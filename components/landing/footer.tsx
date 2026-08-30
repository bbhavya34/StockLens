"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Product",
    links: ["Stock Research", "Portfolio", "Comparison", "Backtesting"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API", "Methodology"],
  },
  {
    title: "Company",
    links: ["About", "Contributors", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-surface-2">
                <ScanSearch className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-sm font-semibold">StockLens</span>
            </div>
            <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-muted">
              Built for research, not financial advice.
            </p>
          </div>

          {columns.map((col, columnIndex) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * columnIndex, duration: 0.4 }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <motion.span className="inline-block" whileHover={{ x: 4 }}>
                      <Link href="#" className="text-sm text-muted-2 transition-colors hover:text-foreground">
                        {link}
                      </Link>
                    </motion.span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-[11px] leading-relaxed text-muted">
            StockLens provides market research and educational information. It does not provide
            personalized investment advice or guarantee future performance.
          </p>
          <p className="whitespace-nowrap text-[11px] text-muted">
            © {new Date().getFullYear()} StockLens. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
