"use client";

import {
  ArrowUpRight,
  CircleDollarSign,
  Route,
  TrendingUp,
} from "lucide-react";

import { Provenance } from "@/components/shared/provenance";
import { SectionHeader } from "@/components/shared/section-header";
import { useNovo } from "@/context/novo-context";

const secondarySignals = [
  {
    icon: TrendingUp,
    type: "Growth",
    title: "Khichdi Tales repeat is accelerating",
    copy: "Repeat ordering is up 18% in the demo cohort. Novo recommends testing a recurring meal pass before adding more discounting.",
    impact: "₹24L",
    impactLabel: "annual potential",
    provenance: "hypothesis" as const,
    target: "grow" as const,
    action: "Open signal",
  },
  {
    icon: Route,
    type: "Capacity",
    title: "Varthur has monetisable dinner capacity",
    copy: "31% estimated kitchen capacity remains unused in the evening window. Nearby office demand is the strongest matching opportunity.",
    impact: "31%",
    impactLabel: "unused capacity",
    provenance: "estimate" as const,
    target: "grow" as const,
    action: "Find demand",
  },
];

export function AttentionFeed() {
  const { setView } = useNovo();

  return (
    <section className="today-section">
      <SectionHeader
        eyebrow="MANAGE"
        title="What needs your attention"
        meta={<span>4 OPEN</span>}
        copy="Novo ranks issues by economic impact, urgency and confidence."
      />

      <button
        type="button"
        className="attention-primary"
        onClick={() => setView("money")}
      >
        <div className="attention-icon danger">
          <CircleDollarSign size={18} />
        </div>

        <div className="attention-body">
          <div className="attention-topline">
            <span className="attention-type">MARGIN</span>
            <Provenance type="estimate" />
          </div>

          <h3>Food cost drift at Banaswadi</h3>

          <p>
            Contribution margin is down 4.1pp. Novo traced an estimated
            72% of the movement to paneer cost, packaging variance and
            discount mix.
          </p>

          <div className="attention-reason">
            <span>NOVO FOUND</span>
            Three inputs explain most of the deterioration. Fixing them
            would restore an estimated ₹41K/month.
          </div>
        </div>

        <div className="attention-impact">
          <span>MONTHLY LEAKAGE</span>
          <strong>₹41K</strong>

          <div className="attention-action">
            Investigate
            <ArrowUpRight size={13} />
          </div>
        </div>
      </button>

      <div className="signal-grid">
        {secondarySignals.map((signal) => {
          const Icon = signal.icon;

          return (
            <button
              type="button"
              className="signal-card"
              key={signal.title}
              onClick={() => setView(signal.target)}
            >
              <div className="signal-heading">
                <div className="signal-icon">
                  <Icon size={16} />
                </div>

                <span>{signal.type}</span>

                <Provenance type={signal.provenance} />
              </div>

              <h3>{signal.title}</h3>

              <p>{signal.copy}</p>

              <div className="signal-footer">
                <div>
                  <strong>{signal.impact}</strong>
                  <span>{signal.impactLabel}</span>
                </div>

                <span className="text-action">
                  {signal.action}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}