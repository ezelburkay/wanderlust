"use client";

import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import type { OnboardingPreferences } from "../onboarding/OnboardingExperience";
import { CityCard } from "../city/CityCard";

interface SeasonalDiscoverySectionProps {
  cities: CityViewModel[];
  collections: HomepageDiscoveryViewModel[];
}

type TimeframeId = "this-month" | "next-3-months";

interface StoredOnboardingState {
  completed: boolean;
  skipped: boolean;
  preferences: OnboardingPreferences;
}

const storageKey = "wanderlust_onboarding";

function getStoredOnboarding(): StoredOnboardingState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredOnboardingState;

    return {
      completed: Boolean(parsedValue.completed),
      skipped: Boolean(parsedValue.skipped),
      preferences: parsedValue.preferences || { timeframe: null, vibes: [] }
    };
  } catch {
    return null;
  }
}

function getSeasonalCities(cities: CityViewModel[], timeframe: TimeframeId | null): CityViewModel[] {
  const currentMonth = new Date().getMonth();
  const seasonalKeywords = {
    spring: ["march", "april", "may", "bloom", "garden", "outdoor"],
    summer: ["june", "july", "august", "warm", "outdoor", "terrace"],
    fall: ["september", "october", "november", "autumn", "foliage", "cozy"],
    winter: ["december", "january", "february", "cold", "indoor", "cozy"]
  };

  const season = currentMonth >= 2 && currentMonth <= 4 ? "spring" :
                currentMonth >= 5 && currentMonth <= 7 ? "summer" :
                currentMonth >= 8 && currentMonth <= 10 ? "fall" : "winter";

  const keywords = seasonalKeywords[season] || [];

  return cities
    .map(city => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (city.searchText.includes(keyword) ? 1 : 0);
      }, 0);
      return { city, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ city }) => city);
}

export function SeasonalDiscoverySection({ cities, collections }: SeasonalDiscoverySectionProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [storedState, setStoredState] = useState<StoredOnboardingState | null>(null);

  useEffect(() => {
    setStoredState(getStoredOnboarding());
    setHasHydrated(true);
  }, []);

  const selectedTimeframe = useMemo(() => storedState?.preferences.timeframe ?? null, [storedState]);
  const seasonalCities = useMemo(() => {
    return getSeasonalCities(cities, selectedTimeframe);
  }, [cities, selectedTimeframe]);

  if (!hasHydrated || seasonalCities.length === 0) {
    return null;
  }

  return (
    <section className="seasonal-discovery" id="seasonal">
      <div className="site-shell">
        <div className="section-heading">
          <h2 className="section-title">Cities that feel right this season</h2>
          <p className="section-copy">
            A timely edit shaped by weather, pace, and what's best experienced now.
          </p>
        </div>

        <div className="seasonal-discovery__grid">
          {seasonalCities.map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

