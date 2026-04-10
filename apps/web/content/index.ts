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
import type { DiscoveryCollection } from "../../../packages/content/schemas/discovery";

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
    imageAlt: "La Concha bay and elegant seaside promenade in soft evening light",
    imagePosition: "center center",
    imageUrl: "/images/cities/san-sebastian/card.jpg"
  },
  oaxaca: {
    country: "Mexico",
    imageAlt: "Warm Oaxaca street with colorful facades and layered historic texture",
    imagePosition: "center center",
    imageUrl: "/images/cities/oaxaca/card.jpg"
  },
  kyoto: {
    country: "Japan",
    imageAlt: "Kyoto temple approach framed by trees and quiet morning light",
    imagePosition: "center center",
    imageUrl: "/images/cities/kyoto/card.jpg"
  },
  lisbon: {
    country: "Portugal",
    imageAlt: "Lisbon hillside facades and river glow in late afternoon light",
    imagePosition: "center center",
    imageUrl: "/images/cities/lisbon/card.jpg"
  },
  vienna: {
    country: "Austria",
    imageAlt: "Vienna boulevard and grand historic facades in crisp daylight",
    imagePosition: "center center",
    imageUrl: "/images/cities/vienna/card.jpg"
  },
  seville: {
    country: "Spain",
    imageAlt: "Seville rooftops and cathedral skyline in warm golden light",
    imagePosition: "center center",
    imageUrl: "/images/cities/seville/card.jpg"
  },
  reykjavik: {
    country: "Iceland",
    imageAlt: "Reykjavik colorful roofs with open sky and distant mountains",
    imagePosition: "center center",
    imageUrl: "/images/cities/reykjavik/card.jpg"
  },
  copenhagen: {
    country: "Denmark",
    imageAlt: "Copenhagen canal frontage and calm waterfront light",
    imagePosition: "center center",
    imageUrl: "/images/cities/copenhagen/card.jpg"
  }
};

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

function buildCitySearchText(city: SourceCity, presentation: CityPresentation): string {
  return [
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
}

function toCityViewModel(city: SourceCity): CityViewModel {
  const presentation = getCityPresentation(city);
  const searchText = buildCitySearchText(city, presentation);

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

const mappedCities: CityViewModel[] = sourceCities.map(toCityViewModel);
const cityBySlug = new Map<string, CityViewModel>(mappedCities.map((city) => [city.slug, city]));

function getCitiesForDiscovery(citySlugs: string[]): CityViewModel[] {
  return citySlugs
    .map((slug) => cityBySlug.get(slug))
    .filter((city): city is CityViewModel => Boolean(city));
}

function toHomepageDiscoveryViewModel(
  collection: DiscoveryCollection,
  label: string,
  slugOverride?: string
): HomepageDiscoveryViewModel {
  return {
    cities: getCitiesForDiscovery(collection.citySlugs),
    label,
    slug: slugOverride ?? collection.slug,
    subtitle: collection.subtitle,
    title: collection.title
  };
}

export function getAllCities(): CityViewModel[] {
  return mappedCities;
}

export function getCityBySlug(slug: string): CityViewModel | undefined {
  return cityBySlug.get(slug);
}

export function getHomepageDiscovery(): HomepageDiscoveryViewModel[] {
  const pickedForYou = personalizedCollections[1] ?? personalizedCollections[0];
  const bestThisMonth = seasonalCollections[0];
  const greatForInterest = personalizedCollections[0];

  return [
    toHomepageDiscoveryViewModel(
      pickedForYou,
      "Picked for you",
      "picked-for-you"
    ),
    toHomepageDiscoveryViewModel(bestThisMonth, "Best this month"),
    toHomepageDiscoveryViewModel(greatForInterest, "Great for food lovers")
  ];
}
