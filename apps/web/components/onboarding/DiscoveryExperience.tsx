"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";

interface DiscoveryExperienceProps {
  cities: CityViewModel[];
  collections: HomepageDiscoveryViewModel[];
}

type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
type TimeframeId = "this-month" | "next-3-months" | "just-exploring";

interface StoredPreferences {
  completed: boolean;
  timeframe: TimeframeId | null;
  vibes: VibeId[];
}

const storageKey = "wanderlust.home.onboarding";

const vibeOptions: Array<{ icon: string; id: VibeId; label: string }> = [
  { icon: "🍽️", id: "food", label: "Food" },
  { icon: "✦", id: "romantic", label: "Romantic" },
  { icon: "🏛️", id: "culture", label: "Culture" },
  { icon: "🌿", id: "nature", label: "Nature" },
  { icon: "⚡", id: "adventure", label: "Adventure" },
  { icon: "○", id: "slow", label: "Slow" }
];

const timeframeOptions: Array<{ id: TimeframeId; label: string }> = [
  { id: "this-month", label: "This month" },
  { id: "next-3-months", label: "Next 3 months" }
];

const vibeCopy: Record<VibeId, { keywords: string[]; subtitle: string; title: string }> = {
  adventure: {
    keywords: ["walk", "streets", "energy", "explore", "landmark", "iconic", "hill"],
    subtitle: "Strong sights, easy movement, and a day that keeps opening up.",
    title: "Cities that keep the day moving"
  },
  culture: {
    keywords: ["culture", "art", "museum", "cathedral", "history", "historic", "architecture"],
    subtitle: "Museums, landmark buildings, and neighborhoods with cultural weight.",
    title: "Cities where culture leads the day"
  },
  food: {
    keywords: ["food", "dining", "dish", "bakery", "wine", "market", "bistro", "eat"],
    subtitle: "Cities where meals, markets, and neighborhood rituals shape the whole trip.",
    title: "Cities for food-led trips"
  },
  nature: {
    keywords: ["garden", "park", "river", "hill", "outdoor", "green", "nature"],
    subtitle: "Open walks, river light, and places that leave more room to breathe.",
    title: "Cities with space to exhale"
  },
  romantic: {
    keywords: ["wine", "pastry", "evening", "garden", "romantic", "bistro", "cafe"],
    subtitle: "Golden-hour streets, slow dinners, and places that feel best shared.",
    title: "Cities for slower, romantic days"
  },
  slow: {
    keywords: ["walking", "walk", "neighborhood", "garden", "wine", "bistro", "slow"],
    subtitle: "Cities that reward lingering, walking, and leaving room between plans.",
    title: "Cities best taken slowly"
  }
};

function getMonthTokens(offset: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + offset + index, 1);

    return {
      full: monthDate.toLocaleString("en-US", { month: "long" }).toLowerCase(),
      short: monthDate.toLocaleString("en-US", { month: "short" }).toLowerCase()
    };
  });
}

function getTimeframeCopy(timeframe: TimeframeId) {
  const thisMonth = getMonthTokens(0, 1)[0]?.full ?? "this month";

  if (timeframe === "this-month") {
    return {
      label: "For your timing",
      subtitle: `A calmer fit for ${thisMonth}, with strong everyday rhythm and easy pacing.`,
      title: `Good ${thisMonth}`
    };
  }

  if (timeframe === "next-3-months") {
    return {
      label: "For your timing",
      subtitle: "Cities that should feel especially good over the next stretch of the season.",
      title: "Good in the next few months"
    };
  }

  return {
    label: "Exploring",
    subtitle: "A calm place to start while you work out what kind of trip fits best.",
    title: "A few strong places to begin"
  };
}

function getStoredPreferences(): StoredPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredPreferences;

    return {
      completed: Boolean(parsedValue.completed),
      timeframe: parsedValue.timeframe ?? null,
      vibes: Array.isArray(parsedValue.vibes) ? parsedValue.vibes : []
    };
  } catch {
    return null;
  }
}

function saveStoredPreferences(preferences: StoredPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(preferences));
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

function buildDiscoveryCollections(
  baseCollections: HomepageDiscoveryViewModel[],
  cities: CityViewModel[],
  vibes: VibeId[],
  timeframe: TimeframeId | null
) {
  const hasPreferences = vibes.length > 0 || timeframe !== null;

  if (!hasPreferences) {
    return baseCollections;
  }

  const rankedCities = rankCities(cities, vibes, timeframe);
  const collections: HomepageDiscoveryViewModel[] = [];
  const primaryVibe = vibes[0];
  const secondaryVibe = vibes[1];

  if (primaryVibe) {
    collections.push({
      cities: rankedCities,
      label: "Picked for your vibe",
      slug: `vibe-${primaryVibe}`,
      subtitle: vibeCopy[primaryVibe].subtitle,
      title: vibeCopy[primaryVibe].title
    });
  }

  if (timeframe) {
    const timeframeCopy = getTimeframeCopy(timeframe);

    collections.push({
      cities: rankedCities,
      label: timeframeCopy.label,
      slug: `time-${timeframe}`,
      subtitle: timeframeCopy.subtitle,
      title: timeframeCopy.title
    });
  }

  if (secondaryVibe) {
    collections.push({
      cities: rankedCities,
      label: "Also worth a look",
      slug: `vibe-${secondaryVibe}`,
      subtitle: vibeCopy[secondaryVibe].subtitle,
      title: vibeCopy[secondaryVibe].title
    });
  }

  for (const collection of baseCollections) {
    if (collections.length >= 3) {
      break;
    }

    collections.push({
      ...collection,
      cities: prioritizeCollectionCities(collection, rankedCities)
    });
  }

  return collections.slice(0, 3);
}

