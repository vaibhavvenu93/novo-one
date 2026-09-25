"use client";

import { RankedGrowthOpportunity } from "@/domain/growth";

interface OpportunityRankingProps {
  opportunities: RankedGrowthOpportunity[];
  onSelectOpportunity: (
    opportunity: RankedGrowthOpportunity
  ) => void;
}
const brandLabels = {
  novo: "Novo",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
} as const;

const laneLabels = {
  schools: "Schools",
  corporate: "Corporate",
  delivery: "Delivery",
  "existing-account": "Existing account",
  location: "Location",
  "new-business": "New business",
} as const;

const stageLabels = {
  signal: "Signal",
  research: "Research",
  qualified: "Qualified",
  experiment: "Experiment",
  pipeline: "Pipeline",
  won: "Won",
  lost: "Lost",
} as const;

const timeLabels = {
  "0-30": "0–30 days",
  "31-60": "31–60 days",
  "61-90": "61–90 days",
  "90+": "90+ days",
} as const;

function formatCrores(value: number) {
  return `₹${(value / 10_000_000).toFixed(2)}Cr`;
}

function formatLakhs(value: number) {
  return `₹${(value / 100_000).toFixed(1)}L`;
}

function formatInvestment(value: number) {
  if (value >= 10_000_000) {
    return formatCrores(value);
  }

  return formatLakhs(value);
}

function confidenceLabel(confidence: number) {
  if (confidence >= 0.75) {
    return "High confidence";
  }

  if (confidence >= 0.5) {
    return "Medium confidence";
  }

  return "Early signal";
}

export function OpportunityRanking({
  opportunities,
  onSelectOpportunity,
}: OpportunityRankingProps) {
  if (!opportunities.length) {
    return (
      <section className="growth-ranking">
        <div className="growth-section-heading">
          <div>
            <span className="growth-eyebrow">
              OPPORTUNITY ENGINE
            </span>

            <h2>What should Novo pursue next?</h2>

            <p>
              No growth opportunities match the current business
              context.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="growth-ranking">
      <div className="growth-section-heading">
        <div>
          <span className="growth-eyebrow">
            OPPORTUNITY ENGINE
          </span>

          <h2>What should Novo pursue next?</h2>

          <p>
            Ranked by economic potential, confidence, strategic fit,
            capacity fit and speed to impact.
          </p>
        </div>

        <div className="growth-ranking-count">
          <strong>{opportunities.length}</strong>
          <span>opportunities ranked</span>
        </div>
      </div>

      <div className="growth-ranking-list">
        {opportunities.map((opportunity) => {
          const brandLabel =
            brandLabels[opportunity.brandId] ??
            opportunity.brandId;

          const laneLabel =
            laneLabels[opportunity.lane] ??
            opportunity.lane;

          const stageLabel =
            stageLabels[opportunity.stage] ??
            opportunity.stage;

          return (
            <article
  className="growth-opportunity growth-opportunity--interactive"
  key={opportunity.id}
  role="button"
  tabIndex={0}
  aria-label={`Open ${opportunity.title}`}
  onClick={() => onSelectOpportunity(opportunity)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectOpportunity(opportunity);
    }
  }}
>
              <div className="growth-opportunity-rank">
                <span>RANK</span>
                <strong>
                  {String(opportunity.rank).padStart(2, "0")}
                </strong>
              </div>

              <div className="growth-opportunity-main">
                <div className="growth-opportunity-meta">
                  <span>{brandLabel}</span>
                  <span>·</span>
                  <span>{laneLabel}</span>
                  <span>·</span>
                  <span>{stageLabel}</span>
                </div>

                <h3>{opportunity.title}</h3>

                <p className="growth-opportunity-description">
                  {opportunity.description}
                </p>

                <div className="growth-opportunity-reason">
                  <span>WHY NOW</span>
                  <p>{opportunity.whyNow}</p>
                </div>

                <div className="growth-opportunity-action">
                  <span>NEXT MOVE</span>
                  <p>{opportunity.nextAction}</p>
                </div>
              </div>

              <div className="growth-opportunity-economics">
                <div className="growth-score">
                  <span>OPPORTUNITY SCORE</span>

                  <strong>
                    {Math.round(opportunity.score)}
                  </strong>

                  <small>/ 100</small>
                </div>

                <div className="growth-economic-row">
                  <span>Revenue potential</span>
                  <strong>
                    {formatCrores(
                      opportunity.annualRevenuePotential
                    )}
                  </strong>
                </div>

                <div className="growth-economic-row">
                  <span>Contribution</span>
                  <strong>
                    {formatCrores(
                      opportunity.annualContributionPotential
                    )}
                  </strong>
                </div>

                <div className="growth-economic-row">
                  <span>Contribution margin</span>
                  <strong>
                    {opportunity.contributionMarginPotential.toFixed(
                      1
                    )}
                    %
                  </strong>
                </div>

                <div className="growth-economic-row">
                  <span>Investment</span>
                  <strong>
                    {formatInvestment(
                      opportunity.investmentRequired
                    )}
                  </strong>
                </div>

                <div className="growth-economic-row">
                  <span>Potential ROI</span>
                  <strong>
                    {opportunity.roiMultiple.toFixed(1)}×
                  </strong>
                </div>

                <div className="growth-opportunity-signals">
                  <span>
                    {confidenceLabel(opportunity.confidence)}
                  </span>

                  <span>
                    {Math.round(opportunity.confidence * 100)}%
                  </span>

                  <span>
                    {timeLabels[opportunity.timeToImpact]}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

