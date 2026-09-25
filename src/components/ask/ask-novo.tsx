"use client";

import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Provenance } from "@/components/shared/provenance";
import {
  NovoView,
  useNovo,
} from "@/context/novo-context";

import { findMoney } from "@/services/finance";
import {
  getGrowthSnapshot,
  rankGrowthOpportunities,
} from "@/services/growth";
import { getExperiments } from "@/services/build";
import { getOperationsSnapshot } from "@/services/operations";

interface AskNovoProps {
  open: boolean;
  onClose: () => void;
}

interface NovoAnswer {
  eyebrow: string;
  title: string;
  answer: string;
  metric?: string;
  metricLabel?: string;
  evidence:
    | "verified"
    | "public"
    | "modelled"
    | "hypothesis"
    | "needs-data";
  actionLabel?: string;
  targetView?: NovoView;
  sourceId?: string;
}

const prompts = [
  "What needs my attention today?",
  "Where are we losing money?",
  "Find me ₹10L.",
  "What should we grow next?",
  "Which operating issue matters most?",
  "What experiment needs a decision?",
];

function formatMoney(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10_000_000) {
    return `₹${(
      value / 10_000_000
    ).toFixed(2)}Cr`;
  }

  if (absolute >= 100_000) {
    return `₹${(
      value / 100_000
    ).toFixed(1)}L`;
  }

  if (absolute >= 1_000) {
    return `₹${Math.round(
      value / 1_000
    )}K`;
  }

  return `₹${Math.round(value)}`;
}

