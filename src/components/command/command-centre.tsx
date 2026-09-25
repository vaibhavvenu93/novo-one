"use client";

import { GrowView } from "@/components/grow/grow-view";
import { MoneyView } from "@/components/money/money-view";
import { TodayView } from "@/components/today/today-view";
import { useNovo } from "@/context/novo-context";

const roomContent = {
  operate: {
    eyebrow: "EXECUTION",
    title: "Operate",
    copy: "Kitchens, schools, locations, routes, capacity, inventory, quality and daily operating health.",
  },

  build: {
    eyebrow: "OPPORTUNITIES",
    title: "Build",
    copy: "Turn signals into experiments, business cases and executable bets.",
  },

  "50cr": {
    eyebrow: "FOUNDER",
    title: "Where does the next ₹50Cr come from?",
    copy: "Decompose the ambition into brands, channels, locations and growth engines — then pressure-test every assumption.",
  },

  "90days": {
    eyebrow: "EXECUTION PLAN",
    title: "The first 90 days",
    copy: "What we diagnose, fix, grow and prove — with owners, milestones and measurable business outcomes.",
  },

  memory: {
    eyebrow: "COMPANY INTELLIGENCE",
    title: "Novo Memory",
    copy: "Every bet, result and lesson becomes institutional memory so Novo never pays twice to learn the same thing.",
  },
} as const;

export function CommandCentre() {
  const { view } = useNovo();

  if (view === "today") {
    return <TodayView />;
  }

  if (view === "money") {
    return <MoneyView />;
  }

  if (view === "grow") {
    return <GrowView />;
  }

  const room = roomContent[view];

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">{room.eyebrow}</p>

          <h1 className="page-title">{room.title}</h1>

          <p className="page-subtitle">{room.copy}</p>
        </div>

        <span className="status-pill neutral">
          NEXT BUILD CLUSTER
        </span>
      </header>

      <div className="card empty-view">
        <h2>{room.title}</h2>

        <p>
          This room already inherits the active business, location and
          period context. Its operating workflow is the next build cluster.
        </p>
      </div>
    </div>
  );
}