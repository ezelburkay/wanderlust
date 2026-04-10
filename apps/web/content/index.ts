import type { City as SourceCity } from "../../../packages/content/schemas/city";
import { copenhagen } from "../../../packages/content/cities/copenhagen";
import { kyoto } from "../../../packages/content/cities/kyoto";
import { lisbon } from "../../../packages/content/cities/lisbon";
import { oaxaca } from "../../../packages/content/cities/oaxaca";
import { paris } from "../../../packages/content/cities/paris";
import { reykjavik } from "../../../packages/content/cities/reykjavik";
import { rome } from "../../../packages/content/cities/rome";
import { sanSebastian } from "../../../packages/content/cities/san-sebastian";
import { seville } from "../../../packages/content/cities/seville";
import { vienna } from "../../../packages/content/cities/vienna";
import { personalizedCollections } from "../../../packages/content/discovery/personalized";
import { seasonalCollections } from "../../../packages/content/discovery/seasonal";

interface CityPresentation {
  country: string;
  imageAlt: string;
  imagePosition: string;
  imageUrl: string;
}

const defaultCityImageUrl =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const sourceCities: SourceCity[] = [
  paris,
  rome,
  kyoto,
  lisbon,
  vienna,
  copenhagen,
  sanSebastian,
  oaxaca,
  seville,
  reykjavik
];

const cityPresentationBySlug: Record<string, CityPresentation> = {
  paris: {
    country: "France",
    imageAlt: "Paris rooftops and river light at golden hour",
    imagePosition: "center center",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
  },
  rome: {
    country: "Italy",
    imageAlt: "Rome skyline with warm stone architecture",
    imagePosition: "center center",
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80"
  },
  "san-sebastian": {
    country: "Spain",
    imageAlt: "San Sebastian bay and beachfront at golden hour",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  oaxaca: {
    country: "Mexico",
    imageAlt: "Oaxaca rooftops and colorful historic streets",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  kyoto: {
    country: "Japan",
    imageAlt: "Kyoto temple roofs and green hills in soft light",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  lisbon: {
    country: "Portugal",
    imageAlt: "Lisbon hillside rooftops and river light",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  vienna: {
    country: "Austria",
    imageAlt: "Vienna grand avenues and classical architecture",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  seville: {
    country: "Spain",
    imageAlt: "Seville rooftops in warm late-afternoon light",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  reykjavik: {
    country: "Iceland",
    imageAlt: "Reykjavik colorful roofs with mountain backdrop",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  },
  copenhagen: {
    country: "Denmark",
    imageAlt: "Copenhagen waterfront and canal buildings in daylight",
    imagePosition: "center center",
    imageUrl: defaultCityImageUrl
  }
};

export interface CityViewModel {
  badge: string;
  cardSentence: string;
  country: string;
  essence: string;
  imageAlt: string;
  imagePosition: string;
  imageUrl: string;
  moreToEat: SourceCity["moreToEat"];
  mustSeeFirst: SourceCity["mustSeeFirst"];
  name: string;
  places: SourceCity["places"];
  quickFacts: SourceCity["quickFacts"];
  searchText: string;
  signatureDishes: SourceCity["signatureDishes"];
  slug: string;
  whereToEat: string[];
}

export interface HomepageDiscoveryViewModel {
  cities: CityViewModel[];
  label: string;
  slug: string;
  subtitle: string;
  title: string;
}

function getCityPresentation(city: SourceCity): CityPresentation {
  return (
    cityPresentationBySlug[city.slug] ?? {
      country: "",
      imageAlt: `${city.name} city view`,
      imagePosition: "center center",
      imageUrl: defaultCityImageUrl
    }
  );
}

function toCityViewModel(city: SourceCity): CityViewModel {
  const presentation = getCityPresentation(city);
  const searchText = [
    city.name,
    presentation.country,
    city.badge,
    city.cardSentence,
    city.essence,
    city.quickFacts.bestMonths,
    city.quickFacts.worksBestFor,
    city.quickFacts.bestFor,
    ...city.mustSeeFirst.map((place) => place.name),
    ...city.places.map((place) => place.name),
    ...city.signatureDishes.map((dish) => dish.name),
    ...city.moreToEat.map((dish) => dish.name),
    ...city.whereToEat
  ]
    .join(" ")
    .toLowerCase();

  return {
    badge: city.badge,
    cardSentence: city.cardSentence,
    country: presentation.country,
    essence: city.essence,
    imageAlt: presentation.imageAlt,
    imagePosition: presentation.imagePosition,
    imageUrl: presentation.imageUrl,
    moreToEat: city.moreToEat,
    mustSeeFirst: city.mustSeeFirst,
    name: city.name,
    places: city.places,
    quickFacts: city.quickFacts,
    searchText,
    signatureDishes: city.signatureDishes,
    slug: city.slug,
    whereToEat: city.whereToEat
  };
}

const mappedCities = sourceCities.map(toCityViewModel);
const cityBySlug = new Map(mappedCities.map((city) => [city.slug, city]));

function getCitiesForDiscovery(citySlugs: string[]) {
  return citySlugs
    .map((slug) => cityBySlug.get(slug))
    .filter((city): city is CityViewModel => Boolean(city));
}

export function getAllCities() {
  return mappedCities;
}

export function getCityBySlug(slug: string) {
  return cityBySlug.get(slug);
}

export function getHomepageDiscovery(): HomepageDiscoveryViewModel[] {
  const pickedForYou = personalizedCollections[1] ?? personalizedCollections[0];
  const bestThisMonth = seasonalCollections[0];
  const greatForInterest = personalizedCollections[0];

  return [
    {
      cities: getCitiesForDiscovery(pickedForYou.citySlugs),
      label: "Picked for you",
