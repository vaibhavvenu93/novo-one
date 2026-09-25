"use client";

import { useMemo, useState } from "react";

import {
  FinanceFilter,
  FinanceScenarioInput,
} from "@/domain/finance";

import { runFinanceScenario } from "@/services/finance";

interface ScenarioLabProps {
  filter: FinanceFilter;
}

type LeverKey = keyof FinanceScenarioInput;

interface Lever {
  key: LeverKey;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
}

const levers: Lever[] = [
  {
    key: "revenueChangePct",
    label: "Revenue",
    description: "Change in topline while preserving current mix.",
    min: -20,
    max: 30,
    step: 1,
  },
  {
    key: "foodCostChangePct",
    label: "Food cost",
    description: "Change in ingredient and recipe cost.",
    min: -20,
    max: 20,
    step: 1,
  },
  {
    key: "packagingCostChangePct",
    label: "Packaging",
    description: "Change in packaging cost per current order mix.",
    min: -20,
    max: 20,
    step: 1,
  },
  {
    key: "discountChangePct",
    label: "Discounting",
    description: "Change in the current discount burden.",
    min: -50,
    max: 50,
    step: 1,
  },
  {
    key: "marketplaceCostChangePct",
    label: "Marketplace",
    description: "Change in marketplace commission burden.",
    min: -30,
    max: 30,
    step: 1,
  },
  {
    key: "variableLabourChangePct",
    label: "Variable labour",
    description: "Change in labour cost tied to fulfilment.",
    min: -20,
    max: 20,
    step: 1,
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

function formatDelta(value: number) {
  if (value === 0) {
    return "₹0";
  }

  return `${value > 0 ? "+" : "−"}${formatMoney(
    Math.abs(value)
  )}`;
}

function formatPp(value: number) {
  if (Math.abs(value) < 0.05) {
    return "0.0pp";
  }

  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(
    1
  )}pp`;
}

export function ScenarioLab({
  filter,
}: ScenarioLabProps) {
  const [input, setInput] =
    useState<FinanceScenarioInput>({});

  const result = useMemo(
    () => runFinanceScenario(filter, input),
    [filter, input]
  );

  const hasChanges = levers.some(
    (lever) => (input[lever.key] ?? 0) !== 0
  );

  const updateLever = (
    key: LeverKey,
    value: number
  ) => {
    setInput((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const reset = () => {
    setInput({});
  };

  return (
    <section className="scenario-lab">
      <div className="scenario-lab__header">
        <div>
          <span className="money-eyebrow">
            SCENARIO LAB
          </span>

          <h2>What happens if we change the economics?</h2>

          <p>
            Move the operating levers. Novo recalculates
            contribution instantly against the current business
            context.
          </p>
        </div>

        <div className="scenario-lab__status">
          <span className="scenario-lab__status-dot" />

          LIVE MODEL
        </div>
      </div>

      <div className="scenario-lab__body">
        <div className="scenario-levers">
          {levers.map((lever) => {
            const value = input[lever.key] ?? 0;

            return (
              <div
                className="scenario-lever"
                key={lever.key}
              >
                <div className="scenario-lever__top">
                  <div>
                    <strong>{lever.label}</strong>

                    <p>{lever.description}</p>
                  </div>

                  <span
                    className={
                      value > 0
                        ? "scenario-lever__value positive"
                        : value < 0
                          ? "scenario-lever__value negative"
                          : "scenario-lever__value"
                    }
                  >
                    {value > 0 ? "+" : ""}
                    {value}%
                  </span>
                </div>

                <input
                  aria-label={lever.label}
                  type="range"
                  min={lever.min}
                  max={lever.max}
                  step={lever.step}
                  value={value}
                  onChange={(event) =>
                    updateLever(
                      lever.key,
                      Number(event.target.value)
                    )
                  }
                />

                <div className="scenario-lever__range">
                  <span>{lever.min}%</span>
                  <span>0</span>
                  <span>+{lever.max}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="scenario-result">
          <span className="money-eyebrow">
            MODELLED OUTCOME
          </span>

          <div className="scenario-result__hero">
            <span>Operating contribution</span>

            <strong>
              {formatMoney(
                result.scenario.operatingContribution
              )}
            </strong>

            <small
              className={
                result.operatingContributionDelta > 0
                  ? "positive"
                  : result.operatingContributionDelta < 0
                    ? "negative"
                    : ""
              }
            >
              {formatDelta(
                result.operatingContributionDelta
              )}{" "}
              vs current
            </small>
          </div>

          <div className="scenario-result__metrics">
            <div>
              <span>Net revenue</span>

              <strong>
                {formatMoney(result.scenario.netRevenue)}
              </strong>

              <small>
                current{" "}
                {formatMoney(result.baseline.netRevenue)}
              </small>
            </div>

            <div>
              <span>Contribution</span>

              <strong>
                {formatMoney(
                  result.scenario.contribution
                )}
              </strong>

              <small>
                {formatDelta(
                  result.contributionDelta
                )}{" "}
                impact
              </small>
            </div>

            <div>
              <span>Contribution margin</span>

              <strong>
                {result.scenario.contributionMargin.toFixed(
                  1
                )}
                %
              </strong>

              <small>
                {formatPp(
                  result.contributionMarginDeltaPp
                )}{" "}
                vs current
              </small>
            </div>

            <div>
              <span>Operating margin</span>

              <strong>
                {result.scenario.operatingContributionMargin.toFixed(
                  1
                )}
                %
              </strong>

              <small>
                current{" "}
                {result.baseline.operatingContributionMargin.toFixed(
                  1
                )}
                %
              </small>
            </div>
          </div>

          <div className="scenario-result__interpretation">
            <span className="money-eyebrow">
              NOVO READ
            </span>

            {!hasChanges ? (
              <p>
                Move a lever to pressure-test the current
                economics.
              </p>
            ) : result.operatingContributionDelta > 0 ? (
              <p>
                This combination improves operating
                contribution by{" "}
                <strong>
                  {formatMoney(
                    result.operatingContributionDelta
                  )}
                </strong>
                . The next step is to turn the assumptions
                behind it into measurable experiments.
              </p>
            ) : result.operatingContributionDelta < 0 ? (
              <p>
                This combination reduces operating
                contribution by{" "}
                <strong>
                  {formatMoney(
                    Math.abs(
                      result.operatingContributionDelta
                    )
                  )}
                </strong>
                . Novo would flag this direction before
                capital is committed.
              </p>
            ) : (
              <p>
                The current combination has no material
                operating contribution impact.
              </p>
            )}
          </div>

          <div className="scenario-result__actions">
            <button
              type="button"
              onClick={reset}
              disabled={!hasChanges}
            >
              Reset model
            </button>

            <button
              type="button"
              className="scenario-result__primary"
              disabled={!hasChanges}
            >
              Turn into experiment
              <span>→</span>
            </button>
          </div>

          <div className="scenario-result__foot">
            Modelled scenario · not a forecast
          </div>
        </aside>
      </div>
    </section>
  );
}