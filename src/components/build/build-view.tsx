"use client";

import {
  useMemo,
  useState,
} from "react";

import { BuildHero } from "@/components/build/build-hero";
import { ExperimentDetail } from "@/components/build/experiment-detail";
import { ExperimentPortfolio } from "@/components/build/experiment-portfolio";

import { useNovo } from "@/context/novo-context";
import type { Experiment } from "@/domain/build";

import {
  createExperimentDraftFromOpportunityId,
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
  const {
    brandId,
    locationId,
    buildOpportunityId,
    clearBuildOpportunity,
    navigationTarget,
    clearNavigationTarget,
  } = useNovo();

  const [
    selectedExperiment,
    setSelectedExperiment,
  ] = useState<Experiment | null>(null);

  const filter = useMemo(
    () => ({
      brandId,
      locationId,
    }),
    [brandId, locationId]
  );

  const snapshot =
    getBuildSnapshot(filter);

  const experiments =
    getExperiments(filter);

  const contextLabel =
    brandLabels[brandId] ??
    "the current business";

  const incomingExperiment =
    useMemo<Experiment | null>(() => {
      if (!buildOpportunityId) {
        return null;
      }

      const draft =
        createExperimentDraftFromOpportunityId(
          buildOpportunityId
        );

      if (!draft) {
        return null;
      }

      return {
        ...draft,
        id: `draft-${draft.sourceOpportunityId}`,
      };
    }, [buildOpportunityId]);

  const focusedExperiment =
    navigationTarget?.view === "build" &&
    navigationTarget.sourceId
      ? experiments.find(
          (experiment) =>
            experiment.id ===
            navigationTarget.sourceId
        ) ?? null
      : null;

  const activeExperiment =
    incomingExperiment ??
    focusedExperiment ??
    selectedExperiment;

  const handleCloseExperiment = () => {
    if (buildOpportunityId) {
      clearBuildOpportunity();
    }

    clearNavigationTarget();
    setSelectedExperiment(null);
  };

  const handleSelectExperiment = (
    experiment: Experiment
  ) => {
    if (buildOpportunityId) {
      clearBuildOpportunity();
    }

    clearNavigationTarget();
    setSelectedExperiment(experiment);
  };

  return (
    <div className="build-view">
      <BuildHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <ExperimentPortfolio
        experiments={experiments}
        onSelectExperiment={
          handleSelectExperiment
        }
      />

      <ExperimentDetail
        experiment={activeExperiment}
        onClose={handleCloseExperiment}
      />
    </div>
  );
}