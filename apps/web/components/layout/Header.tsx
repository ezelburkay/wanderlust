import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-brand" href="/">
          <span aria-hidden="true" className="site-brand__mark">
            <svg className="site-brand__mark-svg" viewBox="0 0 48 48">
              <circle className="site-brand__ring" cx="24" cy="24" r="18.5" />
              <line className="site-brand__north-mark" x1="24" y1="4.6" x2="24" y2="8.1" />
              <path className="site-brand__needle" d="M24 9.35 26.7 19.1 24 17.35 21.3 19.1Z" />
              <path className="site-brand__monogram" d="M14.7 31.1 19.1 16.95 24 23.55 28.9 16.95 33.3 31.1" />
              <circle className="site-brand__center" cx="24" cy="24" r="1.95" />
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
