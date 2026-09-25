"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { BrandId } from "@/domain/novo";

export type Period = "today" | "7d" | "30d" | "mtd";

export type NovoView =
  | "today"
  | "money"
  | "grow"
  | "operate"
  | "build"
  | "50cr"
  | "90days"
  | "memory";

export interface NovoNavigationTarget {
  view: NovoView;
  sourceId?: string;
}

interface NovoContextValue {
  brandId: BrandId;
  setBrandId: (brandId: BrandId) => void;

  locationId: string;
  setLocationId: (locationId: string) => void;

  period: Period;
  setPeriod: (period: Period) => void;

  view: NovoView;
  setView: (view: NovoView) => void;

  navigationTarget: NovoNavigationTarget | null;

  openIntelligence: (
    view: NovoView,
    sourceId?: string
  ) => void;

  clearNavigationTarget: () => void;

  buildOpportunityId: string | null;

  sendOpportunityToBuild: (
    opportunityId: string
  ) => void;

  clearBuildOpportunity: () => void;
}

const NovoContext =
  createContext<NovoContextValue | null>(null);

export function NovoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [brandIdState, setBrandIdState] =
    useState<BrandId>("novo");

  const [locationId, setLocationId] =
    useState("all");

  const [period, setPeriod] =
    useState<Period>("mtd");

  const [view, setViewState] =
    useState<NovoView>("today");

  const [
    navigationTarget,
    setNavigationTarget,
  ] = useState<NovoNavigationTarget | null>(
    null
  );

  const [
    buildOpportunityId,
    setBuildOpportunityId,
  ] = useState<string | null>(null);

  const setView = useCallback(
    (nextView: NovoView) => {
      setNavigationTarget(null);
      setViewState(nextView);
    },
    []
  );

  const setBrandId = useCallback(
    (nextBrandId: BrandId) => {
      setBrandIdState(nextBrandId);
      setLocationId("all");

      setNavigationTarget(null);
      setBuildOpportunityId(null);

      setViewState("today");
    },
    []
  );

  const openIntelligence = useCallback(
    (
      nextView: NovoView,
      sourceId?: string
    ) => {
      setNavigationTarget({
        view: nextView,
        sourceId,
      });

      setViewState(nextView);
    },
    []
  );

  const clearNavigationTarget =
    useCallback(() => {
      setNavigationTarget(null);
    }, []);

  const sendOpportunityToBuild =
    useCallback(
      (opportunityId: string) => {
        setNavigationTarget(null);

        setBuildOpportunityId(
          opportunityId
        );

        setViewState("build");
      },
      []
    );

  const clearBuildOpportunity =
    useCallback(() => {
      setBuildOpportunityId(null);
    }, []);

  const value =
    useMemo<NovoContextValue>(
      () => ({
        brandId: brandIdState,
        setBrandId,

        locationId,
        setLocationId,

        period,
        setPeriod,

        view,
        setView,

        navigationTarget,
        openIntelligence,
        clearNavigationTarget,

        buildOpportunityId,
        sendOpportunityToBuild,
        clearBuildOpportunity,
      }),
      [
        brandIdState,
        setBrandId,
        locationId,
        period,
        view,
        setView,
        navigationTarget,
        openIntelligence,
        clearNavigationTarget,
        buildOpportunityId,
        sendOpportunityToBuild,
        clearBuildOpportunity,
      ]
    );

  return (
    <NovoContext.Provider value={value}>
      {children}
    </NovoContext.Provider>
  );
}

export function useNovo() {
  const context = useContext(NovoContext);

  if (!context) {
    throw new Error(
      "useNovo must be used inside NovoProvider"
    );
  }

  return context;
}