"use client";

import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import type { OnboardingPreferences } from "../onboarding/OnboardingExperience";
import { CityCard } from "../city/CityCard";

interface PreferenceSeasonSectionProps {
  cities: CityViewModel[];
  collections: HomepageDiscoveryViewModel[];
}

type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
type TimeframeId = "this-month" | "next-3-months";

interface StoredOnboardingState {
  completed: boolean;
  skipped: boolean;
  preferences: OnboardingPreferences;
}

const storageKey = "wanderlust_onboarding";

const preferenceSeasonCopy: Record<VibeId, { title: string; description: string }> = {
  food: {
    title: "Where food feels best right now",
    description: "Cities where seasonal ingredients and dining traditions shine in the current months."
  },
  romantic: {
    title: "Places made for spring evenings",
    description: "Cities with softer light, longer meals, and room to linger this time of year."
  },
  culture: {
    title: "Where culture comes alive this season",
    description: "Museums, architecture, and neighborhoods that reward curiosity in the current months."
  },
  nature: {
    title: "Where the season opens up outdoors",
    description: "Cities with gardens, parks, and landscapes that feel especially alive right now."
  },
  adventure: {
    title: "Cities with momentum this season",
    description: "Places that keep the day moving with energy and routes that match the current pace."
  },
  slow: {
    title: "Cities that reward slower days right now",
    description: "Places that unfold well at an unhurried pace, especially in the current season."
  }
};

const vibeKeywords: Record<VibeId, string[]> = {
  food: ["food", "dining", "dish", "bakery", "wine", "market", "bistro", "eat"],
  romantic: ["wine", "pastry", "evening", "garden", "romantic", "bistro", "cafe"],
  culture: ["culture", "art", "museum", "cathedral", "history", "historic", "architecture"],
  nature: ["garden", "park", "river", "hill", "outdoor", "green", "nature"],
  adventure: ["walk", "streets", "energy", "explore", "landmark", "iconic", "hill"],
  slow: ["walking", "walk", "neighborhood", "garden", "wine", "bistro", "slow"]
};

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

function getSeasonalKeywords(): string[] {
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

  return seasonalKeywords[season] || [];
}

function getPreferenceSeasonCities(cities: CityViewModel[], primaryVibe: VibeId | null): CityViewModel[] {
  if (!primaryVibe) {
    return [];
  }

  const seasonalKeywords = getSeasonalKeywords();
  const vibeSpecificKeywords = vibeKeywords[primaryVibe] || [];
  const allKeywords = [...seasonalKeywords, ...vibeSpecificKeywords];

  return cities
    .map(city => {
      const score = allKeywords.reduce((acc, keyword) => {
        return acc + (city.searchText.includes(keyword) ? 1 : 0);
      }, 0);
      return { city, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ city }) => city);
}

export function PreferenceSeasonSection({ cities, collections }: PreferenceSeasonSectionProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [storedState, setStoredState] = useState<StoredOnboardingState | null>(null);

  useEffect(() => {
    setStoredState(getStoredOnboarding());
    setHasHydrated(true);
  }, []);

  const selectedVibes = useMemo(() => storedState?.preferences.vibes ?? [], [storedState]);
  const primaryVibe = useMemo(() => selectedVibes[0] ?? null, [selectedVibes]);
  const preferenceSeasonCities = useMemo(() => {
    return getPreferenceSeasonCities(cities, primaryVibe);
  }, [cities, primaryVibe]);

  if (!hasHydrated || !primaryVibe || preferenceSeasonCities.length === 0) {
    return null;
  }

  const copy = preferenceSeasonCopy[primaryVibe];

  return (
    <section className="preference-season" id="preference-season">
      <div className="site-shell">
        <div className="section-heading">
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-copy">
            {copy.description}
          </p>
        </div>

        <div className="preference-season__grid">
          {preferenceSeasonCities.map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

