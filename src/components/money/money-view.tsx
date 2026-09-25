"use client";

import { BrandEconomics } from "@/components/money/brand-economics";
import { FindMoney } from "@/components/money/find-money";
import { LeakageRadar } from "@/components/money/leakage-radar";
import { MarginDrivers } from "@/components/money/margin-drivers";
import { MoneyHero } from "@/components/money/money-hero";
import { PnlWaterfall } from "@/components/money/pnl-waterfall";
import { ScenarioLab } from "@/components/money/scenario-lab";

import { useNovo } from "@/context/novo-context";

import {
  getFinanceLeakages,
  getFinanceSnapshot,
  getMarginDrivers,
} from "@/services/finance";

const brandLabels = {
  novo: "the Novo portfolio",
  monkeybox: "MonkeyBox",
  "khichdi-tales": "Khichdi Tales",
  pressmans: "Pressman's",
};

export function MoneyView() {
 const {
  brandId,
  locationId,
  period,
  navigationTarget,
  clearNavigationTarget,
} = useNovo();

  const filter = {
    brandId,
    locationId,
    period,
  };

  const snapshot = getFinanceSnapshot(filter);
  const marginDrivers = getMarginDrivers(filter);
  const leakages = getFinanceLeakages(filter);

  const contextLabel =
    brandLabels[brandId] ?? "the current business";

  const scrollToFindMoney = () => {
    document
      .getElementById("find-money")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="money-view">
      <MoneyHero
        snapshot={snapshot}
        contextLabel={contextLabel}
      />

      <div className="money-primary-grid">
        <PnlWaterfall snapshot={snapshot} />

        <aside className="money-question-panel">
          <span className="money-eyebrow">
            ASK THE BUSINESS
          </span>

          <h2>What do you want to know?</h2>

          <p>
            Ask Novo about the economics underneath the
            current business context.
          </p>

          <div className="money-question-list">
            <button type="button">
              Why did margin move?
            </button>

            <button type="button">
              Where are we leaking money?
            </button>

            <button type="button">
              Which channel makes us the most money?
            </button>

            <button
              type="button"
              onClick={scrollToFindMoney}
            >
              Find me ₹10L.
            </button>
          </div>

          <div className="money-question-foot">
            Engine connected · intelligence layer active
          </div>
        </aside>
      </div>

      <BrandEconomics />

      <MarginDrivers drivers={marginDrivers} />

     <LeakageRadar
  leakages={leakages}
  focusedLeakageId={
    navigationTarget?.view === "money"
      ? navigationTarget.sourceId
      : undefined
  }
  onClearFocus={clearNavigationTarget}
/>

      <ScenarioLab filter={filter} />

      <div id="find-money">
        <FindMoney filter={filter} />
      </div>
    </div>
  );
}