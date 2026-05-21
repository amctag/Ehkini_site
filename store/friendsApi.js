import { api } from "./api";

export const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "/friends",
      providesTags: ["Friends"]
    }),
    getFriendSuggestions: builder.query({
      query: () => "/friends/suggestions",
      providesTags: ["Friends"]
    })
  })
});

export const { useGetFriendsQuery, useGetFriendSuggestionsQuery } = friendsApi;
