import { GrowthLaneSummary } from "@/domain/growth";

interface GrowthLanesProps {
  lanes: GrowthLaneSummary[];
}

const laneLabels = {
  schools: "Schools",
  corporate: "Corporate",
  delivery: "Delivery",
  "existing-account": "Existing accounts",
  location: "Locations",
  "new-business": "New business",
} as const;

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  return `₹${(value / 100_000).toFixed(1)}L`;
}

export function GrowthLanes({
  lanes,
}: GrowthLanesProps) {
  const maxWeighted = Math.max(
    ...lanes.map((lane) => lane.weightedRevenuePotential),
    1
  );

  return (
    <section className="growth-section">
      <div className="growth-section-header">
        <div>
          <span className="grow-eyebrow">
            GROWTH SURFACES
          </span>

          <h2>Where the opportunity sits</h2>

          <p>
            Compare growth lanes by confidence-weighted
            revenue rather than headline potential alone.
          </p>
        </div>

        <span className="growth-section-meta">
          {lanes.length} ACTIVE LANES
        </span>
      </div>

      <div className="growth-lanes">
        {lanes.map((lane, index) => {
          const width =
            (lane.weightedRevenuePotential / maxWeighted) *
            100;

          return (
            <div className="growth-lane" key={lane.lane}>
              <span className="growth-lane__rank">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="growth-lane__main">
                <div className="growth-lane__title">
                  <strong>{laneLabels[lane.lane]}</strong>

                  <span>
                    {lane.opportunityCount}{" "}
                    {lane.opportunityCount === 1
                      ? "opportunity"
                      : "opportunities"}
                  </span>
                </div>

                <div className="growth-lane__track">
                  <span
                    style={{
                      width: `${Math.max(width, 4)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="growth-lane__value">
                <strong>
                  {formatMoney(
                    lane.weightedRevenuePotential
                  )}
                </strong>

                <span>weighted</span>
              </div>

              <div className="growth-lane__confidence">
                <strong>
                  {Math.round(lane.averageConfidence * 100)}%
                </strong>

                <span>confidence</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}