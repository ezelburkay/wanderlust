import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-brand" href="/">
          <span className="site-brand__mark">W</span>
          <span className="site-brand__text">Wanderlust</span>
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
