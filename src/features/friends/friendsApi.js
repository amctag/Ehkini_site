import { api } from "@/src/services/baseApi";
import { mapFriendsResponse } from "./friendsMappers";

function pickId(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return /^\d+$/.test(text) ? Number(text) : text;
}

function buildFriendRequestBody(input) {
  const receiverId = pickId(
    input?.receiver_id ??
      input?.receiverId ??
      input?.id ??
      input
  );

  if (receiverId === null) return {};
  return { receiver_id: receiverId };
}

function buildCancelRequestBody(input) {
  const friendshipId = pickId(
    input?.friendship_id ??
      input?.friendshipId ??
      input?.id
  );
  if (friendshipId !== null) return { friendship_id: friendshipId };

  const receiverId = pickId(
    input?.receiver_id ??
      input?.receiverId ??
      input?.user_id ??
      input?.userId ??
      input
  );
  if (receiverId !== null) return { receiver_id: receiverId };

  return {};
}

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
    }),
    sendFriendRequest: builder.mutation({
      query: (payload) => ({
        url: "friends/request",
        method: "POST",
        body: buildFriendRequestBody(payload)
      }),
      invalidatesTags: ["Friends"]
    }),
    cancelFriendRequest: builder.mutation({
      query: (payload) => ({
        url: "friends/requests/cancel",
        method: "POST",
        body: buildCancelRequestBody(payload)
      }),
      invalidatesTags: ["Friends"]
    })
  })
});

export const {
  useGetFriendsQuery,
  useGetFriendSuggestionsQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation
} = friendsApi;
