"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllCities, type CityViewModel, type HomepageDiscoveryViewModel } from "../content";
import { CityBrowser } from "../components/city";
import { HeroSection } from "../components/home/HeroSection";
import { PersonalizedDiscoveryFlow } from "../components/home/PersonalizedDiscoveryFlow";
import { SearchSection } from "../components/home/SearchSection";
import { SeasonalDiscoverySection } from "../components/home/SeasonalDiscoverySection";
import { PreferenceSeasonSection } from "../components/home/PreferenceSeasonSection";
import { Header } from "../components/layout/Header";
import { OnboardingGate } from "../components/onboarding/OnboardingGate";
import { parseDiscoveryQuery, rankCitiesByQuery, type ParsedQuery } from "../components/home/discoverySearch";
import type { OnboardingPreferences } from "../components/onboarding/onboarding-types";

type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
type TimeframeId = "this-month" | "next-3-months";

function extractOnboardingHierarchy(preferences: OnboardingPreferences): {
  primaryVibe: VibeId | null;
  secondaryVibes: VibeId[];
  timeframe: TimeframeId | null;
} {
  const vibes = preferences.vibe as VibeId[];
  const timeframe = (preferences.tripStyle[0] as TimeframeId | undefined) ?? null;

  return {
    primaryVibe: vibes[0] ?? null,
    secondaryVibes: vibes.slice(1),
    timeframe
  };
}

type HomepageMode = "search-active" | "search-inactive";
type CanonicalSeasonIntent = "thismonth" | "next3months";

interface OnboardingHierarchy {
  primaryVibe: VibeId | null;
  secondaryVibes: VibeId[];
  timeframe: TimeframeId | null;
}

type ActiveDiscoveryLens =
  | {
      type: "search";
      query: string;
      parsedQuery: ParsedQuery;
      isActive: true;
    }
  | {
      type: "default";
      query: "";
      parsedQuery: null;
      isActive: false;
    };

interface SectionBuildResult {
  collections: HomepageDiscoveryViewModel[];
  shouldRender: boolean;
  reason: string;
}

interface CitySelectionResult {
  cities: CityViewModel[];
  reason: string;
}

const primaryVibeCopyMap: Record<VibeId, { eyebrow: string; title: string; subcopy: string }> = {
  food: {
    eyebrow: "Food",
    title: "Great for food lovers",
    subcopy: "A curated edit of places shaped by markets, long lunches, and the appetite that defines a trip."
  },
  romantic: {
    eyebrow: "Romantic",
    title: "Romantic destinations",
    subcopy: "A more thoughtful edit of cities shaped by atmosphere, pace, and shared moments."
  },
  culture: {
    eyebrow: "Culture",
    title: "Cities where culture leads the day",
    subcopy: "A thoughtful edit of places where museums, streets, and architectural stories reveal themselves slowly."
  },
  nature: {
    eyebrow: "Nature",
    title: "Cities with space to exhale",
    subcopy: "A calmer edit of places where parks, gardens, and open air give the city space to unfold."
  },
  adventure: {
    eyebrow: "Adventure",
    title: "Cities that keep the day moving",
    subcopy: "A dynamic edit of places where walks, viewpoints, and urban energy shape the experience."
  },
  slow: {
    eyebrow: "Slow",
    title: "Slower cities, softer days",
    subcopy: "Cities that reward a gentler pace, longer mornings, and less urgency in how you move through them."
  }
};

