import { EvidenceState } from "@/domain/novo";

export type ProvenanceType =
  | EvidenceState
  | "company"
  | "estimate";

interface ProvenanceProps {
  type: ProvenanceType;
}

const provenanceLabels: Record<ProvenanceType, string> = {
  verified: "VERIFIED",
  public: "PUBLIC",
  company: "COMPANY",
  estimate: "ESTIMATE",
  modelled: "MODELLED",
  hypothesis: "HYPOTHESIS",
  "needs-data": "NEEDS DATA",
};

const provenanceDescriptions: Record<ProvenanceType, string> = {
  verified:
    "Supported by verified operating or connected-source evidence",

  public:
    "Derived from publicly available information",

  company:
    "Information stated or supplied by the company",

  estimate:
    "Estimated from the information currently available",

  modelled:
    "Calculated from assumptions in the current Novo operating model",

  hypothesis:
    "A hypothesis that requires validation before action",

  "needs-data":
    "The system does not yet have enough evidence to make this claim",
};

export function Provenance({
  type,
}: ProvenanceProps) {
  return (
    <span
      className={`provenance provenance--${type}`}
      title={provenanceDescriptions[type]}
    >
      <span className="provenance__dot" />

      {provenanceLabels[type]}
    </span>
  );
}