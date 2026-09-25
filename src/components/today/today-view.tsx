"use client";

import { ArrowRight } from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { useNovo } from "@/context/novo-context";

import type {
  TodayPriority,
} from "@/domain/today";

import {
  getTodaySnapshot,
} from "@/services/today-intelligence";

function formatMoney(value: number) {
  if (value >= 10_000_000) {
    return `₹${(
      value / 10_000_000
    ).toFixed(2)}Cr`;
  }

  if (value >= 100_000) {
    return `₹${(
      value / 100_000
    ).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `₹${(
      value / 1_000
    ).toFixed(1)}K`;
  }

  return `₹${Math.round(value)}`;
}

function confidenceLabel(
  confidence?: number
) {
  if (confidence === undefined) {
    return null;
  }

  return `${Math.round(
    confidence * 100
  )}% confidence`;
}

function TodayPriorityRow({
  priority,
  onOpen,
}: {
  priority: TodayPriority;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="today-priority"
      onClick={onOpen}
      aria-label={`${priority.actionLabel}: ${priority.title}`}
    >
      <div className="today-priority__rank">
        <span>PRIORITY</span>

        <strong>
          {String(priority.rank).padStart(
            2,
            "0"
          )}
        </strong>
      </div>

      <div className="today-priority__content">
        <div className="today-priority__meta">
          <span>
            {priority.eyebrow}
          </span>

          <Provenance
            type={priority.evidence}
          />
        </div>

        <h3>{priority.title}</h3>

        <p>{priority.detail}</p>

        <div className="today-priority__footer">
          {priority.owner ? (
            <span>
              OWNER{" "}
              <strong>
                {priority.owner}
              </strong>
            </span>
          ) : null}

          {confidenceLabel(
            priority.confidence
          ) ? (
            <span>
              {confidenceLabel(
                priority.confidence
              )}
            </span>
          ) : null}
        </div>
      </div>

      <div className="today-priority__value">
        <span>
          {priority.valueLabel}
        </span>

        <strong>
          {formatMoney(priority.value)}
        </strong>
      </div>

      <div className="today-priority__action">
        <span>
          {priority.actionLabel}
        </span>

        <ArrowRight size={17} />
      </div>
    </button>
  );
}

export function TodayView() {
 const {
  brandId,
  locationId,
  setView,
  openIntelligence,
} = useNovo();

  const snapshot =
    getTodaySnapshot({
      brandId,
      locationId,
    });

  return (
    <div className="today-command">
      <section className="today-command__hero">
        <div>
          <p className="today-command__eyebrow">
            TODAY
          </p>

          <h1>
            {snapshot.headline}
          </h1>

          <p className="today-command__summary">
            {snapshot.summary}
          </p>
        </div>

        <div className="today-command__status">
          <span className="today-command__status-dot" />

          <span>
            Novo is watching the business
          </span>
        </div>
      </section>

      <section className="today-command__picture">
        <div>
          <span>NET REVENUE</span>

          <strong>
            {formatMoney(
              snapshot.netRevenue
            )}
          </strong>
        </div>

        <div>
          <span>CONTRIBUTION</span>

          <strong>
            {formatMoney(
              snapshot.contribution
            )}
          </strong>
        </div>

        <div>
          <span>EXPOSED</span>

          <strong>
            {formatMoney(
              snapshot.financialExposure
            )}
          </strong>

          <small>
            {snapshot.activeExceptions} active
            exceptions
          </small>
        </div>

        <div>
          <span>GROWTH VISIBLE</span>

          <strong>
            {formatMoney(
              snapshot.growthPotential
            )}
          </strong>

          <small>
            {snapshot.growthOpportunities}{" "}
            opportunities
          </small>
        </div>
      </section>

      <section className="today-command__priorities">
        <div className="today-command__section-heading">
          <div>
            <p className="today-command__eyebrow">
              FOUNDER QUEUE
            </p>

            <h2>
              What deserves attention?
            </h2>
          </div>

          <span>
            {
              snapshot.priorities
                .length
            }{" "}
            PRIORITIES
          </span>
        </div>

        <div className="today-priority-list">
  {snapshot.priorities.map(
    (priority) => (
      <TodayPriorityRow
        key={priority.id}
        priority={priority}
        onOpen={() => {
          if (priority.sourceId) {
            openIntelligence(
              priority.area,
              priority.sourceId
            );

            return;
          }

          setView(priority.area);
        }}
      />
    )
  )}
</div>
      </section>

      <section className="today-command__footer">
        <div>
          <span>ACTIVE EXPERIMENTS</span>

          <strong>
            {snapshot.activeExperiments}
          </strong>
        </div>

        <p>
          Novo is continuously comparing
          financial performance, operating
          exceptions, growth opportunities and
          experiments to determine where founder
          attention has the highest expected
          value.
        </p>
      </section>
    </div>
  );
}