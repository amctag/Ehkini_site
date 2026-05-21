"use client";

import { Provider } from "react-redux";
import { useState } from "react";
import { makeStore } from "@/src/app/store";
import AuthBootstrap from "./AuthBootstrap";

export default function ReduxProvider({ children }) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
