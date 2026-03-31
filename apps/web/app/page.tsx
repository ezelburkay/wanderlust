import { getAllCities, getHomepageDiscovery } from "../content";
import { CityBrowser } from "../components/city/CityBrowser";
import { DiscoverySection } from "../components/home/DiscoverySection";
import { HeroSection } from "../components/home/HeroSection";
import { SearchSection } from "../components/home/SearchSection";
import { Header } from "../components/layout/Header";
import { OnboardingGate } from "../components/onboarding/OnboardingGate";

interface HomePageProps {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = Array.isArray(resolvedSearchParams?.q)
    ? resolvedSearchParams.q[0]
    : resolvedSearchParams?.q;
  const query = rawQuery?.trim() ?? "";
  const cities = getAllCities();
  const discoveryCollections = getHomepageDiscovery();
  const filteredCities = query
    ? cities.filter((city) => city.searchText.includes(query.toLowerCase()))
    : cities;

  return (
    <OnboardingGate>
      <>
        <Header />

        <main className="page-main">
          <HeroSection />
          <SearchSection query={query} resultCount={filteredCities.length} />
          <DiscoverySection collections={discoveryCollections} />
          <CityBrowser cities={filteredCities} />
        </main>
      </>
    </OnboardingGate>
  );
}
