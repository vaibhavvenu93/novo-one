import { describe, expect, it } from "vitest";
import { getBrandUniverse, getPortfolioSnapshot } from "./novo";

describe("Novo operating model", () => {
  it("reconciles portfolio revenue from brands", () => {
    const portfolio = getPortfolioSnapshot();

    const brandRevenue = portfolio.brands.reduce(
      (sum, brand) => sum + brand.revenue,
      0
    );

    expect(portfolio.revenue).toBe(brandRevenue);
  });

  it("calculates portfolio contribution margin", () => {
    const portfolio = getPortfolioSnapshot();

    expect(portfolio.contributionMargin).toBeCloseTo(
      (portfolio.contribution / portfolio.revenue) * 100
    );
  });

  it("returns the correct Khichdi Tales universe", () => {
    const universe = getBrandUniverse("khichdi-tales");

    expect(universe.brand?.name).toBe("Khichdi Tales");
    expect(universe.channels.length).toBeGreaterThan(0);
    expect(
      universe.opportunities.every(
        (opportunity) => opportunity.brandId === "khichdi-tales"
      )
    ).toBe(true);
  });

  it("keeps opportunity value additive", () => {
    const portfolio = getPortfolioSnapshot();

    const expected = portfolio.opportunities.reduce(
      (sum, opportunity) => sum + opportunity.annualImpact,
      0
    );

    expect(portfolio.opportunityValue).toBe(expected);
  });
});
