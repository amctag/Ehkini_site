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

function buildRemoveFriendRequestBody(input) {
  const friendId = pickId(
    input?.friend_id ??
      input?.friendId ??
      input?.user_id ??
      input?.userId ??
      input?.receiver_id ??
      input?.receiverId ??
      input?.id ??
      input
  );

  if (friendId === null) return {};
  return {
    user_id: friendId,
    friend_id: friendId
  };
}

function normalizeImageUrl(value) {
  const image = String(value ?? "").trim();
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }

  if (image.startsWith("//")) {
    return `https:${image}`;
  }

  if (/^[\w.-]+\.[a-z]{2,}\/.+/i.test(image)) {
    return `https://${image}`;
  }

  return `/${image.replace(/^\/+/, "")}`;
}

function pickImage(...values) {
  for (const value of values) {
    const image = normalizeImageUrl(value);
    if (image) return image;
  }
  return "";
}

function mapIncomingFriendRequestRow(row, index = 0) {
  const sender = row?.sender ?? row?.from_user ?? row?.requester ?? row?.user ?? row?.friend ?? row;
  const firstLastName = [sender?.first_name, sender?.last_name].filter(Boolean).join(" ").trim();
  const name = String(sender?.full_name ?? firstLastName ?? sender?.name ?? "").trim() || `User #${index + 1}`;

  return {
    id: row?.id ?? row?.request_id ?? row?.friendship_id ?? sender?.id ?? `incoming-${index}`,
    requestId: row?.request_id ?? row?.id ?? null,
    friendshipId: row?.friendship_id ?? row?.friendshipId ?? row?.id ?? null,
    senderId: sender?.id ?? row?.sender_id ?? row?.user_id ?? null,
    name,
    image: pickImage(
      sender?.profile_image_url,
      sender?.profile_image,
      sender?.avatar_url,
      sender?.avatar,
      sender?.image,
      row?.profile_image_url,
      row?.profile_image
    ),
    createdAt: row?.created_at ?? row?.requested_at ?? row?.sent_at ?? null,
    status: row?.status ?? ""
  };
}

function mapIncomingFriendRequestsResponse(response) {
  const rows =
    (Array.isArray(response) && response) ||
    (Array.isArray(response?.data) && response.data) ||
    (Array.isArray(response?.requests) && response.requests) ||
    (Array.isArray(response?.data?.requests) && response.data.requests) ||
    (Array.isArray(response?.response) && response.response) ||
    [];

  return rows.map(mapIncomingFriendRequestRow);
}

function buildRespondFriendRequestBody(input) {
  const friendshipId = pickId(
    input?.friendship_id ??
      input?.friendshipId ??
      input?.request_id ??
      input?.requestId ??
      input?.id
  );
  const actionText = String(input?.action ?? input?.status ?? input?.response ?? "").trim().toLowerCase();
  const normalizedAction = actionText === "accept" || actionText === "accepted" ? "accept" : "reject";

  const payload = {
    action: normalizedAction
  };

  if (friendshipId !== null) {
    payload.friendship_id = friendshipId;
  }

  return payload;
}

export const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "friends",
      transformResponse: mapFriendsResponse,
      providesTags: ["Friends"]
    }),
    searchFriends: builder.query({
      query: (searchText) => ({
        url: "friends/search",
        params: {
          q: searchText,
          name: searchText,
          search_name: searchText
        }
      }),
      transformResponse: mapFriendsResponse,
      providesTags: ["Friends"]
    }),
    getFriendSuggestions: builder.query({
      query: () => "friends/suggested",
      transformResponse: mapFriendsResponse,
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
    }),
    removeFriend: builder.mutation({
      query: (payload) => ({
        url: "friends/remove",
        method: "POST",
        body: buildRemoveFriendRequestBody(payload)
      }),
      invalidatesTags: ["Friends"]
    }),
    getIncomingFriendRequests: builder.query({
      query: () => "friends/requests",
      transformResponse: mapIncomingFriendRequestsResponse,
      providesTags: ["Friends"]
    }),
    respondFriendRequest: builder.mutation({
      query: (payload) => ({
        url: "friends/respond",
        method: "POST",
        body: buildRespondFriendRequestBody(payload)
      }),
      invalidatesTags: ["Friends"]
    })
  })
});

export const {
  useGetFriendsQuery,
  useSearchFriendsQuery,
  useGetFriendSuggestionsQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
  useGetIncomingFriendRequestsQuery,
  useRespondFriendRequestMutation
} = friendsApi;
