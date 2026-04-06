"use client";

import { useState, useEffect } from "react";
import { getAllCities, getHomepageDiscovery } from "../content";
import { CityBrowser } from "../components/city";
import { HeroSection } from "../components/home/HeroSection";
import { PersonalizedDiscoveryFlow } from "../components/home/PersonalizedDiscoveryFlow";
import { SearchSection } from "../components/home/SearchSection";
import { SeasonalDiscoverySection } from "../components/home/SeasonalDiscoverySection";
import { PreferenceSeasonSection } from "../components/home/PreferenceSeasonSection";
import { Header } from "../components/layout/Header";
import { OnboardingGate } from "../components/onboarding/OnboardingGate";
import { parseDiscoveryQuery, rankCitiesByQuery } from "../components/home/discoverySearch";

interface HomePageProps {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(getAllCities());

  // Handle URL params on mount
  useEffect(() => {
    const loadSearchParams = async () => {
      try {
        const resolvedSearchParams = await searchParams;
        const rawQuery = Array.isArray(resolvedSearchParams?.q)
          ? resolvedSearchParams.q[0]
          : resolvedSearchParams?.q;
        const initialQuery = rawQuery?.trim() ?? "";
        
        setQuery(initialQuery);
        
        if (initialQuery) {
          const cities = getAllCities();
          const parsedQuery = parseDiscoveryQuery(initialQuery);
          if (parsedQuery && parsedQuery.intents) {
            const rankedResults = rankCitiesByQuery(cities, parsedQuery);
            const results = rankedResults && rankedResults.length > 0 
              ? rankedResults.map(result => result?.city).filter(Boolean)
              : cities;
            setFilteredCities(results);
          } else {
            setFilteredCities(cities);
          }
        } else {
          setFilteredCities(getAllCities());
        }
      } catch (error) {
        console.warn('Error loading search params:', error);
        // Fallback to default state
        setQuery("");
        setFilteredCities(getAllCities());
      }
    };
    
    loadSearchParams();
  }, [searchParams]);

  // Handle search changes from SearchSection
  const handleSearchChange = (newQuery: string, parsedQuery: any) => {
    setQuery(newQuery);
    
    if (newQuery && parsedQuery) {
      try {
        const cities = getAllCities();
        const rankedResults = rankCitiesByQuery(cities, parsedQuery);
        const results = rankedResults && rankedResults.length > 0 
          ? rankedResults.map(result => result?.city).filter(Boolean)
          : cities;
        setFilteredCities(results);
      } catch (error) {
        console.warn('Error during search processing:', error);
        // Fallback to all cities if search processing fails
        setFilteredCities(getAllCities());
      }
    } else {
      setFilteredCities(getAllCities());
    }
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setQuery("");
    setFilteredCities(getAllCities());
    // Update URL to remove query parameter
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Resolve active discovery lens based on priority
  const getActiveDiscoveryLens = () => {
    // Priority 1: Active search query
    if (query && query.trim()) {
      try {
        const parsedQuery = parseDiscoveryQuery(query);
        if (parsedQuery && parsedQuery.intents) {
          return {
            type: 'search',
            query,
            parsedQuery,
            isActive: true
          };
        }
      } catch (error) {
        console.warn('Failed to parse search query:', query, error);
        // Fall back to default if parsing fails
      }
    }
    
    // Priority 2: Onboarding preferences (would need to read from localStorage)
    // For now, fallback to default
    return {
      type: 'default',
      query: '',
      parsedQuery: null,
      isActive: false
    };
  };

  // Generate search-driven discovery collections
  const getSearchDrivenCollections = (activeLens: any) => {
    if (activeLens.type !== 'search') {
      return [];
    }

    // Safety check: ensure parsedQuery exists and has expected structure
    if (!activeLens.parsedQuery || !activeLens.parsedQuery.intents) {
      console.warn('Invalid parsedQuery in activeLens:', activeLens);
      return [];
    }

    const cities = getAllCities();
    const rankedResults = rankCitiesByQuery(cities, activeLens.parsedQuery);
    
    const collections = [];
    
    // Primary search results collection
    if (rankedResults && rankedResults.length > 0) {
      const topResults = rankedResults.slice(0, 6);
      collections.push({
        cities: topResults.map(result => result?.city).filter(Boolean),
        label: "Search results",
        slug: "search-results",
        subtitle: `Found ${rankedResults.length} cities matching "${activeLens.query}"`,
        title: `Best matches for "${activeLens.query}"`
      });
    }

    // Mood-specific collection if mood intent detected
    if (activeLens.parsedQuery.intents.mood && activeLens.parsedQuery.intents.mood.length > 0) {
      const moodResults = rankedResults.filter(result => 
        result && result.matches && result.matches.mood > 0
      ).slice(0, 4);
      
      if (moodResults.length > 0) {
        const mood = activeLens.parsedQuery.intents.mood[0];
        collections.push({
          cities: moodResults.map(result => result?.city).filter(Boolean),
          label: mood,
          slug: `mood-${mood}`,
          subtitle: `Cities perfect for ${mood} experiences`,
          title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} destinations`
        });
      }
    }

    // Ensure we have at least some collections if search is active
    if (collections.length === 0 && activeLens.query) {
      // Fallback collection with all cities
      collections.push({
        cities: cities.slice(0, 6),
        label: "All cities",
        slug: "fallback-cities",
        subtitle: `Showing all cities for "${activeLens.query}"`,
        title: "City destinations"
      });
    }

    return collections;
  };

  const cities = getAllCities();
  const defaultCollections = getHomepageDiscovery();
  const activeLens = getActiveDiscoveryLens();
  const searchCollections = getSearchDrivenCollections(activeLens);
  
  // Use search collections if search is active, otherwise use default
  const activeCollections = activeLens.type === 'search' ? searchCollections : defaultCollections;

  return (
    <OnboardingGate>
      <>
        <Header />

        <main className="page-main">
          <div className="page-main__guided-start">
            <HeroSection />
            <SearchSection query={query} onSearchChange={handleSearchChange} />
          </div>

          <PersonalizedDiscoveryFlow cities={cities} collections={activeCollections} activeSearchQuery={query} />
          <SeasonalDiscoverySection cities={cities} collections={activeCollections} />
          <PreferenceSeasonSection cities={cities} collections={activeCollections} />
          
          {/* Search state indicator */}
          {query && (
            <div className="site-shell">
              <div className="search-state-indicator">
                <span className="search-state-indicator__text">
                  Showing results for <strong>"{query}"</strong>
                </span>
                <button 
                  className="search-state-indicator__clear"
                  onClick={handleClearSearch}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          
          <CityBrowser cities={filteredCities} />
        </main>
      </>
    </OnboardingGate>
  );
}
