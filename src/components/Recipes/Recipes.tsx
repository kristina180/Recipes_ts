"use client";

import { useStores } from "@/root-store-context";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { IGetRecipe } from "@/utils/types";
import styles from "./Recipes.module.scss";

const Recipes = observer(() => {
  const {
    recipeStore: { filterRecipes, getRecipes },
  } = useStores();

  const [recipes, setRecipes] = useState<IGetRecipe[]>(filterRecipes);
  const [sortType, setSortType] = useState<
    "level" | "calories" | "cooktime" | "not_selected"
  >("not_selected");
  const [stateValue, setStateValue] = useState("Loading...");

  const { push } = useRouter();

  function sortFunLevel(a: IGetRecipe, b: IGetRecipe) {
    if (
      (a.difficulty.toLowerCase() == "easy" &&
        b.difficulty.toLowerCase() == "medium") ||
      (a.difficulty.toLowerCase() == "medium" &&
        b.difficulty.toLowerCase() == "hard") ||
      (a.difficulty.toLowerCase() == "easy" &&
        b.difficulty.toLowerCase() == "hard")
    ) {
      return -1;
    } else if (
      (b.difficulty.toLowerCase() == "easy" &&
        a.difficulty.toLowerCase() == "medium") ||
      (b.difficulty.toLowerCase() == "medium" &&
        a.difficulty.toLowerCase() == "hard") ||
      (b.difficulty.toLowerCase() == "easy" &&
        a.difficulty.toLowerCase() == "hard")
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  function sortFunCooktime(a: IGetRecipe, b: IGetRecipe) {
    const timeA = +a.cookTimeMinutes + +a.prepTimeMinutes;
    const timeB = +b.cookTimeMinutes + +b.prepTimeMinutes;
    return timeA - timeB;
  }

  function sortFunCalories(a: IGetRecipe, b: IGetRecipe) {
    return +a.caloriesPerServing - +b.caloriesPerServing;
  }

  function sortFun(type: "level" | "calories" | "cooktime" | "not_selected") {
    let new_arr: IGetRecipe[] = [];
    if (type == "level") {
      new_arr = filterRecipes.toSorted(sortFunLevel);
    }
    if (type == "cooktime") {
      new_arr = filterRecipes.toSorted(sortFunCooktime);
    }
    if (type == "calories") {
      new_arr = filterRecipes.toSorted(sortFunCalories);
    }
    setRecipes(new_arr);
  }

  function handleSort(type: "level" | "calories" | "cooktime") {
    if (type == sortType) {
      setRecipes(filterRecipes);
      setSortType("not_selected");
    } else {
      setSortType(type);
      sortFun(type);
    }
  }

  useEffect(() => {
    if (sortType != "not_selected") {
      sortFun(sortType);
    } else {
      setRecipes(filterRecipes);
    }
  }, [filterRecipes]);

  useEffect(() => {
    getRecipes();
    setTimeout(() => setStateValue("No recipes"), 1000);
  }, []);

  return (
    <div>
      <div className={styles.sort}>
        Sort by:
        <div
          onClick={() => handleSort("level")}
          className={sortType == "level" ? styles.selected : styles.sortType}
        >
          level
        </div>
        <div
          onClick={() => handleSort("cooktime")}
          className={sortType == "cooktime" ? styles.selected : styles.sortType}
        >
          cooking time
        </div>
        <div
          onClick={() => handleSort("calories")}
          className={sortType == "calories" ? styles.selected : styles.sortType}
        >
          calories
        </div>
      </div>
      {recipes.length > 0 ? (
        <div className={styles.listrecipes}>
          {recipes.map((elem) => (
            <div
              className={styles.recipe}
              key={elem.id}
              onClick={() => push(`/${elem.id}`)}
            >
              <div className={styles.divimg}>
                <img
                  src={elem.image}
                  alt="photo_recipe"
                  width={100}
                  height={100}
                  className={styles.recipeimg}
                />
              </div>

              <div className={styles.info}>
                <div className={styles.name}> {elem.name} </div>
                <div className={styles.time}>
                  {+elem.prepTimeMinutes + +elem.cookTimeMinutes} min
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{stateValue}</p>
      )}
    </div>
  );
});

export default Recipes;
