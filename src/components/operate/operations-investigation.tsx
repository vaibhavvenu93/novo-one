"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import type { OperationalException } from "@/domain/operations";
import { locations } from "@/data/novo-demo";
import { formatINR } from "@/services/novo";

interface OperationsInvestigationProps {
  exception: OperationalException | null;
  onClose: () => void;
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatExceptionType(value: string) {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export function OperationsInvestigation({
  exception,
  onClose,
}: OperationsInvestigationProps) {
  useEffect(() => {
    if (!exception) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [exception, onClose]);

  if (!exception) {
    return null;
  }

  const location = exception.locationId
    ? locations.find(
        (item) => item.id === exception.locationId
      )
    : undefined;

  return (
    <div
      className="operate-drawer-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <aside
        className="operate-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={exception.title}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="operate-drawer__header">
          <div className="operate-drawer__header-meta">
            <span className="operate-eyebrow">
              EXCEPTION INVESTIGATION
            </span>

            <Provenance type={exception.evidence} />
          </div>

          <button
            type="button"
            className="operate-drawer__close"
            onClick={onClose}
            aria-label="Close investigation"
          >
            <X size={17} />
          </button>
        </header>

        <div className="operate-drawer__body">
          <section className="operate-drawer__hero">
            <div className="operate-drawer__badges">
              <span
                className={`operate-severity operate-severity--${exception.severity}`}
              >
                {exception.severity}
              </span>

              <span>
                {formatExceptionType(exception.type)}
              </span>
            </div>

            <h2>{exception.title}</h2>

            <p>{exception.detail}</p>
          </section>

          <section className="operate-drawer__metrics">
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
                {formatConfidence(
                  exception.confidence
                )}
              </strong>
            </div>

            <div>
              <span>PRIORITY SCORE</span>
              <strong>
                {exception.priorityScore.toFixed(1)}
              </strong>
            </div>

            <div>
              <span>OWNER</span>
              <strong>{exception.owner}</strong>
            </div>
          </section>

          <section className="operate-drawer__section">
            <span className="operate-drawer__label">
              WHAT NOVO OBSERVED
            </span>

            <h3>{exception.title}</h3>

            <p>{exception.detail}</p>
          </section>

          <section className="operate-drawer__section">
            <span className="operate-drawer__label">
              AFFECTED OPERATION
            </span>

            {location ? (
              <div className="operate-drawer__location">
                <div>
                  <span>LOCATION</span>
                  <strong>{location.name}</strong>
                </div>

                <div>
                  <span>TYPE</span>
                  <strong>
                    {location.type}
                  </strong>
                </div>

                <div>
                  <span>CAPACITY</span>
                  <strong>
                    {location.capacityUtilisation}%
                  </strong>
                </div>
              </div>
            ) : (
              <p>
                This exception currently applies at
                portfolio or cross-location level.
              </p>
            )}
          </section>

          <section className="operate-drawer__section">
            <span className="operate-drawer__label">
              EVIDENCE
            </span>

            <div className="operate-evidence">
              <div>
                <span>SOURCE SIGNALS</span>
                <strong>
                  {exception.sourceSignalIds.length}
                </strong>
              </div>

              <div>
                <span>EVIDENCE STATE</span>
                <Provenance
                  type={exception.evidence}
                />
              </div>

              <div>
                <span>CONFIDENCE</span>
                <strong>
                  {formatConfidence(
                    exception.confidence
                  )}
                </strong>
              </div>
            </div>

            <div className="operate-source-signals">
              {exception.sourceSignalIds.map(
                (signalId) => (
                  <span key={signalId}>
                    {signalId}
                  </span>
                )
              )}
            </div>
          </section>

          <section className="operate-drawer__section">
            <span className="operate-drawer__label">
              WHY IT MATTERS
            </span>

            <h3>
              {formatINR(
                exception.financialExposure
              )}{" "}
              is currently exposed.
            </h3>

            <p>
              Novo has ranked this exception using
              severity, estimated financial exposure,
              confidence and the operating signals
              currently available.
            </p>
          </section>

          <section className="operate-drawer__action">
            <span className="operate-drawer__label">
              RECOMMENDED ACTION
            </span>

            <h3>
              {exception.recommendedAction}
            </h3>

            <div className="operate-drawer__owner">
              <span>OWNER</span>
              <strong>{exception.owner}</strong>
            </div>
          </section>

          <section className="operate-drawer__handoff">
            <div>
              <span className="operate-drawer__label">
                OPPORTUNITY HANDOFF
              </span>

              <h3>
                Turn the operating signal into an
                intervention.
              </h3>

              <p>
                Once validated, Novo can convert this
                exception into a growth, operating or
                build action without losing the evidence
                behind it.
              </p>
            </div>

            <button type="button" disabled>
              Create opportunity →
            </button>

            <small>
              Handoff becomes active when the shared
              opportunity state layer is introduced.
            </small>
          </section>
        </div>
      </aside>
    </div>
  );
}