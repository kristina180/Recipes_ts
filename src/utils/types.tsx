export interface IGetRecipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings?: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags?: string[];
  userId?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  mealType?: string[];
}

export interface IPromiseAxios {
  access_token: string;
  refresh_token: string;
}

export interface IInitialStateAddForm {
  name: string;
  image: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  cuisine: string;
  difficulty: string;
  calories: string;
  ingredients: string;
  instructions: string;
}

export interface IFormValuesAddForm {
  name: string;
  image: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  cuisine: string;
  difficulty: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
}

export interface IFilters {
  cooktime: string;
  cuisine: string;
  difficulty: string;
  calories: string;
}
