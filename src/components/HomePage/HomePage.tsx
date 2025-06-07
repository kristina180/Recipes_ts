"use client";
import RecipeFilters from "../RecipeFilters/RecipeFilters";
import Recipes from "../Recipes/Recipes";

import styles from "./HomePage.module.scss";

export default function HomePage() {
  return (
    <div className={styles.content}>
      <RecipeFilters />
      <Recipes />
    </div>
  );
}
