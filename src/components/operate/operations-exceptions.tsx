import { Provenance } from "@/components/shared/provenance";
import type {
  OperationalException,
  OperationalSeverity,
} from "@/domain/operations";
import { formatINR } from "@/services/novo";

interface OperationsExceptionsProps {
  exceptions: OperationalException[];
  onSelect: (exception: OperationalException) => void;
}

const severityLabels: Record<
  OperationalSeverity,
  string
> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function confidenceLabel(value: number) {
  return `${Math.round(value * 100)}%`;
}

function typeLabel(value: string) {
  return value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

export function OperationsExceptions({
  exceptions,
  onSelect,
}: OperationsExceptionsProps) {
  return (
    <section className="operate-section">
      <div className="operate-section__heading">
        <div>
          <p className="operate-eyebrow">
            EXCEPTION QUEUE
          </p>

          <h2>What needs intervention?</h2>

          <p className="operate-section__copy">
            Ranked operating problems by severity,
            financial exposure and confidence.
          </p>
        </div>

        <span>{exceptions.length} ACTIVE</span>
      </div>

      {exceptions.length === 0 ? (
        <div className="operate-empty-state">
          No operating exceptions are active in the
          current context.
        </div>
      ) : (
        <div className="operate-exception-list">
          {exceptions.map((exception, index) => (
            <article
              className="operate-exception"
              key={exception.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(exception)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  onSelect(exception);
                }
              }}
            >
              <div className="operate-exception__rank">
                <span>PRIORITY</span>

                <strong>
                  {String(index + 1).padStart(2, "0")}
                </strong>
              </div>

              <div className="operate-exception__main">
                <div className="operate-exception__meta">
                  <span
                    className={`operate-severity operate-severity--${exception.severity}`}
                  >
                    {
                      severityLabels[
                        exception.severity
                      ]
                    }
                  </span>

                  <span>
                    {typeLabel(exception.type)}
                  </span>

                  <Provenance
                    type={exception.evidence}
                  />
                </div>

                <h3>{exception.title}</h3>

                <p>{exception.detail}</p>

                <div className="operate-exception__action">
                  <span>NEXT ACTION</span>

                  <strong>
                    {exception.recommendedAction}
                  </strong>
                </div>
              </div>

              <div className="operate-exception__economics">
                <div>
                  <span>EXPOSURE</span>

                  <strong>
                    {formatINR(
                      exception.financialExposure
                    )}
                  </strong>
                </div>

                <div>
                  <span>CONFIDENCE</span>

                  <strong>
                    {confidenceLabel(
                      exception.confidence
                    )}
                  </strong>
                </div>

                <div>
                  <span>OWNER</span>

                  <strong>{exception.owner}</strong>
                </div>
              </div>

              <div className="operate-exception__open">
                <span aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}