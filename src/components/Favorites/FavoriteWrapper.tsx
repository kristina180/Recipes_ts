"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useStores } from "@/root-store-context";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ModuleAuth from "../ModalAuth/ModalAuth";

import styles from "./Favorites.module.scss";
import LoadingPage from "../LoadingPage/LoadingPage";
import Favorites from "@/components/Favorites/Favorites";

const FavComponet = dynamic(() => import("@/components/Favorites/Favorites"), {
  ssr: false,
});

const FavoriteWrapper = observer(() => {
  const [isModalActive, setModalActive] = useState<boolean>(false);

  const { replace } = useRouter();

  const {
    authStore: { checkAuth, user, isError },
  } = useStores();

  function handleModalClose(value?: string) {
    if (value == "cancel") {
      replace("/");
    }
    setModalActive(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {!isError ? (
        user && user.id ? (
          <Favorites />
        ) : (
          <LoadingPage />
        )
      ) : (
        <>
          <ModuleAuth
            text={
              <>
                You can't add <span className={styles.nowr}> a recipe</span>
                <span className={styles.nowr}> without registration</span>
              </>
            }
            onCloseAction={handleModalClose}
          />
        </>
      )}
    </>
  );
});

export default FavoriteWrapper;
