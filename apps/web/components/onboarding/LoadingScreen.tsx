"use client";

interface LoadingScreenProps {
  isExiting?: boolean;
}

export function LoadingScreen({ isExiting = false }: LoadingScreenProps) {
  return (
    <div className={`loading-screen${isExiting ? " loading-screen--exit" : ""}`} role="status" aria-live="polite">
      <div className="loading-screen__inner">
        <div className="loading-screen__compass-wrap">
          <svg aria-hidden="true" className="loading-compass" viewBox="0 0 160 160">
            <circle className="loading-compass__halo" cx="80" cy="80" r="62" />
            <circle className="loading-compass__ring" cx="80" cy="80" r="48" />
            <g className="loading-compass__marks">
              <path d="M80 18v10" />
              <path d="M80 132v10" />
              <path d="M18 80h10" />
              <path d="M132 80h10" />
            </g>
            <g className="loading-compass__needle-group">
              <path className="loading-compass__needle-tail" d="M80 88 72.5 118 80 111 87.5 118Z" />
              <path className="loading-compass__needle" d="M80 26 71.5 86 80 78 88.5 86Z" />
            </g>
            <circle className="loading-compass__center" cx="80" cy="80" r="4.5" />
          </svg>
        </div>
        <p className="loading-screen__copy">Loading your next destination</p>
      </div>
    </div>
  );
}

