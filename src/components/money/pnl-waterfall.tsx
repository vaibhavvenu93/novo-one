import { Provenance } from "@/components/shared/provenance";
import { SectionHeader } from "@/components/shared/section-header";
import { FinanceSnapshot } from "@/domain/finance";

interface PnlWaterfallProps {
  snapshot: FinanceSnapshot;
}

function money(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10_000_000) {
    return `₹${(absolute / 10_000_000).toFixed(2)}Cr`;
  }

  if (absolute >= 100_000) {
    return `₹${(absolute / 100_000).toFixed(1)}L`;
  }

  if (absolute >= 1_000) {
    return `₹${(absolute / 1_000).toFixed(0)}K`;
  }

  return `₹${Math.round(absolute)}`;
}

export function PnlWaterfall({
  snapshot,
}: PnlWaterfallProps) {
  const rows = [
    {
      label: "Gross sales",
      value: snapshot.grossSales,
      kind: "positive",
    },
    {
      label: "Discounts",
      value: snapshot.discounts,
      kind: "negative",
    },
    {
      label: "Refunds",
      value: snapshot.refunds,
      kind: "negative",
    },
    {
      label: "Net revenue",
      value: snapshot.netRevenue,
      kind: "total",
    },
    {
      label: "Food",
      value: snapshot.foodCost,
      kind: "negative",
    },
    {
      label: "Packaging",
      value: snapshot.packagingCost,
      kind: "negative",
    },
    {
      label: "Marketplace",
      value: snapshot.marketplaceCost,
      kind: "negative",
    },
    {
      label: "Payments",
      value: snapshot.paymentCost,
      kind: "negative",
    },
    {
      label: "Variable labour",
      value: snapshot.variableLabourCost,
      kind: "negative",
    },
    {
      label: "Delivery",
      value: snapshot.deliveryCost,
      kind: "negative",
    },
    {
      label: "Other variable",
      value: snapshot.otherVariableCost,
      kind: "negative",
    },
    {
      label: "Contribution",
      value: snapshot.contribution,
      kind: "total",
    },
    {
      label: "Operating costs",
      value: snapshot.operatingCosts,
      kind: "negative",
    },
    {
      label: "Operating contribution",
      value: snapshot.operatingContribution,
      kind: "final",
    },
  ];

  const max = Math.max(
    ...rows.map((row) => Math.abs(row.value)),
    1
  );

  return (
    <section className="money-section">
      <SectionHeader
        eyebrow="P&L"
        title="Where the money goes"
        meta={`${snapshot.contributionMargin.toFixed(1)}% CM`}
        copy="A contribution view of the operating model, from gross sales down to operating contribution."
      />

      <div className="pnl-waterfall">
        {rows.map((row) => {
          const width = Math.max(
            2,
            (Math.abs(row.value) / max) * 100
          );

          return (
            <div
              className={`pnl-row pnl-row--${row.kind}`}
              key={row.label}
            >
              <span className="pnl-row__label">
                {row.label}
              </span>

              <div className="pnl-row__track">
                <span
                  className="pnl-row__bar"
                  style={{ width: `${width}%` }}
                />
              </div>

              <strong className="pnl-row__value">
                {row.kind === "negative" ? "−" : ""}
                {money(row.value)}
              </strong>
            </div>
          );
        })}
      </div>

      <div className="money-source-note">
        <Provenance type="modelled" />
        <span>
          Illustrative economics. Replace with accounting,
          marketplace, POS and procurement feeds.
        </span>
      </div>
    </section>
  );
}