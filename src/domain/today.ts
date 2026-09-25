import type { EvidenceState } from "@/domain/novo";

export type TodayPriorityArea =
  | "money"
  | "grow"
  | "operate"
  | "build";

export type TodayPriorityIntent =
  | "protect"
  | "capture"
  | "decide"
  | "fix";

export interface TodayPriority {
  id: string;

  rank: number;

  area: TodayPriorityArea;
  intent: TodayPriorityIntent;

  eyebrow: string;
  title: string;
  detail: string;

  valueLabel: string;
  value: number;

  confidence?: number;
  owner?: string;

  evidence: EvidenceState;

  actionLabel: string;

  sourceId?: string;
}

export interface TodaySnapshot {
  priorities: TodayPriority[];

  netRevenue: number;
  contribution: number;

  financialExposure: number;
  growthPotential: number;

  activeExceptions: number;
  growthOpportunities: number;
  activeExperiments: number;

  headline: string;
  summary: string;
}