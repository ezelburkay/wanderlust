// Selection Engine v1 - Constants and Configuration

import type { PrimaryLens, LensAdjacency, SectionConfig, SelectionEngineOptions, SupportingTag } from './types';

// Editorial lens adjacency mapping - primary/secondary/rescue fallback layers
export const LENS_ADJACENCY: Record<PrimaryLens, LensAdjacency> = {
  romantic: {
    primary: ['romantic'],
    secondary: ['slow', 'coastal', 'food'],
    rescue: ['scenic', 'elegant', 'weekend']
  },
  food: {
    primary: ['food'],
    secondary: ['market', 'bakery', 'wine'],
    rescue: ['slow', 'local', 'seafood']
  },
  slow: {
    primary: ['slow'],
    secondary: ['romantic', 'coastal', 'scenic'],
    rescue: ['walkable', 'wellness', 'elegant']
  },
  summer: {
    primary: ['summer'],
    secondary: ['coastal', 'weekend', 'island'],
    rescue: ['sun-drenched', 'outdoor', 'compact']
  },
  coastal: {
    primary: ['coastal'],
    secondary: ['summer', 'slow', 'seafood'],
    rescue: ['scenic', 'romantic', 'island']
  },
  weekend: {
    primary: ['weekend'],
    secondary: ['compact', 'food', 'romantic'],
    rescue: ['walkable', 'culture', 'stylish']
  }
};

// Section configuration for search-active homepage
export const SECTION_CONFIGS: Record<string, SectionConfig> = {
  'active-lens': {
    type: 'active-lens',
    minCities: 3,
    maxCities: 4,
    targetCities: 4,
    allowDuplicates: false,
    duplicatePenalty: 100 // Heavy penalty for duplicates
  },
  'seasonal': {
    type: 'seasonal',
    minCities: 3,
    maxCities: 4,
    targetCities: 4,
    allowDuplicates: false,
    duplicatePenalty: 80
  },
  'onboarding': {
    type: 'onboarding',
    minCities: 3,
    maxCities: 4,
    targetCities: 3,
    allowDuplicates: true, // Allow but penalize heavily
    duplicatePenalty: 60
  },
  'explore': {
    type: 'explore',
    minCities: 6,
    maxCities: 12,
    targetCities: 8,
    allowDuplicates: false,
    duplicatePenalty: 40
  }
};

// Editorial section title mapping
export const SECTION_TITLES = {
  'active-lens': {
    romantic: {
      title: 'Romantic destinations',
      subtitle: 'A more thoughtful edit of cities shaped by atmosphere, pace, and shared moments.'
    },
    food: {
      title: 'Cities worth arriving hungry',
      subtitle: 'A curated edit of places shaped by markets, long lunches, and the appetite that defines a trip.'
    },
    slow: {
      title: 'Slower cities, softer days',
      subtitle: 'Cities that reward a gentler pace, longer mornings, and less urgency in how you move through them.'
    },
    summer: {
      title: 'Summer cities in full light',
      subtitle: 'A warmer edit of places that feel most alive in longer days, brighter evenings, and open-air rhythms.'
    },
    coastal: {
      title: 'Coastal places that linger',
      subtitle: 'Cities where water, light, and a slower edge shape the rhythm of the stay.'
    },
    weekend: {
      title: 'Cities made for the weekend',
      subtitle: 'A tighter edit of places that give more back in less time \u2014 easy to enter, hard to leave.'
    }
  },
  'seasonal': {
    title: 'Cities that feel right this season',
    subtitle: 'A timely edit of places where mood, season, and setting come together naturally.'
  },
  'onboarding': {
    romantic: {
      title: 'Cities for slower evenings',
      subtitle: 'A few more places shaped by atmosphere, softer light, and the kind of moments you usually travel for.'
    },
    food: {
      title: 'Cities worth arriving hungry',
      subtitle: 'A few more cities shaped by markets, long lunches, and the kind of places you usually look for first.'
    },
    slow: {
      title: 'Cities that unfold gently',
      subtitle: 'A quieter edit of places where pace softens and the city reveals itself more gradually.'
    },
    summer: {
      title: 'Cities that open up in full light',
      subtitle: 'A few more places shaped by longer days, open air, and the energy of the season.'
    },
    coastal: {
      title: 'Cities with a slower shoreline rhythm',
      subtitle: 'A few more places where water, atmosphere, and ease shape the way you move through the city.'
    },
    weekend: {
      title: 'Cities that give more in less time',
      subtitle: 'A few more places built for shorter escapes, quick entry, and strong payoff.'
    }
  },
  'explore': {
    title: 'Explore more cities',
    subtitle: 'Broader discovery and hidden gems worth exploring.'
  }
};

// Default selection engine options
export const DEFAULT_OPTIONS: SelectionEngineOptions = {
  enableDeduplication: true,
  enableSeasonalBoost: true,
  enableAdjacencyFallback: true,
  editorialWeight: 0.3,
  uniquenessWeight: 0.2,
  repeatPenaltyWeight: 0.5
};

// Scoring weights
export const SCORING_WEIGHTS = {
  exactLens: 0.4,
  adjacency: 0.25,
  seasonal: 0.15,
  editorial: 0.15,
  uniqueness: 0.05
} as const;

// Seasonal boost factors
export const SEASONAL_BOOST = {
  perfect: 1.5, // City has current season tag
  good: 1.2,   // City has year_round tag
  neutral: 1.0 // No seasonal relevance
} as const;

