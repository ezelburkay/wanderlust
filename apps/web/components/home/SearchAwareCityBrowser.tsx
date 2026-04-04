"use client";

import { useMemo } from "react";
import { useSearch } from "./SearchContext";
import { rankCitiesByQuery } from "./discoverySearch";
import { getAllCities } from "../../content";

interface SearchAwareCityBrowserProps {
  children: (cities: any[]) => any;
  fallback?: any;
}

export function SearchAwareCityBrowser({ children, fallback }: SearchAwareCityBrowserProps) {
  const { query, parsedQuery, isActive } = useSearch();

  const filteredCities = useMemo(() => {
    // If no active search, return all cities
    if (!isActive || !parsedQuery) {
      return getAllCities();
    }

    const allCities = getAllCities();
    const rankedResults = rankCitiesByQuery(allCities, parsedQuery);

    // Return ranked results for city browser, or all cities if no matches
    return rankedResults.length > 0 ? rankedResults.map(result => result.city) : allCities;
  }, [isActive, parsedQuery]);

  return <>{children(filteredCities)}</>;
}
