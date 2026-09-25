import { Provenance } from "@/components/shared/provenance";

export function MorningBrief() {
  return (
    <section className="morning-brief">
      <div className="morning-meta">
        <span>THURSDAY · 08:04</span>

        <span className="live-indicator">
          <span className="live-dot" />
          LIVE
        </span>
      </div>

      <h1>Good morning, Sandeep.</h1>

      <p className="morning-summary">
        Novo is growing. Margin needs attention. MonkeyBox is carrying
        volume, Khichdi Tales has the strongest growth signal, and unused
        kitchen capacity is the clearest near-term revenue opportunity.
      </p>

      <div className="brief-source">
        <Provenance type="estimate" />
        <span>Demo operating model · refreshed 08:04</span>
      </div>
    </section>
  );
}