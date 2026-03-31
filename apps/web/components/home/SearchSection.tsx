interface SearchSectionProps {
  query?: string;
}

export function SearchSection({ query = "" }: SearchSectionProps) {
  return (
    <section className="search-section">
      <div className="site-shell">
        <div className="search-section__panel">
          <div className="search-section__copy">
            <h2 className="section-title">Start with a city.</h2>
            <form action="/" className="search-form" role="search">
              <input
                aria-label="Search for a city"
                className="search-form__input"
                defaultValue={query}
                id="city-search"
                name="q"
                placeholder="Paris, Rome"
                type="search"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
