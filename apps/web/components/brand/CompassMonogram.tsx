interface CompassMonogramProps {
  className?: string;
}

export function CompassMonogram({ className = "" }: CompassMonogramProps) {
  const svgClassName = className ? `brand-mark ${className}` : "brand-mark";

  return (
    <svg aria-hidden="true" className={svgClassName} viewBox="0 0 100 100">
      <circle className="brand-mark__ring" cx="50" cy="50" r="43.25" />
      <g className="brand-mark__ticks">
        <line x1="50" y1="9.25" x2="50" y2="14.25" />
        <line x1="90.75" y1="50" x2="85.75" y2="50" />
        <line x1="50" y1="90.75" x2="50" y2="85.75" />
        <line x1="9.25" y1="50" x2="14.25" y2="50" />
      </g>
      <g className="brand-mark__needle-system">
        <path className="brand-mark__north" d="M50 15.5 57.25 49.85 53.65 46.35 50 52.25 46.35 46.35 42.75 49.85Z" />
        <path className="brand-mark__south" d="M50 84.5 53.35 52.45 50 45.75 46.65 52.45Z" />
      </g>
      <circle className="brand-mark__pivot" cx="50" cy="50" r="3" />
    </svg>
  );
}
