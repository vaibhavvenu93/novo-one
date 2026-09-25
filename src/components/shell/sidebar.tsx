"use client";

import type { ComponentType } from "react";

import {
  Activity,
  Banknote,
  Brain,
  Building2,
  Hammer,
  History,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";

import { useNovo, NovoView } from "@/context/novo-context";
import { brands } from "@/data/novo-demo";

interface NavigationItem {
  id: NovoView;
  label: string;
  icon: ComponentType<{ size?: number }>;
  count?: number;
}

const operatingItems: NavigationItem[] = [
  {
    id: "today",
    label: "Today",
    icon: Activity,
  },
  {
    id: "money",
    label: "Money",
    icon: Banknote,
  },
  {
    id: "grow",
    label: "Grow",
    icon: TrendingUp,
  },
  {
    id: "operate",
    label: "Operate",
    icon: Building2,
  },
  {
    id: "build",
    label: "Build",
    icon: Hammer,
    count: 4,
  },
];

const founderItems: NavigationItem[] = [
  {
    id: "50cr",
    label: "Next ₹50Cr",
    icon: Rocket,
  },
  {
    id: "90days",
    label: "90 Days",
    icon: Target,
  },
  {
    id: "memory",
    label: "Novo Memory",
    icon: History,
  },
];

export function Sidebar() {
  const { brandId, view, setView } = useNovo();

  const activeBrand =
    brandId === "novo"
      ? undefined
      : brands.find((brand) => brand.id === brandId);

  const contextName =
    activeBrand?.name ?? "Novo Group";

  const renderItem = (item: NavigationItem) => {
    const Icon = item.icon;

    return (
      <button
        type="button"
        key={item.id}
        className={`sidebar-item ${
          view === item.id ? "active" : ""
        }`}
        onClick={() => setView(item.id)}
      >
        <Icon size={15} />

        <span>{item.label}</span>

        {item.count ? (
          <span className="sidebar-count">
            {item.count}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <aside className="novo-sidebar">
      <div className="sidebar-context">
        <p className="sidebar-eyebrow">
          Viewing
        </p>

        <div className="sidebar-brand">
          <span
            className="sidebar-brand-dot"
            style={{
              background:
                activeBrand?.accent ?? "var(--ink)",
            }}
          />

          <span className="sidebar-brand-name">
            {contextName}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {operatingItems.map(renderItem)}

        <p className="sidebar-section-label">
          Founder
        </p>

        {founderItems.map(renderItem)}
      </nav>

      <div className="sidebar-bottom">
        <div className="agent-status">
          <div className="agent-status-top">
            <span className="working-dot" />

            <Brain size={14} />

            <span>Novo working</span>
          </div>

          <p className="agent-status-copy">
            8 agents watching orders, customers,
            margin, operations and growth.
          </p>
        </div>
      </div>
    </aside>
  );
}