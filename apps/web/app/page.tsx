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

function buildPrimaryCollections(args: {
  activeDiscoveryLens: ActiveDiscoveryLens;
  allCities: CityViewModel[];
  onboardingHierarchy: OnboardingHierarchy;
}): HomepageDiscoveryViewModel[] {
  const { activeDiscoveryLens, allCities, onboardingHierarchy } = args;

  if (allCities.length === 0) {
    return [];
  }

  if (activeDiscoveryLens.type === "search") {
    const primaryIntent = activeDiscoveryLens.parsedQuery.intents.mood[0] || activeDiscoveryLens.parsedQuery.intents.season[0] || "Discovery";
    const copy = searchPrimaryCopyMap[primaryIntent.toLowerCase()] || {
      eyebrow: primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1),
      title: `${primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1)} destinations`,
      subcopy: "A curated edit of places shaped by your interests."
    };

    let primaryCities = appendUniqueCities(
      [],
      collectRankedCities(allCities, activeDiscoveryLens.parsedQuery),
      4,
      new Set<string>()
    );

    if (primaryCities.length < 3) {
      primaryCities = appendUniqueCities(
        primaryCities,
        collectEditorialFallbackCities(
          allCities,
          searchEditorialFallbackMap[primaryIntent.toLowerCase()] ?? [],
          new Set(primaryCities.map((city) => city.slug)),
          4 - primaryCities.length
        ),
        4,
        new Set<string>()
      );
    }

    if (primaryCities.length < 3) {
      primaryCities = appendUniqueCities(primaryCities, allCities, 4, new Set<string>());
    }

    return primaryCities.length > 0
      ? [{
          cities: primaryCities,
          label: copy.eyebrow,
          slug: "primary-lens",
          subtitle: copy.subcopy,
          title: copy.title
        }]
      : [];
  }

  const { primaryVibe, timeframe } = onboardingHierarchy;

  if (!primaryVibe) {
    return [{
      cities: allCities.slice(0, 4),
      label: "For you",
      slug: "primary-discovery",
      subtitle: "A thoughtful edit of places for your next trip.",
      title: "Cities in focus"
    }];
  }

  const canonicalSeasonIntent = getCanonicalSeasonIntent(timeframe);
  let primaryCities = appendUniqueCities(
    [],
    collectRankedCities(
      allCities,
      buildParsedQuery(primaryVibe, {
        mood: [primaryVibe],
        season: canonicalSeasonIntent ? [canonicalSeasonIntent] : []
      })
    ),
    4,
    new Set<string>()
  );

  if (primaryCities.length === 0) {
    primaryCities = allCities.slice(0, 4);
  }

  const copy = primaryVibeCopyMap[primaryVibe];

  return [{
    cities: primaryCities,
    label: copy.eyebrow,
    slug: `primary-${primaryVibe}`,
    subtitle: copy.subcopy,
    title: copy.title
  }];
}

function buildSeasonalCollections(args: {
  allCities: CityViewModel[];
  excludeSlugs: Set<string>;
  timeframe: TimeframeId | null;
}): HomepageDiscoveryViewModel[] {
  const { allCities, excludeSlugs, timeframe } = args;
  const strategy = timeframe
    ? seasonalStrategyByTimeframe[timeframe]
    : seasonalStrategyByTimeframe["this-month"];

  let seasonalCities = appendUniqueCities(
    [],
    collectRankedCities(
      allCities,
      buildParsedQuery(strategy.queryLabel, {
        season: [strategy.canonicalSeasonIntent]
      })
    ),
    3,
    excludeSlugs
  );

  if (seasonalCities.length < 3) {
    seasonalCities = appendUniqueCities(
      seasonalCities,
      collectEditorialFallbackCities(
        allCities,
        strategy.editorialFallbackIntents,
        new Set([
          ...Array.from(excludeSlugs),
          ...seasonalCities.map((city) => city.slug)
        ]),
        3 - seasonalCities.length
      ),
      3,
      excludeSlugs
    );
  }

  if (seasonalCities.length < 3) {
    seasonalCities = appendUniqueCities(
      seasonalCities,
      getRemainingCities(allCities, excludeSlugs),
      3,
      excludeSlugs
    );
  }

  return seasonalCities.length > 0
    ? [{
        cities: seasonalCities,
        label: "Seasonal",
        slug: "seasonal-continuation",
        subtitle: strategy.subtitle,
        title: strategy.title
      }]
    : [];
}

