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

const vibeOptions: Array<{ id: VibeId; label: string }> = [
  { id: "food", label: "Food" },
  { id: "romantic", label: "Romantic" },
  { id: "culture", label: "Culture" },
  { id: "nature", label: "Nature" },
  { id: "adventure", label: "Adventure" },
  { id: "slow", label: "Slow" }
];

const timeframeOptions: Array<{ id: TimeframeId; label: string }> = [
  { id: "this-month", label: "This month" },
  { id: "next-3-months", label: "Next 3 months" }
];

function getVibeIcon(vibe: VibeId) {
  switch (vibe) {
    case "food":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 3v8" />
          <path d="M9 3v8" />
          <path d="M6 7h3" />
          <path d="M7.5 11v10" />
          <path d="M16.5 3c1.8 2 2.2 4.7 1.2 8.2-.6 2.1-.9 5.4-.9 9.8" />
          <path d="M14.8 12.3h3.1" />
        </svg>
      );
    case "romantic":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 4.5 13.8 9 18.5 10.8 13.8 12.6 12 17.5 10.2 12.6 5.5 10.8 10.2 9 12 4.5Z" />
        </svg>
      );
    case "culture":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 9 12 4l8 5" />
          <path d="M5 20h14" />
          <path d="M7 10v8" />
          <path d="M12 10v8" />
          <path d="M17 10v8" />
          <path d="M4 9h16" />
        </svg>
      );
    case "nature":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M18.5 5.5c-5 .3-9.2 3.1-11.1 8.6" />
          <path d="M7.4 14.1c.3-4.8 3.4-8.4 8.6-10 1 4.8-.6 9.5-5.2 12.2" />
          <path d="M6 12.5c-1.6.7-2.9 2-3.8 3.8 2.3.6 4.4.2 6.3-1.1" />
          <path d="M8.4 15.5V20" />
        </svg>
      );
    case "adventure":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M14.5 4.5 7.5 13h4l-2 6.5 7-8.5h-4l2-6Z" />
        </svg>
      );
    case "slow":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M15.8 4.8A7.6 7.6 0 1 0 19.2 18 6.8 6.8 0 1 1 15.8 4.8Z" />
        </svg>
      );
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

              return (
                <button
                  className={`onboarding-chip${isSelected ? " onboarding-chip--selected" : ""}`}
                  key={option.id}
                  onClick={() => toggleVibe(option.id)}
                  type="button"
                >
                  <span className="onboarding-chip__icon">{getVibeIcon(option.id)}</span>
                  <span>{option.label}</span>
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

        {!canContinue ? (
          <div className="discovery-section__controls">
            <p className="discovery-section__summary">Choose a few signals so we can open Wanderlust in the right mood.</p>
          </div>
        ) : null}

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
