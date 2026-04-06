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

  // Generate search-driven collections with coherent editorial flow
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
      
      // Section 1 — Primary active-lens section
      if (rankedResults && rankedResults.length > 0) {
        const topResults = rankedResults.slice(0, 6);
        
        collections.push({
          cities: topResults.map(result => result?.city).filter(Boolean),
          label: primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1), // "Romantic"
          slug: "primary-lens",
          subtitle: `Curated ${primaryIntent} destinations`,
          title: `${primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1)} destinations`
        });
      }

      // Section 2 — Seasonal continuation with active lens
      const seasonalResults = rankedResults.slice(6, 10);
      if (seasonalResults.length > 0) {
        collections.push({
          cities: seasonalResults.map(result => result?.city).filter(Boolean),
          label: "Seasonal",
          slug: "seasonal-continuation",
          subtitle: `${primaryIntent} destinations that feel right this season`,
          title: "Cities that feel right this season"
        });
      }

      // Section 3 — Supporting discovery section
      const supportingResults = rankedResults.slice(10, 14);
      if (supportingResults.length > 0) {
        // Create editorial supporting title based on primary intent
        let supportingTitle = "More destinations to explore";
        let supportingSubtitle = "Continue your journey";
        
        if (primaryIntent === "romantic") {
          supportingTitle = "Weekend escapes for two";
          supportingSubtitle = "Cities perfect for slower moments";
        } else if (primaryIntent === "food") {
          supportingTitle = "Culinary discoveries";
          supportingSubtitle = "Cities for memorable meals";
        } else if (primaryIntent === "slow") {
          supportingTitle = "Gentle explorations";
          supportingSubtitle = "Cities for longer stays";
        }
        
        collections.push({
          cities: supportingResults.map(result => result?.city).filter(Boolean),
          label: "Discover",
          slug: "supporting-discovery",
          subtitle: supportingSubtitle,
          title: supportingTitle
        });
      }

      // Section 4 — Explore more (broader browsing)
      const exploreResults = rankedResults.slice(14, 20);
      if (exploreResults.length > 0) {
        collections.push({
          cities: exploreResults.map(result => result?.city).filter(Boolean),
          label: "Explore",
          slug: "explore-more",
          subtitle: "More cities to discover",
          title: "Explore more cities"
        });
      }

      return collections;
    } catch (error) {
      console.warn('Error generating search collections:', error);
      return [];
    }
  }, [activeDiscoveryLens]);

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

          {/* Search-active flow: show only search-driven sections */}
          {activeDiscoveryLens.type === 'search' ? (
            <>
              <PersonalizedDiscoveryFlow cities={cities} collections={activeCollections} activeSearchQuery={query} />
              {/* CityBrowser shows search-weighted cities as the explore layer */}
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
