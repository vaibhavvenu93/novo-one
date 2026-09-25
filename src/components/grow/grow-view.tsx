"use client";

import { useState } from "react";

import { GrowthHero } from "@/components/grow/growth-hero";
import { GrowthLanes } from "@/components/grow/growth-lanes";
import { OpportunityDetail } from "@/components/grow/opportunity-detail";
import { OpportunityRanking } from "@/components/grow/opportunity-ranking";

import { useNovo } from "@/context/novo-context";
import type { RankedGrowthOpportunity } from "@/domain/growth";
import {
  getGrowthLaneSummaries,
  getGrowthSnapshot,
  rankGrowthOpportunities,
} from "@/services/growth";

const brandLabels = {
  novo: "Novo portfolio",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
} as const;

export function GrowView() {
  const { brandId, locationId } = useNovo();

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<RankedGrowthOpportunity | null>(null);

  const filter = {
    brandId,
    locationId,
  };

  const snapshot = getGrowthSnapshot(filter);
  const opportunities = rankGrowthOpportunities(filter);
  const lanes = getGrowthLaneSummaries(filter);

  const contextLabel =
    brandLabels[brandId] ?? "current business";

  return (
    <div className="grow-view">
      <GrowthHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <GrowthLanes lanes={lanes} />

      <OpportunityRanking
        opportunities={opportunities}
        onSelectOpportunity={setSelectedOpportunity}
      />

      <OpportunityDetail
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
