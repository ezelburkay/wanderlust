"use client";

import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import type { OnboardingPreferences } from "../onboarding/onboarding-types";
import { CityCard } from "../city";

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

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readStoredOnboarding(): StoredOnboardingState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredOnboardingState> & {
      preferences?: Partial<OnboardingPreferences>;
    };

    return {
      completed: parsedValue.completed === true,
      skipped: parsedValue.skipped === true,
      preferences: {
        mood: sanitizeStringArray(parsedValue.preferences?.mood),
        pace: typeof parsedValue.preferences?.pace === "string" ? parsedValue.preferences.pace : "",
        foodInterest: sanitizeStringArray(parsedValue.preferences?.foodInterest),
        vibe: sanitizeStringArray(parsedValue.preferences?.vibe),
        tripStyle: sanitizeStringArray(parsedValue.preferences?.tripStyle)
      }
    };
  } catch {
    return null;
  }
}

function getSelectedTimeframe(state: StoredOnboardingState | null): TimeframeId | null {
  const validTimeframes: TimeframeId[] = ["this-month", "next-3-months"];
  
  const selectedTimeframe = state?.preferences.tripStyle.find((value): value is TimeframeId => {
    return validTimeframes.includes(value as TimeframeId);
  });

  return selectedTimeframe ?? null;
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
    setStoredState(readStoredOnboarding());
    setHasHydrated(true);
  }, []);

  const selectedTimeframe = useMemo(() => getSelectedTimeframe(storedState), [storedState]);
  const seasonalCities = useMemo(() => {
    return getSeasonalCities(cities, selectedTimeframe);
  }, [cities, selectedTimeframe]);

  console.log('=== SEASONAL DISCOVERY SECTION DEBUG ===');
  console.log('Component: SeasonalDiscoverySection');
  console.log('Data source:', collections.length > 0 ? 'passed collections' : 'independent seasonal logic');
  console.log('Collections received:', collections.length);
  console.log('Selected timeframe:', selectedTimeframe);
  console.log('Seasonal cities generated:', seasonalCities.length);
  console.log('Section title source: hardcoded');
  console.log('Section title: "Cities that feel right this season"');

  if (!hasHydrated || seasonalCities.length === 0) {
    console.log('SeasonalDiscoverySection: not rendering (no hydration or no cities)');
    return null;
  }

  console.log('SeasonalDiscoverySection: rendering with', seasonalCities.length, 'cities');

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
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
