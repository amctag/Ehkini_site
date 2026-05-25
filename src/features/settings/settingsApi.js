import { api } from "@/src/services/baseApi";

function asArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.blocked_users)) return response.blocked_users;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.users)) return response.data.users;
  if (Array.isArray(response?.data?.blocked_users)) return response.data.blocked_users;
  return [];
}

function fullNameFromParts(user, fallback = "User") {
  const fullName = String(user?.full_name ?? "").trim();
  if (fullName) return fullName;
  const firstLast = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  if (firstLast) return firstLast;
  return String(user?.name ?? fallback).trim() || fallback;
}

function mapBlockedUserRow(row, index) {
  const user = row?.user ?? row?.blocked_user ?? row;
  const id = user?.id ?? row?.user_id ?? row?.id ?? `blocked-${index}`;

  return {
    ...row,
    ...user,
    id,
    user_id: user?.id ?? row?.user_id ?? row?.id ?? null,
    name: fullNameFromParts(user),
    reason: String(row?.reason ?? user?.reason ?? "").trim()
  };
}

function mapBlockedUsersResponse(response) {
  return asArray(response).map(mapBlockedUserRow);
}

function buildUnblockPayload(input) {
  const rawUserId =
    input?.user_id ??
    input?.userId ??
    input?.id ??
    input;

  const text = String(rawUserId ?? "").trim();
  if (!text) return {};
  return { user_id: /^\d+$/.test(text) ? Number(text) : text };
}

function normalizePhone(value) {
  return String(value ?? "").trim();
}

function buildSendPhoneOtpPayload(input) {
  const phone = normalizePhone(input?.phone ?? input?.new_phone ?? input?.newPhone);
  if (!phone) return {};

  return {
    phone,
    new_phone: phone
  };
}

function buildConfirmPhoneOtpPayload(input) {
  const phone = normalizePhone(input?.phone ?? input?.new_phone ?? input?.newPhone);
  const otp = normalizePhone(input?.otp ?? input?.code);

  const payload = {};
  if (phone) {
    payload.phone = phone;
    payload.new_phone = phone;
  }
  if (otp) {
    payload.otp = otp;
    payload.code = otp;
  }
  return payload;
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function buildPasswordOtpPayload(input) {
  const currentPassword = normalizeText(input?.current_password ?? input?.currentPassword);
  const newPassword = normalizeText(input?.new_password ?? input?.newPassword);
  const confirmPassword = normalizeText(
    input?.new_password_confirmation ??
      input?.newPasswordConfirmation ??
      input?.confirm_password ??
      input?.confirmPassword
  );

  const payload = {};
  if (currentPassword) payload.current_password = currentPassword;
  if (newPassword) payload.new_password = newPassword;
  if (confirmPassword) payload.new_password_confirmation = confirmPassword;
  return payload;
}

function buildPasswordOtpConfirmPayload(input) {
  const payload = buildPasswordOtpPayload(input);
  const otp = normalizeText(input?.otp ?? input?.code);
  if (otp) {
    payload.otp = otp;
    payload.code = otp;
  }
  return payload;
}

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlockedUsers: builder.query({
      query: () => "users/blocked",
      transformResponse: mapBlockedUsersResponse,
      providesTags: ["User"]
    }),
    unblockUser: builder.mutation({
      query: (input) => ({
        url: "users/unblock",
        method: "POST",
        body: buildUnblockPayload(input)
      }),
      invalidatesTags: ["User"]
    }),
    sendPhoneOtpNew: builder.mutation({
      query: (input) => ({
        url: "profile/phone/send-otp-new",
        method: "POST",
        body: buildSendPhoneOtpPayload(input)
      })
    }),
    confirmPhoneNew: builder.mutation({
      query: (input) => ({
        url: "profile/phone/confirm-new",
        method: "POST",
        body: buildConfirmPhoneOtpPayload(input)
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            api.endpoints.getMe.initiate(undefined, {
              forceRefetch: true,
              subscribe: false
            })
          );
        } catch {
          // handled in UI
        }
      },
      invalidatesTags: ["User"]
    }),
    sendPasswordOtp: builder.mutation({
      query: (input) => ({
        url: "profile/password/send-otp",
        method: "POST",
        body: buildPasswordOtpPayload(input)
      })
    }),
    confirmPasswordOtp: builder.mutation({
      query: (input) => ({
        url: "profile/password/send-otp",
        method: "POST",
        body: buildPasswordOtpConfirmPayload(input)
      })
    })
  })
});

export const {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
  useSendPhoneOtpNewMutation,
  useConfirmPhoneNewMutation,
  useSendPasswordOtpMutation,
  useConfirmPasswordOtpMutation
} = settingsApi;
