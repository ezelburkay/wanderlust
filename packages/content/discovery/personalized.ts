import { DiscoveryCollection } from "../schemas/discovery";

export const personalizedCollections: DiscoveryCollection[] = [
  {
    slug: "great-for-food",
    title: "Great for food lovers",
    subtitle: "Strong local cuisine and everyday dining culture.",
    citySlugs: ["san-sebastian", "paris", "oaxaca", "lisbon", "copenhagen", "rome"]
  },
  {
    slug: "perfect-for-first-time",
    title: "Perfect for first-time trips",
    subtitle: "Clear structure, iconic sights, easy flow.",
    citySlugs: ["paris", "rome", "lisbon", "kyoto"]
  },
  {
    slug: "romantic-destinations",
    title: "Cities with atmosphere",
    subtitle: "Slower pace, evening light, and places that reward staying longer.",
    citySlugs: ["paris", "vienna", "seville", "lisbon"]
  },
  {
    slug: "culture-first",
    title: "Cities where culture leads the day",
    subtitle: "Layers of history, architecture, and everyday tradition worth slowing down for.",
    citySlugs: ["rome", "kyoto", "vienna", "oaxaca"]
  },
  {
    slug: "slow-travel",
    title: "Slower cities, softer days",
    subtitle: "Cities that reward a gentler pace and longer mornings.",
    citySlugs: ["lisbon", "copenhagen", "kyoto", "seville"]
  },
  {
    slug: "nature-adventure",
    title: "Cities that earn the view",
    subtitle: "Active edges, open skies, and landscape that shapes the trip.",
    citySlugs: ["reykjavik", "san-sebastian", "copenhagen"]
  }
];
