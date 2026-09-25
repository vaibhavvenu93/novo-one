"use client";

import { useNovo } from "@/context/novo-context";
import { brands } from "@/data/novo-demo";

export function BrandPulse() {
  const { setBrandId } = useNovo();

  return (
    <section className="today-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">PORTFOLIO</p>
          <h2>Your businesses</h2>
        </div>

        <span className="panel-subtle">
          Select a brand to enter its universe
        </span>
      </div>

      <div className="brand-pulse-grid">
        {brands.map((brand) => (
          <button
            type="button"
            className="brand-pulse-card"
            key={brand.id}
            onClick={() => setBrandId(brand.id)}
          >
            <div className="brand-pulse-top">
              <span
                className="brand-mark"
                style={{
                  background: brand.accent,
                }}
              >
                {brand.shortName}
              </span>

              <span className="brand-enter">↗</span>
            </div>

            <div>
              <strong className="brand-pulse-name">
                {brand.name}
              </strong>

              <p className="brand-pulse-description">
                {brand.description}
              </p>
            </div>

            <div className="brand-pulse-metrics">
              <div>
                <span>Revenue</span>
                <strong>
                  ₹{(brand.revenue / 100000).toFixed(1)}L
                </strong>
              </div>

              <div>
                <span>Orders</span>
                <strong>
                  {brand.orders.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>CM</span>
                <strong>
                  {brand.contributionMargin.toFixed(0)}%
                </strong>
              </div>
            </div>

            <div className="brand-pulse-footer">
              <span>↗ {brand.growth}%</span>
              <span>Demo data</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}