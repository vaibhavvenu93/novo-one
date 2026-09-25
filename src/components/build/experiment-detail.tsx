"use client";

import { useEffect } from "react";
import {
  ArrowRight,
  Check,
  RefreshCcw,
  X,
  XCircle,
} from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import type {
  Experiment,
  ExperimentDecision,
} from "@/domain/build";

interface ExperimentDetailProps {
  experiment: Experiment | null;
  onClose: () => void;
}

function formatMoney(value: number) {
  if (Math.abs(value) >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (Math.abs(value) >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function decisionLabel(
  decision: ExperimentDecision | undefined
) {
  switch (decision) {
    case "scale":
      return "SCALE";
    case "iterate":
      return "ITERATE";
    case "kill":
      return "KILL";
    case "needs-evidence":
      return "NEEDS MORE EVIDENCE";
    default:
      return "NO DECISION YET";
  }
}

function provenanceType(
  evidence: Experiment["evidence"]
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

export function ExperimentDetail({
  experiment,
  onClose,
}: ExperimentDetailProps) {
  useEffect(() => {
    if (!experiment) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [experiment, onClose]);

  if (!experiment) {
    return null;
  }

  return (
    <div
      className="build-drawer-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <aside
        className="build-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={experiment.title}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="build-drawer__header">
          <div>
            <span className="build-eyebrow">
              EXPERIMENT
            </span>

            <Provenance
              type={provenanceType(
                experiment.evidence
              )}
            />
          </div>

          <button
            type="button"
            className="build-drawer__close"
            onClick={onClose}
            aria-label="Close experiment"
          >
            <X size={17} />
          </button>
        </header>

        <div className="build-drawer__body">
          <section className="build-drawer__hero">
            <span
              className={`experiment-status experiment-status--${experiment.status}`}
            >
              {experiment.status === "decision"
                ? "DECISION REQUIRED"
                : experiment.status.toUpperCase()}
            </span>

            <h2>{experiment.title}</h2>

            <p>{experiment.hypothesis}</p>
          </section>

          <section className="build-drawer__metrics">
            <div>
              <span>BUDGET CEILING</span>
              <strong>
                {formatMoney(
                  experiment.budgetCeiling
                )}
              </strong>
            </div>

            <div>
              <span>REVENUE UPSIDE</span>
              <strong>
                {formatMoney(
                  experiment.expectedAnnualRevenue
                )}
              </strong>
            </div>

            <div>
              <span>CONTRIBUTION</span>
              <strong>
                {formatMoney(
                  experiment.expectedAnnualContribution
                )}
              </strong>
            </div>

            <div>
              <span>CONFIDENCE</span>
              <strong>
                {Math.round(
                  experiment.confidence * 100
                )}
                %
              </strong>
            </div>
          </section>

          <section className="build-drawer__section">
            <span className="build-drawer__label">
              WHAT ARE WE TRYING TO PROVE?
            </span>

            <h3>{experiment.successMetric.name}</h3>

            <div className="build-target">
              <div>
                <span>BASELINE</span>
                <strong>
                  {experiment.successMetric.baseline ??
                    "—"}
                  {experiment.successMetric.unit
                    ? ` ${experiment.successMetric.unit}`
                    : ""}
                </strong>
              </div>

              <ArrowRight size={16} />

              <div>
                <span>TARGET</span>
                <strong>
                  {experiment.successMetric.target ??
                    "—"}
                  {experiment.successMetric.unit
                    ? ` ${experiment.successMetric.unit}`
                    : ""}
                </strong>
              </div>
            </div>
          </section>

          <section className="build-drawer__section">
            <span className="build-drawer__label">
              WHY NOW
            </span>

            <p>{experiment.whyNow}</p>
          </section>

          <section className="build-drawer__section">
            <span className="build-drawer__label">
              CONSTRAINT
            </span>

            <p>{experiment.constraint}</p>
          </section>

          <section className="build-drawer__section">
            <span className="build-drawer__label">
              NEXT ACTION
            </span>

            <h3>{experiment.nextAction}</h3>

            <p>
              Owner: <strong>{experiment.owner}</strong>
            </p>
          </section>

          <section className="build-decision">
            <span className="build-drawer__label">
              NOVO DECISION
            </span>

            <h3>
              {decisionLabel(experiment.decision)}
            </h3>

            <p>
              The decision should only strengthen as
              observed evidence replaces assumptions.
            </p>

            <div className="build-decision__actions">
              <button type="button">
                <Check size={15} />
                Scale
              </button>

              <button type="button">
                <RefreshCcw size={15} />
                Iterate
              </button>

              <button type="button">
                <XCircle size={15} />
                Kill
              </button>
            </div>

            <small>
              Decision controls are intentionally
              non-persistent in this cluster. Mutation
              comes with the experiment state layer.
            </small>
          </section>
        </div>
      </aside>
    </div>
  );
}
