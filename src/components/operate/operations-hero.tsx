import type { OperationsSnapshot } from "@/domain/operations";
import { formatINR } from "@/services/novo";

interface OperationsHeroProps {
  snapshot: OperationsSnapshot;
  contextLabel: string;
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function OperationsHero({
  snapshot,
  contextLabel,
}: OperationsHeroProps) {
  return (
    <section className="operations-hero">
      <div className="operations-hero__heading">
        <div>
          <p className="operate-eyebrow">
            OPERATING INTELLIGENCE
          </p>

          <h1>
            Where is the business
            <br />
            breaking right now?
          </h1>

          <p className="operations-hero__copy">
            Detect operating pressure across kitchens,
            schools, routes, inventory, fulfilment and
            quality before it becomes a larger financial
            problem.
          </p>
        </div>

        <div className="operations-hero__context">
          <span>ACTIVE CONTEXT</span>
          <strong>{contextLabel}</strong>
        </div>
      </div>

      <div className="operations-hero__metrics">
        <article>
          <span>EXCEPTIONS</span>
          <strong>{snapshot.exceptionCount}</strong>
          <small>
            {snapshot.criticalCount} critical {"·"}{" "}
{snapshot.highCount} high
          </small>
        </article>

        <article>
          <span>FINANCIAL EXPOSURE</span>
          <strong>
            {formatINR(snapshot.financialExposure)}
          </strong>
          <small>
            Value currently exposed to operating issues
          </small>
        </article>

        <article>
          <span>LOCATIONS AT RISK</span>
          <strong>{snapshot.locationsAtRisk}</strong>
          <small>
            Locations with active operating exceptions
          </small>
        </article>

        <article>
          <span>AVG. CONFIDENCE</span>
          <strong>
            {formatConfidence(snapshot.averageConfidence)}
          </strong>
          <small>
            Confidence across detected exceptions
          </small>
        </article>
      </div>

      <div className="operations-hero__signals">
        <div>
          <span>CAPACITY PRESSURE</span>
          <strong>{snapshot.capacityPressureCount}</strong>
        </div>

        <div>
          <span>UNDER-UTILISED</span>
          <strong>{snapshot.underUtilisedCount}</strong>
        </div>

        <div>
          <span>SIGNALS WATCHED</span>
          <strong>{snapshot.signalCount}</strong>
        </div>
      </div>
    </section>
  );
}