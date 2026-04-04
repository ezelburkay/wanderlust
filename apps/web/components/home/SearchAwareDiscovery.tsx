"use client";

import { useMemo } from "react";
import { useSearch } from "./SearchContext";
import { rankCitiesByQuery } from "./discoverySearch";
import { getAllCities, HomepageDiscoveryViewModel } from "../../content";

interface SearchAwareDiscoveryProps {
  children: (discoveryData: HomepageDiscoveryViewModel[]) => any;
  fallback?: any;
}

export function SearchAwareDiscovery({ children, fallback }: SearchAwareDiscoveryProps) {
  const { query, parsedQuery, isActive } = useSearch();

  const searchAwareDiscovery = useMemo(() => {
    // If no active search, return default discovery
    if (!isActive || !parsedQuery) {
      return [];
    }

    const allCities = getAllCities();
    const rankedResults = rankCitiesByQuery(allCities, parsedQuery);

    // Create search-focused discovery collections
    const searchCollections: HomepageDiscoveryViewModel[] = [];

    if (rankedResults.length > 0) {
      // Primary results - top matches
      const topResults = rankedResults.slice(0, 6);
      searchCollections.push({
        cities: topResults.map(result => result.city),
        label: "Search results",
        slug: "search-results",
        subtitle: `Found ${rankedResults.length} cities matching "${query}"`,
        title: `Best matches for "${query}"`
      });

      // If we have mood intent, add mood-specific collection
      if (parsedQuery.intents.mood.length > 0) {
        const moodResults = rankedResults.filter(result => result.matches.mood > 0).slice(0, 4);
        if (moodResults.length > 0) {
          searchCollections.push({
            cities: moodResults.map(result => result.city),
            label: parsedQuery.intents.mood[0],
            slug: `mood-${parsedQuery.intents.mood[0]}`,
            subtitle: `Cities perfect for ${parsedQuery.intents.mood[0]} experiences`,
            title: `${parsedQuery.intents.mood[0].charAt(0).toUpperCase() + parsedQuery.intents.mood[0].slice(1)} destinations`
          });
        }
      }

      // If we have season intent, add seasonal collection
      if (parsedQuery.intents.season.length > 0) {
        const seasonResults = rankedResults.filter(result => result.matches.season > 0).slice(0, 4);
        if (seasonResults.length > 0) {
          searchCollections.push({
            cities: seasonResults.map(result => result.city),
            label: parsedQuery.intents.season[0],
            slug: `season-${parsedQuery.intents.season[0]}`,
            subtitle: `Great destinations for ${parsedQuery.intents.season[0]}`,
            title: `${parsedQuery.intents.season[0].charAt(0).toUpperCase() + parsedQuery.intents.season[0].slice(1)} travel`
          });
        }
      }
    }

    return searchCollections;
  }, [isActive, parsedQuery, query]);

  // If search is active but no results, show no results
  if (isActive && searchAwareDiscovery.length === 0) {
    return fallback || (
      <div className="search-section__no-results">
        <p>No cities found matching "{query}". Try different terms like "romantic", "food", "summer", or a city name.</p>
      </div>
    );
  }

  // If search is active and we have results, show search-aware discovery
  if (isActive && searchAwareDiscovery.length > 0) {
    return <>{children(searchAwareDiscovery)}</>;
  }

  // Default: show regular discovery (no search active)
  return null;
}