const searchPrimaryCopyMap: Record<string, { eyebrow: string; title: string; subcopy: string }> = {
  romantic: {
    eyebrow: "Romantic",
    title: "Romantic destinations",
    subcopy: "A more thoughtful edit of cities shaped by atmosphere, pace, and shared moments."
  },
  food: {
    eyebrow: "Food",
    title: "Cities worth arriving hungry",
    subcopy: "A curated edit of places shaped by markets, long lunches, and the appetite that defines a trip."
  },
  slow: {
    eyebrow: "Slow",
    title: "Slower cities, softer days",
    subcopy: "Cities that reward a gentler pace, longer mornings, and less urgency in how you move through them."
  },
  summer: {
    eyebrow: "Summer",
    title: "Summer cities in full light",
    subcopy: "A warmer edit of places that feel most alive in longer days, brighter evenings, and open-air rhythms."
  },
  coastal: {
    eyebrow: "Coastal",
    title: "Coastal places that linger",
    subcopy: "Cities where water, light, and a slower edge shape the rhythm of the stay."
  },
  weekend: {
    eyebrow: "Weekend",
    title: "Cities made for the weekend",
    subcopy: "A tighter edit of places that give more back in less time — easy to enter, hard to leave."
  },
  thismonth: {
    eyebrow: "Seasonal",
    title: "Cities that feel right this season",
    subcopy: "A timely edit of places where mood, season, and setting come together naturally."
  },
  next3months: {
    eyebrow: "Seasonal",
    title: "Cities for the season ahead",
    subcopy: "A forward-looking edit of places where the coming season brings out their best qualities."
  }
};

const searchEditorialFallbackMap: Record<string, string[]> = {
  romantic: ["slow", "food", "coastal"],
  food: ["market", "slow", "wine"],
  slow: ["romantic", "coastal"],
  summer: ["coastal", "weekend"],
  coastal: ["summer", "slow"],
  weekend: ["compact", "food", "romantic"],
  thismonth: ["food", "culture", "romantic"],
  next3months: ["nature", "slow", "food"]
};

const seasonalStrategyByTimeframe: Record<TimeframeId, {
  canonicalSeasonIntent: CanonicalSeasonIntent;
  editorialFallbackIntents: string[];
  queryLabel: string;
  subtitle: string;
  title: string;
}> = {
  "this-month": {
    canonicalSeasonIntent: "thismonth",
    editorialFallbackIntents: ["food", "culture", "romantic"],
    queryLabel: "this month",
    subtitle: "A timely edit of places where mood, season, and setting come together naturally.",
    title: "Cities that feel right this season"
  },
  "next-3-months": {
    canonicalSeasonIntent: "next3months",
    editorialFallbackIntents: ["nature", "slow", "food"],
    queryLabel: "next 3 months",
    subtitle: "A forward-looking edit of places where the coming season brings out their best qualities.",
    title: "Cities for the season ahead"
  }
};

const onboardingContinuationCopyMap: Record<VibeId, { eyebrow: string; title: string; subcopy: string }> = {
  food: {
    eyebrow: "For food lovers",
    title: "Cities worth arriving hungry",
    subcopy: "A few more cities shaped by markets, long lunches, and the kind of places you usually look for first."
  },
  romantic: {
    eyebrow: "For romantics",
    title: "Cities for slower evenings",
    subcopy: "A few more places shaped by atmosphere, softer light, and the kind of moments you usually travel for."
  },
  culture: {
    eyebrow: "For the curious",
    title: "Cities that reveal themselves slowly",
    subcopy: "A few more places where museums, architecture, and street life reward patient exploration."
  },
  nature: {
    eyebrow: "For nature seekers",
    title: "Cities with room to breathe",
    subcopy: "A few more places where parks, gardens, and open air give the experience more space."
  },
  adventure: {
    eyebrow: "For adventurers",
    title: "Cities that energize",
    subcopy: "A few more places where walks, viewpoints, and urban energy shape the rhythm of the stay."
  },
  slow: {
    eyebrow: "For slower travel",
    title: "Cities that unfold gently",
    subcopy: "A quieter edit of places where pace softens and the city reveals itself more gradually."
  }
};

function getCanonicalSeasonIntent(timeframe: TimeframeId | null): CanonicalSeasonIntent | null {
  if (timeframe === "this-month") {
    return "thismonth";
  }

  if (timeframe === "next-3-months") {
    return "next3months";
  }

  return null;
}

