import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "@/src/features/auth/authApi";
import { clearAuth } from "@/src/features/auth/authSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(clearAuth());
  }
});
