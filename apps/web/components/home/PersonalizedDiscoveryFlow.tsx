"use client";

import { useEffect, useMemo, useState } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import type { OnboardingPreferences } from "../onboarding/onboarding-types";
import { CityCard } from "../city";

interface PersonalizedDiscoveryFlowProps {
  cities: CityViewModel[];
  collections: HomepageDiscoveryViewModel[];
  activeSearchQuery?: string; // New prop to detect active search
}

type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
type TimeframeId = "this-month" | "next-3-months";

interface StoredOnboardingState {
  completed: boolean;
  skipped: boolean;
  preferences: OnboardingPreferences;
}

interface DiscoveryFlowSection {
  cities: CityViewModel[];
  label: string;
  layout: "three" | "four";
  slug: string;
  title: string;
}

interface DiscoveryIntro {
  eyebrow: string;
  identity: string;
  text: string;
  title: string;
}

interface EditorialCardTone {
  descriptor: string;
  sentence: string;
}

const storageKey = "wanderlust_onboarding";
const validVibes: VibeId[] = ["food", "romantic", "culture", "nature", "adventure", "slow"];
const validTimeframes: TimeframeId[] = ["this-month", "next-3-months"];
const defaultDiscoverySupport = "Not more options \u2014 just a more thoughtful edit of places that match how you want to travel next.";

const vibeCopy: Record<VibeId, { identity: string; keywords: string[]; supportingLine: string; title: string }> = {
  adventure: {
    identity: "For adventure seekers",
    keywords: ["walk", "streets", "energy", "explore", "landmark", "iconic", "hill"],
    supportingLine: "Not more options — just a more thoughtful edit of places that keep the day moving and the route open.",
    title: "Cities with momentum"
  },
  culture: {
    identity: "For culture lovers",
    keywords: ["culture", "art", "museum", "cathedral", "history", "historic", "architecture"],
    supportingLine: "Not more options — just a more thoughtful edit of cities that reward time, attention, and curiosity.",
    title: "Cities that reward curiosity"
  },
  food: {
    identity: "For food lovers",
    keywords: ["food", "dining", "dish", "bakery", "wine", "market", "bistro", "eat"],
    supportingLine: defaultDiscoverySupport,
    title: "Cities worth arriving hungry"
  },
  nature: {
    identity: "For nature seekers",
    keywords: ["garden", "park", "river", "hill", "outdoor", "green", "nature"],
    supportingLine: "Not more options — just a more thoughtful edit of places that open into airier days and quieter landscapes.",
    title: "Cities that open into quieter landscapes"
  },
  romantic: {
    identity: "For romantics",
    keywords: ["wine", "pastry", "evening", "garden", "romantic", "bistro", "cafe"],
    supportingLine: "Not more options — just a more thoughtful edit of places with softer light, longer meals, and room to linger.",
    title: "Cities worth slowing down for"
  },
  slow: {
    identity: "For slow travelers",
    keywords: ["walking", "walk", "neighborhood", "garden", "wine", "bistro", "slow"],
    supportingLine: "Not more options — just a more thoughtful edit of places that unfold well at an unhurried pace.",
    title: "Cities worth taking slowly"
  }
};

