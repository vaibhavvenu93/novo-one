export type ProvenanceType =
  | "verified"
  | "company"
  | "estimate"
  | "hypothesis";

interface ProvenanceProps {
  type: ProvenanceType;
}

const labels: Record<ProvenanceType, string> = {
  verified: "VERIFIED",
  company: "COMPANY DATA",
  estimate: "ESTIMATE",
  hypothesis: "HYPOTHESIS",
};

export function Provenance({ type }: ProvenanceProps) {
  return (
    <span className={`provenance provenance-${type}`}>
      <span className="provenance-dot" />
      {labels[type]}
    </span>
  );
}