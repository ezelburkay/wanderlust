import { cities } from "../../../../packages/content/cities";
 
export function getCities() {
  return cities;
}
 
export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug);
}
