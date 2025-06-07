"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStores } from "@/root-store-context";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import validator from "validator";
import styles from "./AuthForms.module.scss";

const SignUpForm = observer(() => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    authStore: { user, signup, toggleFormType },
  } = useStores();

  const { replace } = useRouter();

  function handleChangeValue({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [name]: value });
  }

  async function handleSubmitForm() {
    signup(values);
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
          type="name"
          {...register("name", { required: true })}
          value={values.name}
          onChange={handleChangeValue}
          placeholder="Your name"
          className={styles.input}
        ></input>
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
        <input
          type="avatar"
          {...register("avatar", {
            required: true,
          })}
          value={values.avatar}
          onChange={handleChangeValue}
          placeholder="Your avatar"
          className={styles.input}
        ></input>
        <p onClick={() => toggleFormType("login")}>I already have an account</p>
        <button type="submit">SIgn up</button>
      </form>
    </div>
  );
});
export default SignUpForm;
