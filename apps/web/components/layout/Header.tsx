import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-brand" href="/">
          <span aria-hidden="true" className="site-brand__mark">
            <svg className="site-brand__mark-svg" viewBox="0 0 48 48">
              <circle className="site-brand__ring site-brand__ring--outer" cx="24" cy="24" r="18.5" />
              <circle className="site-brand__ring site-brand__ring--inner" cx="24" cy="24" r="12.75" />
              <g className="site-brand__ticks">
                <line x1="24" y1="3.75" x2="24" y2="6.75" />
                <line x1="38.32" y1="9.68" x2="36.2" y2="11.8" />
                <line x1="44.25" y1="24" x2="41.25" y2="24" />
                <line x1="38.32" y1="38.32" x2="36.2" y2="36.2" />
                <line x1="24" y1="44.25" x2="24" y2="41.25" />
                <line x1="9.68" y1="38.32" x2="11.8" y2="36.2" />
                <line x1="3.75" y1="24" x2="6.75" y2="24" />
                <line x1="9.68" y1="9.68" x2="11.8" y2="11.8" />
              </g>
              <path className="site-brand__needle site-brand__needle--north" d="M24 8.4 27.15 22.2 24 20.1 20.85 22.2Z" />
              <path className="site-brand__needle site-brand__needle--south" d="M24 26.35 21.8 35.65 24 33.55 26.2 35.65Z" />
              <path className="site-brand__monogram" d="M13.2 30.9 18.1 17.35 24 24.1 29.9 17.35 34.8 30.9" />
              <circle className="site-brand__center" cx="24" cy="24" r="2.45" />
            </svg>
          </span>
          <span className="site-brand__wordmark">
            <span className="site-brand__text">WANDERLUST</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="site-nav">
          <Link className="site-nav__link" href="/#discover">
            Discover
          </Link>
          <Link className="site-nav__link" href="/#cities">
            Cities
          </Link>
        </nav>
      </div>
    </header>
  );
}
