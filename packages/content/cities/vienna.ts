import { City } from "../schemas/city";

export const vienna: City = {
  name: "Vienna",
  slug: "vienna",
  badge: "Romantic",
  cardSentence: "Grand cafes, late quartets",
  essence:
    "A romantic culture city of coffeehouses, concert halls, and elegant streets that feels best when you linger after dark.",
  quickFacts: {
    bestMonths: "November–December, April–June",
    worksBestFor: "Romantic weekends, culture, cafes",
    bestFor: "Couples",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Ringstrasse", descriptor: "boulevard" },
    { name: "Schonbrunn Palace", descriptor: "palace" },
    { name: "Belvedere", descriptor: "museum" },
    { name: "Vienna State Opera", descriptor: "opera house" }
  ],
  places: [
    { name: "Naschmarkt", descriptor: "market" },
    { name: "MuseumsQuartier", descriptor: "district" },
    { name: "Grinzing", descriptor: "wine quarter" }
  ],
  signatureDishes: [
    { emoji: "🍽️", name: "Wiener schnitzel" },
    { emoji: "🍫", name: "Sachertorte" }
  ],
  moreToEat: [{ emoji: "🥞", name: "Kaiserschmarrn" }],
  whereToEat: ["Historic coffeehouses", "Heuriger wine taverns"]
};
