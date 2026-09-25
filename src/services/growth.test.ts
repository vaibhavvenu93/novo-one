import { describe, expect, it } from "vitest";

import {
  calculateGrowthScore,
  getGrowthLaneSummaries,
  getGrowthOpportunity,
  getGrowthSnapshot,
  rankGrowthOpportunities,
} from "@/services/growth";

describe("Novo growth engine", () => {
  it("returns the complete opportunity portfolio", () => {
    const opportunities = rankGrowthOpportunities();

    expect(opportunities).toHaveLength(8);
  });

  it("ranks opportunities from highest to lowest score", () => {
    const opportunities = rankGrowthOpportunities();

    expect(opportunities.length).toBeGreaterThan(1);

    for (let index = 1; index < opportunities.length; index += 1) {
      expect(opportunities[index - 1].score).toBeGreaterThanOrEqual(
        opportunities[index].score
      );
    }

    expect(opportunities[0].rank).toBe(1);
  });

  it("keeps growth scores inside the 0-100 range", () => {
    const opportunities = rankGrowthOpportunities();

    for (const opportunity of opportunities) {
      expect(opportunity.score).toBeGreaterThanOrEqual(0);
      expect(opportunity.score).toBeLessThanOrEqual(100);
    }
  });

  it("calculates ROI and contribution margin potential", () => {
    const opportunity = rankGrowthOpportunities().find(
      (item) => item.id === "growth-varthur-schools"
    );

    expect(opportunity).toBeDefined();

    expect(opportunity!.contributionMarginPotential).toBeCloseTo(30, 2);
    expect(opportunity!.roiMultiple).toBeCloseTo(4.55, 2);
  });

  it("filters growth opportunities by brand", () => {
    const opportunities = rankGrowthOpportunities({
      brandId: "monkeybox",
    });

    expect(opportunities).toHaveLength(2);

    expect(
      opportunities.every(
        (opportunity) => opportunity.brandId === "monkeybox"
      )
    ).toBe(true);
  });

  it("filters growth opportunities by lane", () => {
    const opportunities = rankGrowthOpportunities({
      lane: "corporate",
    });

    expect(opportunities).toHaveLength(2);

    expect(
      opportunities.every(
        (opportunity) => opportunity.lane === "corporate"
      )
    ).toBe(true);
  });

  it("filters growth opportunities by location", () => {
    const opportunities = rankGrowthOpportunities({
      locationId: "varthur",
    });

    expect(opportunities.length).toBeGreaterThan(0);

    expect(
      opportunities.every(
        (opportunity) => opportunity.locationId === "varthur"
      )
    ).toBe(true);
  });

  it("reconciles total annual revenue opportunity", () => {
    const snapshot = getGrowthSnapshot();

    expect(snapshot.annualRevenuePotential).toBe(23_070_000);
  });

  it("reconciles total annual contribution opportunity", () => {
    const snapshot = getGrowthSnapshot();

    expect(snapshot.annualContributionPotential).toBe(6_712_000);
  });

  it("reconciles total investment required", () => {
    const snapshot = getGrowthSnapshot();

    expect(snapshot.investmentRequired).toBe(3_235_000);
  });

  it("confidence-weights the revenue portfolio", () => {
    const snapshot = getGrowthSnapshot();

    expect(snapshot.weightedRevenuePotential).toBeCloseTo(
  13_326_400,
  0
);

    expect(snapshot.weightedRevenuePotential).toBeLessThan(
      snapshot.annualRevenuePotential
    );
  });

  it("only counts qualified and execution-stage revenue as qualified pipeline", () => {
    const snapshot = getGrowthSnapshot();

    expect(snapshot.qualifiedRevenuePotential).toBe(4_220_000);
  });

  it("returns the ranked top opportunity in the snapshot", () => {
    const snapshot = getGrowthSnapshot();
    const ranked = rankGrowthOpportunities();

    expect(snapshot.topOpportunity).toBeDefined();
    expect(snapshot.topOpportunity?.id).toBe(ranked[0].id);
    expect(snapshot.topOpportunity?.rank).toBe(1);
  });

  it("groups opportunities into growth lanes", () => {
    const lanes = getGrowthLaneSummaries();

    const corporate = lanes.find(
      (lane) => lane.lane === "corporate"
    );

    expect(corporate).toBeDefined();
    expect(corporate?.opportunityCount).toBe(2);
    expect(corporate?.annualRevenuePotential).toBe(7_350_000);
  });

  it("sorts growth lanes by confidence-weighted revenue", () => {
    const lanes = getGrowthLaneSummaries();

    for (let index = 1; index < lanes.length; index += 1) {
      expect(
        lanes[index - 1].weightedRevenuePotential
      ).toBeGreaterThanOrEqual(
        lanes[index].weightedRevenuePotential
      );
    }
  });

  it("retrieves a single growth opportunity", () => {
    const opportunity = getGrowthOpportunity(
      "growth-khichdi-pass"
    );

    expect(opportunity).toBeDefined();
    expect(opportunity?.brandId).toBe("khichdi-tales");
    expect(opportunity?.lane).toBe("delivery");
  });

  it("gives a stronger opportunity a meaningful score", () => {
    const opportunity = getGrowthOpportunity(
      "growth-varthur-schools"
    );

    expect(opportunity).toBeDefined();

    const score = calculateGrowthScore(opportunity!);

    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns an empty portfolio cleanly when nothing matches", () => {
    const snapshot = getGrowthSnapshot({
      brandId: "pressmans",
      lane: "schools",
    });

    expect(snapshot.opportunityCount).toBe(0);
    expect(snapshot.annualRevenuePotential).toBe(0);
    expect(snapshot.weightedRevenuePotential).toBe(0);
    expect(snapshot.averageConfidence).toBe(0);
    expect(snapshot.topOpportunity).toBeUndefined();
  });
});