// Selection Engine v1 - Core Functions

import type { 
  City, 
  PrimaryLens, 
  SeasonalTag, 
  LensScore, 
  ScoringContext,
  HomepageSection,
  HomepagePlan
} from './types';
import { 
  LENS_ADJACENCY, 
  SECTION_CONFIGS, 
  SECTION_TITLES,
  SCORING_WEIGHTS,
  SEASONAL_BOOST
} from './constants';

/**
 * Calculate seasonal relevance score for a city
 */
export function calculateSeasonalScore(city: City, currentSeason: SeasonalTag): number {
  if (city.seasonalTags.includes(currentSeason)) {
    return SEASONAL_BOOST.perfect;
  }
  if (city.seasonalTags.includes('year_round')) {
    return SEASONAL_BOOST.good;
  }
  return SEASONAL_BOOST.neutral;
}

/**
 * Calculate lens adjacency score for fallback logic
 */
export function calculateAdjacencyScore(city: City, targetLens: PrimaryLens): number {
  const adjacency = LENS_ADJACENCY[targetLens];
  
  // Primary lens match
  if (city.primaryLenses.includes(targetLens)) {
    return 1.0;
  }
  
  // Secondary lens match
  const secondaryMatch = adjacency.secondary.some(lens => 
    city.primaryLenses.includes(lens as PrimaryLens) || 
    city.supportingTags.includes(lens)
  );
  if (secondaryMatch) {
    return 0.7;
  }
  
  // Rescue tag match
  const rescueMatch = adjacency.rescue.some(tag => city.supportingTags.includes(tag));
  if (rescueMatch) {
    return 0.4;
  }
  
  return 0.0;
}

/**
 * Calculate repeat penalty based on usage context
 */
export function calculateRepeatPenalty(city: City, context: ScoringContext): number {
  if (!context.usedCityIds.has(city.id)) {
    return 0.0; // No penalty for first use
  }
  
  const usageCount = context.sectionCityCounts.get(city.id) || 0;
  const sectionConfig = SECTION_CONFIGS[context.sectionIndex === 0 ? 'active-lens' : 
                         context.sectionIndex === 1 ? 'seasonal' : 
                         context.sectionIndex === 2 ? 'onboarding' : 'explore'];
  
  // Exponential penalty based on usage count
  return Math.pow(usageCount, 2) * (sectionConfig.duplicatePenalty / 100);
}

/**
 * Score a city for a specific lens with full context
 */
export function scoreCityForLens(city: City, lens: PrimaryLens, context: ScoringContext): LensScore {
  // Exact lens contribution
  const exactLensScore = city.primaryLenses.includes(lens) ? 
    city.perLensScores[lens] / 100 : 0.0;
  
  // Adjacency contribution
  const adjacencyScore = calculateAdjacencyScore(city, lens);
  
  // Seasonal contribution
  const seasonalScore = calculateSeasonalScore(city, context.currentSeason);
  
  // Editorial and uniqueness contributions
  const editorialScore = city.editorialScore / 100;
  const uniquenessScore = city.uniquenessScore / 100;
  
  // Repeat penalty
  const repeatPenalty = calculateRepeatPenalty(city, context);
  
  // Calculate final weighted score
  const finalScore = 
    (exactLensScore * SCORING_WEIGHTS.exactLens) +
    (adjacencyScore * SCORING_WEIGHTS.adjacency) +
    (seasonalScore * SCORING_WEIGHTS.seasonal) +
    (editorialScore * SCORING_WEIGHTS.editorial) +
    (uniquenessScore * SCORING_WEIGHTS.uniqueness) -
    repeatPenalty;
  
  return {
    city,
    exactLensScore,
    adjacencyScore,
    seasonalScore,
    editorialScore,
    uniquenessScore,
    repeatPenalty,
    finalScore: Math.max(0, finalScore) // Ensure non-negative
  };
}

/**
 * Build candidate pool for a section
 */
export function buildCandidatePool(
  allCities: City[], 
  lens: PrimaryLens, 
  context: ScoringContext,
  targetCount: number
): City[] {
  // Score all cities for the lens
  const scoredCities = allCities.map(city => 
    scoreCityForLens(city, lens, context)
  );
  
  // Sort by final score (descending)
  scoredCities.sort((a, b) => b.finalScore - a.finalScore);
  
  // Take top candidates with some buffer for selection
  const buffer = Math.max(targetCount * 2, 8);
  return scoredCities
    .slice(0, buffer)
    .map(score => score.city);
}

/**
 * Select cities for a section with diversity and deduplication
 */
export function selectCitiesForSection(
  candidates: City[],
  targetCount: number,
  context: ScoringContext,
  allowDuplicates: boolean = false
): City[] {
  const selected: City[] = [];
  const availableCandidates = [...candidates];
  
  while (selected.length < targetCount && availableCandidates.length > 0) {
    let bestCandidate: City | null = null;
    let bestScore = -1;
    let bestIndex = -1;
    
    // Find best candidate considering current selection
    availableCandidates.forEach((candidate, index) => {
      if (!allowDuplicates && context.usedCityIds.has(candidate.id)) {
        return; // Skip if duplicates not allowed and already used
      }
      
      // Calculate diversity score (prefer different countries/regions)
      let diversityScore = 1.0;
      if (selected.length > 0) {
        const countryMatches = selected.filter(s => s.country === candidate.country).length;
        diversityScore = Math.max(0.1, 1.0 - (countryMatches * 0.3));
      }
      
      // Final selection score
      const activeLens = context.activeLens || 'food';
      const selectionScore = candidate.perLensScores[activeLens] / 100 * diversityScore;
      
      if (selectionScore > bestScore) {
        bestScore = selectionScore;
        bestCandidate = candidate;
        bestIndex = index;
      }
    });
    
    if (bestCandidate) {
      selected.push(bestCandidate);
      availableCandidates.splice(bestIndex, 1);
      
      // Update context
      context.usedCityIds.add(bestCandidate.id);
      const currentCount = context.sectionCityCounts.get(bestCandidate.id) || 0;
      context.sectionCityCounts.set(bestCandidate.id, currentCount + 1);
    } else {
      break; // No more valid candidates
    }
  }
  
  return selected;
}

/**
 * Get section title and subtitle based on type and lens
 */
export function getSectionContent(type: HomepageSection['type'], lens?: PrimaryLens): {
  title: string;
  subtitle: string;
} {
  const titleMap = SECTION_TITLES[type];
  
  if (type === 'active-lens' && lens) {
    return (titleMap as any)[lens];
  }
  
  if (type === 'onboarding' && lens) {
    return (titleMap as any)[lens];
  }
  
  return titleMap as { title: string; subtitle: string };
}

