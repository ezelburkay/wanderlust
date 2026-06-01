"use client";

import type { HomepageDiscoveryViewModel } from "../../content";
import { CityCard } from "../city";

interface PreferenceSeasonSectionProps {
  collections: HomepageDiscoveryViewModel[];
}
export function PreferenceSeasonSection({ collections }: PreferenceSeasonSectionProps) {
  const section = collections[0];

  if (!section || section.cities.length === 0) {
    return null;
  }

  return (
    <section className="preference-season" id="preference-season">
      <div className="site-shell">
        <div className="section-heading">
          <h2 className="section-title">{section.title}</h2>
          <p className="section-copy">{section.subtitle}</p>
        </div>

        <div className="preference-season__grid">
          {section.cities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
