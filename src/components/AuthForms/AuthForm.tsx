"use client";

import { useEffect } from "react";
import { useStores } from "@/root-store-context";
import { observer } from "mobx-react-lite";

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthForm = observer(() => {
  const {
    recipeStore: { getRecipes },
    authStore: { formType, getAllUsers },
  } = useStores();

  useEffect(() => {
    getRecipes();
    getAllUsers();
  }, []);

  return <> {formType == "signup" ? <SignUpForm /> : <LoginForm />}</>;
});

export default AuthForm;
