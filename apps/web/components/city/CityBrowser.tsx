import type { CityViewModel } from "../../content";
import { CityCard } from "./CityCard";

interface CityBrowserProps {
  cities: CityViewModel[];
}

export function CityBrowser({ cities }: CityBrowserProps) {
  return (
    <section className="city-browser" id="cities">
      <div className="site-shell">
        <div className="section-heading section-heading--compact">
          <h2 className="section-title">More cities</h2>
        </div>

        {cities.length > 0 ? (
          <div className="city-browser__grid">
            {cities.map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
        ) : (
          <div className="city-browser__empty">
            <h3 className="city-browser__empty-title">No city briefings to show here.</h3>
            <p className="city-browser__empty-copy">
              Try a different city name or clear the current search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
