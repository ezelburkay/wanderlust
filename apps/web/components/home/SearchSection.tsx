"use client";

import { useEffect, useState } from "react";

interface SearchSectionProps {
  query?: string;
}

const searchPromptCities = ["Paris", "Rome", "Kyoto", "Lisbon", "Seoul", "Istanbul"];
const promptCycleDurationMs = 2900;
const promptFadeDurationMs = 560;
const promptSettleDurationMs = 40;

type PromptCityPhase = "visible" | "enter" | "exit";

export function SearchSection({ query = "" }: SearchSectionProps) {
  const [value, setValue] = useState(query);
  const [cityIndex, setCityIndex] = useState(0);
  const [cityPhase, setCityPhase] = useState<PromptCityPhase>("visible");

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    if (value.trim().length > 0) {
      setCityPhase("visible");
      return;
    }

    let swapTimeout: number | undefined;
    let settleTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setCityPhase("exit");

      swapTimeout = window.setTimeout(() => {
        setCityIndex((currentIndex: number) => (currentIndex + 1) % searchPromptCities.length);
        setCityPhase("enter");

        settleTimeout = window.setTimeout(() => {
          setCityPhase("visible");
        }, promptSettleDurationMs);
      }, promptFadeDurationMs);
    }, promptCycleDurationMs);

    return () => {
      window.clearInterval(interval);

      if (swapTimeout !== undefined) {
        window.clearTimeout(swapTimeout);
      }

      if (settleTimeout !== undefined) {
        window.clearTimeout(settleTimeout);
      }
    };
  }, [value]);

  return (
    <section className="search-section">
      <div className="site-shell">
        <div className="search-section__panel">
          <div className="search-section__copy">
            <span className="section-label">Quick search</span>
            <h2 className="section-title">Or start with a city.</h2>
            <form action="/" className="search-form" role="search">
              <div className="search-form__field">
                <span className="search-form__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <circle cx="8.25" cy="8.25" r="5.4" />
                    <path d="M12.45 12.45 16.2 16.2" />
                  </svg>
                </span>
                {value.trim().length === 0 ? (
                  <span className="search-form__prompt">
                    <span className="search-form__prompt-prefix">In pursuit of</span>
                    <span className={`search-form__prompt-city search-form__prompt-city--${cityPhase}`}>
                      {searchPromptCities[cityIndex]}...
                    </span>
                  </span>
                ) : null}
                <input
                  aria-label="Search for a city"
                  autoComplete="off"
                  className="search-form__input"
                  id="city-search"
                  name="q"
                  onChange={(event: { target: { value: string } }) => setValue(event.target.value)}
                  type="search"
                  value={value}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
