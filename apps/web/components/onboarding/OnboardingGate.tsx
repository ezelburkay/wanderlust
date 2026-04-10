"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";
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
const onboardingUpdatedEvent = "wanderlust:onboarding-updated";
const loadingDurationMs = 3600;
const loadingFadeDurationMs = 850;
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
  window.dispatchEvent(new Event(onboardingUpdatedEvent));
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const [status, setStatus] = useState<"loading" | "onboarding" | "ready">("loading");
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [loadingScreenExiting, setLoadingScreenExiting] = useState(false);

  useEffect(() => {
    const storedState = readStoredOnboarding();
    const nextStatus = storedState?.completed || storedState?.skipped ? "ready" : "onboarding";
    const revealTimer = window.setTimeout(() => {
      setStatus(nextStatus);
      setLoadingScreenExiting(true);
    }, loadingDurationMs);
    const hideLoaderTimer = window.setTimeout(() => {
      setShowLoadingScreen(false);
    }, loadingDurationMs + loadingFadeDurationMs);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideLoaderTimer);
    };
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

  return (
    <>
      {status === "onboarding" ? <DiscoveryExperience onComplete={handleComplete} onSkip={handleSkip} /> : null}
      {status === "ready" ? <>{children}</> : null}
      {showLoadingScreen ? <LoadingScreen isExiting={loadingScreenExiting} /> : null}
    </>
  );
}
