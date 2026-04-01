"use client";

import { CompassMonogram } from "../brand/CompassMonogram";

interface LoadingScreenProps {
  isExiting?: boolean;
}

export function LoadingScreen({ isExiting = false }: LoadingScreenProps) {
  return (
    <div className={`loading-screen${isExiting ? " loading-screen--exit" : ""}`} role="status" aria-live="polite">
      <div className="loading-screen__inner">
        <div className="loading-screen__compass-wrap">
          <div className="loading-screen__brand-mark-shell">
            <CompassMonogram className="loading-screen__brand-mark" />
          </div>
        </div>
        <p className="loading-screen__brand" aria-label="Wanderlust">
          <span className="loading-screen__brand-part loading-screen__brand-part--wander">Wander</span>
          <span className="loading-screen__brand-part loading-screen__brand-part--lust">lust</span>
        </p>
        <p className="loading-screen__copy">Loading your next destination</p>
      </div>
    </div>
  );
}
