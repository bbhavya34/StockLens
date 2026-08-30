"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanSearch,
  BarChart3,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  CircleUserRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  {
    label: "Research",
    href: "/research",
    icon: <ScanSearch className="h-5 w-5" />,
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    label: "Intelligence",
    href: "#",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/profile",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex md:hidden items-center justify-between border-b border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald/30 bg-emerald/10">
            <ScanSearch className="h-4 w-4 text-emerald" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">StockLens</span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-muted-2 hover:bg-white/[0.06] hover:text-foreground transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border-subtle bg-surface-2 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-3 py-3">
              {/* Main Navigation */}
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                      isActive(item.href)
                        ? "bg-emerald/15 text-emerald"
                        : "text-muted-2 hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-border-subtle" />

              {/* Secondary Navigation */}
              {secondaryNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                      isActive(item.href)
                        ? "bg-emerald/15 text-emerald"
                        : "text-muted-2 hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-border-subtle" />

              {/* User Section */}
              <div className="rounded-lg border border-border-subtle bg-background/50 p-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong bg-background">
                    <CircleUserRound className="h-4 w-4 text-muted-2" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-medium text-foreground truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-muted">Account</p>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-2 transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
