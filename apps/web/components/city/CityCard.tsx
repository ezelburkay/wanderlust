import Link from "next/link";
import type { CityViewModel } from "../../content";

interface CityCardProps {
  city: CityViewModel;
}

export function CityCard({ city }: CityCardProps) {
  const imageStyle = {
    backgroundImage: `url(${city.imageUrl})`,
    backgroundPosition: city.imagePosition,
    backgroundSize: "cover"
  };

  return (
    <Link className="city-card" href={`/cities/${city.slug}`}>
      <article className="city-card__surface">
        <div className="city-card__media">
          <div aria-hidden="true" className="city-card__image" style={imageStyle} />
          <div aria-hidden="true" className="city-card__overlay" />
          <div className="city-card__meta">
            <span className="city-card__badge">{city.badge}</span>
            <p className="city-card__country">{city.country}</p>
          </div>
        </div>

        <div className="city-card__content">
          <div className="city-card__header">
            <h3 className="city-card__title">{city.name}</h3>
            <p className="city-card__sentence">{city.cardSentence}</p>
          </div>

          <span className="city-card__cta">Open briefing</span>
        </div>
      </article>
    </Link>
  );
}
