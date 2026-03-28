import { City } from "../schemas/city";

export const paris: City = {
  name: "Paris",
  slug: "paris",
  badge: "Romantic",
  cardSentence: "Dense streets, slow dinners",
  essence:
    "A dense, walkable city where landmarks, food, and daily street life sit close together, making it easy to move quickly and slow down just as fast.",
  quickFacts: {
    bestMonths: "April–June, September–October",
    worksBestFor: "Walking, food, culture",
    bestFor: "Couples, first-time visitors",
    idealDays: "Give it: 3 days"
  },
  mustSeeFirst: [
    { name: "Eiffel Tower", descriptor: "landmark" },
    { name: "Louvre", descriptor: "museum" },
    { name: "Montmartre", descriptor: "neighborhood" },
    { name: "Seine", descriptor: "walk" }
  ],
  places: [
    { name: "Le Marais", descriptor: "district" },
    { name: "Sainte-Chapelle", descriptor: "chapel" },
    { name: "Luxembourg Gardens", descriptor: "park" },
    { name: "Musée d’Orsay", descriptor: "museum" }
  ],
  signatureDishes: [
    { emoji: "🥐", name: "Croissant" },
    { emoji: "🥩", name: "Steak frites" }
  ],
  moreToEat: [{ emoji: "🍰", name: "Tarte aux fruits" }],
  whereToEat: ["Neighborhood bistros", "Corner bakeries"]
};
