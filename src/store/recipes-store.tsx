import { makeAutoObservable, runInAction } from "mobx";
import { IFormValuesAddForm, IGetRecipe } from "@/utils/types";
import { RECIPE_URL } from "@/utils/constants";
// import { makePersistable } from "mobx-persist-store";

interface IFilters {
  cooktime: string;
  cuisine: string;
  difficulty: string;
  calories: string;
}

export class RecipeStore {
  recipes: IGetRecipe[] = [];
  filterRecipes: IGetRecipe[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    // makePersistable(this, {
    //   name: "RecipeStore",
    //   storage: typeof window !== "undefined" ? window.localStorage : undefined,
    //   properties: ["recipes", "filterRecipes"],
    // });
  }

  getRecipes = async () => {
    try {
      this.isLoading = true;
      const response = await fetch(RECIPE_URL);
      const data = await response.json();

      runInAction(() => {
        this.recipes = data;
        this.isLoading = false;
        this.filterRecipes = data;
      });
    } catch {
      this.isLoading = false;
    }
  };

  addNewRecipe = async (values: IFormValuesAddForm) => {
    try {
      if (values.image.trim() == "") {
        values.image =
          "https://cdn1.ozone.ru/s3/multimedia-h/c600/6820732817.jpg";
      }

      this.isLoading = true;
      const response = await fetch(RECIPE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          name: values.name,
          ingredients: values.ingredients,
          instructions: values.instructions,
          prepTimeMinutes: values.prepTimeMinutes,
          cookTimeMinutes: values.prepTimeMinutes,
          difficulty: values.difficulty,
          cuisine: values.cuisine,
          caloriesPerServing: values.calories,
          image: values.image,
        }),
      });

      runInAction(() => {
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  getFilterRecipes = (filters: IFilters) => {
    if (
      Object.values(filters).every(
        (elem) => elem == "" || elem == "not_selected"
      )
    ) {
      this.filterRecipes = this.recipes;
    } else {
      let rezult: IGetRecipe[] = this.recipes.filter((elem) => {
        const cookmin =
          filters.cooktime == "" ||
          +filters.cooktime >= elem.cookTimeMinutes + elem.prepTimeMinutes
            ? true
            : false;
        const arr_calories = filters.calories.split("_").map((elem) => +elem);
        const calories =
          filters.calories == "not_selected" ||
          (elem.caloriesPerServing >= arr_calories[0] &&
            elem.caloriesPerServing <= arr_calories[1])
            ? true
            : false;
        const cuisine =
          filters.cuisine == "not_selected" ||
          filters.cuisine == elem.cuisine.toLowerCase()
            ? true
            : false;

        const difficulty =
          filters.difficulty == "not_selected" ||
          filters.difficulty == elem.difficulty.toLowerCase()
            ? true
            : false;

        return difficulty && cuisine && calories && cookmin;
      });
      console.log(rezult);
      this.filterRecipes = rezult;
    }
  };

  changeRecipes = () => {
    this.filterRecipes = this.recipes;
  };
}
