"use client";

import { useEffect, useState } from "react";
import { parseDiscoveryQuery, isValidQuery } from "./discoverySearch";

interface SearchSectionProps {
  draftQuery?: string;
  committedQuery?: string;
  onDraftChange?: (draftQuery: string) => void;
  onSubmit?: (query: string, parsedQuery: any) => void;
  onPillClick?: (pillQuery: string) => void;
  onSuggestionSelect?: (suggestionQuery: string) => void;
  onClear?: () => void;
}

const searchExamples = ["Romantic", "Food", "Slow", "Summer", "Coastal", "Weekend"];

export function SearchSection({ 
  draftQuery = "", 
  committedQuery = "",
  onDraftChange,
  onSubmit,
  onPillClick,
  onSuggestionSelect,
  onClear
}: SearchSectionProps) {
  const [value, setValue] = useState(draftQuery);

  useEffect(() => {
    setValue(draftQuery);
  }, [draftQuery]);

  const handleSearch = (searchQuery: string) => {
    if (!isValidQuery(searchQuery)) return;
    
    try {
      const parsed = parseDiscoveryQuery(searchQuery);
      onSubmit?.(searchQuery, parsed);
    } catch (error) {
      console.warn('Failed to parse search query:', searchQuery, error);
    }
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value;
    setValue(newValue);
    onDraftChange?.(newValue);
    
    // Only clear if input is empty, don't trigger real-time search
    if (newValue.length === 0) {
      handleClear();
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleSearch(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(value);
    }
  };

  const handlePillClick = (pillQuery: string) => {
    setValue(pillQuery);
    onPillClick?.(pillQuery);
  };

  const handleClear = () => {
    setValue("");
    onClear?.();
  };

  const handleExampleClick = (example: string) => {
    handlePillClick(example);
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
