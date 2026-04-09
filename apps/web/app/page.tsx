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

export default function HomePage() {
  // Stable client-side search state
  const [draftQuery, setDraftQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [committedParsedQuery, setCommittedParsedQuery] = useState<ParsedQuery | null>(null);
  const [filteredCities, setFilteredCities] = useState(getAllCities());

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
        const cities = getAllCities();
        const rankedResults = rankCitiesByQuery(cities, newParsedQuery);
        const results = rankedResults && rankedResults.length > 0 
          ? rankedResults.map(result => result?.city).filter(Boolean)
          : cities;
        setFilteredCities(results);
      } catch (error) {
        console.warn('Error during search processing:', error);
        setFilteredCities(getAllCities());
      }
    } else {
      setFilteredCities(getAllCities());
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
    setFilteredCities(getAllCities());
    updateURL("");
  };

  // Resolve active discovery lens at page level using committed state
  const activeDiscoveryLens = useMemo(() => {
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

  const onboardingHierarchy = useMemo<{
    primaryVibe: VibeId | null;
    secondaryVibes: VibeId[];
    timeframe: TimeframeId | null;
  }>(() => {
    return onboardingPreferences
      ? extractOnboardingHierarchy(onboardingPreferences)
      : {
          primaryVibe: null,
          secondaryVibes: [],
          timeframe: null
        };
  }, [onboardingPreferences]);

  // Generate search-driven collections with fallback system
  const searchCollections = useMemo(() => {
    if (activeDiscoveryLens.type !== 'search' || !activeDiscoveryLens.parsedQuery) {
      return [];
    }

    try {
      const cities = getAllCities();
      const rankedResults = rankCitiesByQuery(cities, activeDiscoveryLens.parsedQuery);
      
      const collections: HomepageDiscoveryViewModel[] = [];
      
      // Get primary intent for editorial direction
      const primaryIntent = activeDiscoveryLens.parsedQuery.intents.mood?.[0] || 
                           activeDiscoveryLens.parsedQuery.intents.season?.[0] || 
                           "Discovery";
      
      // Section 1 copy mapping for each pill
      const pillCopyMap: Record<string, { eyebrow: string; title: string; subcopy: string }> = {
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
          subcopy: "A tighter edit of places that give more back in less time \u2014 easy to enter, hard to leave."
        }
      };
      
      const copy = pillCopyMap[primaryIntent.toLowerCase()] || {
        eyebrow: primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1),
        title: `${primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1)} destinations`,
        subcopy: "A curated edit of places shaped by your interests."
      };
      
      // Editorial fallback mapping for weak matches
      const editorialFallbackMap: Record<string, string[]> = {
        romantic: ["slow", "food", "coastal"],
        food: ["market", "slow", "wine"],
        slow: ["romantic", "coastal"],
        summer: ["coastal", "weekend"],
        coastal: ["summer", "slow"],
        weekend: ["compact", "food", "romantic"]
      };
      
      // Section 1 - Primary active-lens section with fallback
      let primaryCities: CityViewModel[] = [];
      
      if (rankedResults && rankedResults.length > 0) {
        // Take top matches
        primaryCities = rankedResults.slice(0, 4).map((result) => result?.city).filter(Boolean) as CityViewModel[];
      }
      
      // Fallback: if not enough cities, expand with editorial relevance
      if (primaryCities.length < 3) {
        const fallbackIntents = editorialFallbackMap[primaryIntent.toLowerCase()] || [];
        const allCities = getAllCities();
        
        // Add cities that match fallback intents (simple editorial expansion)
        fallbackIntents.forEach(fallbackIntent => {
          if (primaryCities.length >= 4) return;
          
          const fallbackCities = allCities.filter((city) => 
            !primaryCities.some(pc => pc.slug === city.slug) &&
            (
              city.searchText?.includes(fallbackIntent) ||
              city.name?.toLowerCase().includes(fallbackIntent) ||
              city.cardSentence?.toLowerCase().includes(fallbackIntent) ||
              city.essence?.toLowerCase().includes(fallbackIntent)
            )
          ).slice(0, 4 - primaryCities.length);
          
          primaryCities.push(...fallbackCities);
        });
      }
      
      // Final fallback: if still not enough, add diverse cities
      if (primaryCities.length < 3) {
        const allCities = getAllCities();
        const remainingCities = allCities.filter((city) => 
          !primaryCities.some(pc => pc.slug === city.slug)
        ).slice(0, 4 - primaryCities.length);
        
        primaryCities.push(...remainingCities);
      }
      
      if (primaryCities.length > 0) {
        collections.push({
          cities: primaryCities,
          label: copy.eyebrow,
          slug: "primary-lens",
          subtitle: copy.subcopy,
          title: copy.title
        });
      }

      return collections;
    } catch (error) {
      console.warn('Error generating search collections:', error);
      return [];
    }
  }, [activeDiscoveryLens]);

  // Generate simplified collections based on discovery mode
  const activeCollections = useMemo(() => {
    if (activeDiscoveryLens.type === 'search') {
      // Search active: use search collections
      return searchCollections;
    }
    
    // Search inactive: always generate single primary onboarding collection
    const { primaryVibe, timeframe } = onboardingHierarchy;
    
    // Always generate a single collection, even without onboarding
    const allCities = getAllCities();
    
    let primaryCities: CityViewModel[] = [];
    let copy: { eyebrow: string; title: string; subcopy: string };
    
    if (primaryVibe) {
      // Generate based on primary vibe
      const rankedCities = rankCitiesByQuery(allCities, {
        original: '',
        normalized: '',
        tokens: [],
        intents: {
          city: [],
          mood: [primaryVibe],
          season: timeframe ? [timeframe] : []
        }
      });
      
      primaryCities = rankedCities?.slice(0, 4).map((result) => result?.city).filter(Boolean) as CityViewModel[] || allCities.slice(0, 4);
      
      // Get copy for primary vibe
      const vibeCopyMap: Record<string, { eyebrow: string; title: string; subcopy: string }> = {
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
      
      copy = vibeCopyMap[primaryVibe] || {
        eyebrow: "Discovery",
        title: "Cities worth exploring",
        subcopy: "A thoughtful edit of places for your next trip."
      };
    } else {
      // Fallback: generic discovery collection
      primaryCities = allCities.slice(0, 4);
      copy = {
        eyebrow: "For you",
        title: "Cities in focus",
        subcopy: "A thoughtful edit of places for your next trip."
      };
    }
    
    const finalCollections = [{
      cities: primaryCities,
      label: copy.eyebrow,
      slug: primaryVibe ? `primary-${primaryVibe}` : "primary-discovery",
      subtitle: copy.subcopy,
      title: copy.title
    }];
    
    return finalCollections;
  }, [activeDiscoveryLens.type, onboardingHierarchy, searchCollections]);

  // Generate simplified seasonal collections from parent-owned state
  const seasonalCollections = useMemo(() => {
    const allCities = getAllCities();
    const { timeframe } = onboardingHierarchy;
    const excludedSlugs = new Set((activeCollections[0]?.cities ?? []).map((city: CityViewModel) => city.slug));
    const seasonQuery = timeframe === 'this-month'
      ? 'this month'
      : timeframe === 'next-3-months'
        ? 'next few months'
        : 'this season';

    try {
      const rankedResults = rankCitiesByQuery(allCities, {
        original: seasonQuery,
        normalized: seasonQuery,
        tokens: [seasonQuery],
        intents: {
          city: [],
          mood: [],
          season: timeframe ? [timeframe] : ['current']
        }
      });

      const rankedCities = (rankedResults ?? [])
        .map((result) => result?.city)
        .filter(Boolean)
        .filter((city): city is CityViewModel => Boolean(city))
        .filter((city) => !excludedSlugs.has(city.slug));

      const fallbackCities = allCities.filter((city) => !excludedSlugs.has(city.slug));
      const seasonalCities = [...rankedCities, ...fallbackCities].slice(0, 3);

      if (seasonalCities.length === 0) {
        return [];
      }

      return [{
        cities: seasonalCities,
        label: 'Seasonal',
        slug: 'seasonal-continuation',
        subtitle: 'A timely edit of places where mood, season, and setting come together naturally.',
        title: 'Cities that feel right this season'
      }];
    } catch (error) {
      console.warn('Error generating seasonal collections:', error);

      const fallbackCities = allCities.filter((city) => !excludedSlugs.has(city.slug)).slice(0, 3);

      return fallbackCities.length > 0
        ? [{
            cities: fallbackCities,
            label: 'Seasonal',
            slug: 'seasonal-continuation',
            subtitle: 'A timely edit of places where mood, season, and setting come together naturally.',
            title: 'Cities that feel right this season'
          }]
        : [];
    }
  }, [activeCollections, onboardingHierarchy]);

  // Generate onboarding continuation collections from parent-owned state
  const onboardingCollections = useMemo(() => {
    if (activeDiscoveryLens.type !== 'search' || !onboardingHierarchy.primaryVibe) {
      return [];
    }

    const allCities = getAllCities();
    const primaryVibe = onboardingHierarchy.primaryVibe as VibeId;
    const { timeframe } = onboardingHierarchy;
    const excludedSlugs = new Set([
      ...(activeCollections[0]?.cities ?? []),
      ...(seasonalCollections[0]?.cities ?? [])
    ].map((city: CityViewModel) => city.slug));

    const onboardingCopyMap: Record<VibeId, { eyebrow: string; title: string; subcopy: string }> = {
      food: {
        eyebrow: 'For food lovers',
        title: 'Cities worth arriving hungry',
        subcopy: 'A few more cities shaped by markets, long lunches, and the kind of places you usually look for first.'
      },
      romantic: {
        eyebrow: 'For romantics',
        title: 'Cities for slower evenings',
        subcopy: 'A few more places shaped by atmosphere, softer light, and the kind of moments you usually travel for.'
      },
      culture: {
        eyebrow: 'For the curious',
        title: 'Cities that reveal themselves slowly',
        subcopy: 'A few more places where museums, architecture, and street life reward patient exploration.'
      },
      nature: {
        eyebrow: 'For nature seekers',
        title: 'Cities with room to breathe',
        subcopy: 'A few more places where parks, gardens, and open air give the experience more space.'
      },
      adventure: {
        eyebrow: 'For adventurers',
        title: 'Cities that energize',
        subcopy: 'A few more places where walks, viewpoints, and urban energy shape the rhythm of the stay.'
      },
      slow: {
        eyebrow: 'For slower travel',
        title: 'Cities that unfold gently',
        subcopy: 'A quieter edit of places where pace softens and the city reveals itself more gradually.'
      }
    };

    const rankedResults = rankCitiesByQuery(allCities, {
      original: '',
      normalized: '',
      tokens: [],
      intents: {
        city: [],
        mood: [primaryVibe],
        season: timeframe ? [timeframe] : []
      }
    });

    const rankedCities = (rankedResults ?? [])
      .map((result) => result?.city)
      .filter(Boolean)
      .filter((city) => !excludedSlugs.has(city.slug));

    const fallbackCities = allCities.filter((city) => !excludedSlugs.has(city.slug));
    const continuationCities = [...rankedCities, ...fallbackCities].slice(0, 3);

    if (continuationCities.length === 0) {
      return [];
    }

    const copy = onboardingCopyMap[primaryVibe];

    return [{
      cities: continuationCities,
      label: copy.eyebrow,
      slug: `onboarding-continuation-${primaryVibe}`,
      subtitle: copy.subcopy,
      title: copy.title
    }];
  }, [activeCollections, activeDiscoveryLens.type, onboardingHierarchy, seasonalCollections]);

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
              <SeasonalDiscoverySection collections={seasonalCollections} />
              
              {/* 3. Onboarding preference section (secondary, preserved) */}
              <PreferenceSeasonSection collections={onboardingCollections} />
              
              {/* 4. Explore more cities (final broader browsing) */}
              <CityBrowser cities={filteredCities} />
            </>
          ) : (
            <>
              {/* Search-inactive flow: simplified 3-section model */}
              {/* 1. Primary onboarding section */}
              <PersonalizedDiscoveryFlow collections={activeCollections} isSearchDriven={false} />
              
              {/* 2. Seasonal continuation section */}
              <SeasonalDiscoverySection collections={seasonalCollections} />
              
              {/* 3. Explore more cities */}
              <CityBrowser cities={filteredCities} />
            </>
          )}
        </main>
      </>
    </OnboardingGate>
  );
}
