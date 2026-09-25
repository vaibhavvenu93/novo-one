"use client";

import { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { RankedGrowthOpportunity } from "@/domain/growth";

interface OpportunityDetailProps {
  opportunity: RankedGrowthOpportunity | null;
  onClose: () => void;
}

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  return `₹${(value / 100_000).toFixed(1)}L`;
}

function provenanceType(
  evidence: RankedGrowthOpportunity["evidence"]
) {
  switch (evidence) {
    case "verified":
      return "verified" as const;
    case "public":
      return "public" as const;
    case "modelled":
      return "modelled" as const;
    case "hypothesis":
      return "hypothesis" as const;
    case "needs-data":
      return "needs-data" as const;
  }
}

export function OpportunityDetail({
  opportunity,
  onClose,
}: OpportunityDetailProps) {
 useEffect(() => {
  if (!opportunity) {
    return;
  }

  const previousOverflow = document.body.style.overflow;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [opportunity, onClose]);

  if (!opportunity) {
    return null;
  }


  return (
    <div
      className="growth-drawer-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <aside
        className="growth-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={opportunity.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="growth-drawer__header">
          <div>
            <span className="grow-eyebrow">
              OPPORTUNITY #{String(opportunity.rank).padStart(2, "0")}
            </span>

            <Provenance
              type={provenanceType(opportunity.evidence)}
            />
          </div>

          <button
            type="button"
            className="growth-drawer__close"
            onClick={onClose}
            aria-label="Close opportunity"
          >
            <X size={17} />
          </button>
        </header>

        <div className="growth-drawer__body">
          <div className="growth-drawer__hero">
            <h2>{opportunity.title}</h2>
            <p>{opportunity.description}</p>
          </div>

          <div className="growth-drawer__metrics">
            <div>
              <span>ANNUAL REVENUE</span>
              <strong>
                {formatMoney(
                  opportunity.annualRevenuePotential
                )}
              </strong>
            </div>

            <div>
              <span>CONTRIBUTION</span>
              <strong>
                {formatMoney(
                  opportunity.annualContributionPotential
                )}
              </strong>
            </div>

            <div>
              <span>ROI</span>
              <strong>
                {opportunity.roiMultiple.toFixed(1)}×
              </strong>
            </div>

            <div>
              <span>CONFIDENCE</span>
              <strong>
                {Math.round(opportunity.confidence * 100)}%
              </strong>
            </div>
          </div>

          <section className="growth-drawer__section">
            <span>WHY NOW</span>
            <h3>{opportunity.whyNow}</h3>
          </section>

          <section className="growth-drawer__section">
            <span>WHAT COULD BREAK THIS</span>
            <h3>{opportunity.constraint}</h3>
          </section>

          <section className="growth-drawer__section">
            <span>NEXT MOVE</span>
            <h3>{opportunity.nextAction}</h3>

            <p>
              Owner: <strong>{opportunity.owner}</strong> ·
              expected impact window:{" "}
              <strong>
                {opportunity.timeToImpact} days
              </strong>
            </p>
          </section>
        </div>

        <footer className="growth-drawer__footer">
          <button type="button" onClick={onClose}>
            Back to ranking
          </button>

          <button type="button" className="growth-drawer__primary">
            Turn into experiment
            <ArrowRight size={15} />
          </button>
        </footer>
      </aside>
    </div>
  );
}
