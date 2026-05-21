import { api } from "@/src/services/baseApi";
import { setAuthError } from "./authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"]
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.endpoints.getMe.initiate());
        } catch (err) {
          const message =
            err.error?.data?.message ??
            err.error?.data?.error ??
            "Login failed";
          dispatch(setAuthError(message));
        }
      }
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      invalidatesTags: ["User"]
    })
  })
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation
} = authApi;
