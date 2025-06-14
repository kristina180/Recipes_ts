"use client";

import { useState, useEffect } from "react";
import { useStores } from "@/root-store-context";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { observer } from "mobx-react-lite";

import { X } from "lucide-react";
import { IInitialStateAddForm, IFormValuesAddForm } from "@/utils/types";
import styles from "./AddForm.module.scss";

type TForm = FieldValues & IFormValuesAddForm;

const initialState: IInitialStateAddForm = {
  name: "",
  image: "",
  prepTimeMinutes: "",
  cookTimeMinutes: "",
  cuisine: "not_selected",
  difficulty: "not_selected",
  calories: "",
  ingredients: "",
  instructions: "",
};

const initialStateForm: IFormValuesAddForm = {
  name: "",
  image: "",
  prepTimeMinutes: "",
  cookTimeMinutes: "",
  cuisine: "not_selected",
  difficulty: "not_selected",
  calories: "",
  ingredients: [],
  instructions: [],
};

const AddForm = observer(() => {
  const [values, setValue] = useState<IInitialStateAddForm>(initialState);

  const {
    recipeStore: { recipes, getRecipes, addNewRecipe },
  } = useStores();

  const cuisines = [...new Set(recipes.map((elem) => elem.cuisine))];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TForm>();

  const {
    fields: filedsIngredients,
    append: appendIngredients,
    remove: removeIngredients,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: filedsInstructions,
    append: appendInstructions,
    remove: removeInstructions,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  function validateItem(value_difficulty: string) {
    if (value_difficulty != "not_selected") {
      return true;
    } else {
      return false;
    }
  }

  function handleChangeValue({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValue({ ...values, [name]: value });
  }

  function handleAddItem(name: string) {
    if (name == "ingredients" && values.ingredients.trim().length > 0) {
      appendIngredients(values.ingredients);
    }

    if (name == "instructions" && values.instructions.trim().length > 0) {
      appendInstructions(values.instructions);
    }
    setValue({ ...values, [name]: "" });
  }

  const removeIngr = (index: number) => () => {
    removeIngredients(index);
  };

  const removeInst = (index: number) => () => {
    removeInstructions(index);
  };

  const handleSubmitForm: SubmitHandler<TForm> = (data) => {
    if (
      values.difficulty != "not_selected" &&
      values.cuisine != "not_selected"
    ) {
      addNewRecipe(data);
      setValue(initialState);
      reset(initialStateForm);
      removeIngredients();
      removeInstructions();
    }
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div className={styles.section}>
      <div className={styles.title}>Adding a recipe</div>
      <form
        className={styles.form}
        onSubmit={handleSubmit(handleSubmitForm)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <label htmlFor="name">Name of the dish</label>
        <input
          id="name"
          {...register("name", { required: true })}
          type="text"
          value={values.name}
          onChange={handleChangeValue}
        ></input>
        {errors.name?.type == "required" && (
          <div className={styles.error}>Name is required</div>
        )}

        <label htmlFor="image">Photo of the dish</label>
        <input
          id="image"
          {...register("image", { required: true })}
          value={values.image}
          onChange={handleChangeValue}
        ></input>
        {errors.image?.type == "required" && (
          <div className={styles.error}>Photo is required</div>
        )}

        <label htmlFor="prepTimeMinutes">Preparing time</label>
        <input
          id="prepTimeMinutes"
          {...register("prepTimeMinutes", { required: true, pattern: /^\d+$/ })}
          value={values.prepTimeMinutes}
          onChange={handleChangeValue}
        ></input>
        {errors.prepTimeMinutes &&
          (errors.prepTimeMinutes.type == "required" ? (
            <div className={styles.error}>Preparing time is required</div>
          ) : (
            <div className={styles.error}>Numeric value only</div>
          ))}

        <label htmlFor="cookTimeMinutes">Cooking time</label>
        <input
          id="cookTimeMinutes"
          {...register("cookTimeMinutes", { required: true, pattern: /^\d+$/ })}
          value={values.cookTimeMinutes}
          onChange={handleChangeValue}
        ></input>
        {errors.cookTimeMinutes &&
          (errors.cookTimeMinutes.type == "required" ? (
            <div className={styles.error}>Cooking time is required</div>
          ) : (
            <div className={styles.error}>Numeric value only</div>
          ))}

        <label htmlFor="cuisine">Cuisine</label>
        <select
          id="cuisine"
          {...register("cuisine", { validate: validateItem })}
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
        {errors.cuisine && (
          <div className={styles.error}>Cuisine is required</div>
        )}

        <label htmlFor="difficulty">Level</label>
        <select
          id="difficulty"
          {...register("difficulty", { validate: validateItem })}
          defaultValue={"not_selected"}
          onChange={handleChangeValue}
        >
          <option value="not_selected">Level is not selected</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {errors.difficulty && (
          <div className={styles.error}>Level is required</div>
        )}

        <label htmlFor="calories">Calorie content</label>
        <input
          id="calories"
          {...register("calories", { required: true, pattern: /^\d+$/ })}
          value={values.calories}
          onChange={handleChangeValue}
        ></input>
        {errors.calories &&
          (errors.calories.type == "required" ? (
            <div className={styles.error}>Calorie content is required</div>
          ) : (
            <div className={styles.error}>Numeric value only</div>
          ))}

        <label htmlFor="ingredients">Ingredients</label>
        <div className={styles.divList}>
          <input
            id="ingredients"
            name="ingredients"
            value={values.ingredients}
            onChange={handleChangeValue}
          ></input>
          <button type="button" onClick={() => handleAddItem("ingredients")}>
            Add
          </button>
        </div>
        <div className={styles.list}>
          {filedsIngredients.map((item, index) => (
            <div key={item.id} className={styles.listItem}>
              <Controller
                render={({ field }) => (
                  <div className={styles.listItemP}>{field.value}</div>
                )}
                name={`ingredients[${index}]`}
                control={control}
              />
              <button type="button" onClick={removeIngr(index)}>
                <X strokeWidth={1} size={20} className={styles.iconX} />
              </button>
              <br />
            </div>
          ))}
        </div>

        <label htmlFor="instruction">Instructions</label>
        <div className={styles.divList}>
          <input
            id="instructions"
            name="instructions"
            value={values.instructions}
            onChange={handleChangeValue}
          ></input>
          <button type="button" onClick={() => handleAddItem("instructions")}>
            Add
          </button>
        </div>
        <div className={styles.list}>
          {filedsInstructions.map((item, index) => (
            <div key={item.id} className={styles.listItem}>
              <Controller
                render={({ field }) => (
                  <div className={styles.listItemP}>{field.value}</div>
                )}
                name={`instructions[${index}]`}
                control={control}
              />
              <button type="button" onClick={removeInst(index)}>
                <X strokeWidth={1} size={20} className={styles.iconX} />
              </button>
              <br />
            </div>
          ))}
        </div>
        <button type="submit" className={styles.submitForm}>
          Add a recipe
        </button>
      </form>
    </div>
  );
});

export default AddForm;
