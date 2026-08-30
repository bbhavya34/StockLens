"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-provider";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "AI Agents", href: "#agents" },
  { label: "Research", href: "#explainability" },
  { label: "Portfolio", href: "#portfolio" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { session, profile } = useAuth();
  const appHref = session ? "/research" : "/auth/login";
  const appLabel = session ? profile?.display_name || "Open research" : "Login / Sign up";

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
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link href="#" className="flex items-center gap-2" aria-label="StockLens home">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong bg-surface-2">
              <ScanSearch className="h-4 w-4 text-foreground" strokeWidth={2} />
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald ring-2 ring-background"
              />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">StockLens</span>
          </Link>
        </motion.div>

        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <motion.div
              key={link.label}
              variants={{ hidden: { y: -8, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={link.href}
                className="relative text-sm text-muted-2 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-emerald after:transition-transform hover:text-foreground hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:block"
        >
          <Button size="sm" asChild><Link href={appHref}>{appLabel}</Link></Button>
        </motion.div>

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
                <motion.div key={link.label} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-2 py-3 text-sm text-muted-2 hover:bg-white/[0.05] hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button className="w-full" asChild><Link href={appHref}>{appLabel}</Link></Button>
              </motion.div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