function buildParsedQuery(
  queryLabel: string,
  intents: {
    city?: string[];
    mood?: string[];
    season?: string[];
  }
): ParsedQuery {
  const normalized = queryLabel.trim().toLowerCase();

  return {
    original: queryLabel,
    normalized,
    tokens: normalized ? normalized.split(/\s+/).filter(Boolean) : [],
    intents: {
      city: intents.city ?? [],
      mood: intents.mood ?? [],
      season: intents.season ?? []
    }
  };
}

function appendUniqueCities(
  currentCities: CityViewModel[],
  nextCities: CityViewModel[],
  limit: number,
  excludedSlugs: Set<string>
): CityViewModel[] {
  const collectedCities = [...currentCities];
  const seenSlugs = new Set<string>([
    ...Array.from(excludedSlugs),
    ...collectedCities.map((city) => city.slug)
  ]);

  nextCities.forEach((city) => {
    if (collectedCities.length >= limit || seenSlugs.has(city.slug)) {
      return;
    }

    collectedCities.push(city);
    seenSlugs.add(city.slug);
  });

  return collectedCities;
}

function collectRankedCities(allCities: CityViewModel[], parsedQuery: ParsedQuery): CityViewModel[] {
  return rankCitiesByQuery(allCities, parsedQuery)
    .map((result) => result?.city)
    .filter((city): city is CityViewModel => Boolean(city));
}

function collectEditorialFallbackCities(
  allCities: CityViewModel[],
  fallbackIntents: string[],
  excludedSlugs: Set<string>,
  limit: number
): CityViewModel[] {
  const collectedCities: CityViewModel[] = [];
  const seenSlugs = new Set<string>(Array.from(excludedSlugs));

  fallbackIntents.forEach((fallbackIntent) => {
    if (collectedCities.length >= limit) {
      return;
    }

    const normalizedIntent = fallbackIntent.toLowerCase();
    const matchingCities = allCities.filter((city) => {
      if (seenSlugs.has(city.slug)) {
        return false;
      }

      return (
        city.searchText.includes(normalizedIntent) ||
        city.badge.toLowerCase().includes(normalizedIntent) ||
        city.cardSentence.toLowerCase().includes(normalizedIntent) ||
        city.essence.toLowerCase().includes(normalizedIntent)
      );
    });

    matchingCities.forEach((city) => {
      if (collectedCities.length >= limit || seenSlugs.has(city.slug)) {
        return;
      }

      collectedCities.push(city);
      seenSlugs.add(city.slug);
    });
  });

  return collectedCities;
}

function getRemainingCities(allCities: CityViewModel[], excludedSlugs: Set<string>): CityViewModel[] {
  return allCities.filter((city) => !excludedSlugs.has(city.slug));
}

function getExcludedSlugsFromCollections(collections: HomepageDiscoveryViewModel[]): Set<string> {
  return new Set(
    collections.flatMap((collection) => collection.cities.map((city) => city.slug))
  );
}

function getMinimumRenderableCityCount(allCitiesCount: number, limit: number): number {
  if (allCitiesCount <= 0) {
    return 0;
  }

  if (allCitiesCount === 1) {
    return 1;
  }

  return Math.min(2, limit);
}

function appendReusableCities(
  currentCities: CityViewModel[],
  nextCities: CityViewModel[],
  limit: number
): CityViewModel[] {
  const collectedCities = [...currentCities];
  const seenSlugs = new Set<string>(collectedCities.map((city) => city.slug));

  nextCities.forEach((city) => {
    if (collectedCities.length >= limit || seenSlugs.has(city.slug)) {
      return;
    }

    collectedCities.push(city);
    seenSlugs.add(city.slug);
  });

  return collectedCities;
}

function buildSectionResult(
  collections: HomepageDiscoveryViewModel[],
  shouldRender: boolean,
  reason: string
): SectionBuildResult {
  return {
    collections,
    shouldRender,
    reason
  };
}

