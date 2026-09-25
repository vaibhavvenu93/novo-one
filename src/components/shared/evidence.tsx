type EvidenceLevel = "verified" | "estimate" | "hypothesis" | "demo";

const labels: Record<EvidenceLevel, string> = {
  verified: "Verified",
  estimate: "Estimate",
  hypothesis: "Hypothesis",
  demo: "Demo data",
};

export function Evidence({
  level = "demo",
}: {
  level?: EvidenceLevel;
}) {
  return (
    <span className={`evidence evidence-${level}`}>
      <span className="evidence-dot" />
      {labels[level]}
    </span>
  );
}