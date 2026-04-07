// Post-Onboarding Homepage Behavior Model
// Implements primary/secondary hierarchy for editorial clarity

import type { OnboardingPreferences } from '../onboarding/onboarding-types';
import type { ParsedQuery } from '../home/discoverySearch';

export type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
export type TimeframeId = "this-month" | "next-3-months";

// Discovery mode states
export type DiscoveryMode = 'search-inactive' | 'search-active';

// Section configuration interface
export interface DiscoverySection {
  id: string;
  type: 'primary-onboarding' | 'seasonal' | 'active-lens' | 'onboarding-continuation' | 'explore-more';
  title: string;
  eyebrow: string;
  subcopy: string;
  layout: 'four' | 'three';
  cities: any[];
}

// Onboarding preference extraction
export function extractOnboardingHierarchy(preferences: OnboardingPreferences): {
  primaryVibe: VibeId | null;
  secondaryVibes: VibeId[];
  timeframe: TimeframeId | null;
} {
  const vibes = preferences.vibe as VibeId[];
  const timeframe = preferences.tripStyle[0] as TimeframeId || null;
  
  return {
    primaryVibe: vibes[0] ?? null,
    secondaryVibes: vibes.slice(1),
    timeframe
  };
}

// Determine active discovery mode
export function getDiscoveryMode(activeSearchQuery: string): DiscoveryMode {
  return activeSearchQuery && activeSearchQuery.trim() !== '' 
    ? 'search-active' 
    : 'search-inactive';
}

// Editorial copy mapping for onboarding vibes
const onboardingCopyMap: Record<VibeId, { eyebrow: string; title: string; subcopy: string }> = {
  food: {
    eyebrow: "Food",
    title: "Cities worth arriving hungry",
    subcopy: "A curated edit of places shaped by markets, long lunches, and the appetite that defines a trip."
  },
  romantic: {
    eyebrow: "Romantic", 
    title: "Romantic destinations",
    subcopy: "A more thoughtful edit of cities shaped by atmosphere, pace, and shared moments."
  },
  culture: {
    eyebrow: "Culture",
    title: "Cities that reward curiosity",
    subcopy: "A thoughtful edit of places where museums, streets, and architectural stories reveal themselves slowly."
  },
  nature: {
    eyebrow: "Nature",
    title: "Cities with room to breathe", 
    subcopy: "A calmer edit of places where parks, gardens, and open air give the city space to unfold."
  },
  adventure: {
    eyebrow: "Adventure",
    title: "Cities that energize",
    subcopy: "A dynamic edit of places where walks, viewpoints, and urban energy shape the experience."
  },
  slow: {
    eyebrow: "Slow",
    title: "Slower cities, softer days",
    subcopy: "Cities that reward a gentler pace, longer mornings, and less urgency in how you move through them."
  }
};

// Seasonal copy mapping
const seasonalCopyMap: Record<string, { title: string; subcopy: string }> = {
  'this-month': {
    title: "Cities that feel right this season",
    subcopy: "A timely edit of places where mood, season, and setting come together naturally."
  },
  'next-3-months': {
    title: "Cities for the season ahead", 
    subcopy: "A forward-looking edit of places where the coming season brings out their best qualities."
  }
};

// Search-active copy mapping for active lens
const searchActiveCopyMap: Record<string, { eyebrow: string; title: string; subcopy: string }> = {
  romantic: {
    eyebrow: "Romantic",
    title: "Romantic destinations", 
    subcopy: "A more thoughtful edit of cities shaped by atmosphere, pace, and shared moments."
  },
  food: {
    eyebrow: "Food",
    title: "Cities worth arriving hungry",
    subcopy: "A curated edit of places shaped by markets, long lunches, and the appetite that defines a trip."
  },
  slow: {
    eyebrow: "Slow",
    title: "Slower cities, softer days", 
    subcopy: "Cities that reward a gentler pace, longer mornings, and less urgency in how you move through them."
  },
  summer: {
    eyebrow: "Summer",
    title: "Summer cities in full light",
    subcopy: "A warmer edit of places that feel most alive in longer days, brighter evenings, and open-air rhythms."
  },
  coastal: {
    eyebrow: "Coastal",
    title: "Coastal places that linger",
    subcopy: "Cities where water, light, and a slower edge shape the rhythm of the stay."
  },
  weekend: {
    eyebrow: "Weekend",
    title: "Cities made for the weekend",
    subcopy: "A tighter edit of places that give more back in less time \u2014 easy to enter, hard to leave."
  }
};

// Onboarding continuation copy for search-active mode
const onboardingContinuationCopyMap: Record<VibeId, { eyebrow: string; title: string; subcopy: string }> = {
  food: {
    eyebrow: "For food lovers",
    title: "Cities worth arriving hungry",
    subcopy: "A few more cities shaped by markets, long lunches, and the kind of places you usually look for first."
  },
  romantic: {
    eyebrow: "For romantics",
    title: "Cities for slower evenings",
    subcopy: "A few more places shaped by atmosphere, softer light, and the kind of moments you usually travel for."
  },
  culture: {
    eyebrow: "For the curious",
    title: "Cities that reveal themselves slowly",
    subcopy: "A few more places where museums, architecture, and street life reward patient exploration."
  },
  nature: {
    eyebrow: "For nature seekers",
    title: "Cities with room to breathe",
    subcopy: "A few more places where parks, gardens, and open air give the experience more space."
  },
  adventure: {
    eyebrow: "For adventurers",
    title: "Cities that energize",
    subcopy: "A few more places where walks, viewpoints, and urban energy shape the rhythm of the stay."
  },
  slow: {
    eyebrow: "For slower travel",
    title: "Cities that unfold gently",
    subcopy: "A quieter edit of places where pace softens and the city reveals itself more gradually."
  }
};

