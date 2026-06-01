import { City } from "../schemas/city";

export const lisbon: City = {
  name: "Lisbon",
  slug: "lisbon",
  badge: "Slow food",
  cardSentence: "Hill walks, long lunches",
  essence:
    "A food city with an easy rhythm, where tiled hills, seafood lunches, and miradouros reward slow travel.",
  quickFacts: {
    bestMonths: "April–June, September–October",
    worksBestFor: "Food, slow city breaks, viewpoints",
    bestFor: "Long-weekenders",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Alfama", descriptor: "district" },
    { name: "Belem Tower", descriptor: "landmark" },
    { name: "Tram 28", descriptor: "tram" },
    { name: "Miradouro da Senhora do Monte", descriptor: "viewpoint" }
  ],
  places: [
    { name: "Mercado da Ribeira", descriptor: "market" },
    { name: "Chiado", descriptor: "district" },
    { name: "Gulbenkian Museum", descriptor: "museum" }
  ],
  signatureDishes: [
    { emoji: "🥧", name: "Pasteis de nata" },
    { emoji: "🐟", name: "Bacalhau" }
  ],
  moreToEat: [{ emoji: "🐠", name: "Grilled sardines" }],
  whereToEat: ["Neighborhood tascas", "Wine bars and pastry counters"]
};
