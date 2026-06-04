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
  whereToEat: ["Pintxos bars in Parte Vieja", "Seafood counters by the market"],
  cityEssence: {
    eat: [
      {
        title: "Pintxos",
        subtitle: "Ganbara",
        mapsQuery: "Ganbara San Sebastian"
      },
      {
        title: "Basque Cheesecake",
        subtitle: "La Viña",
        mapsQuery: "La Viña San Sebastian"
      },
      {
        title: "Seafood",
        subtitle: "Elkano",
        mapsQuery: "Elkano Getaria"
      }
    ],
    walk: [
      {
        title: "La Concha Promenade",
        subtitle: "The city's living room",
        mapsQuery: "La Concha Promenade San Sebastian"
      },
      {
        title: "Parte Vieja",
        subtitle: "The Old Town rhythm",
        mapsQuery: "Parte Vieja San Sebastian"
      },
      {
        title: "Monte Igueldo",
        subtitle: "The classic view",
        mapsQuery: "Monte Igueldo San Sebastian"
      }
    ],
    stay: [
      {
        title: "Parte Vieja",
        subtitle: "Best for food-led nights"
      },
      {
        title: "Centro",
        subtitle: "Central and easy"
      },
      {
        title: "La Concha",
        subtitle: "Wake up by the bay"
      }
    ],
    book: [
      {
        title: "Arzak",
        subtitle: "Three stars, timeless",
        mapsQuery: "Arzak San Sebastian"
      },
      {
        title: "Akelarre",
        subtitle: "Views and tasting menus",
        mapsQuery: "Akelarre San Sebastian"
      },
      {
        title: "Amelia",
        subtitle: "Modern Basque dining",
        mapsQuery: "Amelia San Sebastian"
      }
    ]
  }
};
