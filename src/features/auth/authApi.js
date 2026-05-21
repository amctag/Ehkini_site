import { api } from "@/src/services/baseApi";
import { clearAuth, setAuthError, setUser } from "./authSlice";
import { mapCountriesResponse } from "./countriesMappers";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearAuth());
        }
      }
    }),
    getCountries: builder.query({
      query: () => "countries",
      transformResponse: mapCountriesResponse
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "login",
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
        url: "register",
        method: "POST",
        body
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST"
      }),
      invalidatesTags: ["User"]
    })
  })
});

export const {
  useGetMeQuery,
  useGetCountriesQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation
} = authApi;
