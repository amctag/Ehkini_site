import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { api } from "./api";
import { listenerMiddleware } from "./listenerMiddleware";
import "./authApi";
import "./discoverApi";
import "./profilesApi";
import "./messagesApi";
import "./friendsApi";
import "./giftsApi";
import "./walletApi";
import "./settingsApi";

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(api.middleware)
        .prepend(listenerMiddleware.middleware)
  });
}
