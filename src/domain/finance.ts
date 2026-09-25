import { BrandId, ChannelId, EvidenceState } from "@/domain/novo";

export type FinanceCostBucket =
  | "food"
  | "packaging"
  | "marketplace"
  | "payment"
  | "variable-labour"
  | "delivery"
  | "other-variable";

export interface FinanceRevenueLine {
  id: string;
  brandId: BrandId;
  locationId: string;
  channelId: ChannelId;
  period: string;

  grossSales: number;
  discounts: number;
  refunds: number;
  orders: number;

  evidence: EvidenceState;
}

export interface FinanceCostLine {
  id: string;
  brandId: BrandId;
  locationId: string;
  channelId?: ChannelId;
  period: string;

  bucket: FinanceCostBucket;
  amount: number;

  evidence: EvidenceState;
}

export interface OperatingCostLine {
  id: string;
  brandId: BrandId;
  locationId: string;
  period: string;

  label: string;
  amount: number;

  evidence: EvidenceState;
}

export interface FinanceFilter {
  brandId?: BrandId;
  locationId?: string;
  channelId?: ChannelId;
  period?: string;
}

export interface FinanceSnapshot {
  grossSales: number;
  discounts: number;
  refunds: number;
  netRevenue: number;

  foodCost: number;
  packagingCost: number;
  marketplaceCost: number;
  paymentCost: number;
  variableLabourCost: number;
  deliveryCost: number;
  otherVariableCost: number;

  variableCosts: number;

  contribution: number;
  contributionMargin: number;

  operatingCosts: number;
  operatingContribution: number;
  operatingContributionMargin: number;

  orders: number;
  aov: number;
}

export interface MarginDriver {
  id: string;
  label: string;
  impact: number;
  impactPp: number;
  evidence: EvidenceState;
  explanation: string;
}

export interface LeakageItem {
  id: string;
  title: string;
  category: FinanceCostBucket | "discount" | "refund";
  monthlyImpact: number;
  confidence: number;
  evidence: EvidenceState;
  action: string;
}

export interface FinanceScenarioInput {
  revenueChangePct?: number;
  foodCostChangePct?: number;
  packagingCostChangePct?: number;
  discountChangePct?: number;
  marketplaceCostChangePct?: number;
  variableLabourChangePct?: number;
}

export interface FinanceScenario {
  baseline: FinanceSnapshot;
  scenario: FinanceSnapshot;

  contributionDelta: number;
  contributionMarginDeltaPp: number;

  operatingContributionDelta: number;
}