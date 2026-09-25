const activity = [
  {
    agent: "Margin Agent",
    action:
      "Flagged tomato and dairy cost movement affecting Banaswadi CM.",
    time: "6 min ago",
  },
  {
    agent: "Demand Agent",
    action:
      "Found unused weekday lunch capacity at Varthur.",
    time: "14 min ago",
  },
  {
    agent: "Customer Agent",
    action:
      "Isolated two schools responsible for abnormal cancellation movement.",
    time: "22 min ago",
  },
  {
    agent: "Growth Agent",
    action:
      "Generated corporate lunch expansion hypothesis for Khichdi Tales.",
    time: "31 min ago",
  },
];

export function AgentFeed() {
  return (
    <section className="today-panel agent-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">NOVO INTELLIGENCE</p>
          <h2>What Novo did while you were away</h2>
        </div>

        <span className="live-label">
          <span className="working-dot" />
          Live
        </span>
      </div>

      <div className="agent-feed">
        {activity.map((item) => (
          <div className="agent-row" key={item.action}>
            <div className="agent-icon">N</div>

            <div className="agent-copy">
              <strong>{item.agent}</strong>
              <p>{item.action}</p>
            </div>

            <span className="agent-time">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}