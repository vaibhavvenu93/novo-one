const opportunities = [
  {
    title: "Fill Varthur lunch capacity",
    thesis:
      "Use idle kitchen capacity for corporate lunch contracts within the existing delivery radius.",
    impact: "₹7–10L",
    horizon: "30 days",
    confidence: "High",
  },
  {
    title: "MonkeyBox school expansion",
    thesis:
      "Expand through clusters around schools where logistics density and parent retention already work.",
    impact: "₹12–18L",
    horizon: "60 days",
    confidence: "Medium",
  },
  {
    title: "Khichdi Tales office lunch",
    thesis:
      "Package high-repeat comfort-food SKUs into weekday corporate meal plans.",
    impact: "₹6–9L",
    horizon: "45 days",
    confidence: "Medium",
  },
];

export function OpportunityStack() {
  return (
    <section className="today-panel opportunity-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">GROW</p>
          <h2>Revenue Novo should chase</h2>
        </div>

        <button
          type="button"
          className="text-action"
        >
          View growth engine →
        </button>
      </div>

      <div className="opportunity-list">
        {opportunities.map((opportunity, index) => (
          <article
            className="opportunity-row"
            key={opportunity.title}
          >
            <span className="opportunity-rank">
              0{index + 1}
            </span>

            <div className="opportunity-copy">
              <strong>{opportunity.title}</strong>
              <p>{opportunity.thesis}</p>

              <div className="opportunity-meta">
                <span>{opportunity.horizon}</span>
                <span>
                  {opportunity.confidence} confidence
                </span>
                <span>Hypothesis</span>
              </div>
            </div>

            <strong className="opportunity-impact">
              {opportunity.impact}
              <small> / month</small>
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}