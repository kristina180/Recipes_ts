"use client";

import { useStores } from "@/root-store-context";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import ModuleAuth from "../ModalAuth/ModalAuth";

import { IGetRecipe } from "@/utils/types";
import styles from "./RecipeCard.module.scss";

export const RecipesCard = observer(() => {
  const [isModalActive, setModalActive] = useState<boolean>(false);

  const {
    recipeStore: { recipes, getRecipes },
    favoriteStore: { favorites, addToFavorites, deleteFromFavorites },
    authStore: { user },
  } = useStores();

  const pass = usePathname().replace("/recipes/", "");

  const selectedRecipe = recipes.find((elem) => elem.id == pass);

  const [buttonValue, setButtonValue] = useState<string>("Add to favorites");

  const handleClick = (recipe: IGetRecipe) => {
    if (user && user.id) {
      if (favorites.find((elem) => elem.id == recipe.id)) {
        setButtonValue("Add to favorites");
        deleteFromFavorites(recipe);
      } else {
        setButtonValue("Added to favorites");
        addToFavorites(recipe);
      }
    } else {
      setModalActive(true);
    }
  };
  const handleModalClose = () => {
    setModalActive(false);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    favorites.find((elem) => elem.id == selectedRecipe?.id)
      ? setButtonValue("Added to favorites")
      : setButtonValue("Add to favorites");
  }, [recipes]);

  return (
    selectedRecipe && (
      <div className={styles.section}>
        <div className={styles.img_info}>
          <img src={selectedRecipe.image} />
          <div className={styles.info}>
            <div>{selectedRecipe.name}</div>
            <p>Preparation time: {selectedRecipe.prepTimeMinutes} minutes</p>
            <p>Cooking time: {selectedRecipe.cookTimeMinutes} minutes</p>
            <p>Level: {selectedRecipe.difficulty}</p>
            <p>Calories: {selectedRecipe.caloriesPerServing} calories</p>

            <button type="button" onClick={() => handleClick(selectedRecipe)}>
              {buttonValue}
            </button>
          </div>
        </div>

        <div className={styles.ingr_instr}>
          {selectedRecipe.ingredients.length > 0 && (
            <div>
              <div>Ingredients</div>
              <ul>
                {selectedRecipe.ingredients.map((elem, index) => (
                  <li key={`li_ingr_${index}`}>{elem}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedRecipe.instructions.length > 0 && (
            <div>
              <div>Instructions</div>
              <ul>
                {selectedRecipe.instructions.map((elem, index) => (
                  <li key={`li_instr_${index}`}>{elem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {isModalActive && (
          <ModuleAuth
            text={
              <>
                You can't add <span className={styles.nowr}> a recipe</span>{" "}
                <span className={styles.nowr}> infavorites</span>
                <span className={styles.nowr}> without registration</span>
              </>
            }
            onCloseAction={handleModalClose}
          />
        )}
      </div>
    )
  );
});

export default RecipesCard;
