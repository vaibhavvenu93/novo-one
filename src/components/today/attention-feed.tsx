const items = [
  {
    severity: "high",
    title: "Food cost drift at Banaswadi",
    description:
      "Ingredient mix has moved contribution margin ~310 bps below portfolio target.",
    value: "₹1.8L",
    owner: "Operations",
  },
  {
    severity: "high",
    title: "Two schools driving churn",
    description:
      "A concentrated group of schools appears to explain most of this week's cancellation increase.",
    value: "₹3.3L",
    owner: "MonkeyBox",
  },
  {
    severity: "medium",
    title: "Varthur capacity underused",
    description:
      "Kitchen utilisation is running at 43% with available lunch capacity.",
    value: "₹7.2L",
    owner: "Growth",
  },
  {
    severity: "medium",
    title: "Khichdi Tales CAC rising",
    description:
      "Paid acquisition efficiency has weakened while organic demand remains healthy.",
    value: "₹1.1L",
    owner: "Marketing",
  },
];

export function AttentionFeed() {
  return (
    <section className="today-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">MANAGE</p>
          <h2>What needs attention</h2>
        </div>

        <span className="panel-count">4 open</span>
      </div>

      <div className="attention-list">
        {items.map((item) => (
          <article
            className="attention-row"
            key={item.title}
          >
            <span
              className={`attention-severity severity-${item.severity}`}
            />

            <div className="attention-copy">
              <strong>{item.title}</strong>
              <p>{item.description}</p>

              <span className="attention-owner">
                {item.owner}
              </span>
            </div>

            <strong className="attention-value">
              {item.value}
            </strong>

            <button
              type="button"
              className="row-action"
            >
              Open →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}