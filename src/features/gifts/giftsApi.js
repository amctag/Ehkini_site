import { api } from "@/src/services/baseApi";

export const giftsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGiftCatalog: builder.query({
      query: () => "/gifts/catalog",
      providesTags: ["Gifts"]
    })
  })
});

export const { useGetGiftCatalogQuery } = giftsApi;
