import { makeAutoObservable, runInAction } from "mobx";
import { IFormValuesAddForm, IGetRecipe } from "@/utils/types";

// import { makePersistable } from "mobx-persist-store";

const RECIPE_URL = "http://localhost:3001/recipes";

interface IFilters {
  cooktime: string;
  cuisine: string;
  difficulty: string;
  caloriesPerServing: string;
}

function toUpperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class RecipeStore {
  recipes: IGetRecipe[] = [];
  filterRecipes: IGetRecipe[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
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

      const data_for_post = {
        name: toUpperFirst(values.name),
        ingredients: values.ingredients,
        instructions: values.instructions,
        prepTimeMinutes: Number(values.prepTimeMinutes),
        cookTimeMinutes: Number(values.cookTimeMinutes),
        difficulty: toUpperFirst(values.difficulty),
        cuisine: toUpperFirst(values.cuisine),
        caloriesPerServing: Number(values.caloriesPerServing),
        image: values.image,
      };
      const response = await fetch(RECIPE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data_for_post),
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
        const arr_calories = filters.caloriesPerServing
          .split("_")
          .map((elem) => +elem);
        const calories =
          filters.caloriesPerServing == "not_selected" ||
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
      this.filterRecipes = rezult;
    }
  };

  changeRecipes = () => {
    this.filterRecipes = this.recipes;
  };
}
