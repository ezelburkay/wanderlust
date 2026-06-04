export interface CityQuickFacts {
  bestMonths: string;
  worksBestFor: string;
  bestFor: string;
  idealDays: string;
}

export interface CityPlace {
  name: string;
  descriptor: string;
}

export interface CityDish {
  emoji: string;
  name: string;
}

export interface EssenceItem {
  title: string;
  subtitle?: string;
  url?: string;
  mapsQuery?: string;
}

export interface CityEssence {
  eat: EssenceItem[];
  walk: EssenceItem[];
  stay: EssenceItem[];
  book: EssenceItem[];
}

export interface City {
  name: string;
  slug: string;
  badge: string;
  cardSentence: string;
  essence: string;
  quickFacts: CityQuickFacts;
  mustSeeFirst: CityPlace[];
  places: CityPlace[];
  signatureDishes: CityDish[];
  moreToEat: CityDish[];
  whereToEat: string[];
  cityEssence?: CityEssence;
}
