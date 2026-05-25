import { api } from "@/src/services/baseApi";
import { mapStoriesResponse, mapUsersResponse } from "./discoverMappers";

export const discoverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiscoverPeople: builder.query({
      query: () => "users",
      transformResponse: mapUsersResponse,
      providesTags: ["Discover"]
    }),
    getDiscoverStories: builder.query({
      query: () => "stories",
      transformResponse: mapStoriesResponse,
      providesTags: ["Discover"]
    })
  })
});

export const { useGetDiscoverPeopleQuery, useGetDiscoverStoriesQuery } = discoverApi;
