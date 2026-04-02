import { getAllCities, getHomepageDiscovery } from "../content";
import { CityBrowser } from "../components/city/CityBrowser";
import { HeroSection } from "../components/home/HeroSection";
import { PersonalizedDiscoveryFlow } from "../components/home/PersonalizedDiscoveryFlow";
import { SearchSection } from "../components/home/SearchSection";
import { SeasonalDiscoverySection } from "../components/home/SeasonalDiscoverySection";
import { PreferenceSeasonSection } from "../components/home/PreferenceSeasonSection";
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
          <div className="page-main__guided-start">
            <HeroSection />
            <SearchSection query={query} />
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