const editorialCardToneByVibe: Partial<Record<VibeId, Partial<Record<string, EditorialCardTone>>>> = {
  adventure: {
    paris: {
      descriptor: "Fast walks and landmark momentum",
      sentence: "The city keeps moving well on foot, with long routes, iconic stops, and energy that rarely settles."
    },
    rome: {
      descriptor: "Stairs, ruins, and walking days",
      sentence: "Every turn asks for one more climb, one more detour, and one more hour before dinner."
    }
  },
  culture: {
    paris: {
      descriptor: "Museums, boulevards, and patient looking",
      sentence: "Masterpieces, facades, and neighborhood life reward the kind of trip built around curiosity."
    },
    rome: {
      descriptor: "Ruins layered into daily life",
      sentence: "History never feels sealed off here; it keeps unfolding between walks, meals, and ordinary streets."
    }
  },
  food: {
    paris: {
      descriptor: "Bakeries, bistros, and softer starts",
      sentence: "Corner tables and long evenings make eating feel woven into the shape of the day."
    },
    rome: {
      descriptor: "Late dinners and louder tables",
      sentence: "Markets, trattorias, and a restless appetite carry the city naturally into the night."
    }
  },
  nature: {
    paris: {
      descriptor: "Gardens between the city rush",
      sentence: "Parks, river light, and long walks give the city more room to breathe than it first suggests."
    },
    rome: {
      descriptor: "Open air and slower edges",
      sentence: "Ruins, hills, and warmer light open the city into days that feel broader and less hurried."
    }
  },
  romantic: {
    paris: {
      descriptor: "Soft light and closer tables",
      sentence: "Boulevards, river walks, and slower dinners make the city feel made for lingering."
    },
    rome: {
      descriptor: "Warm stone after dark",
      sentence: "The city glows into the evening, where grand ruins and late meals share the same rhythm."
    }
  },
  slow: {
    paris: {
      descriptor: "Neighborhood mornings and unhurried dinners",
      sentence: "It rewards a patient pace: markets, side streets, and long meals that blur into the afternoon."
    },
    rome: {
      descriptor: "Long afternoons, later dinners",
      sentence: "The best version of Rome arrives slowly, through side streets, quiet pauses, and meals that stretch well past dark."
    }
  }
};

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readStoredOnboarding(): StoredOnboardingState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredOnboardingState> & {
      preferences?: Partial<OnboardingPreferences>;
    };

    return {
      completed: parsedValue.completed === true,
      skipped: parsedValue.skipped === true,
      preferences: {
        mood: sanitizeStringArray(parsedValue.preferences?.mood),
        pace: typeof parsedValue.preferences?.pace === "string" ? parsedValue.preferences.pace : "",
        foodInterest: sanitizeStringArray(parsedValue.preferences?.foodInterest),
        vibe: sanitizeStringArray(parsedValue.preferences?.vibe),
        tripStyle: sanitizeStringArray(parsedValue.preferences?.tripStyle)
      }
    };
  } catch {
    return null;
  }
}

function getMonthTokens(offset: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + offset + index, 1);

    return {
      full: monthDate.toLocaleString("en-US", { month: "long" }).toLowerCase(),
      short: monthDate.toLocaleString("en-US", { month: "short" }).toLowerCase()
    };
  });
}

function getSelectedTimeframe(state: StoredOnboardingState | null): TimeframeId | null {
  const selectedTimeframe = state?.preferences.tripStyle.find((value): value is TimeframeId => {
    return validTimeframes.includes(value as TimeframeId);
  });

  return selectedTimeframe ?? null;
}

function getSelectedVibes(state: StoredOnboardingState | null): VibeId[] {
  return state?.preferences.vibe.filter((value): value is VibeId => validVibes.includes(value as VibeId)) ?? [];
}

function scoreCity(city: CityViewModel, vibes: VibeId[], timeframe: TimeframeId | null) {
  const haystack = city.searchText;
  let score = 0;

  vibes.forEach((vibe) => {
    vibeCopy[vibe].keywords.forEach((keyword) => {
      if (haystack.includes(keyword)) {
        score += 3;
      }
    });
  });

  if (vibes.includes("food")) {
    score += city.signatureDishes.length + city.moreToEat.length;
  }

  if (vibes.includes("culture")) {
    score += city.mustSeeFirst.filter((place) => /museum|art|landmark|cathedral|historic/i.test(`${place.name} ${place.descriptor}`)).length * 2;
  }

  if (vibes.includes("nature")) {
    score += city.places.filter((place) => /park|garden|river|hill/i.test(`${place.name} ${place.descriptor}`)).length * 2;
  }

  if (vibes.includes("slow") && /walking|neighborhood|garden|wine|slow/i.test(haystack)) {
    score += 4;
  }

  if (vibes.includes("romantic") && /wine|pastry|evening|garden|romantic/i.test(haystack)) {
    score += 4;
  }

  if (vibes.includes("adventure") && /walk|explore|iconic|hill|energy/i.test(haystack)) {
    score += 4;
  }

  if (timeframe === "this-month") {
    getMonthTokens(0, 1).forEach((month) => {
      if (haystack.includes(month.full) || haystack.includes(month.short)) {
        score += 5;
      }
    });
  }

  if (timeframe === "next-3-months") {
    getMonthTokens(0, 3).forEach((month) => {
      if (haystack.includes(month.full) || haystack.includes(month.short)) {
        score += 3;
      }
    });
  }

  return score;
}

