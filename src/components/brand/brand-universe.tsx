"use client";

import { Evidence } from "@/components/shared/evidence";
import { Stat } from "@/components/shared/stat";
import { useNovo } from "@/context/novo-context";
import { brands } from "@/data/novo-demo";
import type { BrandId } from "@/domain/novo";

export function BrandUniverse({
  brandId,
}: {
  brandId: BrandId;
}) {
  const { setBrandId } = useNovo();

  const brand = brands.find(
    (item) => item.id === brandId
  );

  if (!brand) {
    return null;
  }

  return (
    <div className="brand-universe">
      <button
        type="button"
        className="back-action"
        onClick={() => setBrandId("novo")}
      >
        ← Novo Group
      </button>

      <section className="brand-universe-hero">
        <div>
          <div className="brand-universe-title">
            <span
              className="brand-universe-mark"
              style={{ background: brand.accent }}
            >
              {brand.shortName}
            </span>

            <div>
              <p className="page-kicker">
                BRAND UNIVERSE
              </p>

              <h1>{brand.name}</h1>
            </div>
          </div>

          <p className="brand-universe-description">
            {brand.description}
          </p>
        </div>

        <Evidence level="demo" />
      </section>

      <section className="metric-strip">
        <Stat
          label="Revenue MTD"
          value={`₹${(
            brand.revenue / 100000
          ).toFixed(1)}L`}
          detail={`↑ ${brand.growth}%`}
        />

        <Stat
          label="Orders"
          value={brand.orders.toLocaleString("en-IN")}
          detail="Across active channels"
        />

        <Stat
          label="Contribution margin"
          value={`${brand.contributionMargin.toFixed(
            0
          )}%`}
          detail="Current demo model"
        />

        <Stat
          label="Growth"
          value={`${brand.growth}%`}
          detail="Current period"
        />
      </section>

      <div className="brand-universe-placeholder">
        <p className="section-kicker">
          BRAND OPERATING SYSTEM
        </p>

        <h2>
          Everything required to grow {brand.name}.
        </h2>

        <p>
          Revenue, P&amp;L, menu economics, Swiggy and
          Zomato performance, customers, social, campaigns,
          operations, locations, pipeline, experiments and
          autonomous agents will live here.
        </p>
      </div>
    </div>
  );
}