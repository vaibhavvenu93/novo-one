import type {
  BuildFilter,
  BuildSnapshot,
  Experiment,
  ExperimentDraft,
  ExperimentMetric,
} from "@/domain/build";

import type {
  RankedGrowthOpportunity,
} from "@/domain/growth";

import {
  getGrowthOpportunity,
} from "@/services/growth";

/* -------------------------------------------------------
   INTERNAL HELPERS
------------------------------------------------------- */

function normaliseConfidence(value: number) {
  return value > 1 ? value / 100 : value;
}

function metricForOpportunity(
  opportunity: RankedGrowthOpportunity
): ExperimentMetric {
  if (
    opportunity.title ===
    "Add three schools to the existing Varthur route"
  ) {
    return {
      name: "Schools added to existing route",
      direction: "increase",
      baseline: 0,
      target: 3,
      unit: "schools",
    };
  }

  switch (opportunity.lane) {

    case "corporate":
      return {
        name: "Qualified contracted demand",
        direction: "increase",
        target: 1,
        unit: "account",
      };

    case "delivery":
      return {
        name: "Contribution per repeat customer",
        direction: "increase",
        target: 10,
        unit: "%",
      };

    case "location":
      return {
        name: "Validated catchment contribution",
        direction: "increase",
        target: 1,
        unit: "validated model",
      };

    case "new-business":
      return {
        name: "Incremental contribution",
        direction: "increase",
        target: 1,
        unit: "validated case",
      };

    default:
      return {
        name: "Validated commercial outcome",
        direction: "increase",
        target: 1,
        unit: "validated result",
      };
  }
}

function buildHypothesis(
  opportunity: RankedGrowthOpportunity
) {
  return [
    opportunity.description,
    opportunity.whyNow,
  ]
    .filter(Boolean)
    .join(" ");
}

/* -------------------------------------------------------
   OPPORTUNITY -> EXPERIMENT
------------------------------------------------------- */

export function createExperimentDraft(
  opportunity: RankedGrowthOpportunity
): ExperimentDraft {
  return {
    sourceOpportunityId: opportunity.id,

    brandId: opportunity.brandId,
    lane: opportunity.lane,
    locationId: opportunity.locationId,

    title: opportunity.title,

    hypothesis: buildHypothesis(opportunity),

    status: "draft",

    successMetric: metricForOpportunity(opportunity),

    budgetCeiling: opportunity.investmentRequired,

    expectedAnnualRevenue:
      opportunity.annualRevenuePotential,

    expectedAnnualContribution:
      opportunity.annualContributionPotential,

    confidence: normaliseConfidence(
      opportunity.confidence
    ),

    evidence: opportunity.evidence,

    timeToImpact: opportunity.timeToImpact,

    whyNow: opportunity.whyNow,
    constraint: opportunity.constraint,

    nextAction: opportunity.nextAction,
    owner: opportunity.owner,
  };
}

export function createExperimentDraftFromOpportunityId(
  opportunityId: string
): ExperimentDraft | undefined {
  const opportunity =
    getGrowthOpportunity(opportunityId);

  if (!opportunity) {
    return undefined;
  }

  return createExperimentDraft(opportunity);
}

/* -------------------------------------------------------
   DEMO EXPERIMENTS

   These represent experiments Novo has already decided
   to investigate. They give Build a useful operating
   surface before persistence is introduced.
------------------------------------------------------- */

function experimentFromOpportunity(
  opportunityId: string,
  overrides: Partial<Experiment>
): Experiment {
  const draft =
    createExperimentDraftFromOpportunityId(
      opportunityId
    );

  if (!draft) {
    throw new Error(
      `Growth opportunity not found: ${opportunityId}`
    );
  }

  return {
    ...draft,
    id: `experiment-${opportunityId}`,
    ...overrides,
  };
}

function buildDemoExperiments(): Experiment[] {
  const opportunityIds = [
  "growth-school-expansion",
  "growth-varthur-schools",
  "growth-khichdi-pass",
  "growth-direct-repeat",
];

  return opportunityIds
    .map((id, index) => {
      const draft =
        createExperimentDraftFromOpportunityId(id);

      if (!draft) {
        return undefined;
      }

      const statuses: Experiment["status"][] = [
        "running",
        "ready",
        "running",
        "decision",
      ];

      return experimentFromOpportunity(id, {
        status: statuses[index],
      });
    })
    .filter(
      (experiment): experiment is Experiment =>
        Boolean(experiment)
    );
}

export const buildExperiments =
  buildDemoExperiments();

/* -------------------------------------------------------
   QUERY
------------------------------------------------------- */

export function getExperiments(
  filter: BuildFilter = {}
) {
  return buildExperiments.filter((experiment) => {
    if (
      filter.brandId &&
      filter.brandId !== "novo" &&
      experiment.brandId !== filter.brandId
    ) {
      return false;
    }

    if (
      filter.status &&
      experiment.status !== filter.status
    ) {
      return false;
    }

    if (
      filter.locationId &&
      filter.locationId !== "all" &&
      experiment.locationId !== filter.locationId
    ) {
      return false;
    }

    return true;
  });
}

export function getExperiment(id: string) {
  return buildExperiments.find(
    (experiment) => experiment.id === id
  );
}

/* -------------------------------------------------------
   BUILD SNAPSHOT
------------------------------------------------------- */

export function getBuildSnapshot(
  filter: BuildFilter = {}
): BuildSnapshot {
  const experiments = getExperiments(filter);

  const active = experiments.filter(
    (experiment) =>
      experiment.status === "ready" ||
      experiment.status === "running"
  );

  const blocked = experiments.filter(
    (experiment) =>
      experiment.status === "blocked"
  );

  const decisions = experiments.filter(
    (experiment) =>
      experiment.status === "decision"
  );

  const sum = (values: number[]) =>
    values.reduce(
      (total, value) => total + value,
      0
    );

  const confidenceTotal = sum(
    experiments.map(
      (experiment) => experiment.confidence
    )
  );

  return {
    experimentCount: experiments.length,

    activeCount: active.length,

    blockedCount: blocked.length,

    decisionCount: decisions.length,

    capitalAtRisk: sum(
      active.map(
        (experiment) => experiment.budgetCeiling
      )
    ),

    expectedAnnualRevenue: sum(
      experiments.map(
        (experiment) =>
          experiment.expectedAnnualRevenue
      )
    ),

    expectedAnnualContribution: sum(
      experiments.map(
        (experiment) =>
          experiment.expectedAnnualContribution
      )
    ),

    averageConfidence: experiments.length
      ? confidenceTotal / experiments.length
      : 0,
  };
}
