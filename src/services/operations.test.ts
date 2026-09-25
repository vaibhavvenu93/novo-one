import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getLocationOperationalHealth,
  getOperationalException,
  getOperationalExceptions,
  getOperationalSignals,
  getOperationsSnapshot,
} from "@/services/operations";

describe("operations intelligence", () => {
  it("returns operational signals", () => {
    const signals =
      getOperationalSignals();

    expect(signals.length)
      .toBeGreaterThan(0);
  });

  it("filters signals by brand", () => {
    const signals =
      getOperationalSignals({
        brandId: "pressmans",
      });

    expect(
      signals.every(
        (signal) =>
          signal.brandId === "pressmans"
      )
    ).toBe(true);
  });

  it("filters signals by location", () => {
    const signals =
      getOperationalSignals({
        locationId: "pm-varthur",
      });

    expect(
      signals.every(
        (signal) =>
          signal.locationId ===
          "pm-varthur"
      )
    ).toBe(true);
  });

  it("detects under-utilised capacity", () => {
    const exceptions =
      getOperationalExceptions({
        locationId: "pm-varthur",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "under-utilisation"
      )
    ).toBe(true);
  });

  it("recognises Varthur under-utilisation as a revenue intervention", () => {
    const exception =
      getOperationalException(
        "exception-ops-pm-varthur-capacity"
      );

    expect(exception).toBeDefined();

    expect(exception?.type)
      .toBe("under-utilisation");

    expect(exception?.owner)
      .toBe("Revenue");

    expect(
      exception?.recommendedAction
    ).toContain("demand");
  });

  it("detects demand and production mismatch", () => {
    const exceptions =
      getOperationalExceptions({
        locationId: "pm-varthur",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "demand-production-mismatch"
      )
    ).toBe(true);
  });

  it("detects Banaswadi cost drift", () => {
    const exceptions =
      getOperationalExceptions({
        locationId: "kt-banaswadi",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "cost-drift"
      )
    ).toBe(true);
  });

  it("detects Banaswadi quality deterioration", () => {
    const exceptions =
      getOperationalExceptions({
        locationId: "kt-banaswadi",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "quality-deterioration"
      )
    ).toBe(true);
  });

  it("detects inventory risk", () => {
    const exceptions =
      getOperationalExceptions({
        brandId: "monkeybox",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "inventory-risk"
      )
    ).toBe(true);
  });

  it("does not flag healthy capacity as pressure", () => {
    const exceptions =
      getOperationalExceptions({
        locationId: "kt-hsr",
      });

    expect(
      exceptions.some(
        (exception) =>
          exception.type ===
          "capacity-pressure"
      )
    ).toBe(false);
  });

  it("preserves evidence provenance", () => {
    const signals =
      getOperationalSignals({
        locationId: "pm-varthur",
      });

    const exceptions =
      getOperationalExceptions({
        locationId: "pm-varthur",
      });

    const source =
      signals.find(
        (signal) =>
          signal.id ===
          "ops-pm-varthur-capacity"
      );

    const exception =
      exceptions.find(
        (item) =>
          item.id ===
          "exception-ops-pm-varthur-capacity"
      );

    expect(exception?.evidence)
      .toBe(source?.evidence);
  });

  it("ranks exceptions by priority", () => {
    const exceptions =
      getOperationalExceptions();

    for (
      let index = 1;
      index < exceptions.length;
      index += 1
    ) {
      expect(
        exceptions[index - 1]
          .priorityScore
      ).toBeGreaterThanOrEqual(
        exceptions[index].priorityScore
      );
    }
  });

  it("calculates location operating health", () => {
    const health =
      getLocationOperationalHealth(
        "kt-banaswadi"
      );

    expect(health).toBeDefined();

    expect(health?.exceptionCount)
      .toBeGreaterThan(0);

    expect(health?.financialExposure)
      .toBeGreaterThan(0);
  });

  it("keeps healthy locations healthy when no exception exists", () => {
    const health =
      getLocationOperationalHealth(
        "kt-hsr"
      );

    expect(health?.health)
      .toBe("healthy");
  });

  it("calculates business exposure", () => {
    const snapshot =
      getOperationsSnapshot();

    expect(snapshot.financialExposure)
      .toBeGreaterThan(0);

    expect(snapshot.exceptionCount)
      .toBeGreaterThan(0);
  });

  it("produces a portfolio operating snapshot", () => {
    const snapshot =
      getOperationsSnapshot();

    expect(snapshot.signalCount)
      .toBeGreaterThan(0);

    expect(snapshot.averageConfidence)
      .toBeGreaterThanOrEqual(0);

    expect(snapshot.averageConfidence)
      .toBeLessThanOrEqual(1);

    expect(snapshot.underUtilisedCount)
      .toBeGreaterThan(0);

    expect(
      Array.isArray(snapshot.exceptions)
    ).toBe(true);
  });
});