function rankCities(cities: CityViewModel[], vibes: VibeId[], timeframe: TimeframeId | null) {
  return [...cities].sort((left, right) => {
    const scoreDifference = scoreCity(right, vibes, timeframe) - scoreCity(left, vibes, timeframe);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.name.localeCompare(right.name);
  });
}

function prioritizeCollectionCities(collection: HomepageDiscoveryViewModel, rankedCities: CityViewModel[]) {
  const rankedIndex = new Map(rankedCities.map((city, index) => [city.slug, index]));

  return [...collection.cities].sort((left, right) => {
    return (rankedIndex.get(left.slug) ?? rankedCities.length) - (rankedIndex.get(right.slug) ?? rankedCities.length);
  });
}

function collectUniqueCities(sources: CityViewModel[][], count: number, excludedSlugs: Set<string> = new Set()) {
  const seenSlugs = new Set(excludedSlugs);
  const selectedCities: CityViewModel[] = [];

  sources.forEach((source) => {
    source.forEach((city) => {
      if (selectedCities.length >= count || seenSlugs.has(city.slug)) {
        return;
      }

      selectedCities.push(city);
      seenSlugs.add(city.slug);
    });
  });

  return selectedCities;
}

function getTimeframeLabel(timeframe: TimeframeId | null) {
  if (timeframe === "this-month") {
    return "This month";
  }

  if (timeframe === "next-3-months") {
    return "Next few months";
  }

  return "";
}

function getDiscoveryIntro(vibes: VibeId[], timeframe: TimeframeId | null): DiscoveryIntro {
  const primaryVibe = vibes[0];
  const timeframeLabel = getTimeframeLabel(timeframe);

  if (primaryVibe) {
    return {
      eyebrow: vibeCopy[primaryVibe].identity,
      identity: "",
      text: defaultDiscoverySupport,
      title: vibeCopy[primaryVibe].title
    };
  }

  if (timeframeLabel) {
    return {
      eyebrow: `For ${timeframeLabel.toLowerCase()}`,
      identity: "",
      text: defaultDiscoverySupport,
      title: "Cities in focus"
    };
  }

  return {
    eyebrow: "For your next trip",
    identity: "",
    text: defaultDiscoverySupport,
    title: "Cities in focus"
  };
}

function getEditorialCardTone(city: CityViewModel, primaryVibe: VibeId | null): EditorialCardTone {
  if (primaryVibe) {
    const override = editorialCardToneByVibe[primaryVibe]?.[city.slug];

    if (override) {
      return override;
    }
  }

  return {
    descriptor: city.badge,
    sentence: city.essence
  };
}

