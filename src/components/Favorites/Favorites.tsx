"use client";

import { observer } from "mobx-react-lite";
import { useStores } from "@/root-store-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { X } from "lucide-react";
import styles from "./Favorites.module.scss";

export const Favorites = observer(() => {
  const {
    recipeStore: { getRecipes },
    favoriteStore: { favorites, deleteFromFavorites },
  } = useStores();

  const { push } = useRouter();

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div className={styles.section}>
      <p>Favorites</p>
      {favorites.length > 0 ? (
        <div>
          {favorites.map((elem) => (
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
                />
              </div>

              <div className={styles.info}>
                <div> {elem.name} </div>

                <div>
                  Cooking time:
                  {` ${+elem.prepTimeMinutes + +elem.cookTimeMinutes} min`}
                </div>
                <div>Cuisine: {elem.cuisine}</div>
                <div>Level: {elem.difficulty}</div>
              </div>
              <button
                type="button"
                className={styles.buttondelete}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFromFavorites(elem);
                }}
              >
                <X size={20} strokeWidth={1} className={styles.iconDelete} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes</p>
      )}
    </div>
  );
});

export default Favorites;
