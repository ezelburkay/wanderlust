import { City } from "../schemas/city";

export const copenhagen: City = {
  name: "Copenhagen",
  slug: "copenhagen",
  badge: "Slow",
  cardSentence: "Bakeries, bikes, bright water",
  essence:
    "A calm design-forward city where bakeries, harbor light, and short bike rides make slow food travel feel easy.",
  quickFacts: {
    bestMonths: "May–September, December",
    worksBestFor: "Slow weekends, food, design",
    bestFor: "Long-weekenders",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Nyhavn", descriptor: "waterfront" },
    { name: "Tivoli Gardens", descriptor: "park" },
    { name: "Rosenborg Castle", descriptor: "castle" },
    { name: "Christianshavn", descriptor: "canal district" }
  ],
  places: [
    { name: "Torvehallerne", descriptor: "market" },
    { name: "Designmuseum Danmark", descriptor: "museum" },
    { name: "Superkilen", descriptor: "park" }
  ],
  signatureDishes: [
    { emoji: "🥪", name: "Smorrebrod" },
    { emoji: "🥐", name: "Cardamom bun" }
  ],
  moreToEat: [{ emoji: "🍥", name: "Cinnamon snail" }],
  whereToEat: ["Neighborhood bakeries", "Natural wine bars"]
};
