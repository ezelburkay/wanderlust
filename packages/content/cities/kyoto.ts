import { City } from "../schemas/city";

export const kyoto: City = {
  name: "Kyoto",
  slug: "kyoto",
  badge: "Seasonal",
  cardSentence: "Temple paths, quiet meals",
  essence:
    "A culture city built for slow travel, with gardens, tea, and food that sharpen in spring and autumn.",
  quickFacts: {
    bestMonths: "March–May, October–November",
    worksBestFor: "Culture, slow travel, seasonal trips",
    bestFor: "First-time Japan travelers",
    idealDays: "Give it: 4 days"
  },
  mustSeeFirst: [
    { name: "Fushimi Inari Shrine", descriptor: "shrine" },
    { name: "Kiyomizu-dera", descriptor: "temple" },
    { name: "Arashiyama Bamboo Grove", descriptor: "grove" },
    { name: "Gion", descriptor: "district" }
  ],
  places: [
    { name: "Nishiki Market", descriptor: "market" },
    { name: "Philosopher's Path", descriptor: "walk" },
    { name: "Nanzen-ji", descriptor: "temple" }
  ],
  signatureDishes: [
    { emoji: "🍱", name: "Kaiseki" },
    { emoji: "🍲", name: "Yudofu" }
  ],
  moreToEat: [{ emoji: "🍵", name: "Matcha parfait" }],
  whereToEat: ["Counter kaiseki spots", "Market lanes near Nishiki"]
};
