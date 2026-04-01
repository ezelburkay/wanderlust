"use client";

import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import type { OnboardingPreferences } from "../onboarding/OnboardingExperience";
import { CityCard } from "../city/CityCard";

interface PersonalizedDiscoveryFlowProps {
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

interface DiscoveryFlowSection {
  cities: CityViewModel[];
  label: string;
  layout: "two" | "three";
  slug: string;
  title: string;
}

const storageKey = "wanderlust_onboarding";
const validVibes: VibeId[] = ["food", "romantic", "culture", "nature", "adventure", "slow"];
const validTimeframes: TimeframeId[] = ["this-month", "next-3-months"];

const vibeCopy: Record<VibeId, { interestLabel: string; keywords: string[]; selectionCopy: string; title: string }> = {
  adventure: {
    interestLabel: "Adventure days",
    keywords: ["walk", "streets", "energy", "explore", "landmark", "iconic", "hill"],
    selectionCopy: "more energetic city days",
    title: "Great for adventure days"
  },
  culture: {
    interestLabel: "Culture lovers",
    keywords: ["culture", "art", "museum", "cathedral", "history", "historic", "architecture"],
    selectionCopy: "culture-led city days",
    title: "Great for culture lovers"
  },
  food: {
    interestLabel: "Food lovers",
    keywords: ["food", "dining", "dish", "bakery", "wine", "market", "bistro", "eat"],
    selectionCopy: "food-first escapes",
    title: "Great for food lovers"
  },
  nature: {
    interestLabel: "Nature seekers",
    keywords: ["garden", "park", "river", "hill", "outdoor", "green", "nature"],
    selectionCopy: "softer green escapes",
    title: "Great for nature seekers"
  },
  romantic: {
    interestLabel: "Romantic trips",
    keywords: ["wine", "pastry", "evening", "garden", "romantic", "bistro", "cafe"],
    selectionCopy: "romantic city breaks",
    title: "Great for romantic trips"
  },
  slow: {
    interestLabel: "Slow travel",
    keywords: ["walking", "walk", "neighborhood", "garden", "wine", "bistro", "slow"],
    selectionCopy: "slower city rhythms",
    title: "Great for slow travel"
  }
};

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

function getMonthTokens(offset: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + offset + index, 1);

    return {
      full: monthDate.toLocaleString("en-US", { month: "long" }).toLowerCase(),
      short: monthDate.toLocaleString("en-US", { month: "short" }).toLowerCase()
    };
  });
}

function getSelectedTimeframe(state: StoredOnboardingState | null): TimeframeId | null {
  const selectedTimeframe = state?.preferences.tripStyle.find((value): value is TimeframeId => {
    return validTimeframes.includes(value as TimeframeId);
  });

  return selectedTimeframe ?? null;
}

function getSelectedVibes(state: StoredOnboardingState | null): VibeId[] {
  return state?.preferences.vibe.filter((value): value is VibeId => validVibes.includes(value as VibeId)) ?? [];
}

function scoreCity(city: CityViewModel, vibes: VibeId[], timeframe: TimeframeId | null) {
  const haystack = city.searchText;
  let score = 0;

  vibes.forEach((vibe) => {
    vibeCopy[vibe].keywords.forEach((keyword) => {
      if (haystack.includes(keyword)) {
        score += 3;
      }
    });
  });

  if (vibes.includes("food")) {
    score += city.signatureDishes.length + city.moreToEat.length;
  }

  if (vibes.includes("culture")) {
    score += city.mustSeeFirst.filter((place) => /museum|art|landmark|cathedral|historic/i.test(`${place.name} ${place.descriptor}`)).length * 2;
  }

  if (vibes.includes("nature")) {
    score += city.places.filter((place) => /park|garden|river|hill/i.test(`${place.name} ${place.descriptor}`)).length * 2;
  }

  if (vibes.includes("slow") && /walking|neighborhood|garden|wine|slow/i.test(haystack)) {
    score += 4;
  }

  if (vibes.includes("romantic") && /wine|pastry|evening|garden|romantic/i.test(haystack)) {
    score += 4;
  }

  if (vibes.includes("adventure") && /walk|explore|iconic|hill|energy/i.test(haystack)) {
    score += 4;
  }

  if (timeframe === "this-month") {
    getMonthTokens(0, 1).forEach((month) => {
      if (haystack.includes(month.full) || haystack.includes(month.short)) {
        score += 5;
      }
    });
  }

  if (timeframe === "next-3-months") {
    getMonthTokens(0, 3).forEach((month) => {
      if (haystack.includes(month.full) || haystack.includes(month.short)) {
        score += 3;
      }
    });
  }

  return score;
}

function rankCities(cities: CityViewModel[], vibes: VibeId[], timeframe: TimeframeId | null) {
  return [...cities].sort((left, right) => {
    const scoreDifference = scoreCity(right, vibes, timeframe) - scoreCity(left, vibes, timeframe);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.name.localeCompare(right.name);
  });
}

function prioritizeCollectionCities(collection: HomepageDiscoveryViewModel, rankedCities: CityViewModel[]) {
  const rankedIndex = new Map(rankedCities.map((city, index) => [city.slug, index]));

  return [...collection.cities].sort((left, right) => {
    return (rankedIndex.get(left.slug) ?? rankedCities.length) - (rankedIndex.get(right.slug) ?? rankedCities.length);
  });
}

