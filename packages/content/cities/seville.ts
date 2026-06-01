import { City } from "../schemas/city";

export const seville: City = {
  name: "Seville",
  slug: "seville",
  badge: "Romantic",
  cardSentence: "Orange dusk, late dinners",
  essence:
    "A warm romantic city where tiled courtyards, late dinners, and flamenco history keep culture close to the surface.",
  quickFacts: {
    bestMonths: "March–May, October–November",
    worksBestFor: "Romantic trips, culture, late dinners",
    bestFor: "Couples",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Alcazar", descriptor: "palace" },
    { name: "Seville Cathedral", descriptor: "cathedral" },
    { name: "Barrio Santa Cruz", descriptor: "neighborhood" },
    { name: "Plaza de Espana", descriptor: "square" }
  ],
  places: [
    { name: "Triana", descriptor: "district" },
    { name: "Casa de Pilatos", descriptor: "palace" },
    { name: "Metropol Parasol", descriptor: "viewpoint" }
  ],
  signatureDishes: [
    { emoji: "🥓", name: "Jamon iberico" },
    { emoji: "🥣", name: "Espinacas con garbanzos" }
  ],
  moreToEat: [{ emoji: "🍞", name: "Torrijas" }],
  whereToEat: ["Tapas bars in Santa Cruz", "Late-night terraces in Triana"]
};
