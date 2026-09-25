import { Evidence } from "@/components/shared/evidence";

export function FounderBrief() {
  return (
    <section className="founder-brief">
      <div>
        <p className="page-kicker">THURSDAY · 08:04</p>

        <h1>Good morning, Sandeep.</h1>

        <p className="founder-summary">
          Novo is growing. Margin needs attention. MonkeyBox is
          carrying volume, Khichdi Tales has the strongest growth
          signal, and unused kitchen capacity is the clearest
          near-term revenue opportunity.
        </p>
      </div>

      <div className="founder-brief-side">
        <Evidence level="demo" />

        <span className="system-health">
          <span className="working-dot" />
          8 systems connected
        </span>
      </div>
    </section>
  );
}