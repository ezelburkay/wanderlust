"use client";

import { useEffect, useState } from "react";

interface SearchSectionProps {
  query?: string;
}

const searchExamples = ["Romantic", "Food", "Slow", "Summer", "Coastal", "Weekend"];

export function SearchSection({ query = "" }: SearchSectionProps) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleExampleClick = (example: string) => {
    setValue(example.toLowerCase());
    window.location.href = `/?q=${encodeURIComponent(example.toLowerCase())}`;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (value.trim()) {
      window.location.href = `/?q=${encodeURIComponent(value.trim())}`;
    }
  };

  return (
    <section className="search-section" id="search">
      <div className="site-shell">
        <div className="search-section__panel">
          <div className="search-section__copy">
            <h2 className="section-title">Search by city, season, or mood</h2>
            <form action="/" className="search-form" role="search" onSubmit={handleSubmit}>
              <div className="search-form__field">
                <span className="search-form__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <circle cx="8.25" cy="8.25" r="5.4" />
                    <path d="M12.45 12.45 16.2 16.2" />
                  </svg>
                </span>
                <input
                  aria-label="Search by city, season, or mood"
                  autoComplete="off"
                  className="search-form__input"
                  id="city-search"
                  name="q"
                  onChange={(event: { target: { value: string } }) => setValue(event.target.value)}
                  placeholder="Try Paris, romantic weekends, slow cities, spring food trips..."
                  type="search"
                  value={value}
                />
              </div>
            </form>
            <div className="search-section__examples">
              {searchExamples.map((example) => (
                <button
                  className="search-section__example"
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
