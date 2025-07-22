import { IGetRecipe } from "@/utils/types";
import { FavoriteStore } from "../store/favorites-store";

export const testRecipe: IGetRecipe[] = [
  {
    id: "28",
    name: "South Indian Masala Dosa",
    ingredients: [
      "Dosa batter (fermented rice and urad dal batter)",
      "Potatoes, boiled and mashed",
      "Onions, finely chopped",
      "Mustard seeds",
      "Cumin seeds",
      "Curry leaves",
      "Turmeric powder",
      "Green chilies, chopped",
      "Ghee",
      "Coconut chutney for serving",
    ],
    instructions: [
      "In a pan, heat ghee and add mustard seeds, cumin seeds, and curry leaves.",
      "Add chopped onions, green chilies, and turmeric powder. Sauté until onions are golden brown.",
      "Mix in boiled and mashed potatoes. Cook until well combined and seasoned.",
      "Spread dosa batter on a hot griddle to make thin pancakes.",
      "Place a spoonful of the potato mixture in the center, fold, and serve hot.",
      "Pair with coconut chutney for a delicious South Indian meal.",
    ],
    prepTimeMinutes: 40,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    caloriesPerServing: 320,
    tags: ["Dosa", "Indian", "Asian"],
    userId: 138,
    image: "https://cdn.dummyjson.com/recipe-images/28.webp",
    rating: 4.4,
    reviewCount: 96,
    mealType: ["Breakfast"],
  },
  {
    id: "29",
    name: "Lebanese Falafel Wrap",
    ingredients: [
      "Falafel balls",
      "Whole wheat or regular wraps",
      "Tomatoes, diced",
      "Cucumbers, sliced",
      "Red onions, thinly sliced",
      "Lettuce, shredded",
      "Tahini sauce",
      "Fresh parsley, chopped",
    ],
    instructions: [
      "Warm falafel balls according to package instructions.",
      "Place a generous serving of falafel in the center of each wrap.",
      "Top with diced tomatoes, sliced cucumbers, red onions, shredded lettuce, and fresh parsley.",
      "Drizzle with tahini sauce and wrap tightly.",
      "Enjoy this Lebanese Falafel Wrap filled with fresh and flavorful ingredients!",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Lebanese",
    caloriesPerServing: 400,
    tags: ["Falafel", "Lebanese", "Wrap"],
    userId: 110,
    image: "https://cdn.dummyjson.com/recipe-images/29.webp",
    rating: 4.7,
    reviewCount: 84,
    mealType: ["Lunch"],
  },
];

describe("FavoritesStore", () => {
  const store = new FavoriteStore();
  it("Add new recipe to favorites", () => {
    store.addToFavorites(testRecipe[0]);
    store.addToFavorites(testRecipe[1]);
    expect(store.favorites.length).toBe(2);
    expect(store.favorites[0]).toEqual(testRecipe[0]);
    expect(store.favorites[1]).toEqual(testRecipe[1]);

    store.deleteFromFavorites(testRecipe[0]);
    expect(store.favorites.length).toBe(1);
    expect(store.favorites[0]).toEqual(testRecipe[1]);
  });
  it("Delete the recipe from favorites", () => {
    store.deleteFromFavorites(testRecipe[0]);
    expect(store.favorites.length).toBe(1);
    expect(store.favorites[0]).toEqual(testRecipe[1]);
  });
});
