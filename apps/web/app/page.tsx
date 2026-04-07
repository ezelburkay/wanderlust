"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllCities, getHomepageDiscovery } from "../content";
import { CityBrowser } from "../components/city";
import { HeroSection } from "../components/home/HeroSection";
import { PersonalizedDiscoveryFlow } from "../components/home/PersonalizedDiscoveryFlow";
import { SearchSection } from "../components/home/SearchSection";
import { SeasonalDiscoverySection } from "../components/home/SeasonalDiscoverySection";
import { PreferenceSeasonSection } from "../components/home/PreferenceSeasonSection";
import { Header } from "../components/layout/Header";
import { OnboardingGate } from "../components/onboarding/OnboardingGate";
import { parseDiscoveryQuery, rankCitiesByQuery, type ParsedQuery } from "../components/home/discoverySearch";

export default function HomePage() {
  // Stable client-side search state
  const [query, setQuery] = useState("");
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);
  const [filteredCities, setFilteredCities] = useState(getAllCities());

  // Safe URL sync - read URL on mount only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlQuery = urlParams.get('q')?.trim() ?? "";
      
      if (urlQuery) {
        setQuery(urlQuery);
        const parsed = parseDiscoveryQuery(urlQuery);
        setParsedQuery(parsed);
        
        const cities = getAllCities();
        const rankedResults = rankCitiesByQuery(cities, parsed);
        const results = rankedResults && rankedResults.length > 0 
          ? rankedResults.map(result => result?.city).filter(Boolean)
          : cities;
        setFilteredCities(results);
      }
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

  // Handle search changes - unified state management
  const handleSearchChange = (newQuery: string, newParsedQuery: ParsedQuery | null) => {
    setQuery(newQuery);
    setParsedQuery(newParsedQuery);
    
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
    
    // Safe URL sync
    updateURL(newQuery);
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setQuery("");
    setParsedQuery(null);
    setFilteredCities(getAllCities());
    updateURL("");
  };

  // Resolve active discovery lens at page level
  const activeDiscoveryLens = useMemo(() => {
    // Priority 1: Active search query
    if (query && query.trim() && parsedQuery) {
      return {
        type: 'search',
        query,
        parsedQuery,
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
  }, [query, parsedQuery]);

  // Generate search-driven collections with fallback system
  const searchCollections = useMemo(() => {
    if (activeDiscoveryLens.type !== 'search' || !activeDiscoveryLens.parsedQuery) {
      return [];
    }

    try {
      const cities = getAllCities();
      const rankedResults = rankCitiesByQuery(cities, activeDiscoveryLens.parsedQuery);
      
      const collections = [];
      
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
      let primaryCities: any[] = [];
      
      if (rankedResults && rankedResults.length > 0) {
        // Take top matches
        primaryCities = rankedResults.slice(0, 4).map(result => result?.city).filter(Boolean);
      }
      
      // Fallback: if not enough cities, expand with editorial relevance
      if (primaryCities.length < 3) {
        const fallbackIntents = editorialFallbackMap[primaryIntent.toLowerCase()] || [];
        const allCities = getAllCities();
        
        // Add cities that match fallback intents (simple editorial expansion)
        fallbackIntents.forEach(fallbackIntent => {
          if (primaryCities.length >= 4) return;
          
          const fallbackCities = allCities.filter(city => 
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
        const remainingCities = allCities.filter(city => 
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

  // Generate seasonal continuation collections with fallback system
  const seasonalCollections = useMemo(() => {
    if (activeDiscoveryLens.type !== 'search' || !activeDiscoveryLens.parsedQuery) {
      return getHomepageDiscovery(); // Default when not searching
    }

    try {
      const cities = getAllCities();
      const rankedResults = rankCitiesByQuery(cities, activeDiscoveryLens.parsedQuery);
      
      const collections = [];
      
      // Section 2 - Seasonal continuation with fallback
      let seasonalCities: any[] = [];
      
      // Start with seasonal results (skip primary cities)
      if (rankedResults && rankedResults.length > 4) {
        seasonalCities = rankedResults.slice(4, 8).map(result => result?.city).filter(Boolean);
      }
      
      // Fallback: if not enough seasonal cities, add more from ranked results
      if (seasonalCities.length < 3 && rankedResults && rankedResults.length > 8) {
        const additionalCities = rankedResults.slice(8, 11).map(result => result?.city).filter(Boolean);
        seasonalCities.push(...additionalCities);
      }
      
      // Final fallback: if still not enough, add diverse cities
      if (seasonalCities.length < 3) {
        const allCities = getAllCities();
        const primaryCities = rankedResults?.slice(0, 4).map(result => result?.city).filter(Boolean) || [];
        const remainingCities = allCities.filter(city => 
          !primaryCities.some(pc => pc.slug === city.slug) &&
          !seasonalCities.some(sc => sc.slug === city.slug)
        ).slice(0, 4 - seasonalCities.length);
        
        seasonalCities.push(...remainingCities);
      }
      
      if (seasonalCities.length > 0) {
        collections.push({
          cities: seasonalCities,
          label: "Seasonal",
          slug: "seasonal-continuation",
          subtitle: "A timely edit of places where mood, season, and setting come together naturally.",
          title: "Cities that feel right this season"
        });
      }

      return collections.length > 0 ? collections : getHomepageDiscovery();
    } catch (error) {
      console.warn('Error generating seasonal collections:', error);
      return getHomepageDiscovery();
    }
  }, [activeDiscoveryLens]);

  // Generate onboarding preference collections with specified copy patterns
  const onboardingCollections = useMemo(() => {
    // For search-active mode, we need to preserve the onboarding preference
    // but use the specified copy patterns for section 3
    const defaultCollections = getHomepageDiscovery();
    
    // Copy patterns for onboarding preferences in search-active mode
    const onboardingCopyMap: Record<string, { eyebrow: string; title: string; subcopy: string }> = {
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
      slow: {
        eyebrow: "For slower travel",
        title: "Cities that unfold gently",
        subcopy: "A quieter edit of places where pace softens and the city reveals itself more gradually."
      },
      summer: {
        eyebrow: "For summer seekers",
        title: "Cities that open up in full light",
        subcopy: "A few more places shaped by longer days, open air, and the energy of the season."
      },
      coastal: {
        eyebrow: "For coastal escapes",
        title: "Cities with a slower shoreline rhythm",
        subcopy: "A few more places where water, atmosphere, and ease shape the way you move through the city."
      },
      weekend: {
        eyebrow: "For weekends away",
        title: "Cities that give more in less time",
        subcopy: "A few more places built for shorter escapes, quick entry, and strong payoff."
      }
    };
    
    // For now, return the default collections since we don't have access to user's onboarding preference
    // In a real implementation, this would be based on stored onboarding data
    return defaultCollections;
  }, []);

  // Use search collections if search is active, otherwise use default
  const activeCollections = activeDiscoveryLens.type === 'search' ? searchCollections : getHomepageDiscovery();
  
  // Get all cities for components that need it
  const cities = getAllCities();

  return (
    <OnboardingGate>
      <>
        <Header />

        <main className="page-main">
          <div className="page-main__guided-start">
            <HeroSection />
            <SearchSection query={query} onSearchChange={handleSearchChange} />
          </div>

          {/* Search-active flow: active pill → seasonal → onboarding preference → explore */}
          {activeDiscoveryLens.type === 'search' ? (
            <>
              {/* 1. Active selected-pill section (primary) */}
              <PersonalizedDiscoveryFlow cities={cities} collections={activeCollections} activeSearchQuery={query} />
              
              {/* 2. Seasonal continuation section */}
              <SeasonalDiscoverySection cities={cities} collections={seasonalCollections} />
              
              {/* 3. Onboarding preference section (secondary, preserved) */}
              <PreferenceSeasonSection cities={cities} collections={onboardingCollections} />
              
              {/* 4. Explore more cities (final broader browsing) */}
              <CityBrowser cities={filteredCities} />
            </>
          ) : (
            <>
              {/* Default flow: show onboarding-led sections */}
              <PersonalizedDiscoveryFlow cities={cities} collections={activeCollections} />
              <SeasonalDiscoverySection cities={cities} collections={activeCollections} />
              <PreferenceSeasonSection cities={cities} collections={activeCollections} />
              <CityBrowser cities={filteredCities} />
            </>
          )}
        </main>
      </>
    </OnboardingGate>
  );
}
