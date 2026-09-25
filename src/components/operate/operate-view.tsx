"use client";

import { useState } from "react";

import { OperationsExceptions } from "@/components/operate/operations-exceptions";
import { OperationsHero } from "@/components/operate/operations-hero";
import { OperationsInvestigation } from "@/components/operate/operations-investigation";
import { OperationsLocationHealth } from "@/components/operate/operations-location-health";

import { useNovo } from "@/context/novo-context";
import type { OperationalException } from "@/domain/operations";
import { getOperationsSnapshot } from "@/services/operations";

const brandLabels = {
  novo: "Novo portfolio",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
} as const;

export function OperateView() {
  const {
    brandId,
    locationId,
    navigationTarget,
    clearNavigationTarget,
  } = useNovo();

  const [
    selectedException,
    setSelectedException,
  ] = useState<OperationalException | null>(
    null
  );

  const filter = {
    brandId:
      brandId === "novo"
        ? undefined
        : brandId,

    locationId:
      locationId === "all"
        ? undefined
        : locationId,
  };

  const snapshot =
    getOperationsSnapshot(filter);

  const contextLabel =
    brandLabels[brandId] ??
    "Current business";

  const focusedException =
    navigationTarget?.view === "operate" &&
    navigationTarget.sourceId
      ? snapshot.exceptions.find(
          (exception) =>
            exception.id ===
            navigationTarget.sourceId
        ) ?? null
      : null;

  const activeException =
    focusedException ??
    selectedException;

  const handleSelectException = (
    exception: OperationalException
  ) => {
    clearNavigationTarget();
    setSelectedException(exception);
  };

  const handleCloseInvestigation = () => {
    clearNavigationTarget();
    setSelectedException(null);
  };

  return (
    <div className="operate-view">
      <OperationsHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <OperationsExceptions
        exceptions={snapshot.exceptions}
        onSelect={
          handleSelectException
        }
      />

      <OperationsLocationHealth
        brandId={brandId}
        locationId={locationId}
        exceptions={snapshot.exceptions}
      />

      <OperationsInvestigation
        exception={activeException}
        onClose={
          handleCloseInvestigation
        }
      />
    </div>
  );
}