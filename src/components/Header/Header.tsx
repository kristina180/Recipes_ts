"use client";

import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStores } from "@/root-store-context";
import { observer } from "mobx-react-lite";

import ModuleAuth from "../ModalAuth/ModalAuth";

import { IGetRecipe } from "@/utils/types";
import { UserRound, Plus, Star, X } from "lucide-react";
import styles from "./Header.module.scss";

const Header = observer(() => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [recipesView, setRecipesView] = useState<IGetRecipe[]>([]);
  const [isModalActive, setModalActive] = useState<boolean>(false);
  const [ModalText, setModalText] = useState<JSX.Element>(<></>);

  const { push } = useRouter();

  const {
    recipeStore: { recipes },
    authStore: { user, checkAuth },
  } = useStores();

  useEffect(() => {
    checkAuth();
  }, []);

  function handleChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSearchValue(value);
    const box = document.getElementById("searchResult");
    if (value.trim() != "") {
      if (box) {
        box.removeAttribute("hidden");
      }
    } else {
      box?.setAttribute("hidden", "");
    }

    let new_recipes: IGetRecipe[] = [];

    if (value != "") {
      const filters: string[] = value.toLowerCase().split(" ");

      if (filters.length > 1) {
        new_recipes = recipes.filter((item) =>
          filters.every(
            (elem) =>
              item.name.toLowerCase().includes(elem) ||
              (item.ingredients.length > 0 &&
                item.ingredients.some((itemIngr) =>
                  itemIngr.toLowerCase().includes(elem)
                ))
          )
        );
      } else {
        new_recipes = recipes.filter((item) =>
          filters.some(
            (elem) =>
              item.name.toLowerCase().includes(elem) ||
              (item.ingredients.length > 0 &&
                item.ingredients.some((itemIngr) =>
                  itemIngr.toLowerCase().includes(elem)
                ))
          )
        );
      }
    }

    setRecipesView(new_recipes);
  }

  function handleClear() {
    setSearchValue("");
    const box = document.getElementById("searchResult");
    box?.setAttribute("hidden", "");
  }

  useEffect(() => {
    const form = document.getElementById("form");
    const input = document.getElementById("searchInput");
    const box = document.getElementById("searchResult");

    window.addEventListener("click", (event) => {
      if (
        event.target != form &&
        event.target != box &&
        event.target != input
      ) {
        box?.setAttribute("hidden", "");
      }
    });
  }, []);

  function handleClickAuth() {
    if (user && user.id) {
      push("/profile");
    } else {
      push("/auth");
    }
  }

  function handleClickAdd() {
    if (user && user.id) {
      push("/addform");
    } else {
      setModalText(
        <>
          You can't add <span className={styles.nowr}> a recipe</span>
        </>
      );

      setModalActive(true);
    }
  }

  function handleClickFav() {
    if (user && user.id) {
      push("/favorites");
    } else {
      setModalText(<>You can't view your favorites`</>);
      setModalActive(true);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const handleModalClose = () => {
    setModalActive(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <Image
          alt="logo"
          width={70}
          height={50}
          src="https://t3.ftcdn.net/jpg/01/31/19/42/360_F_131194206_jk113fvl8oFmeAHSWzDyhRJIkiBmnNaN.jpg"
          onClick={() => push("/")}
        />
        <div className={styles.divAdd}>
          <div onClick={handleClickAdd}>
            <p>Add recipe</p>
            <Plus strokeWidth={1} size={24} className={styles.iconplus} />
          </div>
        </div>
        {isModalActive && (
          <ModuleAuth
            text={
              <>
                {ModalText}
                <span className={styles.nowr}> without registration</span>
              </>
            }
            onCloseAction={handleModalClose}
          />
        )}
        <form id="form" onSubmit={handleSubmit}>
          <input
            id="searchInput"
            type="text"
            name="search"
            placeholder="Search recipe"
            value={searchValue}
            onChange={handleChange}
          ></input>
          <X
            size={20}
            strokeWidth={1}
            className={styles.iconDelete}
            onClick={handleClear}
          />
          <div id="searchResult" hidden>
            {recipesView.length > 0 ? (
              <div className={styles.searchResult}>
                {recipesView.map((elem) => (
                  <div
                    key={`box${elem.id}`}
                    onClick={() => {
                      push(`/${elem.id}`);
                    }}
                    className={styles.boxitem}
                  >
                    <img src={elem.image} /> <p>{elem.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noRec}>No recipes</div>
            )}
          </div>
        </form>

        <Star
          size={25}
          strokeWidth={1}
          className={styles.icon}
          onClick={handleClickFav}
        />
        <UserRound
          size={25}
          strokeWidth={1}
          className={styles.icon}
          onClick={handleClickAuth}
        />
      </div>
    </div>
  );
});
export default Header;
