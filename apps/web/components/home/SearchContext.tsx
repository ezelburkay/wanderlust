"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ParsedQuery } from "./discoverySearch";

interface SearchContextType {
  query: string;
  parsedQuery: ParsedQuery | null;
  isActive: boolean;
  setQuery: (query: string, parsedQuery: ParsedQuery | null) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);

  const setQuery = (newQuery: string, newParsedQuery: ParsedQuery | null) => {
    setQueryState(newQuery);
    setParsedQuery(newParsedQuery);
  };

  const clearSearch = () => {
    setQuery("", null);
  };

  const isActive = query.length > 0 && parsedQuery !== null;

  return (
    <SearchContext.Provider value={{
      query,
      parsedQuery,
      isActive,
      setQuery,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
