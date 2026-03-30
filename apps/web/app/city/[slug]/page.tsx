import { getCityBySlug } from "@/lib/content/getCities";

interface Props {
  params: { slug: string };
}

export default function CityPage({ params }: Props) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    return <main>City not found</main>;
  }

  return (
    <main>
      <h1>{city.name}</h1>
      <p>{city.essence}</p>
    </main>
  );
}
