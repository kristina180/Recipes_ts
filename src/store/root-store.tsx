import { RecipeStore } from "./recipes-store";
import { FavoriteStore } from "./favorites-store";
import { AuthStore } from "./auth-store";

export const RootStore = {
  recipeStore: new RecipeStore(),
  favoriteStore: new FavoriteStore(),
  authStore: new AuthStore(),
};
