import { api } from "@/src/services/baseApi";
import { mapUsersResponse } from "./discoverMappers";

export const discoverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiscoverPeople: builder.query({
      query: () => "users",
      transformResponse: mapUsersResponse,
      providesTags: ["Discover"]
    }),
    getDiscoverStories: builder.query({
      query: () => "/discover/stories",
      providesTags: ["Discover"]
    })
  })
});

export const { useGetDiscoverPeopleQuery, useGetDiscoverStoriesQuery } = discoverApi;
