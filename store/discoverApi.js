import { api } from "./api";

export const discoverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiscoverPeople: builder.query({
      query: () => "/discover/people",
      providesTags: ["Discover"]
    }),
    getDiscoverStories: builder.query({
      query: () => "/discover/stories",
      providesTags: ["Discover"]
    })
  })
});

export const { useGetDiscoverPeopleQuery, useGetDiscoverStoriesQuery } = discoverApi;
