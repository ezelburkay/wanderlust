interface CompassMonogramProps {
  className?: string;
}

export function CompassMonogram({ className = "" }: CompassMonogramProps) {
  const svgClassName = className ? `brand-mark ${className}` : "brand-mark";

  return (
    <svg aria-hidden="true" className={svgClassName} viewBox="0 0 100 100">
      <circle className="brand-mark__ring" cx="50" cy="50" r="44" />
      <g className="brand-mark__ticks">
        <line x1="50" y1="8" x2="50" y2="14" />
        <line x1="92" y1="50" x2="86" y2="50" />
        <line x1="50" y1="92" x2="50" y2="86" />
        <line x1="8" y1="50" x2="14" y2="50" />
      </g>
      <g className="brand-mark__needle-system">
        <path className="brand-mark__north" d="M50 16 57.1 50 50 58.2 42.9 50Z" />
        <path className="brand-mark__north-monogram" d="M42.9 49.2 46.8 33.5 50 42.4 53.2 33.5 57.1 49.2" />
        <path className="brand-mark__south" d="M50 84 54.1 52 50 44 45.9 52Z" />
      </g>
      <circle className="brand-mark__pivot-surface" cx="50" cy="50" r="4.1" />
      <circle className="brand-mark__pivot" cx="50" cy="50" r="2.3" />
    </svg>
  );
}

