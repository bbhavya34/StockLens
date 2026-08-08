"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ScanSearch } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "AI Agents", href: "#agents" },
  { label: "Research", href: "#explainability" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Open Source", href: "#open-source" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border-subtle bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#" className="flex items-center gap-2" aria-label="StockLens home">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong bg-surface-2">
            <ScanSearch className="h-4 w-4 text-foreground" strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald ring-2 ring-background" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">StockLens</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-2 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="View StockLens on GitHub">
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button size="sm">Launch App</Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-md px-2 py-3 text-sm text-muted-2 hover:bg-white/[0.05] hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              <Button variant="secondary" asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button>Launch App</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
