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
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

const mainNavItems: NavItem[] = [
  {
    label: "Research",
    href: "/research",
    icon: <ScanSearch className="h-5 w-5" />,
    description: "AI-powered stock analysis",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Your holdings & insights",
  },
  {
    label: "Intelligence",
    href: "#",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Advanced metrics",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/profile",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ open = true, onOpenChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Header & Drawer */}
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
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="rounded-lg p-2 text-muted-2 hover:bg-white/[0.06] hover:text-foreground transition-colors"
          aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
        >
          {mobileDrawerOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border-subtle bg-surface-2 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-3 py-3">
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

              <div className="my-2 border-t border-border-subtle" />

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

              <div className="my-2 border-t border-border-subtle" />

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

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden border-r border-border-subtle bg-surface md:fixed md:inset-y-0 md:left-0 md:flex md:flex-col md:pt-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald/30 bg-emerald/10">
                  <ScanSearch className="h-4 w-4 text-emerald" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">StockLens</div>
                  <div className="text-xs text-muted">Research</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald/30 bg-emerald/10"
              >
                <ScanSearch className="h-4 w-4 text-emerald" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>

          {isOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-muted-2 transition-colors hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-hidden px-2 py-4">
          <nav className="flex flex-col gap-1">
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 px-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Navigation
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {mainNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                isOpen={isOpen}
              />
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="border-t border-border-subtle px-2 py-4">
          <nav className="flex flex-col gap-1">
            {secondaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                isOpen={isOpen}
              />
            ))}
          </nav>
        </div>

        {/* Footer - User Info */}
        <div className="border-t border-border-subtle px-2 py-4">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* User Profile */}
              <div className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong bg-background">
                    <CircleUserRound className="h-4 w-4 text-muted-2" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-medium text-foreground">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="truncate text-xs text-muted">Account</p>
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-2 hover:text-foreground"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-2 hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Header - Show hamburger menu */}
      <div className="sticky top-0 z-40 flex md:hidden items-center justify-between border-b border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald/30 bg-emerald/10">
            <ScanSearch className="h-4 w-4 text-emerald" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">StockLens</span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg p-2 text-muted-2 hover:bg-white/[0.06] hover:text-foreground transition-colors"
          aria-label="Account"
        >
          <CircleUserRound className="h-5 w-5" />
        </motion.button>
      </div>
    </>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
}

function SidebarNavItem({ item, isActive, isOpen }: SidebarNavItemProps) {
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
          isActive
            ? "bg-emerald/15 text-emerald"
            : "text-muted-2 hover:text-foreground"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute -left-2 top-0 h-full w-1 rounded-full bg-emerald"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Icon */}
        <div className="relative flex h-5 w-5 items-center justify-center shrink-0">
          {item.icon}
        </div>

        {/* Label and description */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="label-open"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <p className="text-sm font-medium leading-tight">{item.label}</p>
              {item.description && (
                <p className="text-xs text-muted">{item.description}</p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tooltip for collapsed state */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="pointer-events-none absolute left-20 rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-xs font-medium text-foreground shadow-xl"
          >
            {item.label}
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return <div className="md:ml-80">{children}</div>;
}
