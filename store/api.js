import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "./authSlice";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include"
});

export const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(clearAuth());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Profile", "Discover"],
  endpoints: () => ({})
});
