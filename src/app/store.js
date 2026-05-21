import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/features/auth/authSlice";
import { api } from "@/src/services/baseApi";
import { listenerMiddleware } from "./listenerMiddleware";
import "@/src/features/auth/authApi";
import "@/src/features/discover/discoverApi";
import "@/src/features/profiles/profilesApi";
import "@/src/features/messages/messagesApi";
import "@/src/features/friends/friendsApi";
import "@/src/features/gifts/giftsApi";
import "@/src/features/wallet/walletApi";
import "@/src/features/settings/settingsApi";

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
