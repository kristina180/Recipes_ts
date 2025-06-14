"use client";

import React, { useState } from "react";
import { useStores } from "@/root-store-context";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";

import { memo } from "react";
import { IFilters } from "@/utils/types";
import styles from "./RecipesFilters.module.scss";

const initialState: IFilters = {
  cooktime: "",
  cuisine: "not_selected",
  difficulty: "not_selected",
  calories: "not_selected",
};

const RecipeFilters = observer(() => {
  const [values, setValue] = useState<IFilters>(initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    recipeStore: { recipes, changeRecipes, getFilterRecipes },
  } = useStores();

  const cuisines = [...new Set(recipes.map((elem) => elem.cuisine))];

  function handleChangeValue({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValue({ ...values, [name]: value });
  }

  function handleClick() {
    setValue({ ...values, cooktime: "" });
    reset(initialState);
    changeRecipes();
  }

  function handleSubmitForm() {
    getFilterRecipes(values);
  }
  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <>
      <div>
        <form
          className={styles.filters}
          onSubmit={handleSubmit(handleSubmitForm)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <div>
            <input
              type="text"
              {...register("cooktime", { pattern: /^\d+$/ })}
              value={values.cooktime}
              onChange={handleChangeValue}
              placeholder="Max cooking time"
              className={styles.input}
            ></input>
            {errors.cooktime &&
              (errors.cooktime.type == "required" ? (
                <div className={styles.error}>Fill in the field</div>
              ) : (
                <div className={styles.error}>
                  The value can only be a number
                </div>
              ))}
          </div>

          <select
            {...register("cuisine")}
            name="cuisine"
            onChange={handleChangeValue}
            defaultValue={"not_selected"}
          >
            <option value="not_selected">Cuisine is not selected</option>
            {cuisines &&
              cuisines.map((elem) => (
                <option
                  key={`cuisine_${cuisines.indexOf(elem)}`}
                  value={elem.toLowerCase()}
                >
                  {elem}
                </option>
              ))}
          </select>
          <select
            {...register("difficulty")}
            defaultValue={"not_selected"}
            onChange={handleChangeValue}
          >
            <option value="not_selected">Level is not selected</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            {...register("calories")}
            defaultValue={"not_selected"}
            onChange={handleChangeValue}
          >
            <option value="not_selected">Calories is not selected</option>
            <option value="0_200">Less 200</option>
            <option value="300_350">200-350</option>
            <option value="351_500">351-500</option>
            <option value="501_10000">More 500</option>
          </select>
          <button type="submit" className={styles.buttonSubmit}>
            Search
          </button>
          <button
            type="button"
            onClick={handleClick}
            className={styles.buttonClear}
          >
            Clear
          </button>
        </form>
      </div>
    </>
  );
});

export default RecipeFilters;
