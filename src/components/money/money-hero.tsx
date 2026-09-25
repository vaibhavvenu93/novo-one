import { Provenance } from "@/components/shared/provenance";
import { FinanceSnapshot } from "@/domain/finance";

interface MoneyHeroProps {
  snapshot: FinanceSnapshot;
  contextLabel: string;
}

function money(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (absolute >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  if (absolute >= 1_000) {
    return `₹${(value / 1_000).toFixed(0)}K`;
  }

  return `₹${Math.round(value)}`;
}

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function MoneyHero({
  snapshot,
  contextLabel,
}: MoneyHeroProps) {
  const metrics = [
    {
      label: "NET REVENUE",
      value: money(snapshot.netRevenue),
      detail: `${snapshot.orders.toLocaleString("en-IN")} orders`,
    },
    {
      label: "CONTRIBUTION",
      value: money(snapshot.contribution),
      detail: `${percent(snapshot.contributionMargin)} margin`,
    },
    {
      label: "OPERATING CONTRIBUTION",
      value: money(snapshot.operatingContribution),
      detail: `${percent(snapshot.operatingContributionMargin)} margin`,
    },
    {
      label: "AOV",
      value: money(snapshot.aov),
      detail: "net revenue / order",
    },
  ];

  return (
    <section className="money-hero">
      <div className="money-hero__top">
        <div>
          <span className="money-eyebrow">MONEY</span>
          <h1>Know where every rupee goes.</h1>
          <p>
            Revenue is useful. Contribution is truth. Novo decomposes
            the economics underneath {contextLabel} so management can
            see where money is made, where it leaks and what to change.
          </p>
        </div>

        <div className="money-hero__evidence">
          <Provenance type="modelled" />
          <span>Demo operating model</span>
        </div>
      </div>

      <div className="money-metric-grid">
        {metrics.map((metric) => (
          <div className="money-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}