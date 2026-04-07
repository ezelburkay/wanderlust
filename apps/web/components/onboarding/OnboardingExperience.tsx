"use client";

import { useEffect, useState } from "react";
import { type VibeId, type TimeframeId, type OnboardingPreferences, getVibePreferences } from "./onboarding-types";

interface DiscoveryExperienceProps {
  onComplete: (preferences: OnboardingPreferences) => void;
  onSkip: () => void;
}

export const emptyOnboardingPreferences: OnboardingPreferences = {
  mood: [],
  pace: "",
  foodInterest: [],
  vibe: [],
  tripStyle: []
};

const vibeOptions: Array<{ icon: string; id: VibeId; label: string }> = [
  { icon: "??", id: "food", label: "Food" },
  { icon: "??", id: "romantic", label: "Romantic" },
  { icon: "??", id: "culture", label: "Culture" },
  { icon: "??", id: "nature", label: "Nature" },
  { icon: "??", id: "adventure", label: "Adventure" },
  { icon: "??", id: "slow", label: "Slow" }
];

const timeframeOptions: Array<{ id: TimeframeId; label: string }> = [
  { id: "this-month", label: "This month" },
  { id: "next-3-months", label: "Next 3 months" }
];

// Constants for selection limits
const MAX_VIBE_SELECTIONS = 3;

function getVibeIcon(vibe: VibeId) {
  switch (vibe) {
    case "food":
      return "onboarding-chip__icon--food";
    case "romantic":
      return "onboarding-chip__icon--romantic";
    case "culture":
      return "onboarding-chip__icon--culture";
    case "nature":
      return "onboarding-chip__icon--nature";
    case "adventure":
      return "onboarding-chip__icon--adventure";
    case "slow":
      return "onboarding-chip__icon--slow";
  }
}

function buildPreferences(vibes: VibeId[], timeframe: TimeframeId | null): OnboardingPreferences {
  const mood = vibes.filter((vibe) => ["romantic", "culture", "nature", "adventure"].includes(vibe));

  return {
    mood,
    pace: vibes.includes("slow") ? "slow" : "balanced",
    foodInterest: vibes.includes("food") ? ["local cuisine", "signature dishes"] : [],
    vibe: vibes,
    tripStyle: timeframe ? [timeframe] : []
  };
}

export function DiscoveryExperience({ onComplete, onSkip }: DiscoveryExperienceProps) {
  const [timeframe, setTimeframe] = useState<TimeframeId | null>(null);
  const [vibes, setVibes] = useState<VibeId[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const canContinue = vibes.length > 0 || timeframe !== null;
  const isMaxSelectionsReached = vibes.length >= MAX_VIBE_SELECTIONS;

  function toggleVibe(vibe: VibeId) {
    setVibes((currentVibes: VibeId[]) => {
      if (currentVibes.includes(vibe)) {
        // Remove vibe if already selected
        return currentVibes.filter((currentVibe: VibeId) => currentVibe !== vibe);
      }

      // Only add if under the limit
      if (currentVibes.length >= MAX_VIBE_SELECTIONS) {
        return currentVibes; // Don't add if limit reached
      }

      // Add new vibe to end (preserves selection order)
      return [...currentVibes, vibe];
    });
  }

  function toggleTimeframe(nextTimeframe: TimeframeId) {
    setTimeframe((currentTimeframe: TimeframeId | null) => (currentTimeframe === nextTimeframe ? null : nextTimeframe));
  }

  function handleComplete() {
    onComplete(buildPreferences(vibes, timeframe));
  }

  // Get preference hierarchy for UI feedback
  const vibePreferences = getVibePreferences(vibes);

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-panel">
        <p className="onboarding-brand">Wanderlust</p>
        <h1 className="onboarding-title">
          What kind of trip <span className="onboarding-title__accent">are you looking for?</span>
        </h1>

        <div className="onboarding-group">
          <p className="onboarding-group__label">Pick up to 3 {vibePreferences.primary && '· your first choice shapes the journey most'}</p>
          <div className="onboarding-chip-grid">
            {vibeOptions.map((option) => {
              const isSelected = vibes.includes(option.id);
              const selectionIndex = vibes.indexOf(option.id);
              const isPrimary = selectionIndex === 0;
              const isSecondary = selectionIndex > 0 && selectionIndex < MAX_VIBE_SELECTIONS;
              const iconClassName = getVibeIcon(option.id);

              return (
                <button
                  className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}${isPrimary ? " onboarding-chip--primary" : ""}${isSecondary ? " onboarding-chip--secondary" : ""}`}
                  key={option.id}
                  onClick={() => toggleVibe(option.id)}
                  type="button"
                  disabled={!isSelected && isMaxSelectionsReached}
                >
                  <span className="onboarding-chip__content">
                    <span className="onboarding-chip__icon-slot">
                      <span className={`onboarding-chip__icon ${iconClassName}`}>{option.icon}</span>
                      {isPrimary && <span className="onboarding-chip__indicator">1</span>}
                      {isSecondary && <span className="onboarding-chip__indicator">{selectionIndex + 1}</span>}
                    </span>
                    <span className="onboarding-chip__label">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {isMaxSelectionsReached && (
            <p className="onboarding-group__hint">Maximum selections reached</p>
          )}
        </div>

        <div className="onboarding-group">
          <p className="onboarding-group__label">When are you thinking?</p>
          <div className="onboarding-chip-grid onboarding-chip-grid--timing">
            {timeframeOptions.map((option) => {
              const isSelected = timeframe === option.id;

              return (
                <button
                  className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}`}
                  key={option.id}
                  onClick={() => toggleTimeframe(option.id)}
                  type="button"
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="onboarding-footer">
          <button className="onboarding-submit" disabled={!canContinue} onClick={handleComplete} type="button">
            Travel Now
          </button>
          <button className="onboarding-skip" onClick={onSkip} type="button">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
