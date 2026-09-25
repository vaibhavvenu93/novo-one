import {
  financeCostLines,
  financeLeakages,
  financeRevenueLines,
  operatingCostLines,
} from "@/data/finance-demo";

import {
  FinanceFilter,
  FinanceScenario,
  FinanceScenarioInput,
  FinanceSnapshot,
  MarginDriver,
} from "@/domain/finance";

function matchesFilter(
  item: {
    brandId: string;
    locationId: string;
    channelId?: string;
    period: string;
  },
  filter: FinanceFilter
) {
  if (
    filter.brandId &&
    filter.brandId !== "novo" &&
    item.brandId !== filter.brandId
  ) {
    return false;
  }

  if (
    filter.locationId &&
    filter.locationId !== "all" &&
    item.locationId !== filter.locationId
  ) {
    return false;
  }

  if (filter.channelId && item.channelId !== filter.channelId) {
    return false;
  }

  if (filter.period && item.period !== filter.period) {
    return false;
  }

  return true;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function getFinanceSnapshot(
  filter: FinanceFilter = {}
): FinanceSnapshot {
  const revenue = financeRevenueLines.filter((line) =>
    matchesFilter(line, filter)
  );

  const costs = financeCostLines.filter((line) =>
    matchesFilter(line, filter)
  );

  const operatingCosts = operatingCostLines.filter((line) =>
    matchesFilter(line, filter)
  );

  const grossSales = sum(revenue.map((line) => line.grossSales));
  const discounts = sum(revenue.map((line) => line.discounts));
  const refunds = sum(revenue.map((line) => line.refunds));

  const netRevenue = grossSales - discounts - refunds;

  const getCost = (bucket: string) =>
    sum(
      costs
        .filter((line) => line.bucket === bucket)
        .map((line) => line.amount)
    );

  const foodCost = getCost("food");
  const packagingCost = getCost("packaging");
  const marketplaceCost = getCost("marketplace");
  const paymentCost = getCost("payment");
  const variableLabourCost = getCost("variable-labour");
  const deliveryCost = getCost("delivery");
  const otherVariableCost = getCost("other-variable");

  const variableCosts =
    foodCost +
    packagingCost +
    marketplaceCost +
    paymentCost +
    variableLabourCost +
    deliveryCost +
    otherVariableCost;

  const contribution = netRevenue - variableCosts;

  const contributionMargin = netRevenue
    ? (contribution / netRevenue) * 100
    : 0;

  const operatingCostTotal = sum(
    operatingCosts.map((line) => line.amount)
  );

  const operatingContribution =
    contribution - operatingCostTotal;

  const operatingContributionMargin = netRevenue
    ? (operatingContribution / netRevenue) * 100
    : 0;

  const orders = sum(revenue.map((line) => line.orders));

  const aov = orders ? netRevenue / orders : 0;

  return {
    grossSales,
    discounts,
    refunds,
    netRevenue,

    foodCost,
    packagingCost,
    marketplaceCost,
    paymentCost,
    variableLabourCost,
    deliveryCost,
    otherVariableCost,

    variableCosts,

    contribution,
    contributionMargin,

    operatingCosts: operatingCostTotal,
    operatingContribution,
    operatingContributionMargin,

    orders,
    aov,
  };
}

export function getFinanceLeakages(filter: FinanceFilter = {}) {
  // Demo leakage items currently represent portfolio-level modelled signals.
  // Brand/location-specific leakage will be introduced once actual data sources
  // are connected.
  void filter;

  return [...financeLeakages].sort(
    (a, b) => b.monthlyImpact - a.monthlyImpact
  );
}

export function getMarginDrivers(
  filter: FinanceFilter = {}
): MarginDriver[] {
  const snapshot = getFinanceSnapshot(filter);

  if (!snapshot.netRevenue) {
    return [];
  }

  const drivers = [
    {
      id: "food-cost",
      label: "Food cost",
      impact: snapshot.foodCost,
      evidence: "modelled" as const,
      explanation:
        "Ingredient and recipe cost consumed from net revenue.",
    },
    {
      id: "discounts",
      label: "Discounting",
      impact: snapshot.discounts,
      evidence: "modelled" as const,
      explanation:
        "Gross sales surrendered through discounts and promotions.",
    },
    {
      id: "marketplace",
      label: "Marketplace commissions",
      impact: snapshot.marketplaceCost,
      evidence: "modelled" as const,
      explanation:
        "Channel economics lost to marketplace commissions.",
    },
    {
      id: "packaging",
      label: "Packaging",
      impact: snapshot.packagingCost,
      evidence: "modelled" as const,
      explanation:
        "Packaging cost required to fulfil current order mix.",
    },
    {
      id: "variable-labour",
      label: "Variable labour",
      impact: snapshot.variableLabourCost,
      evidence: "modelled" as const,
      explanation:
        "Labour cost that scales with production and fulfilment.",
    },
  ];

  return drivers
    .map((driver) => ({
      ...driver,
      impactPp: (driver.impact / snapshot.netRevenue) * 100,
    }))
    .sort((a, b) => b.impact - a.impact);
}

export function runFinanceScenario(
  filter: FinanceFilter,
  input: FinanceScenarioInput
): FinanceScenario {
  const baseline = getFinanceSnapshot(filter);

  const revenueMultiplier =
    1 + (input.revenueChangePct ?? 0) / 100;

  const grossSales =
    baseline.grossSales * revenueMultiplier;

  const discounts =
    baseline.discounts *
    revenueMultiplier *
    (1 + (input.discountChangePct ?? 0) / 100);

  const refunds =
    baseline.refunds * revenueMultiplier;

  const netRevenue =
    grossSales - discounts - refunds;

  const foodCost =
    baseline.foodCost *
    revenueMultiplier *
    (1 + (input.foodCostChangePct ?? 0) / 100);

  const packagingCost =
    baseline.packagingCost *
    revenueMultiplier *
    (1 + (input.packagingCostChangePct ?? 0) / 100);

  const marketplaceCost =
    baseline.marketplaceCost *
    revenueMultiplier *
    (1 + (input.marketplaceCostChangePct ?? 0) / 100);

  const paymentCost =
    baseline.paymentCost * revenueMultiplier;

  const variableLabourCost =
    baseline.variableLabourCost *
    revenueMultiplier *
    (1 + (input.variableLabourChangePct ?? 0) / 100);

  const deliveryCost =
    baseline.deliveryCost * revenueMultiplier;

  const otherVariableCost =
    baseline.otherVariableCost * revenueMultiplier;

  const variableCosts =
    foodCost +
    packagingCost +
    marketplaceCost +
    paymentCost +
    variableLabourCost +
    deliveryCost +
    otherVariableCost;

  const contribution =
    netRevenue - variableCosts;

  const contributionMargin = netRevenue
    ? (contribution / netRevenue) * 100
    : 0;

  const operatingCosts = baseline.operatingCosts;

  const operatingContribution =
    contribution - operatingCosts;

  const operatingContributionMargin = netRevenue
    ? (operatingContribution / netRevenue) * 100
    : 0;

  const orders =
    baseline.orders * revenueMultiplier;

  const aov = orders ? netRevenue / orders : 0;

  const scenario: FinanceSnapshot = {
    grossSales,
    discounts,
    refunds,
    netRevenue,

    foodCost,
    packagingCost,
    marketplaceCost,
    paymentCost,
    variableLabourCost,
    deliveryCost,
    otherVariableCost,

    variableCosts,

    contribution,
    contributionMargin,

    operatingCosts,
    operatingContribution,
    operatingContributionMargin,

    orders,
    aov,
  };

  return {
    baseline,
    scenario,

    contributionDelta:
      scenario.contribution - baseline.contribution,

    contributionMarginDeltaPp:
      scenario.contributionMargin -
      baseline.contributionMargin,

    operatingContributionDelta:
      scenario.operatingContribution -
      baseline.operatingContribution,
  };
}