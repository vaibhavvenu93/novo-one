import type { BrandId, EvidenceState } from "@/domain/novo";
import type {
  GrowthLane,
  GrowthTimeToImpact,
} from "@/domain/growth";

export type ExperimentStatus =
  | "draft"
  | "ready"
  | "running"
  | "blocked"
  | "decision";

export type ExperimentDecision =
  | "scale"
  | "iterate"
  | "kill"
  | "needs-evidence";

export type ExperimentMetricDirection =
  | "increase"
  | "decrease"
  | "maintain";

export interface ExperimentMetric {
  name: string;
  direction: ExperimentMetricDirection;

  baseline?: number;
  target?: number;
  unit?: string;
}

export interface Experiment {
  id: string;

  sourceOpportunityId: string;

  brandId: BrandId;
  lane: GrowthLane;
  locationId?: string;

  title: string;
  hypothesis: string;

  status: ExperimentStatus;

  successMetric: ExperimentMetric;

  budgetCeiling: number;
  expectedAnnualRevenue: number;
  expectedAnnualContribution: number;

  confidence: number;
  evidence: EvidenceState;

  timeToImpact: GrowthTimeToImpact;

  whyNow: string;
  constraint: string;

  nextAction: string;
  owner: string;

  decision?: ExperimentDecision;
}

export interface ExperimentDraft
  extends Omit<
    Experiment,
    "id" | "status" | "decision"
  > {
  status: "draft";
}

export interface BuildSnapshot {
  experimentCount: number;
  activeCount: number;
  blockedCount: number;
  decisionCount: number;

  capitalAtRisk: number;

  expectedAnnualRevenue: number;
  expectedAnnualContribution: number;

  averageConfidence: number;
}

export interface BuildFilter {
  brandId?: BrandId;
  status?: ExperimentStatus;
  locationId?: string;
}
