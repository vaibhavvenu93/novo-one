"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { BrandId } from "@/domain/novo";

type Period = "today" | "7d" | "30d" | "mtd";

interface NovoContextValue {
  brandId: BrandId;
  setBrandId: (brandId: BrandId) => void;
  locationId: string;
  setLocationId: (locationId: string) => void;
  period: Period;
  setPeriod: (period: Period) => void;
}

const NovoContext = createContext<NovoContextValue | null>(null);

export function NovoProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandId] = useState<BrandId>("novo");
  const [locationId, setLocationId] = useState("all");
  const [period, setPeriod] = useState<Period>("mtd");

  const value = useMemo(
    () => ({
      brandId,
      setBrandId: (next: BrandId) => {
        setBrandId(next);
        setLocationId("all");
      },
      locationId,
      setLocationId,
      period,
      setPeriod,
    }),
    [brandId, locationId, period]
  );

  return <NovoContext.Provider value={value}>{children}</NovoContext.Provider>;
}

export function useNovo() {
  const context = useContext(NovoContext);

  if (!context) {
    throw new Error("useNovo must be used inside NovoProvider");
  }

  return context;
}
