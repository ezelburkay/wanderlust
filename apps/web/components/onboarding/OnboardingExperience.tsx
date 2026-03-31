"use client";

import { useEffect, useState } from "react";

export interface OnboardingPreferences {
  mood: string[];
  pace: string;
  foodInterest: string[];
  vibe: string[];
  tripStyle: string[];
}

interface DiscoveryExperienceProps {
  onComplete: (preferences: OnboardingPreferences) => void;
  onSkip: () => void;
}

type VibeId = "food" | "romantic" | "culture" | "nature" | "adventure" | "slow";
type TimeframeId = "this-month" | "next-3-months";

export const emptyOnboardingPreferences: OnboardingPreferences = {
  mood: [],
  pace: "",
  foodInterest: [],
  vibe: [],
  tripStyle: []
};

const vibeOptions: Array<{ icon: string; id: VibeId; label: string }> = [
  { icon: "🍽️", id: "food", label: "Food" },
  { icon: "✦", id: "romantic", label: "Romantic" },
  { icon: "🏛️", id: "culture", label: "Culture" },
  { icon: "🌿", id: "nature", label: "Nature" },
  { icon: "⚡", id: "adventure", label: "Adventure" },
  { icon: "☾", id: "slow", label: "Slow" }
];

const timeframeOptions: Array<{ id: TimeframeId; label: string }> = [
  { id: "this-month", label: "This month" },
  { id: "next-3-months", label: "Next 3 months" }
];

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

  function toggleVibe(vibe: VibeId) {
    setVibes((currentVibes: VibeId[]) => {
      if (currentVibes.includes(vibe)) {
        return currentVibes.filter((currentVibe: VibeId) => currentVibe !== vibe);
      }

      return [...currentVibes, vibe];
    });
  }

  function handleComplete() {
    onComplete(buildPreferences(vibes, timeframe));
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-panel">
        <p className="onboarding-brand">Wanderlust</p>
        <h1 className="onboarding-title">
          What kind of trip <span className="onboarding-title__accent">are you looking for?</span>
        </h1>

        <div className="onboarding-group">
          <p className="onboarding-group__label">Your vibe — pick all that fit</p>
          <div className="onboarding-chip-grid">
            {vibeOptions.map((option) => {
              const isSelected = vibes.includes(option.id);
              const iconClassName = getVibeIcon(option.id);

              return (
                <button
                  className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}`}
                  key={option.id}
                  onClick={() => toggleVibe(option.id)}
                  type="button"
                >
                  <span className="onboarding-chip__content">
                    <span className="onboarding-chip__icon-slot">
                      <span className={`onboarding-chip__icon ${iconClassName}`}>{option.icon}</span>
                    </span>
                    <span className="onboarding-chip__label">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
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
                  onClick={() => setTimeframe(option.id)}
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
