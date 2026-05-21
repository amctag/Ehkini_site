import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/src/features/auth/authSlice";
import { mockBaseQuery } from "./mockBaseQuery";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include"
});

async function realBaseQuery(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
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
