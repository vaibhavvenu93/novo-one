import type {
  BrandId,
  EvidenceState,
  Health,
} from "@/domain/novo";

export type OperationalSignalType =
  | "capacity"
  | "demand"
  | "fulfilment"
  | "quality"
  | "inventory"
  | "cost"
  | "route";

export type OperationalDirection =
  | "positive"
  | "neutral"
  | "negative";

export type OperationalSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type OperationalExceptionType =
  | "capacity-pressure"
  | "under-utilisation"
  | "demand-production-mismatch"
  | "fulfilment-deterioration"
  | "quality-deterioration"
  | "inventory-risk"
  | "cost-drift"
  | "route-risk";

export interface OperationalSignal {
  id: string;

  brandId: BrandId;
  locationId?: string;

  type: OperationalSignalType;

  label: string;
  description: string;

  value: number;
  baseline?: number;
  target?: number;
  unit: string;

  direction: OperationalDirection;

  financialExposure: number;

  confidence: number;
  evidence: EvidenceState;

  observedAt: string;
}

export interface OperationalException {
  id: string;

  brandId: BrandId;
  locationId?: string;

  type: OperationalExceptionType;
  severity: OperationalSeverity;

  title: string;
  detail: string;

  financialExposure: number;
  confidence: number;

  evidence: EvidenceState;

  owner: string;
  recommendedAction: string;

  sourceSignalIds: string[];

  priorityScore: number;
}

export interface OperationalLocationHealth {
  locationId: string;
  brandId: BrandId;

  health: Health;

  capacityUtilisation?: number;

  exceptionCount: number;
  financialExposure: number;

  highestSeverity?: OperationalSeverity;
}

export interface OperationsFilter {
  brandId?: BrandId;
  locationId?: string;
  type?: OperationalSignalType;
}

export interface OperationsSnapshot {
  signalCount: number;
  exceptionCount: number;

  criticalCount: number;
  highCount: number;

  financialExposure: number;

  locationsAtRisk: number;

  averageConfidence: number;

  capacityPressureCount: number;
  underUtilisedCount: number;

  exceptions: OperationalException[];
}
