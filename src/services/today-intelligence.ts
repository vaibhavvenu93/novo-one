import type {
  TodayPriority,
  TodaySnapshot,
} from "@/domain/today";

import type { BrandId } from "@/domain/novo";

import {
  findMoney,
  getFinanceSnapshot,
} from "@/services/finance";

import {
  getGrowthSnapshot,
  rankGrowthOpportunities,
} from "@/services/growth";

import {
  getBuildSnapshot,
  getExperiments,
} from "@/services/build";

import {
  getOperationsSnapshot,
} from "@/services/operations";

interface TodayFilter {
  brandId?: BrandId;
  locationId?: string;
}

function normaliseFilter(filter: TodayFilter) {
  return {
    brandId:
      filter.brandId === "novo"
        ? undefined
        : filter.brandId,

    locationId:
      filter.locationId === "all"
        ? undefined
        : filter.locationId,
  };
}

function priorityScore(
  value: number,
  confidence = 0.5
) {
  return value * Math.max(confidence, 0.25);
}

export function getTodaySnapshot(
  filter: TodayFilter = {}
): TodaySnapshot {
  const scoped = normaliseFilter(filter);

  const finance = getFinanceSnapshot(scoped);

  const money = findMoney(scoped);

  const operations =
    getOperationsSnapshot(scoped);

  const growth =
    getGrowthSnapshot(scoped);

  const growthOpportunities =
    rankGrowthOpportunities(scoped);

  const build =
    getBuildSnapshot(scoped);

  const experiments =
    getExperiments(scoped);

  const priorities: Array<
    TodayPriority & { score: number }
  > = [];

  const topException =
    operations.exceptions[0];

  if (topException) {
    priorities.push({
      id: `operate-${topException.id}`,
      rank: 0,

      area: "operate",
      intent: "protect",

      eyebrow: "OPERATING RISK",

      title: topException.title,

      detail: topException.detail,

      valueLabel: "EXPOSURE",
      value: topException.financialExposure,

      confidence: topException.confidence,
      owner: topException.owner,

      evidence: topException.evidence,

      actionLabel: "Investigate in Operate",

      sourceId: topException.id,

      score: priorityScore(
        topException.financialExposure,
        topException.confidence
      ),
    });
  }

  const topGrowth =
    growthOpportunities[0];

  if (topGrowth) {
    priorities.push({
      id: `grow-${topGrowth.id}`,
      rank: 0,

      area: "grow",
      intent: "capture",

      eyebrow: "GROWTH OPPORTUNITY",

      title: topGrowth.title,

      detail: topGrowth.description,

      valueLabel: "ANNUAL REVENUE",
      value: topGrowth.annualRevenuePotential,

      confidence: topGrowth.confidence,
      owner: topGrowth.owner,

      evidence: topGrowth.evidence,

      actionLabel: "Investigate in Grow",

      sourceId: topGrowth.id,

      score: priorityScore(
        topGrowth.annualContributionPotential,
        topGrowth.confidence
      ),
    });
  }

  const decisionExperiment =
    experiments.find(
      (experiment) =>
        experiment.status === "decision"
    ) ??
    experiments.find(
      (experiment) =>
        experiment.status === "running"
    ) ??
    experiments[0];

  if (decisionExperiment) {
    priorities.push({
      id: `build-${decisionExperiment.id}`,
      rank: 0,

      area: "build",
      intent: "decide",

      eyebrow:
        decisionExperiment.status === "decision"
          ? "DECISION REQUIRED"
          : "EXPERIMENT",

      title: decisionExperiment.title,

      detail:
        decisionExperiment.hypothesis,

      valueLabel: "CAPITAL AT RISK",
      value:
        decisionExperiment.budgetCeiling,

      confidence:
        decisionExperiment.confidence,

      owner: decisionExperiment.owner,

      evidence:
        decisionExperiment.evidence,

      actionLabel: "Review in Build",

      sourceId: decisionExperiment.id,

      score: priorityScore(
        decisionExperiment.expectedAnnualContribution,
        decisionExperiment.confidence
      ),
    });
  }

  const topMoney =
    money.opportunities[0];

  if (topMoney) {
    priorities.push({
      id: `money-${topMoney.id}`,
      rank: 0,

      area: "money",
      intent: "fix",

      eyebrow: "MONEY OPPORTUNITY",

      title: topMoney.title,

      detail: topMoney.description,

      valueLabel: "MONTHLY IMPACT",
      value: topMoney.monthlyImpact,

      confidence: topMoney.confidence,

      evidence: topMoney.evidence,

      actionLabel: "Investigate in Money",

      sourceId: topMoney.id,

      score: priorityScore(
        topMoney.monthlyImpact * 12,
        topMoney.confidence
      ),
    });
  }

  const secondException =
    operations.exceptions[1];

  if (secondException) {
    priorities.push({
      id: `operate-${secondException.id}`,
      rank: 0,

      area: "operate",
      intent: "protect",

      eyebrow: "OPERATING RISK",

      title: secondException.title,

      detail: secondException.detail,

      valueLabel: "EXPOSURE",
      value: secondException.financialExposure,

      confidence: secondException.confidence,
      owner: secondException.owner,

      evidence: secondException.evidence,

      actionLabel: "Investigate in Operate",

      sourceId: secondException.id,

      score: priorityScore(
        secondException.financialExposure,
        secondException.confidence
      ),
    });
  }

 const rankedPriorities = priorities
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map((priority, index) => {
    const {
      score,
      ...todayPriority
    } = priority;

    void score;

    return {
      ...todayPriority,
      rank: index + 1,
    };
  });

  const headline =
    rankedPriorities.length === 1
      ? "1 thing needs your attention."
      : `${rankedPriorities.length} things need your attention.`;

  const summary =
    `${formatCompactMoney(
      operations.financialExposure
    )} is exposed across operations. ` +
    `${formatCompactMoney(
      growth.annualRevenuePotential
    )} of annual growth potential is currently visible. ` +
    `Novo has ranked what deserves attention first.`;

  return {
    priorities: rankedPriorities,

    netRevenue: finance.netRevenue,
    contribution: finance.contribution,

    financialExposure:
      operations.financialExposure,

    growthPotential:
      growth.annualRevenuePotential,

    activeExceptions:
      operations.exceptionCount,

    growthOpportunities:
      growth.opportunityCount,

    activeExperiments:
      build.activeCount,

    headline,
    summary,
  };
}

function formatCompactMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(
      value / 10_000_000
    ).toFixed(2)}Cr`;
  }

  if (value >= 100_000) {
    return `₹${(
      value / 100_000
    ).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `₹${(
      value / 1_000
    ).toFixed(1)}K`;
  }

  return `₹${Math.round(value)}`;
}