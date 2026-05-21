import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "@/src/features/auth/authApi";
import { clearAuth, setUser } from "@/src/features/auth/authSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: authApi.endpoints.getMe.matchFulfilled,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(setUser(action.payload));
  }
});

listenerMiddleware.startListening({
  matcher: authApi.endpoints.getMe.matchRejected,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(clearAuth());
  }
});

listenerMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(clearAuth());
  }
});
