import { api } from "@/src/services/baseApi";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"]
    })
  })
});

export const { useGetUsersQuery } = usersApi;
