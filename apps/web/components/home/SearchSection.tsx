"use client";

import { useEffect, useState } from "react";
import { parseDiscoveryQuery, isValidQuery } from "./discoverySearch";

interface SearchSectionProps {
  query?: string;
  onSearchChange?: (query: string, parsedQuery: any) => void;
}

const searchExamples = ["Romantic", "Food", "Slow", "Summer", "Coastal", "Weekend"];

export function SearchSection({ query = "", onSearchChange }: SearchSectionProps) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim();
      const parsedQuery = parseDiscoveryQuery(trimmedQuery);
      
      // Only proceed if we have valid intents
      if (isValidQuery(trimmedQuery)) {
        setValue(trimmedQuery);
        onSearchChange?.(trimmedQuery, parsedQuery);
        
        // Update URL for sharing/bookmarking
        const url = new URL(window.location.href);
        url.searchParams.set('q', trimmedQuery);
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const handleExampleClick = (example: string) => {
    handleSearch(example.toLowerCase());
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleSearch(value);
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    // Real-time search as user types (debounced could be added)
    if (newValue.length > 2) {
      handleSearch(newValue);
    } else if (newValue.length === 0) {
      // Clear search when input is empty
      setValue("");
      onSearchChange?.("", null);
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
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
                  onChange={handleInputChange}
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
