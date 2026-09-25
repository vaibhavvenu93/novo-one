import { locations } from "@/data/novo-demo";
import type { BrandId, Health } from "@/domain/novo";
import type { OperationalException } from "@/domain/operations";
import { formatINR, formatNumber } from "@/services/novo";

interface OperationsLocationHealthProps {
  brandId: BrandId;
  locationId: string;
  exceptions: OperationalException[];
}

const brandLabels: Record<BrandId, string> = {
  novo: "Novo portfolio",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
};

const healthLabels: Record<Health, string> = {
  healthy: "Healthy",
  watch: "Watch",
  critical: "Critical",
};

function getHealthClass(health: Health) {
  return `operate-health operate-health--${health}`;
}

export function OperationsLocationHealth({
  brandId,
  locationId,
  exceptions,
}: OperationsLocationHealthProps) {
  const visibleLocations = locations.filter((location) => {
    const matchesBrand =
      brandId === "novo" || location.brandId === brandId;

    const matchesLocation =
      locationId === "all" || location.id === locationId;

    return matchesBrand && matchesLocation;
  });

  if (visibleLocations.length === 0) {
    return (
      <section className="operate-panel">
        <div className="operate-section-heading">
          <div>
            <span className="operate-eyebrow">
              LOCATION HEALTH
            </span>

            <h2>Operating network</h2>
          </div>
        </div>

        <div className="operate-empty-state">
          No operating locations are available for the current
          business context.
        </div>
      </section>
    );
  }

  return (
    <section className="operate-panel">
      <div className="operate-section-heading">
        <div>
          <span className="operate-eyebrow">
            LOCATION HEALTH
          </span>

          <h2>Operating network</h2>

          <p>
            Throughput, contribution, capacity and active
            operating exposure across the network.
          </p>
        </div>

        <span className="operate-section-count">
          {visibleLocations.length}{" "}
          {visibleLocations.length === 1
            ? "LOCATION"
            : "LOCATIONS"}
        </span>
      </div>

      <div className="operate-location-grid">
        {visibleLocations.map((location) => {
          const contributionMargin =
            location.revenue > 0
              ? (location.contribution / location.revenue) *
                100
              : 0;

          const locationExceptions = exceptions.filter(
            (exception) =>
              exception.locationId === location.id
          );

          const locationExposure =
            locationExceptions.reduce(
              (sum, exception) =>
                sum + exception.financialExposure,
              0
            );

          return (
            <article
              className="operate-location-card"
              key={location.id}
            >
              <div className="operate-location-card__top">
                <div>
                  <span className="operate-location-card__brand">
                    {brandLabels[location.brandId]}
                  </span>

                  <h3>{location.name}</h3>

                  <p>
                    {location.city} {"·"}{" "}
                    {location.type.replace("-", " ")}
                  </p>
                </div>

                <span
                  className={getHealthClass(
                    location.health
                  )}
                >
                  <span />
                  {healthLabels[location.health]}
                </span>
              </div>

              {locationExceptions.length > 0 && (
                <div className="operate-location-alert">
                  <div>
                    <span>ACTIVE EXCEPTIONS</span>

                    <strong>
                      {locationExceptions.length}
                    </strong>
                  </div>

                  <div>
                    <span>EXPOSURE</span>

                    <strong>
                      {formatINR(locationExposure)}
                    </strong>
                  </div>
                </div>
              )}

              <div className="operate-location-card__metrics">
                <div>
                  <span>REVENUE</span>

                  <strong>
                    {formatINR(location.revenue)}
                  </strong>
                </div>

                <div>
                  <span>ORDERS</span>

                  <strong>
                    {formatNumber(location.orders)}
                  </strong>
                </div>

                <div>
                  <span>CONTRIBUTION</span>

                  <strong>
                    {formatINR(location.contribution)}
                  </strong>
                </div>

                <div>
                  <span>CM</span>

                  <strong>
                    {contributionMargin.toFixed(1)}%
                  </strong>
                </div>
              </div>

              <div className="operate-capacity">
                <div className="operate-capacity__heading">
                  <span>CAPACITY UTILISATION</span>

                  <strong>
                    {location.capacityUtilisation !== undefined
                      ? `${location.capacityUtilisation}%`
                      : "—"}
                  </strong>
                </div>

                <div className="operate-capacity__track">
                  <div
                    className="operate-capacity__fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          location.capacityUtilisation ?? 0
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="operate-location-card__footer">
                <span>
                  Evidence {"·"}{" "}
                  {location.evidence.toUpperCase()}
                </span>

                <span>{location.id}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}