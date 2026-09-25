import { describe, expect, it } from "vitest";

import {
  getFinanceLeakages,
  getFinanceSnapshot,
  getMarginDrivers,
  runFinanceScenario,
} from "./finance";

describe("Novo finance engine", () => {
  it("reconciles net revenue", () => {
    const snapshot = getFinanceSnapshot({
      period: "mtd",
    });

    expect(snapshot.netRevenue).toBe(
      snapshot.grossSales -
        snapshot.discounts -
        snapshot.refunds
    );
  });

  it("reconciles contribution", () => {
    const snapshot = getFinanceSnapshot({
      period: "mtd",
    });

    expect(snapshot.contribution).toBe(
      snapshot.netRevenue - snapshot.variableCosts
    );
  });

  it("calculates contribution margin", () => {
    const snapshot = getFinanceSnapshot({
      period: "mtd",
    });

    expect(snapshot.contributionMargin).toBeCloseTo(
      (snapshot.contribution / snapshot.netRevenue) * 100
    );
  });

  it("filters finance by brand", () => {
    const portfolio = getFinanceSnapshot({
      period: "mtd",
    });

    const monkeyBox = getFinanceSnapshot({
      brandId: "monkeybox",
      period: "mtd",
    });

    expect(monkeyBox.netRevenue).toBeGreaterThan(0);
    expect(monkeyBox.netRevenue).toBeLessThan(
      portfolio.netRevenue
    );
  });

  it("filters finance by location", () => {
    const portfolio = getFinanceSnapshot({
      period: "mtd",
    });

    const banaswadi = getFinanceSnapshot({
      locationId: "banaswadi",
      period: "mtd",
    });

    expect(banaswadi.netRevenue).toBeGreaterThan(0);
    expect(banaswadi.netRevenue).toBeLessThan(
      portfolio.netRevenue
    );
  });

  it("returns ranked margin drivers", () => {
    const drivers = getMarginDrivers({
      period: "mtd",
    });

    expect(drivers.length).toBeGreaterThan(0);

    expect(drivers[0].impact).toBeGreaterThanOrEqual(
      drivers[drivers.length - 1].impact
    );
  });

  it("returns leakage opportunities", () => {
    const leakages = getFinanceLeakages({
      period: "mtd",
    });

    expect(leakages.length).toBeGreaterThan(0);

    expect(leakages[0].monthlyImpact).toBeGreaterThanOrEqual(
      leakages[leakages.length - 1].monthlyImpact
    );
  });

  it("models revenue growth scenarios", () => {
    const result = runFinanceScenario(
      {
        brandId: "khichdi-tales",
        period: "mtd",
      },
      {
        revenueChangePct: 10,
      }
    );

    expect(result.scenario.netRevenue).toBeGreaterThan(
      result.baseline.netRevenue
    );

    expect(result.scenario.contribution).toBeGreaterThan(
      result.baseline.contribution
    );
  });

  it("models food cost improvements", () => {
    const result = runFinanceScenario(
      {
        period: "mtd",
      },
      {
        foodCostChangePct: -5,
      }
    );

    expect(result.scenario.foodCost).toBeLessThan(
      result.baseline.foodCost
    );

    expect(result.contributionDelta).toBeGreaterThan(0);
  });

  it("keeps fixed operating costs fixed in a simple scenario", () => {
    const result = runFinanceScenario(
      {
        period: "mtd",
      },
      {
        revenueChangePct: 10,
      }
    );

    expect(result.scenario.operatingCosts).toBe(
      result.baseline.operatingCosts
    );
  });
});