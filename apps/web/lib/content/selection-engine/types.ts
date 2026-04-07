// Selection Engine v1 - TypeScript Types

export interface City {
  id: string;
  name: string;
  country: string;
  region?: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  
  // Lens system
  primaryLenses: PrimaryLens[];
  supportingTags: SupportingTag[];
  seasonalTags: SeasonalTag[];
  
  // Scoring attributes
  perLensScores: Record<PrimaryLens, number>; // 0-100
  editorialScore: number; // 0-100
  uniquenessScore: number; // 0-100
  repeatPenaltyWeight: number; // 0-100
  
  // Editorial content
  vibeLine?: string;
  cardSentence?: string;
  essence?: string;
  quickFacts?: {
    worksBestFor?: string[];
    bestFor?: string[];
  };
}

export type PrimaryLens = 
  | 'romantic'
  | 'food' 
  | 'slow'
  | 'summer'
  | 'coastal'
  | 'weekend';

export type SupportingTag = 
  | 'romantic'
  | 'food'
  | 'slow'
  | 'summer'
  | 'coastal'
  | 'weekend'
  | 'bakery'
  | 'wine'
  | 'seafood'
  | 'market'
  | 'scenic'
  | 'walkable'
  | 'elegant'
  | 'cafe-heavy'
  | 'hidden-gem'
  | 'local'
  | 'island'
  | 'sun-drenched'
  | 'compact'
  | 'art-led'
  | 'stylish'
  | 'historic'
  | 'low-key'
  | 'wellness'
  | 'culture'
  | 'outdoor';

export type SeasonalTag = 
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'year_round';

export interface LensScore {
  city: City;
  exactLensScore: number;
  adjacencyScore: number;
  seasonalScore: number;
  editorialScore: number;
  uniquenessScore: number;
  repeatPenalty: number;
  finalScore: number;
}

export interface HomepageSection {
  id: string;
  type: 'active-lens' | 'seasonal' | 'onboarding' | 'explore';
  title: string;
  subtitle: string;
  cities: City[];
  lens?: PrimaryLens;
  season?: SeasonalTag;
}

export interface HomepagePlan {
  sections: HomepageSection[];
  usedCities: Set<string>;
  scoringContext: ScoringContext;
}

export interface ScoringContext {
  activeLens?: PrimaryLens;
  onboardingLens?: PrimaryLens;
  currentSeason: SeasonalTag;
  sectionIndex: number;
  usedCityIds: Set<string>;
  sectionCityCounts: Map<string, number>; // cityId -> count across sections
}

export interface LensAdjacency {
  primary: PrimaryLens[];
  secondary: (PrimaryLens | SupportingTag)[];
  rescue: SupportingTag[];
}

export interface SectionConfig {
  type: HomepageSection['type'];
  minCities: number;
  maxCities: number;
  targetCities: number;
  allowDuplicates: boolean;
  duplicatePenalty: number;
}

export interface SelectionEngineOptions {
  enableDeduplication: boolean;
  enableSeasonalBoost: boolean;
  enableAdjacencyFallback: boolean;
  editorialWeight: number;
  uniquenessWeight: number;
  repeatPenaltyWeight: number;
}

