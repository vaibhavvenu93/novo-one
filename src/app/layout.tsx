import type { Metadata } from "next";
import "./globals.css";
import { NovoProvider } from "@/context/novo-context";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "NOVO ONE",
  description: "The operating system for building the next ₹50Cr of Novo.",
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
          <AppShell>{children}</AppShell>
        </NovoProvider>
      </body>
    </html>
  );
}
