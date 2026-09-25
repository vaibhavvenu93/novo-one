import { growthOpportunities } from "@/data/growth-demo";

import {
  GrowthFilter,
  GrowthLane,
  GrowthLaneSummary,
  GrowthOpportunity,
  GrowthSnapshot,
  RankedGrowthOpportunity,
} from "@/domain/growth";

/* -------------------------------------------------------
   INTERNAL HELPERS
------------------------------------------------------- */

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function matchesGrowthFilter(
  opportunity: GrowthOpportunity,
  filter: GrowthFilter
) {
  if (
    filter.brandId &&
    filter.brandId !== "novo" &&
    opportunity.brandId !== filter.brandId
  ) {
    return false;
  }

  if (
    filter.lane &&
    opportunity.lane !== filter.lane
  ) {
    return false;
  }

  if (
    filter.stage &&
    opportunity.stage !== filter.stage
  ) {
    return false;
  }

  if (
    filter.locationId &&
    filter.locationId !== "all" &&
    opportunity.locationId !== filter.locationId
  ) {
    return false;
  }

  return true;
}

function getTimeToImpactScore(
  opportunity: GrowthOpportunity
) {
  switch (opportunity.timeToImpact) {
    case "0-30":
      return 100;

    case "31-60":
      return 80;

    case "61-90":
      return 60;

    case "90+":
      return 35;

    default:
      return 50;
  }
}

function normalisePercentScore(value: number) {
  /*
   * strategicFit and capacityFit may be represented either
   * as 0-1 decimals or 0-100 scores. Supporting both keeps
   * the engine resilient while the demo model evolves.
   */
  if (value <= 1) {
    return value * 100;
  }

  return value;
}

function normaliseConfidence(value: number) {
  /*
   * Confidence is expected to be 0-1 in the current model,
   * but supporting 0-100 prevents accidental score blowouts.
   */
  if (value > 1) {
    return value / 100;
  }

  return value;
}

/* -------------------------------------------------------
   OPPORTUNITY SCORE
------------------------------------------------------- */

export function calculateGrowthScore(
  opportunity: GrowthOpportunity
) {
  const confidence =
    normaliseConfidence(opportunity.confidence) * 100;

  const strategicFit = normalisePercentScore(
    opportunity.strategicFit
  );

  const capacityFit = normalisePercentScore(
    opportunity.capacityFit
  );

  const timeScore =
    getTimeToImpactScore(opportunity);

  /*
   * Founder decision score:
   *
   * 35% confidence
   * 30% strategic fit
   * 20% capacity fit
   * 15% speed to impact
   *
   * Economics remain visible separately through revenue,
   * contribution and ROI rather than allowing a single
   * large revenue estimate to dominate the ranking.
   */
  const score =
    confidence * 0.35 +
    strategicFit * 0.3 +
    capacityFit * 0.2 +
    timeScore * 0.15;

  return Math.max(
    0,
    Math.min(100, Number(score.toFixed(2)))
  );
}

/* -------------------------------------------------------
   RANK OPPORTUNITIES
------------------------------------------------------- */

