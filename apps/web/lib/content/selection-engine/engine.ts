// Selection Engine v1 - Main Engine

import type { 
  City, 
  PrimaryLens, 
  SeasonalTag, 
  HomepageSection,
  HomepagePlan,
  ScoringContext
} from './types';
import { SECTION_CONFIGS } from './constants';
import { 
  buildCandidatePool, 
  selectCitiesForSection, 
  getSectionContent 
} from './core';

/**
 * Build homepage sections for search-active mode
 */
export function buildHomepageSections(
  allCities: City[],
  activeLens: PrimaryLens,
  onboardingLens: PrimaryLens,
  currentSeason: SeasonalTag = 'summer'
): HomepagePlan {
  // Initialize scoring context
  const context: ScoringContext = {
    activeLens,
    onboardingLens,
    currentSeason,
    sectionIndex: 0,
    usedCityIds: new Set(),
    sectionCityCounts: new Map()
  };
  
  const sections: HomepageSection[] = [];
  
  // Section 1: Active lens section (primary)
  context.sectionIndex = 0;
  const activeConfig = SECTION_CONFIGS['active-lens'];
  const activeCandidates = buildCandidatePool(
    allCities, 
    activeLens, 
    context, 
    activeConfig.targetCities
  );
  const activeCities = selectCitiesForSection(
    activeCandidates, 
    activeConfig.targetCities, 
    context, 
    activeConfig.allowDuplicates
  );
  
  const activeContent = getSectionContent('active-lens', activeLens);
  sections.push({
    id: 'active-lens',
    type: 'active-lens',
    title: activeContent.title,
    subtitle: activeContent.subtitle,
    cities: activeCities,
    lens: activeLens
  });
  
  // Section 2: Seasonal continuation
  context.sectionIndex = 1;
  const seasonalConfig = SECTION_CONFIGS['seasonal'];
  const seasonalCandidates = buildCandidatePool(
    allCities, 
    activeLens, 
    context, 
    seasonalConfig.targetCities
  );
  const seasonalCities = selectCitiesForSection(
    seasonalCandidates, 
    seasonalConfig.targetCities, 
    context, 
    seasonalConfig.allowDuplicates
  );
  
  const seasonalContent = getSectionContent('seasonal');
  sections.push({
    id: 'seasonal',
    type: 'seasonal',
    title: seasonalContent.title,
    subtitle: seasonalContent.subtitle,
    cities: seasonalCities,
    season: currentSeason
  });
  
  // Section 3: Onboarding preference (secondary)
  context.sectionIndex = 2;
  const onboardingConfig = SECTION_CONFIGS['onboarding'];
  const onboardingCandidates = buildCandidatePool(
    allCities, 
    onboardingLens, 
    context, 
    onboardingConfig.targetCities
  );
  const onboardingCities = selectCitiesForSection(
    onboardingCandidates, 
    onboardingConfig.targetCities, 
    context, 
    onboardingConfig.allowDuplicates
  );
  
  const onboardingContent = getSectionContent('onboarding', onboardingLens);
  sections.push({
    id: 'onboarding',
    type: 'onboarding',
    title: onboardingContent.title,
    subtitle: onboardingContent.subtitle,
    cities: onboardingCities,
    lens: onboardingLens
  });
  
  // Section 4: Explore more cities
  context.sectionIndex = 3;
  const exploreConfig = SECTION_CONFIGS['explore'];
  const exploreCandidates = buildCandidatePool(
    allCities, 
    activeLens, 
    context, 
    exploreConfig.targetCities
  );
  const exploreCities = selectCitiesForSection(
    exploreCandidates, 
    exploreConfig.targetCities, 
    context, 
    exploreConfig.allowDuplicates
  );
  
  const exploreContent = getSectionContent('explore');
  sections.push({
    id: 'explore',
    type: 'explore',
    title: exploreContent.title,
    subtitle: exploreContent.subtitle,
    cities: exploreCities
  });
  
  return {
    sections,
    usedCities: context.usedCityIds,
    scoringContext: context
  };
}

/**
 * Build homepage sections for default mode (no active search)
 */
export function buildDefaultHomepageSections(
  allCities: City[],
  onboardingLens: PrimaryLens,
  currentSeason: SeasonalTag = 'summer'
): HomepagePlan {
  // For default mode, use onboarding lens as primary
  return buildHomepageSections(allCities, onboardingLens, onboardingLens, currentSeason);
}

/**
 * Get city selection summary for debugging/analytics
 */
export function getSelectionSummary(plan: HomepagePlan): {
  totalCities: number;
  uniqueCities: number;
  sections: Array<{
    type: string;
    cityCount: number;
    countries: string[];
    lenses: string[];
  }>;
  duplicationRate: number;
} {
  const totalCities = plan.sections.reduce((sum, section) => sum + section.cities.length, 0);
  const uniqueCities = plan.usedCities.size;
  const duplicationRate = totalCities > 0 ? (totalCities - uniqueCities) / totalCities : 0;
  
  const sections = plan.sections.map(section => ({
    type: section.type,
    cityCount: section.cities.length,
    countries: [...new Set(section.cities.map(city => city.country))],
    lenses: [...new Set(section.cities.flatMap(city => city.primaryLenses))]
  }));
  
  return {
    totalCities,
    uniqueCities,
    sections,
    duplicationRate
  };
}