// Generate section configuration based on mode and preferences
export function generateDiscoverySections(
  mode: DiscoveryMode,
  preferences: OnboardingPreferences | null,
  activeSearchQuery: string | null,
  parsedQuery: ParsedQuery | null,
  allCities: any[],
  searchResults: any[] | null
): DiscoverySection[] {
  const sections: DiscoverySection[] = [];
  const { primaryVibe, secondaryVibes, timeframe } = preferences 
    ? extractOnboardingHierarchy(preferences) 
    : { primaryVibe: null, secondaryVibes: [], timeframe: null };

  // === SEARCH INACTIVE MODE ===
  if (mode === 'search-inactive') {
    // Section 1: Primary onboarding discovery
    if (primaryVibe) {
      const copy = onboardingCopyMap[primaryVibe];
      sections.push({
        id: 'primary-onboarding',
        type: 'primary-onboarding',
        title: copy.title,
        eyebrow: copy.eyebrow,
        subcopy: copy.subcopy,
        layout: 'four',
        cities: [] // Will be populated by ranking logic
      });
    }

    // Section 2: Seasonal continuation
    const seasonalCopy = timeframe 
      ? seasonalCopyMap[timeframe]
      : { title: "Cities that feel right this season", subcopy: "A timely edit of places where mood, season, and setting come together naturally." };
    
    sections.push({
      id: 'seasonal',
      type: 'seasonal',
      title: seasonalCopy.title,
      eyebrow: "Seasonal",
      subcopy: seasonalCopy.subcopy,
      layout: 'three',
      cities: [] // Will be populated by seasonal logic
    });

    // Section 3: Explore more cities
    sections.push({
      id: 'explore-more',
      type: 'explore-more',
      title: "Explore more cities",
      eyebrow: "Discovery",
      subcopy: "A broader edit of places that offer different perspectives and new rhythms.",
      layout: 'three',
      cities: [] // Will be populated by diverse logic
    });

    return sections;
  }

  // === SEARCH ACTIVE MODE ===
  if (mode === 'search-active' && parsedQuery) {
    // Extract primary intent from search query
    const primaryIntent = parsedQuery.intents.mood?.[0] || 
                         parsedQuery.intents.season?.[0] || 
                         'discovery';

    // Section 1: Active lens (temporary override)
    const searchCopy = searchActiveCopyMap[primaryIntent.toLowerCase()] || {
      eyebrow: primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1),
      title: `${primaryIntent.charAt(0).toUpperCase() + primaryIntent.slice(1)} destinations`,
      subcopy: "A curated edit of places shaped by your interests."
    };

    sections.push({
      id: 'active-lens',
      type: 'active-lens',
      title: searchCopy.title,
      eyebrow: searchCopy.eyebrow,
      subcopy: searchCopy.subcopy,
      layout: 'four',
      cities: searchResults?.slice(0, 4) || []
    });

    // Section 2: Seasonal continuation
    const seasonalCopy = timeframe 
      ? seasonalCopyMap[timeframe]
      : { title: "Cities that feel right this season", subcopy: "A timely edit of places where mood, season, and setting come together naturally." };
    
    sections.push({
      id: 'seasonal',
      type: 'seasonal',
      title: seasonalCopy.title,
      eyebrow: "Seasonal",
      subcopy: seasonalCopy.subcopy,
      layout: 'three',
      cities: [] // Will exclude search results, focus on seasonal
    });

    // Section 3: Onboarding continuation (preserve user identity)
    if (primaryVibe) {
      const onboardingCopy = onboardingContinuationCopyMap[primaryVibe];
      sections.push({
        id: 'onboarding-continuation',
        type: 'onboarding-continuation',
        title: onboardingCopy.title,
        eyebrow: onboardingCopy.eyebrow,
        subcopy: onboardingCopy.subcopy,
        layout: 'three',
        cities: [] // Will exclude search and seasonal results
      });
    }

    // Section 4: Explore more cities
    sections.push({
      id: 'explore-more',
      type: 'explore-more',
      title: "Explore more cities",
      eyebrow: "Discovery",
      subcopy: "A broader edit of places that offer different perspectives and new rhythms.",
      layout: 'three',
      cities: [] // Will exclude all previous sections
    });

    return sections;
  }

  // Fallback: basic discovery
  return [{
    id: 'fallback',
    type: 'explore-more',
    title: "Cities in focus",
    eyebrow: "For you",
    subcopy: "A thoughtful edit of places for your next trip.",
    layout: 'four',
    cities: allCities.slice(0, 4)
  }];
}

// Helper for city ranking with primary/secondary support
export function rankCitiesWithHierarchy(
  cities: any[],
  primaryVibe: VibeId | null,
  secondaryVibes: VibeId[],
  timeframe: TimeframeId | null
): any[] {
  // Implementation would rank cities with primary vibe getting highest weight,
  // secondary vibes getting moderate weight, and timeframe influencing seasonal relevance
  // This is a placeholder for the actual ranking algorithm
  
  return cities.sort((a, b) => {
    // Primary vibe gets highest priority
    if (primaryVibe) {
      // Add primary vibe scoring logic here
    }
    
    // Secondary vibes get moderate priority
    secondaryVibes.forEach(vibe => {
      // Add secondary vibe scoring logic here
    });
    
    // Timeframe influences seasonal relevance
    if (timeframe) {
      // Add timeframe scoring logic here
    }
    
    return 0; // Placeholder
  });
}
