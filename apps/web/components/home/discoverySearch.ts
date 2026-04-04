// Discovery search types and interfaces
export interface ParsedQuery {
  original: string;
  normalized: string;
  tokens: string[];
  intents: QueryIntents;
}

export interface QueryIntents {
  city: string[];
  mood: string[];
  season: string[];
}

export interface CitySearchScore {
  city: any; // CityViewModel type
  score: number;
  matches: {
    city: number;
    mood: number;
    season: number;
    content: number;
  };
}

// City intent mapping - common city names and variations
const CITY_INTENTS = {
  // Direct city names
  paris: ['paris'],
  rome: ['rome'],
  tokyo: ['tokyo'],
  london: ['london'],
  newyork: ['new york', 'nyc', 'new york city'],
  barcelona: ['barcelona'],
  amsterdam: ['amsterdam'],
  venice: ['venice'],
  florence: ['florence'],
  // Country/region mappings that imply cities
  france: ['france', 'french'],
  italy: ['italy', 'italian'],
  spain: ['spain', 'spanish'],
  japan: ['japan', 'japanese'],
  england: ['england', 'english', 'british', 'uk'],
  netherlands: ['netherlands', 'dutch', 'holland'],
};

// Mood/preference intent mapping
const MOOD_INTENTS = {
  romantic: ['romantic', 'romance', 'couples', 'honeymoon', 'love'],
  food: ['food', 'culinary', 'cuisine', 'gastronomy', 'eating', 'dining'],
  slow: ['slow', 'relaxed', 'quiet', 'peaceful', 'calm', 'leisurely'],
  culture: ['culture', 'cultural', 'history', 'historical', 'museums', 'art'],
  nature: ['nature', 'natural', 'outdoors', 'green', 'parks', 'landscape'],
  adventure: ['adventure', 'adventurous', 'active', 'exciting', 'thrill'],
  coastal: ['coastal', 'beach', 'seaside', 'ocean', 'maritime', 'shore'],
  weekend: ['weekend', 'short', 'break', 'getaway', 'mini'],
  urban: ['urban', 'city', 'metropolitan', 'downtown'],
};

// Season/timing intent mapping
const SEASON_INTENTS = {
  spring: ['spring', 'springtime', 'march', 'april', 'may'],
  summer: ['summer', 'june', 'july', 'august'],
  autumn: ['autumn', 'fall', 'september', 'october', 'november'],
  winter: ['winter', 'december', 'january', 'february'],
  thismonth: ['this month', 'current', 'now'],
  next3months: ['next 3 months', 'quarter', 'coming', 'upcoming'],
};

// Normalize and tokenize query
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeQuery(query);
  return normalized.split(' ').filter(token => token.length > 0);
}

// Parse query into structured intents
export function parseDiscoveryQuery(query: string): ParsedQuery {
  const normalized = normalizeQuery(query);
  const tokens = tokenizeQuery(query);
  
  const intents: QueryIntents = {
    city: [],
    mood: [],
    season: []
  };

  // Check each token against intent mappings
  tokens.forEach(token => {
    // City intent detection
    for (const [cityKey, cityAliases] of Object.entries(CITY_INTENTS)) {
      if (cityAliases.includes(token) || token.includes(cityKey)) {
        intents.city.push(cityKey);
        break;
      }
    }

    // Mood intent detection
    for (const [moodKey, moodAliases] of Object.entries(MOOD_INTENTS)) {
      if (moodAliases.includes(token)) {
        intents.mood.push(moodKey);
        break;
      }
    }

    // Season intent detection
    for (const [seasonKey, seasonAliases] of Object.entries(SEASON_INTENTS)) {
      if (seasonAliases.includes(token)) {
        intents.season.push(seasonKey);
        break;
      }
    }
  });

  return {
    original: query,
    normalized,
    tokens,
    intents
  };
}