function buildOnboardingContinuationCollections(args: {
  allCities: CityViewModel[];
  excludeSlugs: Set<string>;
  homepageMode: HomepageMode;
  onboardingHierarchy: OnboardingHierarchy;
}): HomepageDiscoveryViewModel[] {
  const { allCities, excludeSlugs, homepageMode, onboardingHierarchy } = args;
  const { primaryVibe, secondaryVibes, timeframe } = onboardingHierarchy;

  if (homepageMode !== "search-active" || !primaryVibe) {
    return [];
  }

  const canonicalSeasonIntent = getCanonicalSeasonIntent(timeframe);
  let continuationCities = appendUniqueCities(
    [],
    collectRankedCities(
      allCities,
      buildParsedQuery(primaryVibe, {
        mood: [primaryVibe],
        season: canonicalSeasonIntent ? [canonicalSeasonIntent] : []
      })
    ),
    3,
    excludeSlugs
  );

  if (continuationCities.length < 3 && secondaryVibes.length > 0) {
    continuationCities = appendUniqueCities(
      continuationCities,
      collectEditorialFallbackCities(
        allCities,
        secondaryVibes,
        new Set([
          ...Array.from(excludeSlugs),
          ...continuationCities.map((city) => city.slug)
        ]),
        3 - continuationCities.length
      ),
      3,
      excludeSlugs
    );
  }

  if (continuationCities.length < 3) {
    continuationCities = appendUniqueCities(
      continuationCities,
      getRemainingCities(allCities, excludeSlugs),
      3,
      excludeSlugs
    );
  }

  if (continuationCities.length === 0) {
    return [];
  }

  const copy = onboardingContinuationCopyMap[primaryVibe];

  return [{
    cities: continuationCities,
    label: copy.eyebrow,
    slug: `onboarding-continuation-${primaryVibe}`,
    subtitle: copy.subcopy,
    title: copy.title
  }];
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

  const activeCollections = useMemo(() => {
    return buildPrimaryCollections({
      activeDiscoveryLens,
      allCities,
      onboardingHierarchy
    });
  }, [activeDiscoveryLens, allCities, onboardingHierarchy]);

  const excludedAfterPrimary = useMemo<Set<string>>(() => {
    return getExcludedSlugsFromCollections(activeCollections);
  }, [activeCollections]);

  // Generate simplified seasonal collections from parent-owned state
  const seasonalCollections = useMemo(() => {
    if (excludedAfterPrimary.size >= allCities.length) {
      return [];
    }

    return buildSeasonalCollections({
      allCities,
      excludeSlugs: excludedAfterPrimary,
      timeframe: onboardingHierarchy.timeframe
    });
  }, [allCities, excludedAfterPrimary, onboardingHierarchy.timeframe]);

  const excludedAfterPrimaryAndSeasonal = useMemo<Set<string>>(() => {
    const seasonalExcludedSlugs = getExcludedSlugsFromCollections(seasonalCollections);
    const mergedExcludedSlugs: string[] = [
      ...excludedAfterPrimary.values(),
      ...seasonalExcludedSlugs.values()
    ];

    return new Set<string>(mergedExcludedSlugs);
  }, [excludedAfterPrimary, seasonalCollections]);

  // Generate onboarding continuation collections from parent-owned state
  const onboardingCollections = useMemo(() => {
    if (homepageMode !== 'search-active') {
      return [];
    }

    if (excludedAfterPrimaryAndSeasonal.size >= allCities.length) {
      return [];
    }

    return buildOnboardingContinuationCollections({
      allCities,
      excludeSlugs: excludedAfterPrimaryAndSeasonal,
      homepageMode,
      onboardingHierarchy
    });
  }, [allCities, excludedAfterPrimaryAndSeasonal, homepageMode, onboardingHierarchy]);

  const shouldRenderSeasonalSection = useMemo(() => {
    return seasonalCollections.length > 0 && excludedAfterPrimary.size < allCities.length;
  }, [allCities.length, excludedAfterPrimary, seasonalCollections]);

  const shouldRenderOnboardingSection = useMemo(() => {
    return (
      homepageMode === 'search-active' &&
      onboardingCollections.length > 0 &&
      excludedAfterPrimaryAndSeasonal.size < allCities.length
    );
  }, [allCities.length, excludedAfterPrimaryAndSeasonal, homepageMode, onboardingCollections]);

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
        reason: activeCollections.length > 0 ? 'mounted-primary-collection' : 'mounted-empty-primary-fallback',
        collectionSlugs: activeCollections.map((collection: HomepageDiscoveryViewModel) => collection.slug)
      }
    ];

    if (shouldRenderSeasonalSection) {
      stack.push({
        component: 'SeasonalDiscoverySection',
        visible: true,
        reason: seasonalCollections[0]?.cities.length === 3 ? 'mounted-seasonal-continuation' : 'mounted-seasonal-tiny-dataset-fallback',
        collectionSlugs: seasonalCollections.map((collection: HomepageDiscoveryViewModel) => collection.slug)
      });
    }

    if (shouldRenderOnboardingSection) {
      stack.push({
        component: 'PreferenceSeasonSection',
        visible: true,
        reason: onboardingCollections[0]?.cities.length === 3 ? 'mounted-onboarding-continuation' : 'mounted-onboarding-tiny-dataset-fallback',
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
  }, [activeCollections, filteredCities, onboardingCollections, seasonalCollections, shouldRenderOnboardingSection, shouldRenderSeasonalSection]);

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
