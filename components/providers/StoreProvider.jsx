"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore } from "@/store/store";
import AuthBootstrap from "./AuthBootstrap";

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
