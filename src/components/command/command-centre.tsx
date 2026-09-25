"use client";

import { useNovo } from "@/context/novo-context";
import { TodayView } from "@/components/today/today-view";
import { BrandUniverse } from "@/components/brand/brand-universe";

export function CommandCentre() {
  const { brandId } = useNovo();

  if (brandId !== "novo") {
    return <BrandUniverse brandId={brandId} />;
  }

  return <TodayView />;
}