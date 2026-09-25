import { Provenance } from "@/components/shared/provenance";

const metrics = [
  {
    label: "Revenue MTD",
    value: "₹1.08Cr",
    change: "+15.3%",
    changeLabel: "vs prior period",
    tone: "positive",
  },
  {
    label: "Orders",
    value: "77,271",
    change: "+12.1%",
    changeLabel: "across portfolio",
    tone: "positive",
  },
  {
    label: "Contribution",
    value: "₹27.4L",
    change: "+8.4%",
    changeLabel: "vs prior period",
    tone: "positive",
  },
  {
    label: "Contribution margin",
    value: "25.3%",
    change: "−1.8pp",
    changeLabel: "needs attention",
    tone: "negative",
  },
];

export function MetricStrip() {
  return (
    <section className="today-metrics">
      <div className="metrics-source">
        <Provenance type="estimate" />
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div className="today-metric" key={metric.label}>
            <p className="today-metric-label">{metric.label}</p>

            <div className="today-metric-row">
              <strong>{metric.value}</strong>

              <span
                className={
                  metric.tone === "positive"
                    ? "metric-change positive"
                    : "metric-change negative"
                }
              >
                {metric.change}
              </span>
            </div>

            <p className="today-metric-note">{metric.changeLabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}