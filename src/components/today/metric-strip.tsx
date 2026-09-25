import { Stat } from "@/components/shared/stat";

export function MetricStrip() {
  return (
    <section className="metric-strip">
      <Stat
        label="Revenue MTD"
        value="₹1.08Cr"
        detail="↑ 15.3% weighted growth"
      />

      <Stat
        label="Orders"
        value="77,271"
        detail="Across portfolio"
      />

      <Stat
        label="Contribution"
        value="₹27.4L"
        detail="25.3% contribution margin"
      />

      <Stat
        label="Founder attention"
        value="4"
        detail="2 require action today"
      />
    </section>
  );
}