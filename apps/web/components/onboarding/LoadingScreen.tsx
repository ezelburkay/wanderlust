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
            <circle className="loading-compass__ring" cx="80" cy="80" r="48.5" />
            <circle className="loading-compass__ring-inner" cx="80" cy="80" r="34.5" />
            <circle className="loading-compass__base" cx="80" cy="80" r="22.5" />
            <g className="loading-compass__ticks">
              <line x1="80" y1="22.5" x2="80" y2="28.5" />
              <line x1="117.8" y1="42.2" x2="113.7" y2="46.3" />
              <line x1="137.5" y1="80" x2="131.5" y2="80" />
              <line x1="117.8" y1="117.8" x2="113.7" y2="113.7" />
              <line x1="80" y1="137.5" x2="80" y2="131.5" />
              <line x1="42.2" y1="117.8" x2="46.3" y2="113.7" />
              <line x1="22.5" y1="80" x2="28.5" y2="80" />
              <line x1="42.2" y1="42.2" x2="46.3" y2="46.3" />
            </g>
            <g className="loading-compass__needle-group">
              <path className="loading-compass__needle-tail" d="M80 88.5 74.5 112.5 80 107 85.5 112.5Z" />
              <path className="loading-compass__needle" d="M80 21.5 86.7 82.4 80 75.8 73.3 82.4Z" />
            </g>
            <circle className="loading-compass__center-halo" cx="80" cy="80" r="7" />
            <circle className="loading-compass__center" cx="80" cy="80" r="4.1" />
          </svg>
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
