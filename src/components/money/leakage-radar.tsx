"use client";

import { Provenance } from "@/components/shared/provenance";
import { LeakageItem } from "@/domain/finance";

interface LeakageRadarProps {
  leakages: LeakageItem[];
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

function formatCategory(category: LeakageItem["category"]) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function LeakageRadar({
  leakages,
}: LeakageRadarProps) {
  const totalImpact = leakages.reduce(
    (total, item) => total + item.monthlyImpact,
    0
  );

  if (!leakages.length) {
    return null;
  }

  return (
    <section className="leakage-radar">
      <div className="leakage-radar__header">
        <div>
          <span className="money-eyebrow">
            MONEY LEAKAGE
          </span>

          <h2>
            Novo found {formatMoney(totalImpact)} worth
            investigating.
          </h2>

          <p>
            Ranked signals where current economics suggest money
            may be recoverable. These are investigation prompts,
            not booked savings.
          </p>
        </div>

        <div className="leakage-radar__summary">
          <span>MONTHLY SIGNAL</span>
          <strong>{formatMoney(totalImpact)}</strong>
          <small>{leakages.length} opportunities</small>
        </div>
      </div>

      <div className="leakage-radar__list">
        {leakages.map((item, index) => (
          <article
            className="leakage-item"
            key={item.id}
          >
            <div className="leakage-item__rank">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="leakage-item__body">
              <div className="leakage-item__meta">
                <span>{formatCategory(item.category)}</span>

                <Provenance type={item.evidence} />
              </div>

              <h3>{item.title}</h3>

              <p>{item.action}</p>

              <div className="leakage-item__confidence">
                <div className="leakage-item__confidence-label">
                  <span>Confidence</span>
                  <strong>
                    {Math.round(item.confidence * 100)}%
                  </strong>
                </div>

                <div className="leakage-item__confidence-track">
                  <span
                    style={{
                      width: `${item.confidence * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="leakage-item__impact">
              <strong>
                {formatMoney(item.monthlyImpact)}
              </strong>

              <span>potential / month</span>
            </div>

            <button
              className="leakage-item__action"
              type="button"
              aria-label={`Investigate ${item.title}`}
            >
              <span>Investigate</span>
              <span aria-hidden="true">→</span>
            </button>
          </article>
        ))}
      </div>

      <footer className="leakage-radar__footer">
        <span className="leakage-radar__footer-dot" />

        Portfolio-level diagnostic signals. Brand and location
        attribution will activate as transaction, procurement and
        channel feeds are connected.
      </footer>
    </section>
  );
}