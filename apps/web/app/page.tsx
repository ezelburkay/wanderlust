"use client";

import { useState, useEffect } from "react";
import { getAllCities, getHomepageDiscovery } from "../content";
import { CityBrowser } from "../components/city/CityBrowser";
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
      const resolvedSearchParams = await searchParams;
      const rawQuery = Array.isArray(resolvedSearchParams?.q)
        ? resolvedSearchParams.q[0]
        : resolvedSearchParams?.q;
      const initialQuery = rawQuery?.trim() ?? "";
      
      setQuery(initialQuery);
      
      if (initialQuery) {
        const cities = getAllCities();
        const parsedQuery = parseDiscoveryQuery(initialQuery);
        const rankedResults = rankCitiesByQuery(cities, parsedQuery);
        const results = rankedResults.length > 0 ? rankedResults.map(result => result.city) : cities;
        setFilteredCities(results);
      } else {
        setFilteredCities(getAllCities());
      }
    };
    
    loadSearchParams();
  }, [searchParams]);

  // Handle search changes from SearchSection
  const handleSearchChange = (newQuery: string, parsedQuery: any) => {
    setQuery(newQuery);
    
    if (newQuery && parsedQuery) {
      const cities = getAllCities();
      const rankedResults = rankCitiesByQuery(cities, parsedQuery);
      const results = rankedResults.length > 0 ? rankedResults.map(result => result.city) : cities;
      setFilteredCities(results);
    } else {
      setFilteredCities(getAllCities());
    }
  };

  const cities = getAllCities();
  const discoveryCollections = getHomepageDiscovery();

  return (
    <OnboardingGate>
      <>
        <Header />

        <main className="page-main">
          <div className="page-main__guided-start">
            <HeroSection />
            <SearchSection query={query} onSearchChange={handleSearchChange} />
          </div>

          <PersonalizedDiscoveryFlow cities={cities} collections={discoveryCollections} />
          <SeasonalDiscoverySection cities={cities} collections={discoveryCollections} />
          <PreferenceSeasonSection cities={cities} collections={discoveryCollections} />
          <CityBrowser cities={filteredCities} />
        </main>
      </>
    </OnboardingGate>
  );
}
