import { BrandId, EvidenceState } from "@/domain/novo";

export type GrowthLane =
  | "schools"
  | "corporate"
  | "delivery"
  | "existing-account"
  | "location"
  | "new-business";

export type GrowthStage =
  | "signal"
  | "research"
  | "qualified"
  | "experiment"
  | "pipeline"
  | "won"
  | "lost";

export type GrowthTimeToImpact =
  | "0-30"
  | "31-60"
  | "61-90"
  | "90+";

export interface GrowthOpportunity {
  id: string;

  brandId: BrandId;
  lane: GrowthLane;
  stage: GrowthStage;

  title: string;
  description: string;

  locationId?: string;
  account?: string;

  annualRevenuePotential: number;
  annualContributionPotential: number;
  investmentRequired: number;

  confidence: number;
  strategicFit: number;
  capacityFit: number;

  timeToImpact: GrowthTimeToImpact;

  evidence: EvidenceState;

  whyNow: string;
  constraint: string;
  nextAction: string;
  owner: string;
}

export interface GrowthFilter {
  brandId?: BrandId;
  lane?: GrowthLane;
  stage?: GrowthStage;
  locationId?: string;
}

export interface RankedGrowthOpportunity
  extends GrowthOpportunity {
  contributionMarginPotential: number;
  roiMultiple: number;
  score: number;
  rank: number;
}

export interface GrowthSnapshot {
  opportunityCount: number;

  annualRevenuePotential: number;
  annualContributionPotential: number;
  investmentRequired: number;

  weightedRevenuePotential: number;
  weightedContributionPotential: number;

  qualifiedRevenuePotential: number;

  averageConfidence: number;

  topOpportunity?: RankedGrowthOpportunity;
}

export interface GrowthLaneSummary {
  lane: GrowthLane;
  opportunityCount: number;
  annualRevenuePotential: number;
  annualContributionPotential: number;
  weightedRevenuePotential: number;
  averageConfidence: number;
}