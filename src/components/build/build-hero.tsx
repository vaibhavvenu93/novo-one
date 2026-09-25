import type { BuildSnapshot } from "@/domain/build";

interface BuildHeroProps {
  snapshot: BuildSnapshot;
  contextLabel: string;
}

function formatMoney(value: number) {
  if (Math.abs(value) >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }

  if (Math.abs(value) >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function BuildHero({
  snapshot,
  contextLabel,
}: BuildHeroProps) {
  return (
    <section className="build-hero">
      <div className="build-hero__intro">
        <span className="build-eyebrow">
          EXPERIMENTATION ENGINE
        </span>

        <h1>Build.</h1>

        <p>
          Turn growth opportunities into controlled experiments,
          accumulate evidence and decide what {contextLabel} should
          scale, iterate or kill.
        </p>
      </div>

      <div className="build-scorecard">
        <div className="build-scorecard__item">
          <span>EXPERIMENTS</span>
          <strong>{snapshot.experimentCount}</strong>
          <small>
            {snapshot.activeCount} currently active
          </small>
        </div>

        <div className="build-scorecard__item">
          <span>CAPITAL AT RISK</span>
          <strong>{formatMoney(snapshot.capitalAtRisk)}</strong>
          <small>Across active experiments</small>
        </div>

        <div className="build-scorecard__item">
          <span>ANNUAL UPSIDE</span>
          <strong>
            {formatMoney(snapshot.expectedAnnualRevenue)}
          </strong>
          <small>Expected revenue if validated</small>
        </div>

        <div className="build-scorecard__item">
          <span>EXPECTED CONTRIBUTION</span>
          <strong>
            {formatMoney(snapshot.expectedAnnualContribution)}
          </strong>
          <small>Contribution potential</small>
        </div>

        <div className="build-scorecard__item">
          <span>AVG CONFIDENCE</span>
          <strong>
            {Math.round(snapshot.averageConfidence * 100)}%
          </strong>
          <small>Current evidence confidence</small>
        </div>
      </div>

      {(snapshot.blockedCount > 0 ||
        snapshot.decisionCount > 0) && (
        <div className="build-attention">
          <span className="build-attention__dot" />

          <p>
            <strong>Founder attention:</strong>{" "}
            {snapshot.decisionCount > 0
              ? `${snapshot.decisionCount} experiment${
                  snapshot.decisionCount === 1 ? "" : "s"
                } waiting for a decision.`
              : ""}
            {snapshot.decisionCount > 0 &&
            snapshot.blockedCount > 0
              ? " "
              : ""}
            {snapshot.blockedCount > 0
              ? `${snapshot.blockedCount} blocked.`
              : ""}
          </p>
        </div>
      )}
    </section>
  );
}
