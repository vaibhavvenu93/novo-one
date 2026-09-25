"use client";

import { ArrowRight } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { SectionHeader } from "@/components/shared/section-header";
import { useNovo } from "@/context/novo-context";

const opportunities = [
  {
    number: "01",
    title: "Three schools fit the existing Varthur route",
    context: "MonkeyBox · Bengaluru East",
    value: "₹18.2L",
    label: "annual potential",
    confidence: "HIGH FIT",
    provenance: "estimate" as const,
  },
  {
    number: "02",
    title: "Pressman's corporate kiosk cluster",
    context: "Pressman's · Tech parks",
    value: "₹31.5L",
    label: "annual potential",
    confidence: "MEDIUM FIT",
    provenance: "hypothesis" as const,
  },
  {
    number: "03",
    title: "Khichdi Tales recurring meal pass",
    context: "Khichdi Tales · Repeat customers",
    value: "₹24.0L",
    label: "annual potential",
    confidence: "TEST",
    provenance: "hypothesis" as const,
  },
  {
    number: "04",
    title: "Monetise unused evening kitchen capacity",
    context: "Portfolio · Varthur",
    value: "₹17.8L",
    label: "annual potential",
    confidence: "MEDIUM FIT",
    provenance: "estimate" as const,
  },
];

export function OpportunityFeed() {
  const { setView } = useNovo();

  return (
    <section className="today-section">
      <SectionHeader
        eyebrow="BUILD"
        title="Opportunities Novo found"
        meta="₹91.5L MODELLED"
        copy="Potential growth surfaces ranked before management spends time on them."
      />

      <div className="opportunity-table">
        {opportunities.map((opportunity) => (
          <button
            type="button"
            className="opportunity-row"
            key={opportunity.number}
            onClick={() => setView("build")}
          >
            <span className="opportunity-number">
              {opportunity.number}
            </span>

            <div className="opportunity-main">
              <strong>{opportunity.title}</strong>
              <span>{opportunity.context}</span>
            </div>

            <Provenance type={opportunity.provenance} />

            <span className="opportunity-confidence">
              {opportunity.confidence}
            </span>

            <div className="opportunity-value">
              <strong>{opportunity.value}</strong>
              <span>{opportunity.label}</span>
            </div>

            <ArrowRight size={14} />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="view-all-action"
        onClick={() => setView("build")}
      >
        View all opportunities
        <ArrowRight size={13} />
      </button>
    </section>
  );
}