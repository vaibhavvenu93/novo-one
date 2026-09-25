"use client";

import { ReactNode } from "react";

import { ContextBar } from "@/components/shell/context-bar";
import { Sidebar } from "@/components/shell/sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="novo-app">
      <ContextBar />

      <Sidebar />

      <main className="novo-main">
        <div className="novo-content">
          {children}
        </div>
      </main>
    </div>
  );
}