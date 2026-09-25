"use client";

import { ArrowRight } from "lucide-react";

import type {
  Experiment,
  ExperimentStatus,
} from "@/domain/build";

interface ExperimentPortfolioProps {
  experiments: Experiment[];
  onSelectExperiment: (experiment: Experiment) => void;
}

const statusLabels: Record<ExperimentStatus, string> = {
  draft: "DRAFT",
  ready: "READY",
  running: "RUNNING",
  blocked: "BLOCKED",
  decision: "DECISION REQUIRED",
};

const laneLabels = {
  schools: "Schools",
  corporate: "Corporate",
  delivery: "Delivery",
  "existing-account": "Existing account",
  location: "Location",
  "new-business": "New business",
} as const;

function formatMoney(value: number) {
  if (Math.abs(value) >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (Math.abs(value) >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function metricValue(
  value: number | undefined,
  unit?: string
) {
  if (value === undefined) {
    return "—";
  }

  return `${value}${unit ? ` ${unit}` : ""}`;
}

export function ExperimentPortfolio({
  experiments,
  onSelectExperiment,
}: ExperimentPortfolioProps) {
  return (
    <section className="build-section">
      <div className="build-section__header">
        <div>
          <span className="build-eyebrow">
            EXPERIMENT PORTFOLIO
          </span>

          <h2>What are we trying to prove?</h2>
        </div>

        <p>
          Every experiment has a bounded investment, measurable
          success condition and an explicit decision waiting at
          the other end.
        </p>
      </div>

      {experiments.length === 0 ? (
        <div className="build-empty">
          <span>NO EXPERIMENTS IN THIS CONTEXT</span>

          <h3>Nothing is being tested yet.</h3>

          <p>
            Growth opportunities can be converted into experiments
            once there is something worth proving.
          </p>
        </div>
      ) : (
        <div className="experiment-list">
          {experiments.map((experiment, index) => {
            const baseline =
              experiment.successMetric.baseline;

            const target =
              experiment.successMetric.target;

            return (
              <article
                key={experiment.id}
                className="experiment-card"
                role="button"
                tabIndex={0}
                onClick={() =>
                  onSelectExperiment(experiment)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    onSelectExperiment(experiment);
                  }
                }}
              >
                <div className="experiment-rank">
                  <span>TEST</span>
                  <strong>
                    {String(index + 1).padStart(2, "0")}
                  </strong>
                </div>

                <div className="experiment-main">
                  <div className="experiment-meta">
                    <span>
                      {laneLabels[experiment.lane]}
                    </span>

                    <span>·</span>

                    <span>
                      {Math.round(
                        experiment.confidence * 100
                      )}
                      % confidence
                    </span>
                  </div>

                  <h3>{experiment.title}</h3>

                  <p>{experiment.hypothesis}</p>

                  <div className="experiment-metric">
                    <span>SUCCESS CONDITION</span>

                    <div>
                      <strong>
                        {experiment.successMetric.name}
                      </strong>

                      <small>
                        {metricValue(
                          baseline,
                          experiment.successMetric.unit
                        )}
                        {" → "}
                        {metricValue(
                          target,
                          experiment.successMetric.unit
                        )}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="experiment-economics">
                  <span
                    className={`experiment-status experiment-status--${experiment.status}`}
                  >
                    {statusLabels[experiment.status]}
                  </span>

                  <div className="experiment-economic-row">
                    <span>Budget ceiling</span>
                    <strong>
                      {formatMoney(
                        experiment.budgetCeiling
                      )}
                    </strong>
                  </div>

                  <div className="experiment-economic-row">
                    <span>Revenue upside</span>
                    <strong>
                      {formatMoney(
                        experiment.expectedAnnualRevenue
                      )}
                    </strong>
                  </div>

                  <div className="experiment-economic-row">
                    <span>Contribution</span>
                    <strong>
                      {formatMoney(
                        experiment.expectedAnnualContribution
                      )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="experiment-open"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectExperiment(experiment);
                    }}
                  >
                    Investigate
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
