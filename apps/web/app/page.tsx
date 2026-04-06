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

  // Generate search-driven collections safely
  const searchCollections = useMemo(() => {
    if (activeDiscoveryLens.type !== 'search' || !activeDiscoveryLens.parsedQuery) {
      return [];
    }

    try {
      const cities = getAllCities();
      const rankedResults = rankCitiesByQuery(cities, activeDiscoveryLens.parsedQuery);
      
      const collections = [];
      
      // Primary editorial collection based on search intent
      if (rankedResults && rankedResults.length > 0) {
        const topResults = rankedResults.slice(0, 6);
        
        // Editorial title based on primary intent
        let title = "Cities to explore";
        let label = "Discovery";
        let subtitle = "Curated destinations for your journey";
        
        if (activeDiscoveryLens.parsedQuery.intents.mood && activeDiscoveryLens.parsedQuery.intents.mood.length > 0) {
          const mood = activeDiscoveryLens.parsedQuery.intents.mood[0];
          title = `${mood.charAt(0).toUpperCase() + mood.slice(1)} destinations`;
          label = mood;
          subtitle = `Perfect for ${mood} experiences`;
        }
        
        collections.push({
          cities: topResults.map(result => result?.city).filter(Boolean),
          label: label,
          slug: "primary-discovery",
          subtitle: subtitle,
          title: title
        });
      }

      // Mood-specific continuation if mood intent detected
      if (activeDiscoveryLens.parsedQuery.intents.mood && activeDiscoveryLens.parsedQuery.intents.mood.length > 0) {
        const moodResults = rankedResults.filter(result => 
          result && result.matches && result.matches.mood > 0
        ).slice(4, 8); // Continue with more results
        
        if (moodResults.length > 0) {
          const mood = activeDiscoveryLens.parsedQuery.intents.mood[0];
          collections.push({
            cities: moodResults.map(result => result?.city).filter(Boolean),
            label: `More ${mood}`,
            slug: `more-${mood}`,
            subtitle: `Additional ${mood} destinations`,
            title: `More ${mood.charAt(0).toUpperCase() + mood.slice(1)} cities`
          });
        }
      }

      // Fallback collection if no results
      if (collections.length === 0) {
        collections.push({
          cities: getAllCities().slice(0, 6),
          label: "Explore",
          slug: "explore-cities",
          subtitle: "Discover amazing destinations",
          title: "Cities to explore"
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

          <PersonalizedDiscoveryFlow cities={cities} collections={activeCollections} activeSearchQuery={query} />
          <SeasonalDiscoverySection cities={cities} collections={activeCollections} />
          <PreferenceSeasonSection cities={cities} collections={activeCollections} />
          
          <CityBrowser cities={filteredCities} />
        </main>
      </>
    </OnboardingGate>
  );
}
