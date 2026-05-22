import { api } from "@/src/services/baseApi";
import { mapProfileResponse } from "./profileMappers";

function isNumericId(value) {
  return /^\d+$/.test(String(value ?? ""));
}

export const profilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfileBySlug: builder.query({
      query: ({ slug }) => (isNumericId(slug) ? `users/${slug}` : `profiles/${slug}`),
      transformResponse: (response, _meta, arg) =>
        mapProfileResponse(response, arg.fallbackProfile, arg.fallbackName),
      providesTags: (_result, _error, arg) => [{ type: "Profile", id: arg.slug }]
    })
  })
});

export const { useGetProfileBySlugQuery } = profilesApi;
