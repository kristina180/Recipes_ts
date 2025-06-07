import { makeAutoObservable, runInAction } from "mobx";
import { IGetRecipe } from "@/utils/types";
import { makePersistable } from "mobx-persist-store";

export class FavoriteStore {
  favorites: IGetRecipe[] = [];

  isLoading = false;

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: "FavoriteStore",
      properties: ["favorites"],
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    });
  }

  addToFavorites = (elem: IGetRecipe) => {
    if (!this.favorites.some((item) => item.id == elem.id)) {
      this.favorites.push(elem);
    }
  };

  deleteFromFavorites = (elem: IGetRecipe) => {
    if (this.favorites.some((item) => item.id == elem.id)) {
      this.favorites = this.favorites.filter((item) => {
        return elem.id != item.id;
      });
    }
  };
}