function resolveSectionCities(args: {
  allCities: CityViewModel[];
  preferredCities: CityViewModel[];
  editorialFallbackCities: CityViewModel[];
  excludedSlugs: Set<string>;
  limit: number;
}): CitySelectionResult {
  const { allCities, preferredCities, editorialFallbackCities, excludedSlugs, limit } = args;
  const minimumRenderableCityCount = getMinimumRenderableCityCount(allCities.length, limit);

  let selectedCities = appendUniqueCities([], preferredCities, limit, excludedSlugs);

  if (selectedCities.length >= minimumRenderableCityCount) {
    return {
      cities: selectedCities,
      reason: "unique-preferred"
    };
  }

  selectedCities = appendUniqueCities(selectedCities, editorialFallbackCities, limit, excludedSlugs);

  if (selectedCities.length >= minimumRenderableCityCount) {
    return {
      cities: selectedCities,
      reason: "unique-editorial-fallback"
    };
  }

  selectedCities = appendUniqueCities(selectedCities, getRemainingCities(allCities, excludedSlugs), limit, excludedSlugs);

  if (selectedCities.length >= minimumRenderableCityCount) {
    return {
      cities: selectedCities,
      reason: "unique-broad-fallback"
    };
  }

  selectedCities = appendReusableCities(selectedCities, preferredCities, limit);

  if (selectedCities.length >= minimumRenderableCityCount) {
    return {
      cities: selectedCities,
      reason: "reused-preferred-fallback"
    };
  }

  selectedCities = appendReusableCities(selectedCities, editorialFallbackCities, limit);

  if (selectedCities.length >= minimumRenderableCityCount) {
    return {
      cities: selectedCities,
      reason: "reused-editorial-fallback"
    };
  }

  selectedCities = appendReusableCities(selectedCities, allCities, limit);

  return {
    cities: selectedCities,
    reason: selectedCities.length >= minimumRenderableCityCount ? "reused-broad-fallback" : selectedCities.length > 0 ? "partial-fallback" : "no-cities"
  };
}

function buildPrimaryCollections(args: {
  activeDiscoveryLens: ActiveDiscoveryLens;
  allCities: CityViewModel[];
  onboardingHierarchy: OnboardingHierarchy;
}): SectionBuildResult {
  const { activeDiscoveryLens, allCities, onboardingHierarchy } = args;

  if (allCities.length === 0) {
    return buildSectionResult([], false, "primary-no-cities");
  }

  if (activeDiscoveryLens.type === "search") {
    const primaryIntent = activeDiscoveryLens.parsedQuery.intents.mood[0] || activeDiscoveryLens.parsedQuery.intents.season[0] || activeDiscoveryLens.parsedQuery.intents.city[0] || "Discovery";
    const copy = searchPrimaryCopyMap[primaryIntent.toLowerCase()] || {
      eyebrow: primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1),
      title: `${primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1)} destinations`,
      subcopy: "A curated edit of places shaped by your interests."
    };

    const selection = resolveSectionCities({
      allCities,
      preferredCities: collectRankedCities(allCities, activeDiscoveryLens.parsedQuery),
      editorialFallbackCities: collectEditorialFallbackCities(
        allCities,
        searchEditorialFallbackMap[primaryIntent.toLowerCase()] ?? [],
        new Set<string>(),
        4
      ),
      excludedSlugs: new Set<string>(),
      limit: 4
    });

    const collections = selection.cities.length > 0
      ? [{
          cities: selection.cities,
          label: copy.eyebrow,
          slug: "primary-lens",
          subtitle: copy.subcopy,
          title: copy.title
        }]
      : [];

    return buildSectionResult(collections, collections.length > 0, `primary-search-${selection.reason}`);
  }

  const { primaryVibe, secondaryVibes, timeframe } = onboardingHierarchy;

  if (!primaryVibe) {
    return buildSectionResult(
      [{
        cities: allCities.slice(0, 4),
        label: "For you",
        slug: "primary-discovery",
        subtitle: "A thoughtful edit of places for your next trip.",
        title: "Cities in focus"
      }],
      true,
      "primary-generic-fallback-no-onboarding"
    );
  }

  const canonicalSeasonIntent = getCanonicalSeasonIntent(timeframe);
  const selection = resolveSectionCities({
    allCities,
    preferredCities: collectRankedCities(
      allCities,
      buildParsedQuery(primaryVibe, {
        mood: [primaryVibe],
        season: canonicalSeasonIntent ? [canonicalSeasonIntent] : []
      })
    ),
    editorialFallbackCities: collectEditorialFallbackCities(
      allCities,
      secondaryVibes.length > 0 ? secondaryVibes : searchEditorialFallbackMap[primaryVibe] ?? [],
      new Set<string>(),
      4
    ),
    excludedSlugs: new Set<string>(),
    limit: 4
  });

  const copy = primaryVibeCopyMap[primaryVibe];

  return buildSectionResult(
    [{
      cities: selection.cities,
      label: copy.eyebrow,
      slug: `primary-${primaryVibe}`,
      subtitle: copy.subcopy,
      title: copy.title
    }],
    selection.cities.length > 0,
    `primary-onboarding-${selection.reason}`
  );
}

