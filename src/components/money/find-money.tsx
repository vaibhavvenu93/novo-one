"use client";

import { useMemo, useState } from "react";

import {
  FinanceFilter,
  FindMoneyPlan,
  MoneyOpportunity,
  MoneyOpportunityState,
} from "@/domain/finance";

import { findMoney } from "@/services/finance";

interface FindMoneyProps {
  filter: FinanceFilter;
}

const targets = [
  {
    label: "₹5L",
    value: 500_000,
  },
  {
    label: "₹10L",
    value: 1_000_000,
  },
  {
    label: "₹25L",
    value: 2_500_000,
  },
];

function formatMoney(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (absolute >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  if (absolute >= 1_000) {
    return `₹${Math.round(value / 1_000)}K`;
  }

  return `₹${Math.round(value)}`;
}

function stateLabel(
  state: MoneyOpportunityState
) {
  if (state === "identified") {
    return "IDENTIFIED";
  }

  if (state === "modelled") {
    return "MODELLED";
  }

  return "TO PROVE";
}

function confidenceLabel(confidence: number) {
  if (confidence >= 0.75) {
    return "HIGH";
  }

  if (confidence >= 0.55) {
    return "MEDIUM";
  }

  return "LOW";
}

function PlanSummary({
  plan,
}: {
  plan: FindMoneyPlan;
}) {
  const coverage =
    plan.target > 0
      ? Math.min(
          100,
          (plan.totalPotential / plan.target) * 100
        )
      : 0;

  return (
    <div className="find-money-summary">
      <div className="find-money-summary__hero">
        <span className="money-eyebrow">
          NOVO ANSWER
        </span>

        {plan.totalPotential >= plan.target ? (
          <>
            <h3>
              I found{" "}
              {formatMoney(plan.totalPotential)}.
            </h3>

            <p>
              There is enough economic potential in the
              current model to cover the target. Not all of it
              has the same certainty.
            </p>
          </>
        ) : (
          <>
            <h3>
              I found{" "}
              {formatMoney(plan.totalPotential)}.
            </h3>

            <p>
              That leaves{" "}
              <strong>
                {formatMoney(plan.gap)}
              </strong>{" "}
              still to find. Novo will not manufacture the
              remainder just to hit the target.
            </p>
          </>
        )}
      </div>

      <div className="find-money-summary__coverage">
        <div className="find-money-summary__coverage-top">
          <span>Target coverage</span>

          <strong>
            {coverage.toFixed(0)}%
          </strong>
        </div>

        <div className="find-money-summary__track">
          <div
            style={{
              width: `${coverage}%`,
            }}
          />
        </div>
      </div>

      <div className="find-money-summary__breakdown">
        <div>
          <span>Identified</span>

          <strong>
            {formatMoney(plan.identified)}
          </strong>

          <small>
            existing signals
          </small>
        </div>

        <div>
          <span>Modelled</span>

          <strong>
            {formatMoney(plan.modelled)}
          </strong>

          <small>
            economic moves
          </small>
        </div>

        <div>
          <span>To prove</span>

          <strong>
            {formatMoney(plan.toProve)}
          </strong>

          <small>
            experiments
          </small>
        </div>

        <div>
          <span>Gap</span>

          <strong>
            {formatMoney(plan.gap)}
          </strong>

          <small>
            not yet found
          </small>
        </div>
      </div>
    </div>
  );
}

function OpportunityRow({
  opportunity,
  index,
}: {
  opportunity: MoneyOpportunity;
  index: number;
}) {
  return (
    <article className="find-money-opportunity">
      <div className="find-money-opportunity__rank">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="find-money-opportunity__body">
        <div className="find-money-opportunity__tags">
          <span
            className={`find-money-state ${opportunity.state}`}
          >
            {stateLabel(opportunity.state)}
          </span>

          <span>
            {confidenceLabel(
              opportunity.confidence
            )} CONFIDENCE
          </span>
        </div>

        <h3>{opportunity.title}</h3>

        <p>{opportunity.description}</p>

        <div className="find-money-opportunity__action">
          <span>NEXT MOVE</span>

          <p>{opportunity.action}</p>
        </div>
      </div>

      <div className="find-money-opportunity__value">
        <strong>
          {formatMoney(
            opportunity.monthlyImpact
          )}
        </strong>

        <span>potential / month</span>

        <small>
          {Math.round(
            opportunity.confidence * 100
          )}
          % confidence
        </small>
      </div>

      <button
        type="button"
        className="find-money-opportunity__button"
      >
        {opportunity.state === "to-prove"
          ? "Create experiment"
          : "Investigate"}

        <span>→</span>
      </button>
    </article>
  );
}

export function FindMoney({
  filter,
}: FindMoneyProps) {
  const [target, setTarget] =
    useState(1_000_000);

  const plan = useMemo(
    () => findMoney(filter, target),
    [filter, target]
  );

  return (
    <section
      className="find-money"
      id="find-money"
    >
      <div className="find-money-header">
        <div>
          <span className="money-eyebrow">
            CAPITAL FINDER
          </span>

          <h2>Find me money.</h2>

          <p>
            Novo searches the current economics for
            recoverable margin, modelled improvements and
            experiments worth proving — without pretending
            they have equal certainty.
          </p>
        </div>

        <div className="find-money-target">
          <span>TARGET / MONTH</span>

          <div>
            {targets.map((option) => (
              <button
                type="button"
                key={option.value}
                className={
                  target === option.value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTarget(option.value)
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PlanSummary plan={plan} />

      <div className="find-money-plan-header">
        <div>
          <span className="money-eyebrow">
            OPPORTUNITY PLAN
          </span>

          <h3>
            Where Novo would go looking first.
          </h3>
        </div>

        <span>
          {plan.opportunities.length} MOVES
        </span>
      </div>

      <div className="find-money-opportunities">
        {plan.opportunities.map(
          (opportunity, index) => (
            <OpportunityRow
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
            />
          )
        )}
      </div>

      <div className="find-money-footer">
        <span />

        <p>
          Potential is not booked value. Identified signals
          require investigation, modelled moves require
          operational validation and hypotheses require
          experiments.
        </p>
      </div>
    </section>
  );
}