import { City } from "../schemas/city";

export const sanSebastian: City = {
  name: "San Sebastian",
  slug: "san-sebastian",
  badge: "Food-first",
  cardSentence: "Pintxos first, ocean later",
  essence:
    "A compact food city where pintxos bars, beach walks, and late dinners keep the trip centered on taste and an easy pace.",
  quickFacts: {
    bestMonths: "May–September",
    worksBestFor: "Food, slow weekends, coastal walking",
    bestFor: "Food-focused travelers",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "La Concha", descriptor: "bay" },
    { name: "Parte Vieja", descriptor: "old town" },
    { name: "Monte Igueldo", descriptor: "viewpoint" },
    { name: "Kursaal", descriptor: "waterfront" }
  ],
  places: [
    { name: "San Telmo Museoa", descriptor: "museum" },
    { name: "Gros", descriptor: "neighborhood" },
    { name: "Mercado de la Bretxa", descriptor: "market" }
  ],
  signatureDishes: [
    { emoji: "🍢", name: "Gilda" },
    { emoji: "🍰", name: "Basque cheesecake" }
  ],
  moreToEat: [{ emoji: "🐟", name: "Anchovies" }],
  whereToEat: ["Pintxos bars in Parte Vieja", "Seafood counters by the market"]
};