function getPreferenceSummary(vibes: VibeId[], timeframe: TimeframeId | null) {
  const vibeLabels = vibeOptions
    .filter((option) => vibes.includes(option.id))
    .map((option) => option.label);

  const summaryParts = [] as string[];

  if (vibeLabels.length > 0) {
    summaryParts.push(vibeLabels.join(" + "));
  }

  if (timeframe === "this-month") {
    summaryParts.push("This month");
  }

  if (timeframe === "next-3-months") {
    summaryParts.push("Next 3 months");
  }

  if (timeframe === "just-exploring") {
    summaryParts.push("Just exploring");
  }

  return summaryParts.join(" · ");
}

export function DiscoveryExperience({ cities, collections }: DiscoveryExperienceProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeId | null>(null);
  const [vibes, setVibes] = useState<VibeId[]>([]);

  useEffect(() => {
    const storedPreferences = getStoredPreferences();

    if (!storedPreferences?.completed) {
      setShowOnboarding(true);
      return;
    }

    setVibes(storedPreferences.vibes);
    setTimeframe(storedPreferences.timeframe);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    if (showOnboarding) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showOnboarding]);

  const personalizedCollections = useMemo(() => {
    return buildDiscoveryCollections(collections, cities, vibes, timeframe);
  }, [cities, collections, timeframe, vibes]);

  const preferenceSummary = useMemo(() => {
    return getPreferenceSummary(vibes, timeframe);
  }, [timeframe, vibes]);

  const canContinue = vibes.length > 0 || timeframe !== null;

  function toggleVibe(vibe: VibeId) {
    setVibes((currentVibes: VibeId[]) => {
      if (currentVibes.includes(vibe)) {
        return currentVibes.filter((currentVibe: VibeId) => currentVibe !== vibe);
      }

      return [...currentVibes, vibe];
    });
  }

  function completeOnboarding() {
    const nextPreferences: StoredPreferences = {
      completed: true,
      timeframe,
      vibes
    };

    saveStoredPreferences(nextPreferences);
    setShowOnboarding(false);
  }

  function skipOnboarding() {
    const nextPreferences: StoredPreferences = {
      completed: true,
      timeframe: null,
      vibes: []
    };

    saveStoredPreferences(nextPreferences);
    setVibes([]);
    setTimeframe(null);
    setShowOnboarding(false);
  }

  return (
    <>
      {showOnboarding ? (
        <div className="onboarding-overlay">
          <div className="onboarding-panel">
            <p className="onboarding-brand">Wanderlust</p>
            <h1 className="onboarding-title">
              What kind of trip <span className="onboarding-title__accent">are you looking for?</span>
            </h1>

            <div className="onboarding-group">
              <p className="onboarding-group__label">Your vibe — pick all that fit</p>
              <div className="onboarding-chip-grid">
                {vibeOptions.map((option) => {
                  const isSelected = vibes.includes(option.id);

                  return (
                    <button
                      className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}`}
                      key={option.id}
                      onClick={() => toggleVibe(option.id)}
                      type="button"
                    >
                      <span className="onboarding-chip__icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="onboarding-group">
              <p className="onboarding-group__label">When are you thinking?</p>
              <div className="onboarding-chip-grid onboarding-chip-grid--timing">
                {timeframeOptions.map((option) => {
                  const isSelected = timeframe === option.id;

                  return (
                    <button
                      className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}`}
                      key={option.id}
                      onClick={() => setTimeframe(option.id)}
                      type="button"
                    >
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="onboarding-actions">
              <button
                className={`onboarding-explore${timeframe === "just-exploring" ? " onboarding-explore--selected" : ""}`}
                onClick={() => setTimeframe("just-exploring")}
                type="button"
              >
                Just exploring
              </button>
            </div>

            <div className="onboarding-footer">
              <button className="onboarding-submit" disabled={!canContinue} onClick={completeOnboarding} type="button">
                Show me cities
              </button>
              <button className="onboarding-skip" onClick={skipOnboarding} type="button">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="discovery-section" id="discover">
        <div className="site-shell">
          <div className="section-heading">
            <span className="section-label">Discovery</span>
            <h2 className="section-title">A few good places to begin.</h2>
            <p className="section-copy">A calm set of starting points for choosing the next city to open.</p>
          </div>

          <div className="discovery-section__controls">
            <p className="discovery-section__summary">
              {preferenceSummary || "Start with a few calm discovery paths, or tune the list to your current trip."}
            </p>
            <button className="text-link discovery-section__edit" onClick={() => setShowOnboarding(true)} type="button">
              {preferenceSummary ? "Adjust preferences" : "Set preferences"}
            </button>
          </div>

          <div className="discovery-grid">
            {personalizedCollections.map((collection: HomepageDiscoveryViewModel) => (
              <article className="discovery-card" key={collection.slug}>
                <span className="discovery-card__label">{collection.label}</span>
                <h3 className="discovery-card__title">{collection.title}</h3>
                <p className="discovery-card__subtitle">{collection.subtitle}</p>
                <div className="discovery-card__cities">
                  {collection.cities.map((city: CityViewModel) => (
                    <Link className="discovery-card__city" href={`/cities/${city.slug}`} key={city.slug}>
                      <span className="discovery-card__city-name">{city.name}</span>
                      <span className="discovery-card__city-country">{city.country}</span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