function buildSections(
  baseCollections: HomepageDiscoveryViewModel[],
  cities: CityViewModel[],
  vibes: VibeId[],
  timeframe: TimeframeId | null
): DiscoveryFlowSection[] {
  const pickedBase = baseCollections[0];
  const timingBase = baseCollections[1] ?? baseCollections[0];
  const primaryVibe = vibes[0];
  const hasSelections = vibes.length > 0 || timeframe !== null;

  const rankedBySelections = rankCities(cities, primaryVibe ? [primaryVibe] : vibes, timeframe);
  const rankedThisMonth = rankCities(cities, [], "this-month");
  const primaryCities = hasSelections
    ? collectUniqueCities([rankedBySelections, prioritizeCollectionCities(pickedBase, rankedBySelections), pickedBase.cities], 4)
    : collectUniqueCities([prioritizeCollectionCities(pickedBase, rankedThisMonth), rankedThisMonth], 4);
  const primaryCitySlugs = new Set(primaryCities.map((city) => city.slug));
  const expandedCities = collectUniqueCities(
    [
      prioritizeCollectionCities(timingBase, timeframe ? rankCities(cities, [], timeframe) : rankedThisMonth),
      timeframe ? rankCities(cities, [], timeframe) : rankedThisMonth,
      pickedBase.cities,
      cities
    ],
    3,
    primaryCitySlugs
  );

  if (!hasSelections) {
    const fallbackSections: DiscoveryFlowSection[] = [
      {
        cities: primaryCities,
        label: "For you",
        layout: "four",
        slug: "picked-for-you",
        title: "Cities in focus"
      },
      {
        cities: expandedCities,
        label: "Expanded discovery",
        layout: "three",
        slug: "timing-this-month",
        title: "In season now"
      }
    ];

    return fallbackSections.filter((section) => section.cities.length > 0);
  }

  const personalizedSections: DiscoveryFlowSection[] = [
    {
      cities: primaryCities,
      label: primaryVibe ? "Based on your vibe" : "For you",
      layout: "four",
      slug: `interest-${primaryVibe ?? "custom"}`,
      title: primaryVibe ? vibeCopy[primaryVibe].title : "Cities in focus"
    },
    {
      cities: expandedCities,
      label: "Expanded discovery",
      layout: "three",
      slug: "timing-this-month",
      title: "In season now"
    }
  ];

  return personalizedSections.filter((section) => section.cities.length > 0);
}

export function PersonalizedDiscoveryFlow({ cities, collections, activeSearchQuery }: PersonalizedDiscoveryFlowProps) {
  const isSearchDriven = activeSearchQuery && activeSearchQuery.trim() !== '';
  
  // Editorial intro based on collections - use passed data instead of hardcoded fallback
  const discoveryIntro = useMemo(() => {
    // Use the first collection's data if available
    if (collections.length > 0) {
      const primaryCollection = collections[0];
      return {
        eyebrow: primaryCollection?.label || "For you",
        identity: "",
        title: primaryCollection?.title || "Cities in focus",
        text: primaryCollection?.subtitle || defaultDiscoverySupport
      };
    }

    // Fallback only if no collections
    return {
      eyebrow: "For you",
      identity: "",
      title: "Cities in focus",
      text: defaultDiscoverySupport
    };
  }, [collections]);

  // Simplified sections generation - use passed collections directly
  const sections = useMemo(() => {
    if (!collections || collections.length === 0) {
      return [];
    }
    
    // Convert collections to sections with safety checks
    const sectionCandidates = collections.map((collection, index) => {
      // Safety checks for collection properties
      if (!collection || !collection.cities || !Array.isArray(collection.cities)) {
        console.warn('Invalid collection in discovery content:', collection);
        return null;
      }
      
      return {
        cities: collection.cities.filter(Boolean),
        label: collection.label || `Collection ${index + 1}`,
        layout: index === 0 ? "four" as const : "three" as const,
        slug: collection.slug || `collection-${index}`,
        title: collection.title || "Cities"
      };
    });
    
    // Type-safe filter to remove null values
    return sectionCandidates.filter((section): section is DiscoveryFlowSection => section !== null);
  }, [collections]);

  return (
    <section className="discovery-flow" id="discover">
      <div className="site-shell">
        <div className="discovery-flow__intro">
          <p className="discovery-flow__eyebrow">{discoveryIntro.eyebrow}</p>
          {discoveryIntro.identity && <p className="discovery-flow__intro-identity">{discoveryIntro.identity}</p>}
          <h2 className="discovery-flow__intro-title">{discoveryIntro.title}</h2>
          <p className="discovery-flow__intro-text">{discoveryIntro.text}</p>
        </div>

        {/* Only render the first section in search-inactive mode */}
        {sections.length > 0 && (
          <div className="discovery-flow-section discovery-flow-section--primary" key={sections[0].slug}>
            <div className={`discovery-flow-section__grid discovery-flow-section__grid--${sections[0].layout}`}>
              {sections[0].cities.map((city: CityViewModel) => (
                <CityCard
                  key={`${sections[0].slug}-${city.slug}`}
                  badgeText={null}
                  city={city}
                  descriptorText={city.country}
                  sentenceText={city.cardSentence}
                  variant="editorial"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
