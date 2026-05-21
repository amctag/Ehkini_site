import { api } from "./api";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlockedUsers: builder.query({
      query: () => "/settings/blocked-users",
      providesTags: ["User"]
    })
  })
});

export const { useGetBlockedUsersQuery } = settingsApi;
