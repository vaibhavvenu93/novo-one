import type { Metadata } from "next";

import "@/styles/tokens.css";
import "@/styles/shell.css";
import "@/styles/components.css";
import "@/styles/today.css";
import "@/styles/money.css";
import "@/styles/grow.css";
import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { NovoProvider } from "@/context/novo-context";

export const metadata: Metadata = {
  title: "NOVO ONE",
  description:
    "The operating system for building, operating and scaling Novo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NovoProvider>
          <AppShell>
            {children}
          </AppShell>
        </NovoProvider>
      </body>
    </html>
  );
}