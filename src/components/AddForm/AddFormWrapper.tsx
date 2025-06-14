"use client";

import { useStores } from "@/root-store-context";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import ModuleAuth from "../ModalAuth/ModalAuth";
import AddForm from "./AddForm";

import styles from "./AddForm.module.scss";
import LoadingPage from "../LoadingPage/LoadingPage";

const AddFormWrapper = observer(() => {
  const [isModalActive, setModalActive] = useState<boolean>(true);

  const { replace } = useRouter();

  const {
    authStore: { user, checkAuth, isError },
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
          <AddForm />
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

export default AddFormWrapper;