export function AskNovo({
  open,
  onClose,
}: AskNovoProps) {
  const {
    brandId,
    locationId,
    openIntelligence,
    setView,
  } = useNovo();

  const [query, setQuery] =
    useState("");

  const [submittedQuery, setSubmittedQuery] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  const answer =
    useMemo<NovoAnswer | null>(() => {
      if (!submittedQuery) {
        return null;
      }

      const normalised =
        submittedQuery
          .trim()
          .toLowerCase();

      const filter = {
        brandId:
          brandId === "novo"
            ? undefined
            : brandId,

        locationId:
          locationId === "all"
            ? undefined
            : locationId,
      };

      const operations =
        getOperationsSnapshot(filter);

      const growth =
        getGrowthSnapshot(filter);

      const opportunities =
        rankGrowthOpportunities(filter);

      const experiments =
        getExperiments({
          brandId,
          locationId,
        });

      const money =
        findMoney(filter);

      if (
        normalised.includes("lose") ||
        normalised.includes("losing") ||
        normalised.includes("leak") ||
        normalised.includes("money")
      ) {
        const top =
          money.opportunities[0];

        if (top) {
          return {
            eyebrow:
              "MONEY INTELLIGENCE",

            title: top.title,

            answer:
              `${top.description} Novo estimates ` +
              `${formatMoney(
                top.monthlyImpact
              )} of monthly impact is worth investigating first.`,

            metric:
              formatMoney(
                top.monthlyImpact
              ),

            metricLabel:
              "MONTHLY IMPACT",

            evidence:
              top.evidence,

            actionLabel:
              "Open Money",

            targetView: "money",

            sourceId: top.id,
          };
        }
      }

      if (
        normalised.includes("grow") ||
        normalised.includes("growth") ||
        normalised.includes("revenue") ||
        normalised.includes("next")
      ) {
        const top =
          opportunities[0];

        if (top) {
          return {
            eyebrow:
              "GROWTH INTELLIGENCE",

            title: top.title,

            answer:
              `${top.description} The opportunity represents ` +
              `${formatMoney(
                top.annualRevenuePotential
              )} in annual revenue potential at ` +
              `${Math.round(
                top.confidence * 100
              )}% confidence.`,

            metric:
              formatMoney(
                top.annualRevenuePotential
              ),

            metricLabel:
              "ANNUAL POTENTIAL",

            evidence:
              top.evidence,

            actionLabel:
              "Open opportunity",

            targetView: "grow",

            sourceId: top.id,
          };
        }
      }

      if (
        normalised.includes("operate") ||
        normalised.includes("operating") ||
        normalised.includes("issue") ||
        normalised.includes("risk") ||
        normalised.includes("break")
      ) {
        const top =
          operations.exceptions[0];

        if (top) {
          return {
            eyebrow:
              "OPERATING INTELLIGENCE",

            title: top.title,

            answer:
              `${top.detail} This is currently the highest-ranked operating exception with ` +
              `${formatMoney(
                top.financialExposure
              )} of financial exposure.`,

            metric:
              formatMoney(
                top.financialExposure
              ),

            metricLabel:
              "EXPOSURE",

            evidence:
              top.evidence,

            actionLabel:
              "Investigate",

            targetView: "operate",

            sourceId: top.id,
          };
        }
      }

      if (
        normalised.includes("experiment") ||
        normalised.includes("build") ||
        normalised.includes("decision")
      ) {
        const experiment =
          experiments.find(
            (item) =>
              item.status === "decision"
          ) ??
          experiments.find(
            (item) =>
              item.status === "running"
          ) ??
          experiments[0];

        if (experiment) {
          return {
            eyebrow:
              "BUILD INTELLIGENCE",

            title:
              experiment.title,

            answer:
              `${experiment.hypothesis} ` +
              `The experiment has ${formatMoney(
                experiment.budgetCeiling
              )} of capital at risk and ` +
              `${Math.round(
                experiment.confidence * 100
              )}% confidence.`,

            metric:
              formatMoney(
                experiment.budgetCeiling
              ),

            metricLabel:
              "CAPITAL AT RISK",

            evidence:
              experiment.evidence,

            actionLabel:
              "Review experiment",

            targetView: "build",

            sourceId:
              experiment.id,
          };
        }
      }

      const topException =
        operations.exceptions[0];

      const topGrowth =
        opportunities[0];

      return {
        eyebrow:
          "FOUNDER BRIEF",

        title:
          "Protect the downside, then capture the upside.",

        answer:
          `${formatMoney(
            operations.financialExposure
          )} is currently exposed across operations, while ` +
          `${formatMoney(
            growth.annualRevenuePotential
          )} of annual growth potential is visible. ` +
          `${
            topException
              ? `${topException.title} is the first operating issue to investigate. `
              : ""
          }` +
          `${
            topGrowth
              ? `${topGrowth.title} is the highest-ranked growth opportunity.`
              : ""
          }`,

        metric:
          formatMoney(
            operations.financialExposure
          ),

        metricLabel:
          "CURRENT EXPOSURE",

        evidence: "modelled",

        actionLabel:
          topException
            ? "Open top issue"
            : "Open Today",

        targetView:
          topException
            ? "operate"
            : "today",

        sourceId:
          topException?.id,
      };
    }, [
      submittedQuery,
      brandId,
      locationId,
    ]);

  if (!open) {
    return null;
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const nextQuery =
      query.trim();

    if (!nextQuery) {
      return;
    }

    setSubmittedQuery(nextQuery);
  };

  const handleAction = () => {
    if (!answer?.targetView) {
      return;
    }

    if (
      answer.sourceId &&
      answer.targetView !== "today"
    ) {
      openIntelligence(
        answer.targetView,
        answer.sourceId
      );
    } else {
      setView(answer.targetView);
    }

    onClose();
  };

  return (
    <div
      className="ask-novo-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="ask-novo"
        role="dialog"
        aria-modal="true"
        aria-label="Ask Novo"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="ask-novo__header">
          <div>
            <span>
              NOVO INTELLIGENCE
            </span>

            <strong>
              Ask the business.
            </strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask Novo"
          >
            <X size={18} />
          </button>
        </header>

        <form
          className="ask-novo__search"
          onSubmit={handleSubmit}
        >
          <Search size={18} />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Ask Novo anything..."
          />

          <button type="submit">
            Ask
          </button>
        </form>

        {!answer ? (
          <div className="ask-novo__starter">
            <span>
              TRY ASKING
            </span>

            <div>
              {prompts.map(
                (prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() => {
                      setQuery(prompt);
                      setSubmittedQuery(
                        prompt
                      );
                    }}
                  >
                    {prompt}
                    <ArrowRight
                      size={14}
                    />
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="ask-novo__answer">
            <div className="ask-novo__answer-meta">
              <span>
                {answer.eyebrow}
              </span>

              <Provenance
                type={
                  answer.evidence
                }
              />
            </div>

            <h2>
              {answer.title}
            </h2>

            <p>
              {answer.answer}
            </p>

            {answer.metric ? (
              <div className="ask-novo__metric">
                <span>
                  {
                    answer.metricLabel
                  }
                </span>

                <strong>
                  {answer.metric}
                </strong>
              </div>
            ) : null}

            {answer.actionLabel ? (
              <button
                type="button"
                className="ask-novo__action"
                onClick={
                  handleAction
                }
              >
                {
                  answer.actionLabel
                }

                <ArrowRight
                  size={15}
                />
              </button>
            ) : null}

            <div className="ask-novo__disclaimer">
              Novo is answering from the current
              operating model and available evidence.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}