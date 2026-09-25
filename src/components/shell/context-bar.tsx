"use client";

import {
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { AskNovo } from "@/components/ask/ask-novo";
import { useNovo } from "@/context/novo-context";
import {
  brands,
  locations,
} from "@/data/novo-demo";
import { BrandId } from "@/domain/novo";

export function ContextBar() {
  const {
    brandId,
    setBrandId,
    locationId,
    setLocationId,
    period,
    setPeriod,
  } = useNovo();

  const [
    askNovoOpen,
    setAskNovoOpen,
  ] = useState(false);

  const closeAskNovo =
    useCallback(() => {
      setAskNovoOpen(false);
    }, []);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        setAskNovoOpen(
          (current) => !current
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const availableLocations =
    brandId === "novo"
      ? []
      : locations.filter(
          (location) =>
            location.brandId ===
            brandId
        );

  return (
    <>
      <header className="novo-topbar">
        <button
          type="button"
          className="novo-logo"
          onClick={() =>
            setBrandId("novo")
          }
          aria-label="Go to Novo Group"
        >
          <span className="novo-logo-mark">
            N
          </span>

          <span>NOVO ONE</span>
        </button>

        <div className="context-controls">
          <select
            className="context-select"
            value={brandId}
            onChange={(event) =>
              setBrandId(
                event.target
                  .value as BrandId
              )
            }
            aria-label="Select business"
          >
            <option value="novo">
              NOVO GROUP
            </option>

            {brands.map(
              (brand) => (
                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name.toUpperCase()}
                </option>
              )
            )}
          </select>

          <select
            className="context-select"
            value={locationId}
            onChange={(event) =>
              setLocationId(
                event.target.value
              )
            }
            disabled={
              brandId === "novo"
            }
            aria-label="Select location"
          >
            <option value="all">
              ALL LOCATIONS
            </option>

            {availableLocations.map(
              (location) => (
                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name.toUpperCase()}
                </option>
              )
            )}
          </select>

          <select
            className="context-select"
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target
                  .value as typeof period
              )
            }
            aria-label="Select period"
          >
            <option value="today">
              TODAY
            </option>

            <option value="7d">
              7 DAYS
            </option>

            <option value="30d">
              30 DAYS
            </option>

            <option value="mtd">
              MONTH TO DATE
            </option>
          </select>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="ask-novo-trigger"
            aria-label="Ask Novo"
            onClick={() =>
              setAskNovoOpen(true)
            }
          >
            <Search size={14} />

            <span>
              Ask Novo anything
            </span>

            <kbd>Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="working-trigger"
          >
            <span className="working-dot" />

            Novo is working
          </button>
        </div>
      </header>

      <AskNovo
        open={askNovoOpen}
        onClose={closeAskNovo}
      />
    </>
  );
}