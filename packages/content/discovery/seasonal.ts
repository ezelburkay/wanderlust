import { DiscoveryCollection } from "../schemas/discovery";

export const seasonalCollections: DiscoveryCollection[] = [
  {
    slug: "where-march-feels-better",
    title: "Where March feels better",
    subtitle: "Soft weather, fewer crowds, better evenings.",
    citySlugs: ["kyoto", "paris", "rome", "seville", "lisbon"]
  },
  {
    slug: "cities-made-for-walking",
    title: "Cities made for walking",
    subtitle: "Compact streets, strong neighborhoods, easy days on foot.",
    citySlugs: ["paris", "lisbon", "copenhagen", "rome", "vienna"]
  },
  {
    slug: "summer-in-full-light",
    title: "Summer in full light",
    subtitle: "More daylight, warmer evenings, and cities that feel most alive in the heat.",
    citySlugs: ["san-sebastian", "copenhagen", "reykjavik", "rome"]
  },
  {
    slug: "autumn-cities",
    title: "Where autumn changes everything",
    subtitle: "Cooler light, fewer crowds, and cities that earn their depth in the quieter months.",
    citySlugs: ["kyoto", "vienna", "paris", "seville"]
  },
  {
    slug: "winter-worth-it",
    title: "Cities that justify the cold",
    subtitle: "Warm interiors, winter rituals, and atmosphere that only exists in darker months.",
    citySlugs: ["oaxaca", "reykjavik", "vienna", "copenhagen"]
  }
];
