import { City } from "../schemas/city";

export const oaxaca: City = {
  name: "Oaxaca",
  slug: "oaxaca",
  badge: "Market-led",
  cardSentence: "Markets first, mezcal later",
  essence:
    "A food and culture city where markets, mole, and mezcal turn each day into a slower, more sensory routine.",
  quickFacts: {
    bestMonths: "October–March",
    worksBestFor: "Food, culture, market days",
    bestFor: "Curious eaters",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Zocalo", descriptor: "square" },
    { name: "Templo de Santo Domingo", descriptor: "church" },
    { name: "Mercado 20 de Noviembre", descriptor: "market" },
    { name: "Monte Alban", descriptor: "ruins" }
  ],
  places: [
    { name: "Jalatlaco", descriptor: "neighborhood" },
    { name: "Jardin Etnobotanico", descriptor: "garden" },
    { name: "Museo Textil de Oaxaca", descriptor: "museum" }
  ],
  signatureDishes: [
    { emoji: "🍛", name: "Mole negro" },
    { emoji: "🫓", name: "Tlayuda" }
  ],
  moreToEat: [{ emoji: "🥙", name: "Memelas" }],
  whereToEat: ["Market fondas", "Courtyard mezcalerias"]
};
