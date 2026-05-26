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
  "verifyRegisterOtp",
  "forgotPasswordSendOtp",
  "forgotPasswordVerifyOtp",
  "forgotPasswordReset"
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

async function realBaseQuery(args, baseQueryApi, extraOptions) {
  if (!publicEndpoints.has(baseQueryApi.endpoint) && !baseQueryApi.getState().auth?.token) {
    return {
      error: {
        status: 401,
        data: {
          message: "Unauthorized"
        }
      }
    };
  }

  const result = await rawBaseQuery(args, baseQueryApi, extraOptions);

  if (result.error?.status === 401) {
    clearStoredAuthToken();
    baseQueryApi.dispatch(clearAuth());
  }

  return result;
}

export const baseQuery = useMock ? mockBaseQuery : realBaseQuery;

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "UserSearch", "Profile", "Discover", "Messages", "Friends", "Gifts", "Wallet", "Posts"],
  endpoints: () => ({})
});
