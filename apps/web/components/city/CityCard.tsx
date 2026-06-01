import Link from "next/link";
import type { CityViewModel } from "../../content";

interface CityCardProps {
  badgeText?: string | null;
  city: CityViewModel;
  descriptorText?: string;
  sentenceText?: string;
  variant?: "default" | "editorial";
  key?: string;
}

export function CityCard({ badgeText, city, descriptorText, sentenceText, variant = "default" }: CityCardProps) {
  const imageStyle = {
    backgroundImage: `url(${city.imageUrl})`,
    backgroundPosition: city.cardImagePosition ?? city.imagePosition,
    backgroundSize: "cover"
  };
  const resolvedBadgeText = badgeText === undefined ? city.badge : badgeText;
  const resolvedDescriptorText = descriptorText ?? city.country;
  const resolvedSentenceText = sentenceText ?? city.cardSentence;

  return (
    <Link className={`city-card${variant === "editorial" ? " city-card--editorial" : ""}`} href={`/cities/${city.slug}`}>
      <article className="city-card__surface">
        <div aria-hidden="true" className="city-card__image" style={imageStyle} />
        <div aria-hidden="true" className="city-card__overlay" />
        <div className="city-card__content">
          {resolvedBadgeText ? <span className="city-card__badge">{resolvedBadgeText}</span> : null}
          <div className="city-card__header">
            <h3 className="city-card__title">{city.name}</h3>
            <p className="city-card__descriptor">{resolvedDescriptorText}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
