import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/src/features/auth/authSlice";
import { clearStoredAuthToken } from "@/src/features/auth/tokenStorage";
import { mockBaseQuery } from "./mockBaseQuery";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const publicEndpoints = new Set([
  "getCountries",
  "getInterests",
  "login",
  "checkPhone",
  "register",
  "sendRegisterOtp",
  "verifyRegisterOtp"
]);

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("Accept", "application/json");

    if (publicEndpoints.has(endpoint)) {
      return headers;
    }

    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }
});

async function realBaseQuery(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearStoredAuthToken();
    api.dispatch(clearAuth());
  }

  return result;
}

export const baseQuery = useMock ? mockBaseQuery : realBaseQuery;

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Profile", "Discover", "Messages", "Friends", "Gifts", "Wallet"],
  endpoints: () => ({})
});
