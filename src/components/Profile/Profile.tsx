"use client";

import { observer } from "mobx-react-lite";
import { useStores } from "@/root-store-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./Profile.module.scss";

const Profile = observer(() => {
  const {
    recipeStore: { getRecipes },
    authStore: { user, logout, toggleFormType },
  } = useStores();

  const { replace } = useRouter();

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div className={styles.section}>
      {user ? (
        <>
          <img src={user.avatar} />
          <div className={styles.info}>
            <div>Your username: {user.name}</div>
            <div>Your email: {user.email}</div>
            <button
              type="button"
              onClick={() => {
                logout();
                replace("/auth");
                toggleFormType("signup");
              }}
            >
              Log out
            </button>
          </div>
        </>
      ) : (
        <div> Loading...</div>
      )}
    </div>
  );
});

export default Profile;
