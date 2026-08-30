"use client";

import { ReactNode } from "react";
import { Sidebar, SidebarInset } from "@/components/sidebar/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  );
}
