export type EvidenceState =
  | "verified"
  | "public"
  | "modelled"
  | "hypothesis"
  | "needs-data";

export type Health = "healthy" | "watch" | "critical";

export type BrandId =
  | "novo"
  | "monkeybox"
  | "khichdi-tales"
  | "pressmans";

export type BrandType =
  | "portfolio"
  | "school-food"
  | "cloud-kitchen"
  | "cafe-qsr";

export type ChannelId =
  | "swiggy"
  | "zomato"
  | "direct"
  | "schools"
  | "corporate"
  | "qsr"
  | "dine-in";

export interface Metric {
  label: string;
  value: number;
  unit: "inr" | "percent" | "number" | "rating";
  delta?: number;
  target?: number;
  evidence: EvidenceState;
}

export interface ChannelPerformance {
  id: ChannelId;
  name: string;
  revenue: number;
  orders: number;
  contribution: number;
  aov: number;
  health: Health;
  evidence: EvidenceState;
}

export interface Location {
  id: string;
  brandId: BrandId;
  name: string;
  type: "kitchen" | "qsr" | "dine-in" | "school" | "corporate";
  city: string;
  health: Health;
  revenue: number;
  orders: number;
  contribution: number;
  capacityUtilisation?: number;
  evidence: EvidenceState;
}

export interface Brand {
  id: BrandId;
  name: string;
  shortName: string;
  type: BrandType;
  description: string;
  accent: string;
  revenue: number;
  orders: number;
  contribution: number;
  contributionMargin: number;
  growth: number;
  health: Health;
  customers?: number;
  rating?: number;
  locations: number;
  evidence: EvidenceState;
}

export interface AttentionItem {
  id: string;
  brandId: BrandId;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  impact: number;
  owner: string;
  action: string;
  evidence: EvidenceState;
}

export interface Opportunity {
  id: string;
  brandId: BrandId;
  category:
    | "revenue"
    | "margin"
    | "growth"
    | "operations"
    | "brand"
    | "new-business";
  title: string;
  thesis: string;
  annualImpact: number;
  confidence: number;
  effort: "low" | "medium" | "high";
  action: string;
  evidence: EvidenceState;
}

export interface Experiment {
  id: string;
  brandId: BrandId;
  title: string;
  hypothesis: string;
  status: "draft" | "running" | "won" | "lost" | "iterate";
  investment: number;
  expectedImpact: number;
  actualImpact?: number;
  confidence: number;
  owner: string;
  successMetric: string;
}

export interface PortfolioSnapshot {
  revenue: number;
  orders: number;
  contribution: number;
  contributionMargin: number;
  growth: number;
  opportunityValue: number;
  brands: Brand[];
  attention: AttentionItem[];
  opportunities: Opportunity[];
}
