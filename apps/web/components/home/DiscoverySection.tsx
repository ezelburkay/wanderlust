import Link from "next/link";
import type { HomepageDiscoveryViewModel } from "@/content";

interface DiscoverySectionProps {
  collections: HomepageDiscoveryViewModel[];
}

export function DiscoverySection({ collections }: DiscoverySectionProps) {
  return (
    <section className="discovery-section" id="discover">
      <div className="site-shell">
        <div className="section-heading">
          <span className="section-label">Discovery</span>
          <h2 className="section-title">A few good places to begin.</h2>
          <p className="section-copy">
            A calm set of starting points for choosing the next city to open.
          </p>
        </div>

        <div className="discovery-grid">
          {collections.map((collection) => (
            <article className="discovery-card" key={collection.slug}>
              <span className="discovery-card__label">{collection.label}</span>
              <h3 className="discovery-card__title">{collection.title}</h3>
              <p className="discovery-card__subtitle">{collection.subtitle}</p>
              <div className="discovery-card__cities">
                {collection.cities.map((city) => (
                  <Link className="discovery-card__city" href={`/cities/${city.slug}`} key={city.slug}>
                    <span className="discovery-card__city-name">{city.name}</span>
                    <span className="discovery-card__city-country">{city.country}</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
