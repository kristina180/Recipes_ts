"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useStores } from "@/root-store-context";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ModuleAuth from "../ModalAuth/ModalAuth";

import styles from "./Favorites.module.scss";

const FavComponet = dynamic(() => import("@/components/Favorites/Favorites"), {
  ssr: false,
});

const FavoriteWrapper = observer(() => {
  const [isModalActive, setModalActive] = useState<boolean>(false);

  const { replace } = useRouter();

  const {
    authStore: { checkAuth },
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
      {!isModalActive ? (
        <FavComponet />
      ) : (
        <>
          <ModuleAuth
            text={
              <>
                You can't view your favorites
                <span className={styles.nowr}> without registration</span>
              </>
            }
            onCloseAction={handleModalClose}
          />
        </>
      )}{" "}
    </>
  );
});

export default FavoriteWrapper;
