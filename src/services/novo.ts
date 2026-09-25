import {
  attentionItems,
  brands,
  channels,
  experiments,
  locations,
  opportunities,
} from "@/data/novo-demo";
import { BrandId, PortfolioSnapshot } from "@/domain/novo";

export function getPortfolioSnapshot(): PortfolioSnapshot {
  const revenue = brands.reduce((sum, brand) => sum + brand.revenue, 0);
  const orders = brands.reduce((sum, brand) => sum + brand.orders, 0);
  const contribution = brands.reduce(
    (sum, brand) => sum + brand.contribution,
    0
  );

  return {
    revenue,
    orders,
    contribution,
    contributionMargin: revenue ? (contribution / revenue) * 100 : 0,
    growth:
      brands.reduce((sum, brand) => sum + brand.growth * brand.revenue, 0) /
      revenue,
    opportunityValue: opportunities.reduce(
      (sum, opportunity) => sum + opportunity.annualImpact,
      0
    ),
    brands,
    attention: attentionItems,
    opportunities,
  };
}

export function getBrandUniverse(brandId: BrandId) {
  const brand =
    brandId === "novo"
      ? undefined
      : brands.find((item) => item.id === brandId);

  return {
    brand,
    channels: channels[brandId] ?? [],
    locations: locations.filter((item) => item.brandId === brandId),
    attention: attentionItems.filter((item) => item.brandId === brandId),
    opportunities: opportunities.filter((item) => item.brandId === brandId),
    experiments: experiments.filter((item) => item.brandId === brandId),
  };
}

export function formatINR(value: number) {
  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }

  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (Math.abs(value) >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }

  return `₹${Math.round(value)}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

export function getSeverityScore(severity: "high" | "medium" | "low") {
  return severity === "high" ? 3 : severity === "medium" ? 2 : 1;
}
