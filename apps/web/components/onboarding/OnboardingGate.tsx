"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DiscoveryExperience, type OnboardingPreferences } from "./OnboardingExperience";

interface OnboardingGateProps {
  children: ReactNode;
}

interface StoredOnboardingState {
  completed: boolean;
  skipped: boolean;
  preferences: OnboardingPreferences;
}

const storageKey = "wanderlust_onboarding";
const emptyOnboardingPreferences: OnboardingPreferences = {
  mood: [],
  pace: "",
  foodInterest: [],
  vibe: [],
  tripStyle: []
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
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function saveStoredOnboarding(state: StoredOnboardingState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const [status, setStatus] = useState<"loading" | "onboarding" | "ready">("loading");

  useEffect(() => {
    const storedState = readStoredOnboarding();

    if (!storedState) {
      setStatus("onboarding");
      return;
    }

    if (storedState.completed || storedState.skipped) {
      setStatus("ready");
      return;
    }

    setStatus("onboarding");
  }, []);

  function handleComplete(preferences: OnboardingPreferences) {
    saveStoredOnboarding({
      completed: true,
      skipped: false,
      preferences
    });
    setStatus("ready");
  }

  function handleSkip() {
    saveStoredOnboarding({
      completed: false,
      skipped: true,
      preferences: emptyOnboardingPreferences
    });
    setStatus("ready");
  }

  if (status === "loading") {
    return null;
  }

  if (status === "onboarding") {
    return <DiscoveryExperience onComplete={handleComplete} onSkip={handleSkip} />;
  }

  return <>{children}</>;
}
