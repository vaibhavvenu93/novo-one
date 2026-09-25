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
  const {
    brandId,
    locationId,
    navigationTarget,
    clearNavigationTarget,
  } = useNovo();

  const [
    selectedOpportunity,
    setSelectedOpportunity,
  ] =
    useState<RankedGrowthOpportunity | null>(
      null
    );

  const filter = {
    brandId,
    locationId,
  };

  const snapshot =
    getGrowthSnapshot(filter);

  const opportunities =
    rankGrowthOpportunities(filter);

  const lanes =
    getGrowthLaneSummaries(filter);

  const contextLabel =
    brandLabels[brandId] ??
    "current business";

  const focusedOpportunity =
    navigationTarget?.view === "grow" &&
    navigationTarget.sourceId
      ? opportunities.find(
          (opportunity) =>
            opportunity.id ===
            navigationTarget.sourceId
        ) ?? null
      : null;

  const activeOpportunity =
    focusedOpportunity ??
    selectedOpportunity;

  const handleSelectOpportunity = (
    opportunity: RankedGrowthOpportunity
  ) => {
    clearNavigationTarget();
    setSelectedOpportunity(opportunity);
  };

  const handleCloseOpportunity = () => {
    clearNavigationTarget();
    setSelectedOpportunity(null);
  };

  return (
    <div className="grow-view">
      <GrowthHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <GrowthLanes lanes={lanes} />

      <OpportunityRanking
        opportunities={opportunities}
        onSelectOpportunity={
          handleSelectOpportunity
        }
      />

      <OpportunityDetail
        opportunity={activeOpportunity}
        onClose={
          handleCloseOpportunity
        }
      />
    </div>
  );
}