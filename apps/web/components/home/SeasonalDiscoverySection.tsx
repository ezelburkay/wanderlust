"use client";

import type { HomepageDiscoveryViewModel } from "../../content";
import { CityCard } from "../city";

interface SeasonalDiscoverySectionProps {
  collections: HomepageDiscoveryViewModel[];
}
export function SeasonalDiscoverySection({ collections }: SeasonalDiscoverySectionProps) {
  const section = collections[0];

  if (!section || section.cities.length === 0) {
    return null;
  }

  return (
    <section className="seasonal-discovery" id="seasonal">
      <div className="site-shell">
        <div className="section-heading">
          <h2 className="section-title">{section.title}</h2>
          <p className="section-copy">{section.subtitle}</p>
        </div>

        <div className="seasonal-discovery__grid">
          {section.cities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
