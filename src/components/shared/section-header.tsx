import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  meta?: ReactNode;
  copy?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  meta,
  copy,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

        <h2 className="section-title">{title}</h2>

        {copy ? <p className="section-copy">{copy}</p> : null}
      </div>

      {meta ? <div className="section-meta">{meta}</div> : null}
    </div>
  );
}