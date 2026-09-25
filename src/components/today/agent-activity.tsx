import {
  Banknote,
  Building2,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";

const agents = [
  {
    icon: Banknote,
    name: "CFO Agent",
    state: "Investigating",
    work: "Food-cost variance across 3 kitchens",
  },
  {
    icon: GraduationCap,
    name: "School Agent",
    state: "Mapped",
    work: "31 target schools around Varthur",
  },
  {
    icon: TrendingUp,
    name: "Growth Agent",
    state: "Analysing",
    work: "4,821 repeat-customer journeys",
  },
  {
    icon: Building2,
    name: "Corporate Agent",
    state: "Researching",
    work: "17 Bengaluru tech-park clusters",
  },
];

export function AgentActivity() {
  return (
    <section className="today-section agent-section">
      <SectionHeader
        eyebrow="INTELLIGENCE"
        title="What Novo is working on"
        meta={
          <span className="agent-live">
            <span className="live-dot" />
            8 AGENTS ACTIVE
          </span>
        }
      />

      <div className="agent-grid">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div className="agent-card" key={agent.name}>
              <div className="agent-card-icon">
                <Icon size={15} />
              </div>

              <div>
                <div className="agent-name-row">
                  <strong>{agent.name}</strong>
                  <span>{agent.state}</span>
                </div>

                <p>{agent.work}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}