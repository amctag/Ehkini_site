import { api } from "@/src/services/baseApi";
import { clearAuth, setAuthError, setAuthToken, setUser } from "./authSlice";
import { mapCountriesResponse } from "./countriesMappers";
import { clearStoredAuthToken, storeAuthToken } from "./tokenStorage";

function pickLoginToken(payload) {
  return payload?.token ?? payload?.access_token ?? payload?.data?.token ?? null;
}

function pickLoginUser(payload) {
  return payload?.user ?? payload?.data?.user ?? null;
}

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
          const { data } = await queryFulfilled;
          const token = pickLoginToken(data);

          if (!token) {
            dispatch(setAuthError("Login succeeded but no auth token was returned"));
            return;
          }

          storeAuthToken(token);
          dispatch(setAuthToken(token));

          const user = pickLoginUser(data);
          if (user) {
            dispatch(setUser(user));
          }

          dispatch(
            api.endpoints.getMe.initiate(undefined, {
              forceRefetch: true,
              subscribe: false
            })
          );
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          clearStoredAuthToken();
          dispatch(clearAuth());
        }
      },
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
