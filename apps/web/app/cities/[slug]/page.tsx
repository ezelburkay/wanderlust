import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCities, getCityBySlug, type CityViewModel } from "../../../content";
import { Header } from "../../../components/layout/Header";
import { CityEssenceAccordion } from "../../../components/city/CityEssenceAccordion";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

interface OneDayStep {
  time: string;
  note: string;
}

const sanSebastianOneDay: OneDayStep[] = [
  { time: "Morning", note: "Walk La Concha before breakfast." },
  { time: "Lunch", note: "Spend hours in Parte Vieja." },
  { time: "Sunset", note: "Monte Igueldo." },
  { time: "Dinner", note: "Reserve one unforgettable meal." }
];

function getMapsUrl(cityName: string, placeName: string): string {
  const query = encodeURIComponent(`${placeName} ${cityName}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getRequiredCity(slug: string): CityViewModel {
  const city = getCityBySlug(slug);
  if (!city) notFound();
  return city;
}

function getOneDayItems(city: CityViewModel): OneDayStep[] {
  if (city.slug === "san-sebastian") return sanSebastianOneDay;
  return [];
}

export function generateStaticParams() {
  return getAllCities().map((city) => ({ slug: city.slug }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getRequiredCity(slug);
  const oneDayItems = getOneDayItems(city);

  const atAGlanceItems = [
    { label: "Ideal Stay", value: city.quickFacts.idealDays },
    { label: "Best Season", value: city.quickFacts.bestMonths },
    { label: "Best For", value: city.quickFacts.bestFor },
    { label: "Pace", value: city.quickFacts.worksBestFor }
  ].filter((item) => item.value.trim().length > 0);

  return (
    <>
      <Header />

      <main className="page-main city-page">

        {/* 1. Hero */}
        <section className="city-hero">
          <div className="site-shell city-hero__grid">
            <div className="city-hero__media">
              <div
                aria-label={city.imageAlt}
                className="city-hero__image"
                role="img"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(17, 16, 14, 0.08) 0%, rgba(17, 16, 14, 0.24) 100%), url(${city.imageUrl})`,
                  backgroundPosition: city.heroImagePosition ?? city.imagePosition,
                  backgroundSize: "cover"
                }}
              />
            </div>

            <div className="city-hero__content">
              <Link className="city-back-link" href="/">
                Back to briefings
              </Link>
              <span className="section-label">{city.country}</span>
              <h1 className="city-hero__title">{city.name}</h1>
              <p className="city-hero__essence">{city.essence}</p>
            </div>
          </div>
        </section>

        {/* 2. At A Glance */}
        {atAGlanceItems.length > 0 && (
          <section className="at-a-glance">
            <div className="site-shell">
              <div className="city-section-heading">
                <span className="section-label">Overview</span>
                <h2 className="section-title">At A Glance</h2>
              </div>
              <div className="at-a-glance__grid">
                {atAGlanceItems.map((item) => (
                  <div className="at-a-glance__item" key={item.label}>
                    <span className="at-a-glance__label">{item.label}</span>
                    <p className="at-a-glance__value">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. If You Only Had One Day */}
        {oneDayItems.length > 0 && (
          <section className="one-day">
            <div className="site-shell">
              <div className="city-section-heading">
                <span className="section-label">One day</span>
                <h2 className="section-title">If You Only Had One Day</h2>
              </div>
              <div className="one-day__timeline">
                {oneDayItems.map((step) => (
                  <div className="one-day__step" key={step.time}>
                    <span className="one-day__time">{step.time}</span>
                    <p className="one-day__note">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. City Essence */}
        {city.cityEssence != null && (
          <section className="city-essence">
            <div className="site-shell">
              <div className="city-section-heading">
                <span className="section-label">The city</span>
                <h2 className="section-title">City Essence</h2>
              </div>
              <CityEssenceAccordion essence={city.cityEssence} />
            </div>
          </section>
        )}

        {/* 5. Don't Miss */}
        {city.mustSeeFirst.length > 0 && (
          <section className="dont-miss">
            <div className="site-shell">
              <div className="city-section-heading">
                <span className="section-label">Begin here</span>
                <h2 className="section-title">Don't Miss</h2>
              </div>
              <div className="dont-miss__grid">
                {city.mustSeeFirst.slice(0, 4).map((place) => (
                  <a
                    className="dont-miss-card"
                    href={getMapsUrl(city.name, place.name)}
                    key={place.name}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <h3 className="dont-miss-card__name">{place.name}</h3>
                    <p className="dont-miss-card__descriptor">{place.descriptor}</p>
                    <span className="dont-miss-card__hint">Open in Maps ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  );
}
