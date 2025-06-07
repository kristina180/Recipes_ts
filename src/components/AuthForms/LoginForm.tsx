"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useStores } from "@/root-store-context";
import { observer } from "mobx-react-lite";

import validator from "validator";

import styles from "./AuthForms.module.scss";

const LoginForm = observer(() => {
  const [values, setValues] = useState({ email: "", password: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    authStore: { user, login, toggleFormType },
  } = useStores();

  const { replace } = useRouter();

  function handleChangeValue({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValues({ ...values, [name]: value });
  }

  function handleSubmitForm() {
    login(values);
  }

  useEffect(() => {
    if (user != undefined) {
      replace("/profile");
    }
  }, [user]);

  return (
    <div className={styles.section}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <input
          type="text"
          {...register("email", {
            required: true,
            validate: (input) => validator.isEmail(input),
          })}
          value={values.email}
          onChange={handleChangeValue}
          placeholder="Your email"
          className={styles.input}
        ></input>
        <input
          type="text"
          {...register("password", { required: true })}
          value={values.password}
          onChange={handleChangeValue}
          placeholder="Your password"
          className={styles.input}
        ></input>

        <p onClick={() => toggleFormType("signup")}>I don't have an account</p>

        <button type="submit">Log in</button>
      </form>
    </div>
  );
});
export default LoginForm;
