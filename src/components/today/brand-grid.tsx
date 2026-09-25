"use client";

import { ArrowRight } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { SectionHeader } from "@/components/shared/section-header";
import { useNovo } from "@/context/novo-context";
import { BrandId } from "@/domain/novo";

const brandCards: Array<{
  id: BrandId;
  name: string;
  descriptor: string;
  metric: string;
  metricLabel: string;
  signal: string;
  accent: string;
  provenance: "company" | "estimate";
}> = [
  {
    id: "monkeybox",
    name: "MonkeyBox",
    descriptor: "School meals",
    metric: "45–60K",
    metricLabel: "orders / month",
    signal: "Volume engine · school density opportunity",
    accent: "#d58b17",
    provenance: "company",
  },
  {
    id: "khichdi-tales",
    name: "Khichdi Tales",
    descriptor: "Everyday comfort food",
    metric: "+23%",
    metricLabel: "growth signal",
    signal: "Strongest repeat behaviour in portfolio",
    accent: "#c86540",
    provenance: "estimate",
  },
  {
    id: "pressmans",
    name: "Pressman's",
    descriptor: "Café · QSR · Corporate",
    metric: "5",
    metricLabel: "cloud kitchens",
    signal: "Corporate and kiosk expansion opportunity",
    accent: "#287867",
    provenance: "company",
  },
];

export function BrandGrid() {
  const { setBrandId } = useNovo();

  return (
    <section className="today-section">
      <SectionHeader
        eyebrow="PORTFOLIO"
        title="The business"
        meta="3 CORE BRANDS"
        copy="One operating network. Different demand engines."
      />

      <div className="brand-grid">
        {brandCards.map((brand) => (
          <button
            type="button"
            className="brand-card"
            key={brand.id}
            onClick={() => setBrandId(brand.id)}
          >
            <div
              className="brand-accent"
              style={{ background: brand.accent }}
            />

            <div className="brand-card-top">
              <div>
                <p>{brand.descriptor}</p>
                <h3>{brand.name}</h3>
              </div>

              <ArrowRight size={16} />
            </div>

            <div className="brand-metric">
              <strong>{brand.metric}</strong>
              <span>{brand.metricLabel}</span>
            </div>

            <div className="brand-signal">
              <span>{brand.signal}</span>
              <Provenance type={brand.provenance} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}