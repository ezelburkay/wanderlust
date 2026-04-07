// Homepage Integration Helper for Onboarding Preferences

import { type OnboardingPreferences, getPrimaryLens, getSecondaryLenses } from './onboarding-types';

/**
 * Convert onboarding preferences to selection engine format
 */
export function mapOnboardingToSelectionEngine(preferences: OnboardingPreferences): {
  primaryLens: string | null;
  secondaryLenses: string[];
  allLenses: string[];
} {
  // Map vibe IDs to selection engine lens IDs
  const lensMapping: Record<string, string> = {
    'food': 'food',
    'romantic': 'romantic', 
    'culture': 'romantic', // Culture maps to romantic for now
    'nature': 'coastal',   // Nature maps to coastal for now
    'adventure': 'weekend', // Adventure maps to weekend for now
    'slow': 'slow'
  };

  const primaryVibe = getPrimaryLens(preferences);
  const secondaryVibes = getSecondaryLenses(preferences);

  return {
    primaryLens: primaryVibe ? lensMapping[primaryVibe] : null,
    secondaryLenses: secondaryVibes.map(vibe => lensMapping[vibe]),
    allLenses: preferences.vibe.map(vibe => lensMapping[vibe])
  };
}

/**
 * Get onboarding lens for homepage sections
 */
export function getOnboardingLens(preferences: OnboardingPreferences): string {
  const { primaryLens } = mapOnboardingToSelectionEngine(preferences);
  return primaryLens || 'food'; // Fallback to food
}

/**
 * Get secondary lenses for ranking/fallback
 */
export function getSecondaryLensesForRanking(preferences: OnboardingPreferences): string[] {
  const { secondaryLenses } = mapOnboardingToSelectionEngine(preferences);
  return secondaryLenses;
}

/**
 * Check if user has onboarding preferences
 */
export function hasOnboardingPreferences(preferences: OnboardingPreferences): boolean {
  return preferences.vibe.length > 0;
}

/**
 * Get onboarding summary for debugging/analytics
 */
export function getOnboardingSummary(preferences: OnboardingPreferences): {
  totalVibes: number;
  primaryVibe: string | null;
  secondaryVibes: string[];
  hasTimeframe: boolean;
  timeframe: string | null;
} {
  return {
    totalVibes: preferences.vibe.length,
    primaryVibe: getPrimaryLens(preferences),
    secondaryVibes: getSecondaryLenses(preferences),
    hasTimeframe: preferences.tripStyle.length > 0,
    timeframe: preferences.tripStyle[0] || null
  };
}
