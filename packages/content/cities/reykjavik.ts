import { City } from "../schemas/city";

export const reykjavik: City = {
  name: "Reykjavik",
  slug: "reykjavik",
  badge: "Seasonal",
  cardSentence: "Hot springs, shifting light",
  essence:
    "A nature and adventure base where hot springs, sea air, and fast-changing light make the season feel central to the trip.",
  quickFacts: {
    bestMonths: "June–August, November–March",
    worksBestFor: "Nature, adventure, seasonal escapes",
    bestFor: "Outdoor travelers",
    idealDays: "Give it: 4 days"
  },
  mustSeeFirst: [
    { name: "Hallgrimskirkja", descriptor: "church" },
    { name: "Harpa", descriptor: "concert hall" },
    { name: "Sun Voyager", descriptor: "sculpture" },
    { name: "Old Harbour", descriptor: "waterfront" }
  ],
  places: [
    { name: "Sky Lagoon", descriptor: "hot spring" },
    { name: "Perlan", descriptor: "museum" },
    { name: "Laugavegur", descriptor: "street" }
  ],
  signatureDishes: [
    { emoji: "🐟", name: "Arctic char" },
    { emoji: "🍲", name: "Lamb soup" }
  ],
  moreToEat: [{ emoji: "🥛", name: "Skyr" }],
  whereToEat: ["Harbor seafood spots", "Coffee bars and bakery cafes"]
};
