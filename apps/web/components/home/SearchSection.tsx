interface SearchSectionProps {
  query?: string;
  resultCount: number;
}

export function SearchSection({ query = "", resultCount }: SearchSectionProps) {
  const resultLabel = resultCount === 1 ? "city briefing" : "city briefings";

  return (
    <section className="search-section">
      <div className="site-shell">
        <div className="search-section__panel">
          <div className="search-section__copy">
            <span className="section-label">Search</span>
            <h2 className="section-title">Start with a city.</h2>
            <p className="section-copy">
              Search the current briefings by city name and open the one you want to read more closely.
            </p>
          </div>

          <form action="/" className="search-form" role="search">
            <label className="search-form__label" htmlFor="city-search">
              Search for a city briefing
            </label>
            <div className="search-form__controls">
              <input
                className="search-form__input"
                defaultValue={query}
                id="city-search"
                name="q"
                placeholder="Paris, Rome"
                type="search"
              />
              <button className="search-form__button" type="submit">
                Explore
              </button>
            </div>
          </form>

          <p className="search-section__meta">
            {resultCount} {resultLabel} in the current collection.
          </p>
        </div>
      </div>
    </section>
  );
}
