import { api } from "@/src/services/baseApi";

function pickUserSource(row) {
  return row?.user ?? row?.searched_user ?? row?.target_user ?? row?.profile ?? row;
}

function normalizeUserRow(row, index) {
  if (typeof row === "number" || typeof row === "string") {
    const id = String(row).trim();
    return {
      id: id || `user-${index}`,
      user_id: id || null,
      name: id ? `User #${id}` : "User",
      full_name: id ? `User #${id}` : "User"
    };
  }

  const user = pickUserSource(row);
  const fullName = String(user?.full_name ?? row?.full_name ?? "").trim();
  const fallbackName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  const name = fullName || fallbackName || String(user?.name ?? "User").trim() || "User";
  const userId = user?.id ?? row?.user_id ?? row?.searched_user_id ?? row?.target_user_id ?? null;

  return {
    ...row,
    ...user,
    id: userId ?? row?.id ?? `user-${index}`,
    user_id: userId,
    name,
    full_name: fullName || name
  };
}

function mapUsersList(response) {
  const rows =
    (Array.isArray(response) && response) ||
    (Array.isArray(response?.response) && response.response) ||
    (Array.isArray(response?.data) && response.data) ||
    (Array.isArray(response?.data?.response) && response.data.response) ||
    (Array.isArray(response?.users) && response.users) ||
    (Array.isArray(response?.searches) && response.searches) ||
    (Array.isArray(response?.recent) && response.recent) ||
    (Array.isArray(response?.results) && response.results) ||
    (Array.isArray(response?.data?.data) && response.data.data) ||
    (Array.isArray(response?.data?.users) && response.data.users) ||
    (Array.isArray(response?.data?.searches) && response.data.searches) ||
    (Array.isArray(response?.data?.recent) && response.data.recent) ||
    [];

  if (rows.length > 0) {
    return rows.map(normalizeUserRow);
  }

  const clickedUserIds =
    (Array.isArray(response?.clicked_user_ids) && response.clicked_user_ids) ||
    (Array.isArray(response?.data?.clicked_user_ids) && response.data.clicked_user_ids) ||
    (Array.isArray(response?.ids) && response.ids) ||
    (Array.isArray(response?.data?.ids) && response.data.ids) ||
    [];

  const savedSearchName = String(
    response?.saved_search?.name ??
      response?.data?.saved_search?.name ??
      ""
  ).trim();

  return clickedUserIds.map((id, index) =>
    normalizeUserRow(
      {
        id,
        user_id: id,
        search_name: savedSearchName
      },
      index
    )
  );
}

function buildSearchClickPayload(user) {
  const rawUserId =
    (typeof user === "object" &&
      (user?.user_id ??
        user?.id ??
        user?.searched_user_id ??
        user?.target_user_id ??
        user?.user?.id ??
        user?.profile?.id ??
        user?.searched_user?.id ??
        user?.target_user?.id)) ??
    (typeof user === "number" || typeof user === "string" ? user : null);

  if (rawUserId === null || rawUserId === undefined || String(rawUserId).trim() === "") return {};

  const userIdText = String(rawUserId).trim();
  const userId = /^\d+$/.test(userIdText) ? Number(userIdText) : userIdText;

  return { user_id: userId };
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "users",
      transformResponse: mapUsersList,
      providesTags: ["User"]
    }),
    searchUsers: builder.query({
      query: (name) => ({
        url: "users/search",
        params: {
          name,
          search_name: name,
          q: name
        }
      }),
      transformResponse: mapUsersList,
      providesTags: ["User"]
    }),
    getLastSearchedUsers: builder.query({
      query: () => "users/search/last",
      transformResponse: mapUsersList,
      providesTags: ["UserSearch"]
    }),
    saveUserSearchClick: builder.mutation({
      query: (user) => {
        const payload = buildSearchClickPayload(user);
        return ({
        url: "users/search/click",
        method: "POST",
        body: payload
      });
      },
      invalidatesTags: ["UserSearch"]
    }),
    removeUserSearchClick: builder.mutation({
      query: (user) => {
        const payload = buildSearchClickPayload(user);
        return ({
        url: "users/search/click",
        method: "DELETE",
        params: payload,
        body: payload,
        responseHandler: "text"
      });
      },
      invalidatesTags: ["UserSearch"]
    }),
    clearLastSearchedUsers: builder.mutation({
      query: () => ({
        url: "users/search/last",
        method: "DELETE",
        responseHandler: "text"
      }),
      invalidatesTags: ["UserSearch"]
    })
  })
});

export const {
  useGetUsersQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetLastSearchedUsersQuery,
  useSaveUserSearchClickMutation,
  useRemoveUserSearchClickMutation,
  useClearLastSearchedUsersMutation
} = usersApi;
