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
export type MoneyOpportunityState =
  | "identified"
  | "modelled"
  | "to-prove";

export interface MoneyOpportunity {
  id: string;
  title: string;
  description: string;
  state: MoneyOpportunityState;

  monthlyImpact: number;
  annualImpact: number;

  confidence: number;
  effort: "low" | "medium" | "high";

  evidence:
    | "verified"
    | "public"
    | "modelled"
    | "hypothesis"
    | "needs-data";

  action: string;
}

export interface FindMoneyPlan {
  target: number;

  identified: number;
  modelled: number;
  toProve: number;

  totalPotential: number;
  gap: number;

  opportunities: MoneyOpportunity[];
}

export function findMoney(
  filter: FinanceFilter = {},
  target = 1_000_000
): FindMoneyPlan {
  const snapshot = getFinanceSnapshot(filter);
  const leakages = getFinanceLeakages(filter);

  const opportunities: MoneyOpportunity[] = [];

  /*
   * -------------------------------------------------------
   * IDENTIFIED
   * -------------------------------------------------------
   *
   * These are economic leakage signals already present in
   * Novo's finance model.
   *
   * They are still only as reliable as their underlying
   * evidence state. "Identified" means the engine has found
   * the surface — not that cash has already been recovered.
   */

  leakages.forEach((leakage) => {
    opportunities.push({
      id: `find-${leakage.id}`,
      title: leakage.title,

      description:
        `Novo has isolated approximately ₹${Math.round(
          leakage.monthlyImpact / 1000
        )}K per month of potential economic leakage in this area.`,

      state: "identified",

      monthlyImpact: leakage.monthlyImpact,
      annualImpact: leakage.monthlyImpact * 12,

      confidence: leakage.confidence,
      effort: "low",

      evidence: leakage.evidence,

      action: leakage.action,
    });
  });

  /*
   * -------------------------------------------------------
   * MODELLED — FOOD COST
   * -------------------------------------------------------
   *
   * Scenario:
   * What would a 2% improvement in food cost be worth?
   */

  const foodCostOpportunity =
    snapshot.foodCost * 0.02;

  if (foodCostOpportunity > 0) {
    opportunities.push({
      id: "find-food-cost",

      title: "Take 2% out of food cost",

      description:
        "A 2% improvement in current food cost through recipe costing, purchasing discipline, yield control and supplier negotiation.",

      state: "modelled",

      monthlyImpact: foodCostOpportunity,
      annualImpact: foodCostOpportunity * 12,

      confidence: 0.68,
      effort: "medium",

      evidence: "modelled",

      action:
        "Build ingredient-level recipe costing, compare supplier landed costs and investigate the highest-value purchase variances.",
    });
  }

  /*
   * -------------------------------------------------------
   * MODELLED — DISCOUNTS
   * -------------------------------------------------------
   *
   * Scenario:
   * Recover 20% of current discount spend without assuming
   * equivalent revenue loss.
   */

  const discountOpportunity =
    snapshot.discounts * 0.2;

  if (discountOpportunity > 0) {
    opportunities.push({
      id: "find-discounts",

      title: "Remove low-return discounting",

      description:
        "Models recovery of 20% of current discount spend by removing promotions that do not create sufficient incremental demand or repeat behaviour.",

      state: "modelled",

      monthlyImpact: discountOpportunity,
      annualImpact: discountOpportunity * 12,

      confidence: 0.58,
      effort: "medium",

      evidence: "hypothesis",

      action:
        "Run promotion-level cohort analysis and remove discounts that do not improve repeat rate, frequency or contribution.",
    });
  }

  /*
   * -------------------------------------------------------
   * MODELLED — MARKETPLACE MIX
   * -------------------------------------------------------
   */

  const marketplaceOpportunity =
    snapshot.marketplaceCost * 0.1;

  if (marketplaceOpportunity > 0) {
    opportunities.push({
      id: "find-marketplace",

      title: "Improve marketplace mix",

      description:
        "Models a 10% reduction in marketplace commission burden by shifting repeat demand toward structurally better channels.",

      state: "modelled",

      monthlyImpact: marketplaceOpportunity,
      annualImpact: marketplaceOpportunity * 12,

      confidence: 0.61,
      effort: "medium",

      evidence: "modelled",

      action:
        "Identify repeat marketplace customers and test direct ordering, subscriptions, corporate ordering and owned-channel retention loops.",
    });
  }

  /*
   * -------------------------------------------------------
   * MODELLED — PACKAGING
   * -------------------------------------------------------
   */

  const packagingOpportunity =
    snapshot.packagingCost * 0.05;

  if (packagingOpportunity > 0) {
    opportunities.push({
      id: "find-packaging",

      title: "Simplify packaging economics",

      description:
        "Models a 5% reduction in packaging cost through SKU simplification, volume concentration and procurement discipline.",

      state: "modelled",

      monthlyImpact: packagingOpportunity,
      annualImpact: packagingOpportunity * 12,

      confidence: 0.72,
      effort: "low",

      evidence: "modelled",

      action:
        "Map packaging SKU usage by brand and item, consolidate overlapping packs and requote the highest-volume SKUs.",
    });
  }

  /*
   * -------------------------------------------------------
   * TO PROVE — LABOUR PRODUCTIVITY
   * -------------------------------------------------------
   *
   * This is deliberately separated from modelled savings.
   * We do not yet have enough operating data to claim it.
   */

  const labourOpportunity =
    snapshot.variableLabourCost * 0.05;

  if (labourOpportunity > 0) {
    opportunities.push({
      id: "find-labour-productivity",

      title: "Prove kitchen labour productivity",

      description:
        "There may be recoverable capacity inside current kitchen labour, but shift, station and throughput data are required before Novo should count it.",

      state: "to-prove",

      monthlyImpact: labourOpportunity,
      annualImpact: labourOpportunity * 12,

      confidence: 0.4,
      effort: "medium",

      evidence: "needs-data",

      action:
        "Capture labour hours, production volume, station throughput and utilisation by shift before changing staffing.",
    });
  }

  /*
   * -------------------------------------------------------
   * TO PROVE — DELIVERY / ROUTE DENSITY
   * -------------------------------------------------------
   */

  const deliveryOpportunity =
    snapshot.deliveryCost * 0.05;

  if (deliveryOpportunity > 0) {
    opportunities.push({
      id: "find-route-density",

      title: "Prove route-density savings",

      description:
        "A denser school or delivery route may reduce fulfilment cost per order, but route-level operating data is required to validate the saving.",

      state: "to-prove",

      monthlyImpact: deliveryOpportunity,
      annualImpact: deliveryOpportunity * 12,

      confidence: 0.42,
      effort: "medium",

      evidence: "needs-data",

      action:
        "Map route distance, drops, meals, delivery time and vehicle cost before changing the network.",
    });
  }

  /*
   * -------------------------------------------------------
   * RANK
   * -------------------------------------------------------
   */

  opportunities.sort(
    (a, b) =>
      b.monthlyImpact * b.confidence -
      a.monthlyImpact * a.confidence
  );

  /*
   * -------------------------------------------------------
   * SUMMARISE
   * -------------------------------------------------------
   */

  const identified = opportunities
    .filter(
      (opportunity) =>
        opportunity.state === "identified"
    )
    .reduce(
      (total, opportunity) =>
        total + opportunity.monthlyImpact,
      0
    );

  const modelled = opportunities
    .filter(
      (opportunity) =>
        opportunity.state === "modelled"
    )
    .reduce(
      (total, opportunity) =>
        total + opportunity.monthlyImpact,
      0
    );

  const toProve = opportunities
    .filter(
      (opportunity) =>
        opportunity.state === "to-prove"
    )
    .reduce(
      (total, opportunity) =>
        total + opportunity.monthlyImpact,
      0
    );

  const totalPotential =
    identified + modelled + toProve;

  /*
   * The gap is important.
   *
   * If Novo can only currently find ₹3L against a ₹10L
   * request, we show ₹7L still unresolved rather than
   * manufacturing another opportunity to make the UI look
   * complete.
   */

  const gap = Math.max(
    target - totalPotential,
    0
  );

  return {
    target,

    identified,
    modelled,
    toProve,

    totalPotential,
    gap,

    opportunities,
  };
}