// Score a single city against parsed query
export function scoreCityAgainstQuery(city: any, parsedQuery: ParsedQuery): CitySearchScore {
  const cityText = [
    city.name,
    city.country,
    city.badge,
    city.cardSentence,
    city.essence,
    city.quickFacts?.bestMonths || '',
    city.quickFacts?.worksBestFor || '',
    city.quickFacts?.bestFor || '',
    ...(city.mustSeeFirst || []).map((place: any) => place.name),
    ...(city.places || []).map((place: any) => place.name),
    ...(city.signatureDishes || []).map((dish: any) => dish.name),
    ...(city.moreToEat || []).map((dish: any) => dish.name),
    ...(city.whereToEat || [])
  ].join(' ').toLowerCase();

  const matches = {
    city: 0,
    mood: 0,
    season: 0,
    content: 0
  };

  // City intent scoring (highest weight)
  if (parsedQuery.intents.city.length > 0) {
    parsedQuery.intents.city.forEach(cityIntent => {
      const aliases = CITY_INTENTS[cityIntent as keyof typeof CITY_INTENTS] || [];
      if (aliases.some(alias => cityText.includes(alias))) {
        matches.city += 10; // High weight for city matches
      }
      if (cityText.includes(cityIntent)) {
        matches.city += 8;
      }
    });
  }

  // Mood intent scoring (medium weight)
  if (parsedQuery.intents.mood.length > 0) {
    parsedQuery.intents.mood.forEach(moodIntent => {
      const aliases = MOOD_INTENTS[moodIntent as keyof typeof MOOD_INTENTS] || [];
      if (aliases.some(alias => cityText.includes(alias))) {
        matches.mood += 5; // Medium weight for mood matches
      }
      if (cityText.includes(moodIntent)) {
        matches.mood += 3;
      }
    });
  }

  // Season intent scoring (medium weight)
  if (parsedQuery.intents.season.length > 0) {
    parsedQuery.intents.season.forEach(seasonIntent => {
      const aliases = SEASON_INTENTS[seasonIntent as keyof typeof SEASON_INTENTS] || [];
      if (aliases.some(alias => cityText.includes(alias))) {
        matches.season += 4; // Medium weight for season matches
      }
      if (cityText.includes(seasonIntent)) {
        matches.season += 2;
      }
    });
  }

  // General content matching (lowest weight, for broader relevance)
  parsedQuery.tokens.forEach(token => {
    if (cityText.includes(token) && token.length > 2) {
      matches.content += 1;
    }
  });

  const totalScore = matches.city + matches.mood + matches.season + matches.content;

  return {
    city,
    score: totalScore,
    matches
  };
}

// Rank cities by query
export function rankCitiesByQuery(cities: any[], parsedQuery: ParsedQuery): CitySearchScore[] {
  const scored = cities.map(city => scoreCityAgainstQuery(city, parsedQuery));
  
  // Filter out cities with no relevance
  const relevant = scored.filter(scored => scored.score > 0);
  
  // Sort by score (highest first)
  return relevant.sort((a, b) => b.score - a.score);
}

// Check if query has any meaningful content
export function isValidQuery(query: string): boolean {
  const parsed = parseDiscoveryQuery(query);
  return parsed.tokens.length > 0 && (
    parsed.intents.city.length > 0 ||
    parsed.intents.mood.length > 0 ||
    parsed.intents.season.length > 0
  );
}

// Get query type for UI hints
export function getQueryType(parsedQuery: ParsedQuery): 'city' | 'mood' | 'season' | 'mixed' {
  const intentCount = [
    parsedQuery.intents.city.length > 0,
    parsedQuery.intents.mood.length > 0,
    parsedQuery.intents.season.length > 0
  ].filter(Boolean).length;

  if (intentCount === 0) return 'city'; // Default to city
  if (intentCount === 1) {
    if (parsedQuery.intents.city.length > 0) return 'city';
    if (parsedQuery.intents.mood.length > 0) return 'mood';
    if (parsedQuery.intents.season.length > 0) return 'season';
  }
  return 'mixed';
}
