import { ArrowUpRight } from "lucide-react";

import { GrowthSnapshot } from "@/domain/growth";

interface GrowthHeroProps {
  snapshot: GrowthSnapshot;
  contextLabel: string;
}

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function GrowthHero({
  snapshot,
  contextLabel,
}: GrowthHeroProps) {
  const topOpportunity = snapshot.topOpportunity;

  return (
    <section className="growth-hero">
      <div className="growth-hero__top">
        <div>
          <span className="grow-eyebrow">
            GROWTH INTELLIGENCE
          </span>

          <h1>
            Where should Novo
            <br />
            grow next?
          </h1>

          <p>
            Novo has found{" "}
            <strong>{snapshot.opportunityCount} growth bets</strong>{" "}
            across {contextLabel}. They are ranked by economics,
            confidence, strategic fit, capacity and speed to impact.
          </p>
        </div>

        <div className="growth-hero__status">
          <span className="growth-live-dot" />
          OPPORTUNITY ENGINE ACTIVE
        </div>
      </div>

      <div className="growth-hero__metrics">
        <div className="growth-hero-metric growth-hero-metric--primary">
          <span>OPPORTUNITY UNIVERSE</span>

          <strong>
            {formatMoney(snapshot.annualRevenuePotential)}
          </strong>

          <p>annual revenue potential identified</p>
        </div>

        <div className="growth-hero-metric">
          <span>CONFIDENCE-WEIGHTED</span>

          <strong>
            {formatMoney(snapshot.weightedRevenuePotential)}
          </strong>

          <p>risk-adjusted opportunity value</p>
        </div>

        <div className="growth-hero-metric">
          <span>CONTRIBUTION POTENTIAL</span>

          <strong>
            {formatMoney(
              snapshot.annualContributionPotential
            )}
          </strong>

          <p>annual contribution if proven</p>
        </div>

        <div className="growth-hero-metric">
          <span>CAPITAL REQUIRED</span>

          <strong>
            {formatMoney(snapshot.investmentRequired)}
          </strong>

          <p>modelled investment across bets</p>
        </div>
      </div>

      {topOpportunity ? (
        <div className="growth-top-bet">
          <div className="growth-top-bet__label">
            <span>01</span>

            <div>
              <small>TOP BET RIGHT NOW</small>
              <strong>{topOpportunity.title}</strong>
            </div>
          </div>

          <div className="growth-top-bet__economics">
            <div>
              <span>Potential</span>
              <strong>
                {formatMoney(
                  topOpportunity.annualRevenuePotential
                )}
              </strong>
            </div>

            <div>
              <span>Confidence</span>
              <strong>
                {Math.round(topOpportunity.confidence * 100)}%
              </strong>
            </div>

            <div>
              <span>ROI</span>
              <strong>
                {topOpportunity.roiMultiple.toFixed(1)}×
              </strong>
            </div>

            <ArrowUpRight size={17} />
          </div>
        </div>
      ) : null}
    </section>
  );
}