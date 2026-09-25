"use client";

import { useState } from "react";

import { BuildHero } from "@/components/build/build-hero";
import { ExperimentDetail } from "@/components/build/experiment-detail";
import { ExperimentPortfolio } from "@/components/build/experiment-portfolio";

import { useNovo } from "@/context/novo-context";
import type { Experiment } from "@/domain/build";
import {
  getBuildSnapshot,
  getExperiments,
} from "@/services/build";

const brandLabels = {
  novo: "the Novo portfolio",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
} as const;

export function BuildView() {
  const { brandId, locationId } = useNovo();

  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);

  const filter = {
    brandId,
    locationId,
  };

  const snapshot = getBuildSnapshot(filter);
  const experiments = getExperiments(filter);

  const contextLabel =
    brandLabels[brandId] ?? "the current business";

  return (
    <div className="build-view">
      <BuildHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <ExperimentPortfolio
        experiments={experiments}
        onSelectExperiment={setSelectedExperiment}
      />

      <ExperimentDetail
        experiment={selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
      />
    </div>
  );
}
