import Link from "next/link";
import { CompassMonogram } from "../brand/CompassMonogram";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-brand" href="/">
          <span aria-hidden="true" className="site-brand__mark">
            <CompassMonogram className="site-brand__mark-svg" />
          </span>
          <div className="site-brand__lockup">
            <span className="site-brand__text">Wanderlust</span>
            <span className="site-brand__essence">Curated. Distilled.</span>
          </div>
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

