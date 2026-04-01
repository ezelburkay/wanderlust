export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="site-shell">
        <div className="hero-section__panel">
          <p className="hero-section__eyebrow">Tailored</p>
          <h1 className="hero-section__title">
            <span className="hero-section__title-line">The story of</span>
            <span className="hero-section__title-line">a city.</span>
            <span className="hero-section__title-line hero-section__title-line--accent">Distilled.</span>
          </h1>
          <p className="hero-section__subtitle">
            What to see. What to eat. Nothing extra.
          </p>
          <div className="hero-section__actions">
            <a className="hero-section__action hero-section__action--primary" href="#discover">
              Your picks
            </a>
            <a className="hero-section__action" href="#search">
              Search
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
