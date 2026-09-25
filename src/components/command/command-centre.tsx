"use client";

import {
  ArrowRight,
  CircleAlert,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNovo } from "@/context/novo-context";
import { getBrandUniverse, getPortfolioSnapshot, formatINR, formatNumber } from "@/services/novo";
import { EvidenceState } from "@/domain/novo";

function Evidence({ state }: { state: EvidenceState }) {
  const labels: Record<EvidenceState, string> = {
    verified: "VERIFIED",
    public: "PUBLIC",
    modelled: "DEMO DATA",
    hypothesis: "HYPOTHESIS",
    "needs-data": "NEEDS DATA",
  };

  return (
    <span className="rounded-full bg-black/[0.045] px-2 py-1 text-[9px] font-semibold tracking-[0.12em] text-black/45">
      {labels[state]}
    </span>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border-l border-black/10 pl-5 first:border-l-0 first:pl-0">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-1 text-xs text-black/45">{note}</p>
    </div>
  );
}

export function CommandCentre() {
  const { brandId, setBrandId } = useNovo();
  const portfolio = getPortfolioSnapshot();

  if (brandId !== "novo") {
    const universe = getBrandUniverse(brandId);
    const brand = universe.brand;

    if (!brand) return null;

    return (
      <div className="space-y-8">
        <section className="flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Evidence state={brand.evidence} />
              <span className="text-xs text-black/40">
                {brand.type.replace("-", " ")}
              </span>
            </div>
            <h1 className="text-5xl font-semibold tracking-[-0.055em]">
              {brand.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-black/50">
              {brand.description}
            </p>
          </div>

          <button
            onClick={() => setBrandId("novo")}
            className="text-sm font-medium text-black/50 hover:text-black"
          >
            ← Portfolio
          </button>
        </section>

        <section className="grid grid-cols-2 gap-6 border-y border-black/10 py-7 lg:grid-cols-5">
          <Stat label="Revenue MTD" value={formatINR(brand.revenue)} note={`↑ ${brand.growth}% growth`} />
          <Stat label="Orders" value={formatNumber(brand.orders)} note="Current period" />
          <Stat label="Contribution" value={formatINR(brand.contribution)} note={`${brand.contributionMargin}% margin`} />
          <Stat label="Locations" value={String(brand.locations)} note="Operating footprint" />
          <Stat label="Opportunities" value={String(universe.opportunities.length)} note="Active hypotheses" />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {universe.channels.map((channel) => (
            <div key={channel.id} className="rounded-2xl border border-black/8 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{channel.name}</h3>
                <Evidence state={channel.evidence} />
              </div>
              <p className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
                {formatINR(channel.revenue)}
              </p>
              <div className="mt-4 flex gap-6 text-sm text-black/50">
                <span>{formatNumber(channel.orders)} orders</span>
                <span>{formatINR(channel.contribution)} CM</span>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              What needs attention
            </h2>
            <span className="text-xs text-black/40">LIVE OPERATING QUEUE</span>
          </div>

          <div className="divide-y divide-black/8 rounded-2xl border border-black/8 bg-white">
            {universe.attention.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-5">
                <CircleAlert size={18} className="text-black/45" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    <Evidence state={item.evidence} />
                  </div>
                  <p className="mt-1 text-sm text-black/45">{item.detail}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatINR(item.impact)}</p>
                  <p className="text-xs text-black/40">potential impact</p>
                </div>
                <button className="ml-4 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium">
                  {item.action}
                </button>
              </div>
            ))}

            {universe.attention.length === 0 && (
              <div className="p-6 text-sm text-black/45">
                No critical attention items in this demo view.
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-9">
      <section>
        <p className="text-sm font-medium text-black/40">THURSDAY · 08:04</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-0.055em]">
              Good morning, Sandeep.
            </h1>
            <p className="mt-3 text-base text-black/50">
              Novo is healthy. Four things need management attention.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#e8f3ec] px-4 py-2 text-sm font-medium text-[#28613b]">
            <Zap size={14} />
            8 systems connected
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 border-y border-black/10 py-7 lg:grid-cols-5">
        <Stat label="Revenue MTD" value={formatINR(portfolio.revenue)} note={`↑ ${portfolio.growth.toFixed(1)}% weighted growth`} />
        <Stat label="Orders" value={formatNumber(portfolio.orders)} note="Across portfolio" />
        <Stat label="Contribution" value={formatINR(portfolio.contribution)} note={`${portfolio.contributionMargin.toFixed(1)}% CM`} />
        <Stat label="Opportunity" value={formatINR(portfolio.opportunityValue)} note="Annualised hypotheses" />
        <Stat label="Needs Sandeep" value="2" note="Everything else has an owner" />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-black/35">
              Your businesses
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              One company. Different growth engines.
            </h2>
          </div>
          <span className="text-xs text-black/35">SELECT A BRAND TO ENTER ITS UNIVERSE</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {portfolio.brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandId(brand.id)}
              className="group rounded-2xl border border-black/8 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: brand.accent }}
                >
                  {brand.shortName}
                </div>
                <ArrowRight size={17} className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black" />
              </div>

              <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em]">
                {brand.name}
              </h3>
              <p className="mt-1 h-10 text-sm leading-5 text-black/45">
                {brand.description}
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-black/35">Revenue</p>
                  <p className="mt-1 font-semibold">{formatINR(brand.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-black/35">Orders</p>
                  <p className="mt-1 font-semibold">{formatNumber(brand.orders)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-black/35">CM</p>
                  <p className="mt-1 font-semibold">{brand.contributionMargin}%</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-black/7 pt-4">
                <div className="flex items-center gap-1 text-sm font-medium text-[#28613b]">
                  <TrendingUp size={14} />
                  {brand.growth}%
                </div>
                <Evidence state={brand.evidence} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              What needs attention
            </h2>
            <span className="text-xs text-black/35">4 OPEN</span>
          </div>

          <div className="divide-y divide-black/8 rounded-2xl border border-black/8 bg-white">
            {portfolio.attention.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-5">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.severity === "high"
                      ? "bg-red-500"
                      : item.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 truncate text-sm text-black/45">
                    {item.detail}
                  </p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="font-semibold">{formatINR(item.impact)}</p>
                  <p className="text-xs text-black/35">{item.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              Novo found
            </h2>
            <span className="text-xs text-black/35">OPPORTUNITY RADAR</span>
          </div>

          <div className="space-y-3">
            {portfolio.opportunities.slice(0, 3).map((opportunity) => (
              <div key={opportunity.id} className="rounded-2xl border border-black/8 bg-[#171714] p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/40">
                    {opportunity.category}
                  </span>
                  <span className="text-xs text-white/40">
                    {opportunity.confidence}% confidence
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{opportunity.title}</h3>
                <p className="mt-2 text-sm leading-5 text-white/50">
                  {opportunity.thesis}
                </p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-semibold tracking-[-0.04em]">
                      {formatINR(opportunity.annualImpact)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      annual opportunity
                    </p>
                  </div>
                  <button className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">
                    {opportunity.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
