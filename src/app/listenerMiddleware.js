import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearAuth } from "@/src/features/auth/authSlice";
import { clearStoredAuthToken } from "@/src/features/auth/tokenStorage";
import { api } from "@/src/services/baseApi";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: clearAuth,
  effect: (_action, listenerApi) => {
    clearStoredAuthToken();
    listenerApi.dispatch(api.util.resetApiState());
  }
});
