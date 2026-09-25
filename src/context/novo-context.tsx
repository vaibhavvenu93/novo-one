"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { BrandId } from "@/domain/novo";

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

interface NovoContextValue {
  brandId: BrandId;
  setBrandId: (brandId: BrandId) => void;

  locationId: string;
  setLocationId: (locationId: string) => void;

  period: Period;
  setPeriod: (period: Period) => void;

  view: NovoView;
  setView: (view: NovoView) => void;
}

const NovoContext = createContext<NovoContextValue | null>(null);

export function NovoProvider({ children }: { children: ReactNode }) {
  const [brandIdState, setBrandIdState] = useState<BrandId>("novo");
  const [locationId, setLocationId] = useState("all");
  const [period, setPeriod] = useState<Period>("mtd");
  const [view, setView] = useState<NovoView>("today");

  const setBrandId = (nextBrandId: BrandId) => {
    setBrandIdState(nextBrandId);

    // Changing business context should reset location and
    // return the operator to the business overview.
    setLocationId("all");
    setView("today");
  };

  const value = useMemo<NovoContextValue>(
    () => ({
      brandId: brandIdState,
      setBrandId,
      locationId,
      setLocationId,
      period,
      setPeriod,
      view,
      setView,
    }),
    [brandIdState, locationId, period, view]
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
    throw new Error("useNovo must be used inside NovoProvider");
  }

  return context;
}