import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  signupDraft: {},
  isAuthenticated: false,
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload ?? null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
    },
    setAuthLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setAuthError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    updateSignupDraft(state, action) {
      state.signupDraft = {
        ...state.signupDraft,
        ...action.payload
      };
    },
    clearSignupDraft(state) {
      state.signupDraft = {};
    },
    clearAuth() {
      return initialState;
    }
  }
});

export const {
  setAuthToken,
  setUser,
  setAuthLoading,
  setAuthError,
  updateSignupDraft,
  clearSignupDraft,
  clearAuth
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectSignupDraft = (state) => state.auth.signupDraft;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
