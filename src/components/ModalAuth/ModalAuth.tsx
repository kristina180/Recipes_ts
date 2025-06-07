"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";

import styles from "./ModalAuth.module.scss";

interface IProps {
  text: JSX.Element;
  onCloseAction: (arg0?: string) => void;
}

export default function ModuleAuth({ text, onCloseAction }: IProps) {
  const { replace } = useRouter();

  function handleClose(event: React.MouseEvent<HTMLDivElement>) {
    const modalActive = document.getElementById("modalActive");
    if (event.target != modalActive) {
      onCloseAction();
    }
  }

  return (
    <div className={styles.modalsection} onClick={handleClose}>
      <div id="modalActive" className={styles.modalActive}>
        <p>
          {text}
          <br /> To register or log in, click{" "}
          <span className={styles.nowr}> on the</span>
          <span className={styles.nowr}> "Log in" button</span>
        </p>
        <div>
          <button
            onClick={() => {
              replace("/auth");
              onCloseAction();
            }}
          >
            Log in
          </button>
          <button onClick={() => onCloseAction("cancel")}>Close</button>
        </div>
      </div>
    </div>
  );
}
