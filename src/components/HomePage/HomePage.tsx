"use client";
import { useStores } from "@/root-store-context";
import RecipeFilters from "../RecipeFilters/RecipeFilters";
import Recipes from "../Recipes/Recipes";

import styles from "./HomePage.module.scss";
import { observer } from "mobx-react-lite";

const HomePage = observer(() => {
  const {
    recipeStore: { recipes },
  } = useStores();

  const cuisines: string[] = [...new Set(recipes.map((elem) => elem.cuisine))];

  return (
    <div className={styles.content}>
      <RecipeFilters cuisines={cuisines} />
      <Recipes />
      <></>
    </div>
  );
});

export default HomePage;
