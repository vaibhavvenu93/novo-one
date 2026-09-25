"use client";

import { Search, Sparkles } from "lucide-react";
import { brands } from "@/data/novo-demo";
import { BrandId } from "@/domain/novo";
import { useNovo } from "@/context/novo-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    brandId,
    setBrandId,
    locationId,
    setLocationId,
    period,
    setPeriod,
  } = useNovo();

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#171714]">
      <header className="sticky top-0 z-50 border-b border-black/8 bg-[#f7f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-6">
          <button
            onClick={() => setBrandId("novo")}
            className="mr-5 flex items-center gap-2 font-semibold tracking-[-0.03em]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#171714] text-sm text-white">
              N
            </span>
            NOVO ONE
          </button>

          <select
            value={brandId}
            onChange={(event) => setBrandId(event.target.value as BrandId)}
            className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm font-medium outline-none"
          >
            <option value="novo">NOVO GROUP</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All locations</option>
          </select>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as "today" | "7d" | "30d" | "mtd")
            }
            className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none"
          >
            <option value="today">Today</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="mtd">Month to date</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 text-sm text-black/60 md:flex">
              <Search size={15} />
              Ask Novo anything...
              <kbd className="ml-5 text-[11px] text-black/35">⌘ K</kbd>
            </button>

            <button className="flex h-9 items-center gap-2 rounded-lg bg-[#171714] px-3 text-sm font-medium text-white">
              <Sparkles size={14} />
              Novo is working
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-8">{children}</main>
    </div>
  );
}
