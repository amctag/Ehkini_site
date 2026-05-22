import { api } from "@/src/services/baseApi";
import { mapFriendsResponse } from "./friendsMappers";

export const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "friends",
      transformResponse: mapFriendsResponse,
      providesTags: ["Friends"]
    }),
    getFriendSuggestions: builder.query({
      query: () => "/friends/suggestions",
      providesTags: ["Friends"]
    })
  })
});

export const { useGetFriendsQuery, useGetFriendSuggestionsQuery } = friendsApi;
