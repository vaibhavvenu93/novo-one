"use client";

import { X } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { LeakageItem } from "@/domain/finance";

interface LeakageInvestigationProps {
  leakage: LeakageItem | null;
  onClose: () => void;
}

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `₹${Math.round(value / 1_000)}K`;
  }

  return `₹${Math.round(value)}`;
}

function categoryLabel(category: LeakageItem["category"]) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInvestigationCopy(item: LeakageItem) {
  switch (item.category) {
    case "food":
      return {
        thesis:
          "Current economics suggest ingredient cost may be running above the level implied by the operating model.",
        evidence: [
          "Compare supplier invoice prices against contracted or recent benchmark rates.",
          "Check purchase quantity against actual recipe consumption and yield.",
          "Review wastage, substitutions and portion variance.",
        ],
        confirmation:
          "Supplier invoices, purchase orders, recipe BOMs and kitchen consumption data.",
        nextStep:
          "Build a supplier × ingredient variance table and rank the largest recoverable gaps.",
      };

    case "packaging":
      return {
        thesis:
          "Packaging spend appears high enough to justify checking SKU standardisation, pack mix and procurement variance.",
        evidence: [
          "Compare packaging cost per order across brands and channels.",
          "Identify unnecessary SKU variation.",
          "Check purchase prices and minimum-order effects by supplier.",
        ],
        confirmation:
          "Packaging invoices, SKU catalogue, order mix and supplier contracts.",
        nextStep:
          "Calculate packaging cost per order and identify the SKUs creating the largest variance.",
      };

    case "discount":
      return {
        thesis:
          "Some promotional spend may be generating revenue without enough incremental contribution or repeat behaviour.",
        evidence: [
          "Compare discounted and non-discounted customer cohorts.",
          "Measure contribution after promotional cost.",
          "Check repeat rate after the discount period ends.",
        ],
        confirmation:
          "Order-level discount data, customer cohorts and repeat-purchase history.",
        nextStep:
          "Run a cohort analysis to separate incremental demand from subsidised demand.",
      };

    case "marketplace":
      return {
        thesis:
          "Current channel mix may be routing repeat demand through channels with structurally lower contribution.",
        evidence: [
          "Compare contribution per order across marketplace and direct channels.",
          "Identify repeat customers still ordering through paid marketplaces.",
          "Measure commission and promotion burden by channel.",
        ],
        confirmation:
          "Marketplace settlements, direct-order data and customer identity matching.",
        nextStep:
          "Build channel-level contribution economics and quantify the value of migrating repeat demand.",
      };

    default:
      return {
        thesis:
          "Novo has detected an economic pattern worth validating against operating data.",
        evidence: [
          "Validate the underlying transaction data.",
          "Compare actual performance against the operating baseline.",
          "Identify the largest sources of variance.",
        ],
        confirmation:
          "Relevant transaction and operating data.",
        nextStep:
          "Validate the signal before turning it into an operating intervention.",
      };
  }
}

export function LeakageInvestigation({
  leakage,
  onClose,
}: LeakageInvestigationProps) {
  if (!leakage) {
    return null;
  }

  const investigation = getInvestigationCopy(leakage);

  return (
    <>
      <button
        type="button"
        className="investigation-backdrop"
        onClick={onClose}
        aria-label="Close investigation"
      />

      <aside
        className="investigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Investigate ${leakage.title}`}
      >
        <header className="investigation-header">
          <div>
            <span className="money-eyebrow">
              INVESTIGATION
            </span>

            <div className="investigation-meta">
              <span>{categoryLabel(leakage.category)}</span>
              <Provenance type={leakage.evidence} />
            </div>
          </div>

          <button
            type="button"
            className="investigation-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="investigation-body">
          <section className="investigation-hero">
            <h2>{leakage.title}</h2>

            <p>
              Novo has surfaced this as a signal worth
              investigating — not as a booked saving.
            </p>
          </section>

          <div className="investigation-numbers">
            <div>
              <span>POTENTIAL / MONTH</span>
              <strong>
                {formatMoney(leakage.monthlyImpact)}
              </strong>
            </div>

            <div>
              <span>CONFIDENCE</span>
              <strong>
                {Math.round(leakage.confidence * 100)}%
              </strong>
            </div>
          </div>

          <section className="investigation-section">
            <span className="investigation-label">
  NOVO&apos;S THESIS
</span>

            <p>{investigation.thesis}</p>
          </section>

          <section className="investigation-section">
            <span className="investigation-label">
              WHY THIS MAY BE HAPPENING
            </span>

            <div className="investigation-checks">
              {investigation.evidence.map(
                (evidence, index) => (
                  <div
                    className="investigation-check"
                    key={evidence}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p>{evidence}</p>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="investigation-section">
            <span className="investigation-label">
              WHAT WOULD CONFIRM IT
            </span>

            <p>{investigation.confirmation}</p>
          </section>

          <section className="investigation-section investigation-action-section">
            <span className="investigation-label">
              RECOMMENDED NEXT MOVE
            </span>

            <h3>{investigation.nextStep}</h3>

            <p>
              Current modelled opportunity:{" "}
              <strong>
                {formatMoney(leakage.monthlyImpact)} / month
              </strong>
              .
            </p>
          </section>
        </div>

        <footer className="investigation-footer">
          <button
            type="button"
            className="investigation-secondary"
            onClick={onClose}
          >
            Back to Money
          </button>

          <button
            type="button"
            className="investigation-primary"
          >
            Create experiment
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </aside>
    </>
  );
}