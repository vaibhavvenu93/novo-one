import {
  locations,
} from "@/data/novo-demo";

import {
  operationalSignals,
} from "@/data/operations-demo";

import type {
  OperationalException,
  OperationalLocationHealth,
  OperationalSeverity,
  OperationalSignal,
  OperationsFilter,
  OperationsSnapshot,
} from "@/domain/operations";

import type {
  Health,
} from "@/domain/novo";

function clampConfidence(value: number) {
  return Math.max(0, Math.min(1, value));
}

function severityWeight(
  severity: OperationalSeverity
) {
  switch (severity) {
    case "critical":
      return 4;

    case "high":
      return 3;

    case "medium":
      return 2;

    case "low":
      return 1;
  }
}

function severityFromExposure(
  exposure: number
): OperationalSeverity {
  if (exposure >= 750000) {
    return "critical";
  }

  if (exposure >= 300000) {
    return "high";
  }

  if (exposure >= 100000) {
    return "medium";
  }

  return "low";
}

function priorityScore(
  severity: OperationalSeverity,
  exposure: number,
  confidence: number
) {
  const severityComponent =
    severityWeight(severity) * 25;

  const exposureComponent =
    Math.min(exposure / 10000, 100);

  const confidenceComponent =
    clampConfidence(confidence) * 100;

  return Number(
    (
      severityComponent * 0.4 +
      exposureComponent * 0.35 +
      confidenceComponent * 0.25
    ).toFixed(2)
  );
}

function exceptionFromSignal(
  signal: OperationalSignal
): OperationalException | undefined {
  let type: OperationalException["type"];
  let title: string;
  let recommendedAction: string;
  let owner = "Operations";

  if (
    signal.type === "capacity" &&
    signal.value >= 85
  ) {
    type = "capacity-pressure";
    title = `${signal.label}: capacity pressure`;
    recommendedAction =
      "Review peak production constraints, staffing and demand shaping before adding further load.";
  } else if (
    signal.type === "capacity" &&
    signal.value <= 50
  ) {
    type = "under-utilisation";
    title = `${signal.label}: capacity available`;
    recommendedAction =
      "Build incremental demand against existing capacity before adding fixed infrastructure.";
    owner = "Revenue";
  } else if (
    signal.type === "demand" &&
    signal.direction === "negative"
  ) {
    type = "demand-production-mismatch";
    title = `${signal.label}: demand gap`;
    recommendedAction =
      "Match available production capacity with contracted, marketplace or local demand.";
    owner = "Revenue";
  } else if (
    signal.type === "fulfilment" &&
    signal.value < 95
  ) {
    type = "fulfilment-deterioration";
    title = `${signal.label}: fulfilment deterioration`;
    recommendedAction =
      "Trace order failures by shift, channel and root cause before the next operating cycle.";
  } else if (
    signal.type === "quality" &&
    signal.direction === "negative"
  ) {
    type = "quality-deterioration";
    title = `${signal.label}: quality deterioration`;
    recommendedAction =
      "Open a root-cause review and isolate the operating source of the quality signal.";
  } else if (
    signal.type === "inventory" &&
    signal.direction === "negative"
  ) {
    type = "inventory-risk";
    title = `${signal.label}: inventory risk`;
    recommendedAction =
      "Reconcile forecast, purchasing and actual consumption before the next procurement cycle.";
    owner = "Supply";
  } else if (
    signal.type === "cost" &&
    signal.direction === "negative"
  ) {
    type = "cost-drift";
    title = `${signal.label}: cost drift`;
    recommendedAction =
      "Audit ingredient mix, purchasing variance, wastage and menu contribution.";
    owner = "Operations";
  } else if (
    signal.type === "route" &&
    signal.value >= 90
  ) {
    type = "route-risk";
    title = `${signal.label}: route pressure`;
    recommendedAction =
      "Rebalance route load before adding additional school volume.";
  } else {
    return undefined;
  }

  const severity =
    severityFromExposure(
      signal.financialExposure
    );

  return {
    id: `exception-${signal.id}`,

    brandId: signal.brandId,
    locationId: signal.locationId,

    type,
    severity,

    title,
    detail: signal.description,

    financialExposure:
      signal.financialExposure,

    confidence:
      clampConfidence(signal.confidence),

    evidence: signal.evidence,

    owner,
    recommendedAction,

    sourceSignalIds: [signal.id],

    priorityScore: priorityScore(
      severity,
      signal.financialExposure,
      signal.confidence
    ),
  };
}