export function rankGrowthOpportunities(
  filter: GrowthFilter = {}
): RankedGrowthOpportunity[] {
  const filtered = growthOpportunities.filter(
    (opportunity) =>
      matchesGrowthFilter(opportunity, filter)
  );

  const ranked = filtered
    .map((opportunity) => {
      const contributionMarginPotential =
        opportunity.annualRevenuePotential
          ? (opportunity.annualContributionPotential /
              opportunity.annualRevenuePotential) *
            100
          : 0;

      const roiMultiple =
        opportunity.investmentRequired
          ? opportunity.annualContributionPotential /
            opportunity.investmentRequired
          : 0;

      return {
        ...opportunity,

        contributionMarginPotential,
        roiMultiple,

        score: calculateGrowthScore(opportunity),

        // Assigned properly after sorting.
        rank: 0,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      /*
       * Tie-break with confidence-weighted revenue.
       */
      const aWeightedRevenue =
        a.annualRevenuePotential *
        normaliseConfidence(a.confidence);

      const bWeightedRevenue =
        b.annualRevenuePotential *
        normaliseConfidence(b.confidence);

      return bWeightedRevenue - aWeightedRevenue;
    });

  return ranked.map((opportunity, index) => ({
    ...opportunity,
    rank: index + 1,
  }));
}

/* -------------------------------------------------------
   SINGLE OPPORTUNITY
------------------------------------------------------- */

export function getGrowthOpportunity(
  id: string
): RankedGrowthOpportunity | undefined {
  return rankGrowthOpportunities().find(
    (opportunity) => opportunity.id === id
  );
}

/* -------------------------------------------------------
   GROWTH SNAPSHOT
------------------------------------------------------- */

export function getGrowthSnapshot(
  filter: GrowthFilter = {}
): GrowthSnapshot {
  const opportunities =
    rankGrowthOpportunities(filter);

  if (!opportunities.length) {
    return {
      opportunityCount: 0,

      annualRevenuePotential: 0,
      annualContributionPotential: 0,
      investmentRequired: 0,

      weightedRevenuePotential: 0,
      weightedContributionPotential: 0,

      qualifiedRevenuePotential: 0,

      averageConfidence: 0,

      topOpportunity: undefined,
    };
  }

  const annualRevenuePotential = sum(
    opportunities.map(
      (opportunity) =>
        opportunity.annualRevenuePotential
    )
  );

  const annualContributionPotential = sum(
    opportunities.map(
      (opportunity) =>
        opportunity.annualContributionPotential
    )
  );

  const investmentRequired = sum(
    opportunities.map(
      (opportunity) =>
        opportunity.investmentRequired
    )
  );

  const weightedRevenuePotential = sum(
    opportunities.map(
      (opportunity) =>
        opportunity.annualRevenuePotential *
        normaliseConfidence(opportunity.confidence)
    )
  );

  const weightedContributionPotential = sum(
    opportunities.map(
      (opportunity) =>
        opportunity.annualContributionPotential *
        normaliseConfidence(opportunity.confidence)
    )
  );

  /*
   * Revenue is treated as qualified once an opportunity
   * has crossed research into a decision/execution state.
   *
   * Won opportunities are included because they represent
   * validated growth value in the operating portfolio.
   */
  const qualifiedStages = new Set([
    "qualified",
    "experiment",
    "pipeline",
    "won",
  ]);

  const qualifiedRevenuePotential = sum(
    opportunities
      .filter((opportunity) =>
        qualifiedStages.has(opportunity.stage)
      )
      .map(
        (opportunity) =>
          opportunity.annualRevenuePotential
      )
  );

  const averageConfidence =
    sum(
      opportunities.map((opportunity) =>
        normaliseConfidence(
          opportunity.confidence
        )
      )
    ) / opportunities.length;

  return {
    opportunityCount: opportunities.length,

    annualRevenuePotential,
    annualContributionPotential,
    investmentRequired,

    weightedRevenuePotential,
    weightedContributionPotential,

    qualifiedRevenuePotential,

    averageConfidence,

    topOpportunity: opportunities[0],
  };
}

/* -------------------------------------------------------
   GROWTH LANES
------------------------------------------------------- */

export function getGrowthLaneSummaries(
  filter: GrowthFilter = {}
): GrowthLaneSummary[] {
  const opportunities =
    rankGrowthOpportunities(filter);

  const laneMap = new Map<
    GrowthLane,
    RankedGrowthOpportunity[]
  >();

  for (const opportunity of opportunities) {
    const existing =
      laneMap.get(opportunity.lane) ?? [];

    existing.push(opportunity);

    laneMap.set(
      opportunity.lane,
      existing
    );
  }

  const summaries: GrowthLaneSummary[] = [];

  for (const [lane, laneOpportunities] of laneMap) {
    const annualRevenuePotential = sum(
      laneOpportunities.map(
        (opportunity) =>
          opportunity.annualRevenuePotential
      )
    );

    const annualContributionPotential = sum(
      laneOpportunities.map(
        (opportunity) =>
          opportunity.annualContributionPotential
      )
    );

    const weightedRevenuePotential = sum(
      laneOpportunities.map(
        (opportunity) =>
          opportunity.annualRevenuePotential *
          normaliseConfidence(
            opportunity.confidence
          )
      )
    );

    const averageConfidence =
      laneOpportunities.length
        ? sum(
            laneOpportunities.map(
              (opportunity) =>
                normaliseConfidence(
                  opportunity.confidence
                )
            )
          ) / laneOpportunities.length
        : 0;

    summaries.push({
      lane,
      opportunityCount:
        laneOpportunities.length,

      annualRevenuePotential,
      annualContributionPotential,

      weightedRevenuePotential,

      averageConfidence,
    });
  }

  return summaries.sort(
    (a, b) =>
      b.weightedRevenuePotential -
      a.weightedRevenuePotential
  );
}