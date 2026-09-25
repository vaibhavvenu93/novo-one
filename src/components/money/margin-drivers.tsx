"use client";

import { ArrowRight } from "lucide-react";

import { MarginDriver } from "@/domain/finance";

interface MarginDriversProps {
  drivers: MarginDriver[];
}

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `₹${Math.round(value / 1_000)}K`;
  }

  return `₹${Math.round(value)}`;
}

export function MarginDrivers({
  drivers,
}: MarginDriversProps) {
  const visibleDrivers = drivers.slice(0, 5);

  if (!visibleDrivers.length) {
    return null;
  }

  const maxImpact = Math.max(
    ...visibleDrivers.map((driver) => driver.impact)
  );

  return (
    <section className="money-section margin-drivers-section">
      <div className="money-section-heading">
        <div>
          <span className="money-eyebrow">
            MARGIN INTELLIGENCE
          </span>

          <h2>What is consuming margin?</h2>

          <p>
            Novo ranks the largest economic pressures in the
            current business context.
          </p>
        </div>

        <span className="margin-driver-count">
          {visibleDrivers.length} DRIVERS
        </span>
      </div>

      <div className="margin-driver-list">
        {visibleDrivers.map((driver, index) => {
          const width = maxImpact
            ? (driver.impact / maxImpact) * 100
            : 0;

          return (
            <button
              type="button"
              className="margin-driver-row"
              key={driver.id}
            >
              <span className="margin-driver-rank">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="margin-driver-main">
                <div className="margin-driver-title">
                  <strong>{driver.label}</strong>

                  <span>
                    {driver.impactPp.toFixed(1)}pp
                  </span>
                </div>

                <div className="margin-driver-track">
                  <span
                    className="margin-driver-bar"
                    style={{
                      width: `${Math.max(width, 2)}%`,
                    }}
                  />
                </div>

                <p>{driver.explanation}</p>
              </div>

              <div className="margin-driver-impact">
                <strong>
                  {formatMoney(driver.impact)}
                </strong>

                <span>economic weight</span>
              </div>

              <ArrowRight size={14} />
            </button>
          );
        })}
      </div>

      <div className="margin-driver-foot">
        <span className="margin-driver-dot" />

        Modelled from the current contribution structure.
        Connect accounting and procurement feeds to replace
        assumptions with observed drivers.
      </div>
    </section>
  );
}