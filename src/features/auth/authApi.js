import { api } from "@/src/services/baseApi";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import {
  clearAuth,
  clearSignupDraft,
  setAuthError,
  setAuthToken,
  setUser
} from "./authSlice";
import { mapCountriesResponse } from "./countriesMappers";
import { clearStoredAuthToken, storeAuthToken } from "./tokenStorage";

function pickAuthToken(payload) {
  return payload?.token ?? payload?.access_token ?? payload?.data?.token ?? null;
}

function pickAuthUser(payload) {
  return payload?.user ?? payload?.data?.user ?? null;
}

function pickOtpToken(payload) {
  return payload?.otp_token ?? payload?.token ?? payload?.data?.otp_token ?? payload?.data?.token ?? "";
}

function pickVerifiedToken(payload) {
  return (
    payload?.verified_token ??
    payload?.reset_token ??
    payload?.password_reset_token ??
    payload?.token ??
    payload?.data?.verified_token ??
    payload?.data?.reset_token ??
    payload?.data?.password_reset_token ??
    payload?.data?.token ??
    ""
  );
}

function mapInterestsResponse(response) {
  const rows = Array.isArray(response)
    ? response
    : (response?.interests ?? response?.data ?? []);

  return rows
    .map((interest) => ({
      id: Number(interest.id),
      name: String(interest.name ?? interest.title ?? "").trim()
    }))
    .filter((interest) => Number.isFinite(interest.id) && interest.name.length > 0);
}

function responseObject(response) {
  if (response && typeof response === "object") return response;
  return {
    message: String(response ?? "")
  };
}

function persistAuthenticatedPayload(data, dispatch) {
  const token = pickAuthToken(data);

  if (!token) {
    dispatch(setAuthError("Registration succeeded but no auth token was returned"));
    return false;
  }

  storeAuthToken(token);
  dispatch(setAuthToken(token));

  const user = pickAuthUser(data);
  if (user) {
    dispatch(setUser(user));
  }

  return true;
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
    getInterests: builder.query({
      query: () => "interests",
      transformResponse: mapInterestsResponse
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
          const token = pickAuthToken(data);

          if (!token) {
            dispatch(setAuthError("Login succeeded but no auth token was returned"));
            return;
          }

          storeAuthToken(token);
          dispatch(setAuthToken(token));

          const user = pickAuthUser(data);
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
          dispatch(setAuthError(getErrorMessage(err.error ?? err, "Login failed")));
        }
      }
    }),
    checkPhone: builder.mutation({
      query: (body) => ({
        url: "check-phone",
        method: "POST",
        body
      })
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "register",
        method: "POST",
        body
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const didPersistAuth = persistAuthenticatedPayload(data, dispatch);
          if (!didPersistAuth) return;

          dispatch(
            api.endpoints.getMe.initiate(undefined, {
              forceRefetch: true,
              subscribe: false
            })
          );
          dispatch(clearSignupDraft());
        } catch {
          // Component-level UX handles registration errors.
        }
      }
    }),
    sendRegisterOtp: builder.mutation({
      query: (body) => ({
        url: "register/send-otp",
        method: "POST",
        body
      }),
      transformResponse: (response) => {
        const data = responseObject(response);
        return {
          ...data,
          otp_token: pickOtpToken(data)
        };
      }
    }),
    verifyRegisterOtp: builder.mutation({
      query: (body) => ({
        url: "register/verify-otp",
        method: "POST",
        body
      }),
      transformResponse: (response) => {
        const data = responseObject(response);
        return {
          ...data,
          verified_token: pickVerifiedToken(data)
        };
      }
    }),
    forgotPasswordSendOtp: builder.mutation({
      query: (body) => ({
        url: "forgot-password/send-otp",
        method: "POST",
        body
      }),
      transformResponse: (response) => {
        const data = responseObject(response);
        return {
          ...data,
          otp_token: pickOtpToken(data)
        };
      }
    }),
    forgotPasswordVerifyOtp: builder.mutation({
      query: (body) => ({
        url: "forgot-password/verify-otp",
        method: "POST",
        body
      }),
      transformResponse: (response) => {
        const data = responseObject(response);
        return {
          ...data,
          verified_token: pickVerifiedToken(data)
        };
      }
    }),
    forgotPasswordReset: builder.mutation({
      query: (body) => ({
        url: "forgot-password/reset-password",
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
      }
    })
  })
});

export const {
  useGetMeQuery,
  useGetCountriesQuery,
  useGetInterestsQuery,
  useCheckPhoneMutation,
  useLoginMutation,
  useRegisterMutation,
  useSendRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
  useForgotPasswordSendOtpMutation,
  useForgotPasswordVerifyOtpMutation,
  useForgotPasswordResetMutation,
  useLogoutMutation
} = authApi;
