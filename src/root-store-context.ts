"use client";

import { createContext, useContext } from "react";
import { StoreContext } from "./store/store-wrapper";

export const useStores = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("Оберните в провайдер");
  }

  return context;
};