function takeCities(cities: CityViewModel[], count: number) {
  return cities.slice(0, count);
}

function getTimeframeCopy(timeframe: TimeframeId | null) {
  if (timeframe === "this-month") {
    return "this month";
  }

  if (timeframe === "next-3-months") {
    return "the next few months";
  }

  return "";
}

function getDiscoveryIntro(vibes: VibeId[], timeframe: TimeframeId | null) {
  const primaryVibe = vibes[0];
  const timeframeCopy = getTimeframeCopy(timeframe);

  if (primaryVibe && timeframeCopy) {
    return {
      label: "Based on your vibe",
      text: `A short set of city briefings shaped around ${vibeCopy[primaryVibe].selectionCopy} and tuned for ${timeframeCopy}.`,
      title: "A more personal place to begin"
    };
  }

  if (primaryVibe) {
    return {
      label: "Based on your vibe",
      text: `A short set of city briefings shaped around ${vibeCopy[primaryVibe].selectionCopy}, before broader browsing below.`,
      title: "A more personal place to begin"
    };
  }

  if (timeframeCopy) {
    return {
      label: "Based on your timing",
      text: `A short set of city briefings tuned for ${timeframeCopy}, with the wider collection waiting below when you want to roam further.`,
      title: "A more personal place to begin"
    };
  }

  return {
    label: "Start here",
    text: "A short edited set of city briefings first, then the wider collection once you want to explore further.",
    title: "A calm place to begin"
  };
}

function buildSections(
  baseCollections: HomepageDiscoveryViewModel[],
  cities: CityViewModel[],
  vibes: VibeId[],
  timeframe: TimeframeId | null
): DiscoveryFlowSection[] {
  const pickedBase = baseCollections[0];
  const timingBase = baseCollections[1] ?? baseCollections[0];
  const interestBase = baseCollections[2] ?? baseCollections[0];
  const primaryVibe = vibes[0];
  const hasSelections = vibes.length > 0 || timeframe !== null;

  const pickedCities = takeCities(pickedBase.cities, 3);
  const timingCities = takeCities(prioritizeCollectionCities(timingBase, rankCities(cities, [], "this-month")), 2);
  const interestCities = primaryVibe
    ? takeCities(rankCities(cities, [primaryVibe], timeframe), 3)
    : takeCities(rankCities(cities, vibes, timeframe), 3);

  if (!hasSelections) {
    return [
      {
        cities: pickedCities,
        label: "Picked for you",
        layout: "three",
        slug: "picked-for-you",
        title: "Picked for you"
      },
      {
        cities: timingCities,
        label: "Right now",
        layout: "two",
        slug: "timing-this-month",
        title: "Best this month"
      }
    ];
  }

  return [
    {
      cities: interestCities,
      label: primaryVibe ? "Based on your vibe" : "Based on your selections",
      layout: "three",
      slug: `interest-${primaryVibe ?? "custom"}`,
      title: primaryVibe ? vibeCopy[primaryVibe].title : interestBase.title
    },
    {
      cities: timingCities,
      label: timeframe ? "Based on your timing" : "Right now",
      layout: "two",
      slug: "timing-this-month",
      title: "Best this month"
    }
  ];
}

export function PersonalizedDiscoveryFlow({ cities, collections }: PersonalizedDiscoveryFlowProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [storedState, setStoredState] = useState<StoredOnboardingState | null>(null);

  useEffect(() => {
    setStoredState(readStoredOnboarding());
    setHasHydrated(true);
  }, []);

  const selectedVibes = useMemo(() => getSelectedVibes(storedState), [storedState]);
  const selectedTimeframe = useMemo(() => getSelectedTimeframe(storedState), [storedState]);
  const discoveryIntro = useMemo(() => getDiscoveryIntro(selectedVibes, selectedTimeframe), [selectedTimeframe, selectedVibes]);
  const sections = useMemo(() => {
    return buildSections(collections, cities, selectedVibes, selectedTimeframe);
  }, [cities, collections, selectedTimeframe, selectedVibes]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <section className="discovery-flow" id="discover">
      <div className="site-shell">
        <div className="discovery-flow__intro">
          <div className="discovery-flow__intro-copy">
            <p className="discovery-flow__eyebrow">{discoveryIntro.label}</p>
            <h2 className="discovery-flow__intro-title">{discoveryIntro.title}</h2>
            <p className="discovery-flow__intro-text">{discoveryIntro.text}</p>
          </div>
        </div>

        {sections.map((section: DiscoveryFlowSection, index: number) => (
          <div className={`discovery-flow-section${index === 0 ? " discovery-flow-section--primary" : ""}`} key={section.slug}>
            <div className="discovery-flow-section__heading">
              <p className="discovery-flow-section__label">{section.label}</p>
              <h3 className="discovery-flow-section__title">{section.title}</h3>
            </div>

            <div className={`discovery-flow-section__grid discovery-flow-section__grid--${section.layout}`}>
              {section.cities.map((city: CityViewModel) => (
                <CityCard city={city} key={`${section.slug}-${city.slug}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