function buildSeasonalCollections(args: {
  allCities: CityViewModel[];
  excludeSlugs: Set<string>;
  homepageMode: HomepageMode;
  onboardingHierarchy: OnboardingHierarchy;
  timeframe: TimeframeId | null;
}): SectionBuildResult {
  const { allCities, excludeSlugs, homepageMode, onboardingHierarchy, timeframe } = args;

  if (allCities.length === 0) {
    return buildSectionResult([], false, "seasonal-no-cities");
  }

  const shouldAttemptSeasonal = homepageMode === "search-active" || Boolean(onboardingHierarchy.primaryVibe) || Boolean(onboardingHierarchy.timeframe);

  if (!shouldAttemptSeasonal) {
    return buildSectionResult([], false, "seasonal-skipped-no-signal");
  }

  const strategy = timeframe
    ? seasonalStrategyByTimeframe[timeframe]
    : seasonalStrategyByTimeframe["this-month"];

  const selection = resolveSectionCities({
    allCities,
    preferredCities: collectRankedCities(
      allCities,
      buildParsedQuery(strategy.queryLabel, {
        season: [strategy.canonicalSeasonIntent]
      })
    ),
    editorialFallbackCities: collectEditorialFallbackCities(
      allCities,
      strategy.editorialFallbackIntents,
      excludeSlugs,
      3
    ),
    excludedSlugs: excludeSlugs,
    limit: 3
  });

  const minimumRenderableCityCount = getMinimumRenderableCityCount(allCities.length, 3);
  const shouldRender = selection.cities.length >= minimumRenderableCityCount;
  const collections = shouldRender
    ? [{
        cities: selection.cities,
        label: "Seasonal",
        slug: "seasonal-continuation",
        subtitle: strategy.subtitle,
        title: strategy.title
      }]
    : [];

  return buildSectionResult(collections, shouldRender, `seasonal-${selection.reason}`);
}

function buildContinuationCollections(args: {
  allCities: CityViewModel[];
  excludeSlugs: Set<string>;
  homepageMode: HomepageMode;
  onboardingHierarchy: OnboardingHierarchy;
}): SectionBuildResult {
  const { allCities, excludeSlugs, homepageMode, onboardingHierarchy } = args;
  const { primaryVibe, secondaryVibes, timeframe } = onboardingHierarchy;

  if (allCities.length === 0) {
    return buildSectionResult([], false, "continuation-no-cities");
  }

  if (homepageMode !== "search-active") {
    return buildSectionResult([], false, "continuation-skipped-search-inactive");
  }

  if (!primaryVibe) {
    return buildSectionResult([], false, "continuation-skipped-no-onboarding-primary");
  }

  const canonicalSeasonIntent = getCanonicalSeasonIntent(timeframe);
  const selection = resolveSectionCities({
    allCities,
    preferredCities: collectRankedCities(
      allCities,
      buildParsedQuery(primaryVibe, {
        mood: [primaryVibe],
        season: canonicalSeasonIntent ? [canonicalSeasonIntent] : []
      })
    ),
    editorialFallbackCities: collectEditorialFallbackCities(
      allCities,
      secondaryVibes.length > 0 ? secondaryVibes : searchEditorialFallbackMap[primaryVibe] ?? [],
      excludeSlugs,
      3
    ),
    excludedSlugs: excludeSlugs,
    limit: 3
  });

  const minimumRenderableCityCount = getMinimumRenderableCityCount(allCities.length, 3);
  const shouldRender = selection.cities.length >= minimumRenderableCityCount;

  if (!shouldRender) {
    return buildSectionResult([], false, `continuation-${selection.reason}`);
  }

  const copy = onboardingContinuationCopyMap[primaryVibe];

  return buildSectionResult(
    [{
      cities: selection.cities,
      label: copy.eyebrow,
      slug: `onboarding-continuation-${primaryVibe}`,
      subtitle: copy.subcopy,
      title: copy.title
    }],
    true,
    `continuation-${selection.reason}`
  );
}