export function getOperationalSignals(
  filter: OperationsFilter = {}
) {
  return operationalSignals.filter(
    (signal) => {
      if (
        filter.brandId &&
        signal.brandId !== filter.brandId
      ) {
        return false;
      }

      if (
        filter.locationId &&
        signal.locationId !== filter.locationId
      ) {
        return false;
      }

      if (
        filter.type &&
        signal.type !== filter.type
      ) {
        return false;
      }

      return true;
    }
  );
}

export function getOperationalExceptions(
  filter: OperationsFilter = {}
) {
  return getOperationalSignals(filter)
    .map(exceptionFromSignal)
    .filter(
      (
        exception
      ): exception is OperationalException =>
        Boolean(exception)
    )
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    );
}

export function getOperationalException(
  id: string
) {
  return getOperationalExceptions().find(
    (exception) => exception.id === id
  );
}

export function getLocationOperationalHealth(
  locationId: string
): OperationalLocationHealth | undefined {
  const location = locations.find(
    (item) => item.id === locationId
  );

  if (!location) {
    return undefined;
  }

  const exceptions =
    getOperationalExceptions({
      locationId,
    });

  const financialExposure =
    exceptions.reduce(
      (sum, exception) =>
        sum + exception.financialExposure,
      0
    );

  const severityOrder:
    OperationalSeverity[] = [
      "critical",
      "high",
      "medium",
      "low",
    ];

  const highestSeverity =
    severityOrder.find((severity) =>
      exceptions.some(
        (exception) =>
          exception.severity === severity
      )
    );

  let health: Health = "healthy";

  if (
    highestSeverity === "critical" ||
    highestSeverity === "high"
  ) {
    health = "critical";
  } else if (
    highestSeverity === "medium" ||
    highestSeverity === "low"
  ) {
    health = "watch";
  }

  return {
    locationId: location.id,
    brandId: location.brandId,

    health,

    capacityUtilisation:
      location.capacityUtilisation,

    exceptionCount: exceptions.length,
    financialExposure,

    highestSeverity,
  };
}

export function getOperationsSnapshot(
  filter: OperationsFilter = {}
): OperationsSnapshot {
  const signals =
    getOperationalSignals(filter);

  const exceptions =
    getOperationalExceptions(filter);

  const financialExposure =
    exceptions.reduce(
      (sum, exception) =>
        sum + exception.financialExposure,
      0
    );

  const averageConfidence =
    exceptions.length === 0
      ? 0
      : exceptions.reduce(
          (sum, exception) =>
            sum + exception.confidence,
          0
        ) / exceptions.length;

  const locationsAtRisk =
    new Set(
      exceptions
        .map(
          (exception) =>
            exception.locationId
        )
        .filter(
          (
            locationId
          ): locationId is string =>
            Boolean(locationId)
        )
    ).size;

  return {
    signalCount: signals.length,
    exceptionCount: exceptions.length,

    criticalCount:
      exceptions.filter(
        (exception) =>
          exception.severity === "critical"
      ).length,

    highCount:
      exceptions.filter(
        (exception) =>
          exception.severity === "high"
      ).length,

    financialExposure,

    locationsAtRisk,

    averageConfidence,

    capacityPressureCount:
      exceptions.filter(
        (exception) =>
          exception.type ===
          "capacity-pressure"
      ).length,

    underUtilisedCount:
      exceptions.filter(
        (exception) =>
          exception.type ===
          "under-utilisation"
      ).length,

    exceptions,
  };
}
