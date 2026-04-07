// Enhanced Onboarding Types and Helpers
export type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
export type TimeframeId = "this-month" | "next-3-months";

export interface VibePreferences {
  primary: VibeId | null;
  secondary: VibeId[];
  all: VibeId[];
}

export interface OnboardingPreferences {
  mood: string[];
  pace: string;
  foodInterest: string[];
  vibe: string[];
  tripStyle: string[];
}

// Helper to extract primary/secondary preferences from vibes array
export function getVibePreferences(vibes: VibeId[]): VibePreferences {
  return {
    primary: vibes[0] ?? null,
    secondary: vibes.slice(1),
    all: vibes
  };
}

// Helper to get primary lens for homepage logic
export function getPrimaryLens(preferences: OnboardingPreferences): VibeId | null {
  if (preferences.vibe.length === 0) return null;
  return preferences.vibe[0] as VibeId;
}

// Helper to get secondary lenses for ranking/fallback
export function getSecondaryLenses(preferences: OnboardingPreferences): VibeId[] {
  return preferences.vibe.slice(1) as VibeId[];
}
