import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: string;
  detail?: string;
  signal?: ReactNode;
}

export function Stat({
  label,
  value,
  detail,
  signal,
}: StatProps) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {signal}
      </div>

      <strong className="stat-value">{value}</strong>

      {detail ? (
        <span className="stat-detail">{detail}</span>
      ) : null}
    </div>
  );
}