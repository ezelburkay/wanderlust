import { getCities } from "@/lib/content/getCities";

export default function HomePage() {
  const cities = getCities();

  return (
    <main>
      <h1>Wanderlust</h1>

      <section>
        <h2>Cities</h2>
        <ul>
          {cities.map((city) => (
            <li key={city.slug}>
              <strong>{city.name}</strong> — {city.cardSentence}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
