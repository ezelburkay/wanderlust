import { City } from "../schemas/city";

export const rome: City = {
  name: "Rome",
  slug: "rome",
  badge: "Historic",
  cardSentence: "Ruins first, dinner later",
  essence:
    "A layered city where ancient ruins, daily life, and food culture blend into a dense, walkable experience.",
  quickFacts: {
    bestMonths: "April–June, September–October",
    worksBestFor: "History, walking, food",
    bestFor: "First-time visitors",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Colosseum", descriptor: "landmark" },
    { name: "Roman Forum", descriptor: "ruins" },
    { name: "Pantheon", descriptor: "temple" },
    { name: "Trastevere", descriptor: "neighborhood" }
  ],
  places: [
    { name: "Trevi Fountain", descriptor: "fountain" },
    { name: "Spanish Steps", descriptor: "stairs" },
    { name: "Vatican Museums", descriptor: "museum" }
  ],
  signatureDishes: [
    { emoji: "🍝", name: "Cacio e pepe" },
    { emoji: "🥓", name: "Carbonara" }
  ],
  moreToEat: [{ emoji: "🍨", name: "Gelato" }],
  whereToEat: ["Traditional trattorias", "Local markets"]
};