export default function HomePage() {
  const allCities = useMemo(() => getAllCities(), []);

  // Stable client-side search state
  const [draftQuery, setDraftQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [committedParsedQuery, setCommittedParsedQuery] = useState<ParsedQuery | null>(null);
  const [filteredCities, setFilteredCities] = useState<CityViewModel[]>(allCities);

  // Safe URL query parameter sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get('q') || '';
      if (urlQuery) {
        try {
          const parsed = parseDiscoveryQuery(urlQuery);
          setCommittedQuery(urlQuery);
          setCommittedParsedQuery(parsed);
        } catch (error) {
          console.warn('Failed to parse URL query:', urlQuery, error);
        }
      }
    }
  }, []);

  // Read onboarding preferences from localStorage
  const onboardingPreferences = useMemo((): OnboardingPreferences | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const storageKey = "wanderlust_onboarding";
      const rawValue = window.localStorage.getItem(storageKey);
      
      if (!rawValue) return null;
      
      const parsedValue = JSON.parse(rawValue);
      
      if (parsedValue.completed !== true && parsedValue.skipped !== true) {
        return null;
      }
      
      const normalizedPreferences = {
        mood: Array.isArray(parsedValue.preferences?.mood) ? parsedValue.preferences.mood : [],
        pace: typeof parsedValue.preferences?.pace === "string" ? parsedValue.preferences.pace : "",
        foodInterest: Array.isArray(parsedValue.preferences?.foodInterest) ? parsedValue.preferences.foodInterest : [],
        vibe: Array.isArray(parsedValue.preferences?.vibe) ? parsedValue.preferences.vibe : [],
        tripStyle: Array.isArray(parsedValue.preferences?.tripStyle) ? parsedValue.preferences.tripStyle : []
      };
      
      return normalizedPreferences;
    } catch (error) {
      console.warn('Failed to read onboarding preferences:', error);
      return null;
    }
  }, []);

  // Safe URL update function
  const updateURL = (newQuery: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newQuery.trim()) {
        url.searchParams.set('q', newQuery.trim());
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Handle draft input changes - only updates visual state, not discovery
  const handleDraftChange = (newDraftQuery: string) => {
    setDraftQuery(newDraftQuery);
  };

  // Handle search submission - commits the query and updates discovery
  const handleSearchSubmit = (newQuery: string, newParsedQuery: ParsedQuery | null) => {
    setCommittedQuery(newQuery);
    setCommittedParsedQuery(newParsedQuery);
    
    if (newQuery && newParsedQuery) {
      try {
        const rankedResults = rankCitiesByQuery(allCities, newParsedQuery);
        const results = rankedResults && rankedResults.length > 0 
          ? rankedResults
              .map((result) => result?.city)
              .filter((city): city is CityViewModel => Boolean(city))
          : allCities;
        setFilteredCities(results);
      } catch (error) {
        console.warn('Error during search processing:', error);
        setFilteredCities(allCities);
      }
    } else {
      setFilteredCities(allCities);
    }
    
    // Update URL to reflect committed state
    updateURL(newQuery);
    
    // Sync draft with committed
    setDraftQuery(newQuery);
  };

  // Handle pill click - immediate commit
  const handlePillClick = (pillQuery: string) => {
    try {
      const parsed = parseDiscoveryQuery(pillQuery);
      handleSearchSubmit(pillQuery, parsed);
    } catch (error) {
      console.warn('Failed to parse pill query:', pillQuery, error);
    }
  };

  // Handle suggestion selection - commit the query
  const handleSuggestionSelect = (suggestionQuery: string) => {
    try {
      const parsed = parseDiscoveryQuery(suggestionQuery);
      handleSearchSubmit(suggestionQuery, parsed);
    } catch (error) {
      console.warn('Failed to parse suggestion query:', suggestionQuery, error);
    }
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setDraftQuery("");
    setCommittedQuery("");
    setCommittedParsedQuery(null);
    setFilteredCities(allCities);
    updateURL("");
  };

  // Resolve active discovery lens at page level using committed state
  const activeDiscoveryLens = useMemo<ActiveDiscoveryLens>(() => {
    // Priority 1: Active search query (committed state)
    if (committedQuery && committedQuery.trim() && committedParsedQuery) {
      return {
        type: 'search',
        query: committedQuery,
        parsedQuery: committedParsedQuery,
        isActive: true
      };
    }
    
    // Priority 2: Default (onboarding could be added here later)
    return {
      type: 'default',
      query: '',
      parsedQuery: null,
      isActive: false
    };
  }, [committedQuery, committedParsedQuery]);

  const onboardingHierarchy = useMemo<OnboardingHierarchy>(() => {
    return onboardingPreferences
      ? extractOnboardingHierarchy(onboardingPreferences)
      : {
          primaryVibe: null,
          secondaryVibes: [],
          timeframe: null
        };
  }, [onboardingPreferences]);

  const homepageMode: HomepageMode = activeDiscoveryLens.type === 'search' ? 'search-active' : 'search-inactive';

  const primarySectionBuild = useMemo(() => {
    return buildPrimaryCollections({
      activeDiscoveryLens,
      allCities,
      onboardingHierarchy
    });
  }, [activeDiscoveryLens, allCities, onboardingHierarchy]);

  const activeCollections = primarySectionBuild.collections;

  const excludedAfterPrimary = useMemo<Set<string>>(() => {
    return getExcludedSlugsFromCollections(activeCollections);
  }, [activeCollections]);

  const seasonalSectionBuild = useMemo(() => {
    return buildSeasonalCollections({
      allCities,
      excludeSlugs: excludedAfterPrimary,
      homepageMode,
      onboardingHierarchy,
      timeframe: onboardingHierarchy.timeframe
    });
  }, [allCities, excludedAfterPrimary, homepageMode, onboardingHierarchy, onboardingHierarchy.timeframe]);

  const seasonalCollections = seasonalSectionBuild.collections;

  const excludedAfterPrimaryAndSeasonal = useMemo<Set<string>>(() => {
    const seasonalExcludedSlugs = getExcludedSlugsFromCollections(seasonalCollections);
    const mergedExcludedSlugs: string[] = [
      ...excludedAfterPrimary.values(),
      ...seasonalExcludedSlugs.values()
    ];

    return new Set<string>(mergedExcludedSlugs);
  }, [excludedAfterPrimary, seasonalCollections]);

  const continuationSectionBuild = useMemo(() => {
    return buildContinuationCollections({
      allCities,
      excludeSlugs: excludedAfterPrimaryAndSeasonal,
      homepageMode,
      onboardingHierarchy
    });
  }, [allCities, excludedAfterPrimaryAndSeasonal, homepageMode, onboardingHierarchy]);

  const onboardingCollections = continuationSectionBuild.collections;
  const shouldRenderSeasonalSection = seasonalSectionBuild.shouldRender;
  const shouldRenderOnboardingSection = continuationSectionBuild.shouldRender;

  const finalVisibleStack = useMemo(() => {
    const stack: Array<{
      component: string;
      visible: boolean;
      reason: string;
      collectionSlugs?: string[];
      cityCount?: number;
    }> = [
      {
        component: 'PersonalizedDiscoveryFlow',
        visible: true,
        reason: primarySectionBuild.reason,
        collectionSlugs: activeCollections.map((collection: HomepageDiscoveryViewModel) => collection.slug)
      }
    ];

    if (shouldRenderSeasonalSection) {
      stack.push({
        component: 'SeasonalDiscoverySection',
        visible: true,
        reason: seasonalSectionBuild.reason,
        collectionSlugs: seasonalCollections.map((collection: HomepageDiscoveryViewModel) => collection.slug)
      });
    }

    if (shouldRenderOnboardingSection) {
      stack.push({
        component: 'PreferenceSeasonSection',
        visible: true,
        reason: continuationSectionBuild.reason,
        collectionSlugs: onboardingCollections.map((collection: HomepageDiscoveryViewModel) => collection.slug)
      });
    }

    stack.push({
      component: 'CityBrowser',
      visible: true,
      reason: filteredCities.length > 0 ? 'renders-grid' : 'renders-empty-state',
      cityCount: filteredCities.length
    });

    return stack;
  }, [activeCollections, continuationSectionBuild.reason, filteredCities, onboardingCollections, primarySectionBuild.reason, seasonalCollections, seasonalSectionBuild.reason, shouldRenderOnboardingSection, shouldRenderSeasonalSection]);

  useEffect(() => {
    const summarizeCollections = (collections: HomepageDiscoveryViewModel[]) => {
      return collections.map((collection) => ({
        slug: collection.slug,
        label: collection.label,
        title: collection.title,
        cityCount: collection.cities.length,
        citySlugs: collection.cities.map((city) => city.slug)
      }));
    };

    console.log('[homepage-debug] homepageMode', homepageMode);
    console.log('[homepage-debug] activeCollections', summarizeCollections(activeCollections));
    console.log('[homepage-debug] seasonalCollections', summarizeCollections(seasonalCollections));
    console.log('[homepage-debug] onboardingCollections', summarizeCollections(onboardingCollections));
    console.log('[homepage-debug] finalVisibleStack', finalVisibleStack);
  }, [activeCollections, finalVisibleStack, homepageMode, onboardingCollections, seasonalCollections]);

  return (
    <OnboardingGate>
      <>
        <Header />

        <main className="page-main">
          <div className="page-main__guided-start">
            <HeroSection />
            <SearchSection 
              draftQuery={draftQuery}
              committedQuery={committedQuery}
              onDraftChange={handleDraftChange}
              onSubmit={handleSearchSubmit}
              onPillClick={handlePillClick}
              onSuggestionSelect={handleSuggestionSelect}
              onClear={handleClearSearch}
            />
          </div>

          {/* Search-active flow: active pill → seasonal → onboarding preference → explore */}
          {activeDiscoveryLens.type === 'search' ? (
            <>
              {/* 1. Active selected-pill section (primary) */}
              <PersonalizedDiscoveryFlow collections={activeCollections} isSearchDriven />
              
              {/* 2. Seasonal continuation section */}
              {shouldRenderSeasonalSection ? <SeasonalDiscoverySection collections={seasonalCollections} /> : null}
              
              {/* 3. Onboarding preference section (secondary, preserved) */}
              {shouldRenderOnboardingSection ? <PreferenceSeasonSection collections={onboardingCollections} /> : null}
              
              {/* 4. Explore more cities (final broader browsing) */}
              <CityBrowser cities={filteredCities} />
            </>
          ) : (
            <>
              {/* Search-inactive flow: simplified 3-section model */}
              {/* 1. Primary onboarding section */}
              <PersonalizedDiscoveryFlow collections={activeCollections} isSearchDriven={false} />
              
              {/* 2. Seasonal continuation section */}
              {shouldRenderSeasonalSection ? <SeasonalDiscoverySection collections={seasonalCollections} /> : null}
              
              {/* 3. Explore more cities */}
              <CityBrowser cities={filteredCities} />
            </>
          )}
        </main>
      </>
    </OnboardingGate>
  );
}
