interface CompassMonogramProps {
  className?: string;
}

export function CompassMonogram({ className = "" }: CompassMonogramProps) {
  const svgClassName = className ? `brand-mark ${className}` : "brand-mark";

  return (
    <svg aria-hidden="true" className={svgClassName} viewBox="0 0 100 100">
      <circle className="brand-mark__ring" cx="50" cy="50" r="42.75" />
      <g className="brand-mark__ticks">
        <line x1="50" y1="10.1" x2="50" y2="14.35" />
        <line x1="89.9" y1="50" x2="85.65" y2="50" />
        <line x1="50" y1="89.9" x2="50" y2="85.65" />
        <line x1="10.1" y1="50" x2="14.35" y2="50" />
      </g>
      <g className="brand-mark__core">
        <g className="brand-mark__needle-system">
          <path className="brand-mark__north" d="M50 14.35 56.4 49.15 53.15 46.55 50 51.65 46.85 46.55 43.6 49.15Z" />
          <path className="brand-mark__south" d="M50 83.65 52.7 52.1 50 46.6 47.3 52.1Z" />
        </g>
        <circle className="brand-mark__pivot" cx="50" cy="50" r="2.45" />
      </g>
    </svg>
  );
}
