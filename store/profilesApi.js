import { api } from "./api";

export const profilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfileBySlug: builder.query({
      query: (slug) => `/profiles/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Profile", id: slug }]
    })
  })
});

export const { useGetProfileBySlugQuery } = profilesApi;
