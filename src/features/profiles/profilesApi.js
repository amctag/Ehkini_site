import { api } from "@/src/services/baseApi";
import { mapProfileResponse } from "./profileMappers";

function isNumericId(value) {
  return /^\d+$/.test(String(value ?? ""));
}

function toInteger(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const numberValue = Number(text);
  if (!Number.isFinite(numberValue)) return null;
  return Math.trunc(numberValue);
}

function buildUpdateProfileBody(input) {
  const formData = new FormData();
  const firstName = String(input?.firstName ?? "").trim();
  const lastName = String(input?.lastName ?? "").trim();
  const gender = String(input?.gender ?? "").trim();
  const countryId = toInteger(input?.countryId);

  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("gender", gender);

  if (countryId !== null) {
    formData.append("country_id", String(countryId));
  }

  const interests = Array.isArray(input?.interests) ? input.interests : [];
  interests
    .map((interestId) => toInteger(interestId))
    .filter((interestId) => interestId !== null)
    .forEach((interestId) => {
      formData.append("interests[]", String(interestId));
    });

  const hasFileCtor = typeof File !== "undefined";
  const hasBlobCtor = typeof Blob !== "undefined";
  const isFile = hasFileCtor && input?.profileImage instanceof File;
  const isBlob = hasBlobCtor && input?.profileImage instanceof Blob;
  if (isFile || isBlob) {
    formData.append("profile_image", input.profileImage);
  }

  return formData;
}

export const profilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfileBySlug: builder.query({
      query: ({ slug }) => (isNumericId(slug) ? `users/${slug}` : `profiles/${slug}`),
      transformResponse: (response, _meta, arg) =>
        mapProfileResponse(response, arg.fallbackProfile, arg.fallbackName),
      providesTags: (_result, _error, arg) => [{ type: "Profile", id: arg.slug }]
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "profile/update",
        method: "POST",
        body: buildUpdateProfileBody(payload)
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
          // Error handled in UI.
        }
      },
      invalidatesTags: ["User", "Profile"]
    })
  })
});

export const { useGetProfileBySlugQuery, useUpdateProfileMutation } = profilesApi;
