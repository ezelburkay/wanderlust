import { getAllCities, getHomepageDiscovery } from "@/content";
import { CityBrowser } from "@/components/city/CityBrowser";
import { DiscoverySection } from "@/components/home/DiscoverySection";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchSection } from "@/components/home/SearchSection";
import { Header } from "@/components/layout/Header";

interface HomePageProps {
searchParams?: {
q?: string;
};
}

export default function HomePage({ searchParams }: HomePageProps) {
const query = searchParams?.q?.trim() ?? "";
const cities = getAllCities();
const discoveryCollections = getHomepageDiscovery();
const filteredCities = query
? cities.filter((city) => city.searchText.includes(query.toLowerCase()))
: cities;

return (
<> <Header />

```
  <main className="page-main">
    <HeroSection />
    <SearchSection query={query} resultCount={filteredCities.length} />
    <DiscoverySection collections={discoveryCollections} />
    <CityBrowser cities={filteredCities} />
  </main>
</>
```

);
}
