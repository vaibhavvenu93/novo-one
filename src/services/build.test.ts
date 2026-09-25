import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createExperimentDraft,
  createExperimentDraftFromOpportunityId,
  getBuildSnapshot,
  getExperiments,
} from "@/services/build";

import {
  rankGrowthOpportunities,
} from "@/services/growth";

describe("build intelligence", () => {
  it("converts a growth opportunity into an experiment draft", () => {
    const opportunity =
      rankGrowthOpportunities()[0];

    const experiment =
      createExperimentDraft(opportunity);

    expect(experiment.sourceOpportunityId)
      .toBe(opportunity.id);

    expect(experiment.brandId)
      .toBe(opportunity.brandId);

    expect(experiment.status)
      .toBe("draft");

    expect(experiment.budgetCeiling)
      .toBe(opportunity.investmentRequired);

    expect(experiment.expectedAnnualRevenue)
      .toBe(
        opportunity.annualRevenuePotential
      );

    expect(experiment.expectedAnnualContribution)
      .toBe(
        opportunity.annualContributionPotential
      );
  });

  it("normalises experiment confidence", () => {
    const opportunity =
      rankGrowthOpportunities()[0];

    const experiment =
      createExperimentDraft(opportunity);

    expect(experiment.confidence)
      .toBeGreaterThanOrEqual(0);

    expect(experiment.confidence)
      .toBeLessThanOrEqual(1);
  });

  it("assigns a success metric", () => {
    const opportunity =
      rankGrowthOpportunities()[0];

    const experiment =
      createExperimentDraft(opportunity);

    expect(experiment.successMetric.name)
      .toBeTruthy();

    expect(experiment.successMetric.direction)
      .toBe("increase");
  });

  it("can create a draft from an opportunity id", () => {
    const opportunity =
      rankGrowthOpportunities()[0];

    const experiment =
      createExperimentDraftFromOpportunityId(
        opportunity.id
      );

    expect(experiment).toBeDefined();

    expect(experiment?.sourceOpportunityId)
      .toBe(opportunity.id);
  });

  it("returns undefined for an unknown opportunity", () => {
    expect(
      createExperimentDraftFromOpportunityId(
        "does-not-exist"
      )
    ).toBeUndefined();
  });

  it("filters experiments by brand", () => {
    const monkeyBoxExperiments =
      getExperiments({
        brandId: "monkeybox",
      });

    expect(
      monkeyBoxExperiments.every(
        (experiment) =>
          experiment.brandId === "monkeybox"
      )
    ).toBe(true);
  });

  it("uses school acquisition as the success metric for the Varthur route experiment", () => {
    const opportunity =
      rankGrowthOpportunities().find(
        (item) =>
          item.title ===
          "Add three schools to the existing Varthur route"
      );

    expect(opportunity).toBeDefined();

    if (!opportunity) {
      throw new Error(
        "Varthur school acquisition opportunity was not found"
      );
    }

    const draft =
      createExperimentDraftFromOpportunityId(
        opportunity.id
      );

    expect(draft).toBeDefined();

    expect(draft?.successMetric).toEqual({
      name: "Schools added to existing route",
      direction: "increase",
      baseline: 0,
      target: 3,
      unit: "schools",
    });
  });

  it("produces a build snapshot", () => {
    const snapshot =
      getBuildSnapshot();

    expect(snapshot.experimentCount)
      .toBeGreaterThanOrEqual(0);

    expect(snapshot.activeCount)
      .toBeGreaterThanOrEqual(0);

    expect(snapshot.capitalAtRisk)
      .toBeGreaterThanOrEqual(0);

    expect(snapshot.averageConfidence)
      .toBeGreaterThanOrEqual(0);

    expect(snapshot.averageConfidence)
      .toBeLessThanOrEqual(1);
  });
});