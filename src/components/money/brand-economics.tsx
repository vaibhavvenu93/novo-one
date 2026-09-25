"use client";

import { ArrowRight } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { SectionHeader } from "@/components/shared/section-header";
import { useNovo } from "@/context/novo-context";
import { BrandId } from "@/domain/novo";
import { getFinanceSnapshot } from "@/services/finance";

const brandOrder: {
  id: BrandId;
  name: string;
  descriptor: string;
}[] = [
  {
    id: "monkeybox",
    name: "MonkeyBox",
    descriptor: "School meals",
  },
  {
    id: "khichdi-tales",
    name: "Khichdi Tales",
    descriptor: "Delivery",
  },
  {
    id: "pressmans",
    name: "Pressman's",
    descriptor: "Café · corporate",
  },
];

function money(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (absolute >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  if (absolute >= 1_000) {
    return `₹${(value / 1_000).toFixed(0)}K`;
  }

  return `₹${Math.round(value)}`;
}

export function BrandEconomics() {
  const {
    brandId,
    locationId,
    period,
    setBrandId,
  } = useNovo();

  const rows = brandOrder
    .filter(
      (brand) =>
        brandId === "novo" || brand.id === brandId
    )
    .map((brand) => {
      const snapshot = getFinanceSnapshot({
        brandId: brand.id,
        locationId,
        period,
      });

      return {
        ...brand,
        snapshot,
      };
    });

  return (
    <section className="money-section">
      <SectionHeader
        eyebrow="PORTFOLIO"
        title="Brand economics"
        meta={`${rows.length} ACTIVE`}
        copy="Compare the businesses on net revenue, contribution and operating economics."
      />

      <div className="brand-economics-table">
        <div className="brand-economics-head">
          <span>BUSINESS</span>
          <span>NET REVENUE</span>
          <span>CONTRIBUTION</span>
          <span>CM</span>
          <span>OPERATING</span>
          <span />
        </div>

        {rows.map(({ id, name, descriptor, snapshot }) => (
          <button
            type="button"
            className="brand-economics-row"
            key={id}
            onClick={() => setBrandId(id)}
          >
            <div className="brand-economics-name">
              <strong>{name}</strong>
              <span>{descriptor}</span>
            </div>

            <strong>{money(snapshot.netRevenue)}</strong>

            <strong>{money(snapshot.contribution)}</strong>

            <span>
              {snapshot.contributionMargin.toFixed(1)}%
            </span>

            <span>
              {money(snapshot.operatingContribution)}
            </span>

            <div className="brand-economics-action">
              <Provenance type="modelled" />
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}